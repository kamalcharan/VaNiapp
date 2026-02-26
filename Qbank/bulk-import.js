#!/usr/bin/env node
/**
 * Qbank Bulk Import — Scan generated JSON files and insert into Supabase
 *
 * Usage:
 *   node Qbank/bulk-import.js                     # Scan all subjects
 *   node Qbank/bulk-import.js --subject zoo        # Scan only zoology
 *   node Qbank/bulk-import.js --dry-run            # Preview without inserting
 *   node Qbank/bulk-import.js --subject zoo --chapter biomolecules
 *
 * Reads Supabase creds from Qbank/config.json
 * Scans Qbank/generated/{subject}/{chapter}/*.json
 * Validates IDs, checks for duplicates in DB, inserts new questions only
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, basename, relative } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ============================================================================
// CONFIG
// ============================================================================
const GENERATED_DIR = join(__dirname, 'generated');
const CONFIG_PATH = join(__dirname, 'config.json');

// Subject folder → subject_id mapping
const SUBJECT_MAP = {
  zoo: 'zoology',
  botany: 'botany',
  physics: 'physics',
  chemistry: 'chemistry',
};

// ============================================================================
// HELPERS
// ============================================================================
function log(msg, type = 'info') {
  const prefix = {
    info: '\x1b[36mINFO\x1b[0m',
    ok: '\x1b[32m  OK\x1b[0m',
    skip: '\x1b[33mSKIP\x1b[0m',
    fail: '\x1b[31mFAIL\x1b[0m',
    warn: '\x1b[33mWARN\x1b[0m',
  };
  console.log(`[${prefix[type] || prefix.info}] ${msg}`);
}

function loadConfig() {
  if (!existsSync(CONFIG_PATH)) {
    log('Config file not found. Copy config.example.json → config.json and add your Supabase credentials.', 'fail');
    process.exit(1);
  }
  const raw = readFileSync(CONFIG_PATH, 'utf-8');
  const config = JSON.parse(raw);
  if (!config.supabase?.url || config.supabase.url.includes('your-project')) {
    log('Supabase credentials not configured in config.json', 'fail');
    process.exit(1);
  }
  return config;
}

function scanJsonFiles(baseDir, subjectFilter, chapterFilter) {
  const files = [];
  if (!existsSync(baseDir)) {
    log(`Generated directory not found: ${baseDir}`, 'fail');
    process.exit(1);
  }

  const subjects = readdirSync(baseDir).filter((d) => {
    const full = join(baseDir, d);
    return statSync(full).isDirectory() && (!subjectFilter || d === subjectFilter);
  });

  for (const subject of subjects) {
    const subjectDir = join(baseDir, subject);
    const chapters = readdirSync(subjectDir).filter((d) => {
      const full = join(subjectDir, d);
      return statSync(full).isDirectory() && (!chapterFilter || d === chapterFilter);
    });

    for (const chapter of chapters) {
      const chapterDir = join(subjectDir, chapter);
      const jsonFiles = readdirSync(chapterDir).filter((f) => f.endsWith('.json'));

      for (const file of jsonFiles) {
        files.push({
          path: join(chapterDir, file),
          subject,
          chapter,
          filename: file,
          relPath: relative(baseDir, join(chapterDir, file)),
        });
      }
    }
  }

  return files;
}

function validateQuestion(q, fileInfo, index) {
  const errors = [];
  const id = q.id;

  if (!id) errors.push(`Q${index + 1}: missing "id" field`);
  if (!q.question_text) errors.push(`Q${index + 1}: missing "question_text"`);
  if (!q.question_type) errors.push(`Q${index + 1}: missing "question_type"`);
  if (!q.correct_answer && q.question_type === 'mcq') errors.push(`Q${index + 1}: missing "correct_answer"`);
  if (q.question_type === 'mcq' && (!q.options || q.options.length < 4)) {
    errors.push(`Q${index + 1}: MCQ needs 4 options`);
  }

  // Validate ID format: should start with topic_id prefix
  if (id && !id.startsWith('zoo-') && !id.startsWith('bot-') && !id.startsWith('phy-') && !id.startsWith('chem-')) {
    errors.push(`Q${index + 1}: ID "${id}" doesn't follow expected prefix pattern`);
  }

  return errors;
}

// ============================================================================
// MAIN
// ============================================================================
async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const subjectIdx = args.indexOf('--subject');
  const chapterIdx = args.indexOf('--chapter');
  const subjectFilter = subjectIdx !== -1 ? args[subjectIdx + 1] : null;
  const chapterFilter = chapterIdx !== -1 ? args[chapterIdx + 1] : null;

  console.log('\n\x1b[1m========================================\x1b[0m');
  console.log('\x1b[1m  Qbank Bulk Import\x1b[0m');
  console.log('\x1b[1m========================================\x1b[0m\n');

  if (dryRun) log('DRY RUN — no database changes will be made', 'warn');

  // Load config and init Supabase
  const config = loadConfig();
  const supabase = createClient(config.supabase.url, config.supabase.anonKey);
  log(`Connected to Supabase: ${config.supabase.url}`);

  // Scan files
  const files = scanJsonFiles(GENERATED_DIR, subjectFilter, chapterFilter);
  if (files.length === 0) {
    log('No JSON files found to import', 'warn');
    process.exit(0);
  }
  log(`Found ${files.length} JSON files across ${new Set(files.map((f) => f.subject)).size} subject(s)\n`);

  // Collect all questions from all files
  const allQuestions = [];
  const fileResults = [];

  for (const file of files) {
    try {
      const raw = readFileSync(file.path, 'utf-8');
      const questions = JSON.parse(raw);

      if (!Array.isArray(questions)) {
        fileResults.push({ file: file.relPath, status: 'fail', reason: 'Not a JSON array' });
        continue;
      }

      // Validate each question
      let fileErrors = [];
      for (let i = 0; i < questions.length; i++) {
        const errs = validateQuestion(questions[i], file, i);
        fileErrors.push(...errs);
      }

      if (fileErrors.length > 0) {
        log(`${file.relPath}: ${fileErrors.length} validation error(s)`, 'warn');
        fileErrors.forEach((e) => log(`  ${e}`, 'warn'));
      }

      // Attach file metadata to each question
      questions.forEach((q) => {
        q._file = file.relPath;
        q._subject = file.subject;
        q._chapter = file.chapter;
      });

      allQuestions.push(...questions);
      fileResults.push({ file: file.relPath, status: 'ok', count: questions.length });
    } catch (err) {
      fileResults.push({ file: file.relPath, status: 'fail', reason: err.message });
      log(`${file.relPath}: ${err.message}`, 'fail');
    }
  }

  log(`\nTotal questions loaded: ${allQuestions.length}`);

  // Check for duplicate IDs within loaded files
  const idCounts = {};
  allQuestions.forEach((q) => {
    if (q.id) idCounts[q.id] = (idCounts[q.id] || 0) + 1;
  });
  const localDupes = Object.entries(idCounts).filter(([, c]) => c > 1);
  if (localDupes.length > 0) {
    log(`${localDupes.length} duplicate IDs found in local files:`, 'fail');
    localDupes.forEach(([id, count]) => log(`  ${id} appears ${count} times`, 'fail'));
    log('Fix duplicates before importing. Aborting.', 'fail');
    process.exit(1);
  }

  // Check DB for existing question IDs
  // We store our custom ID in the payload field, so we need to check there
  // Or we can check if the question_text already exists
  // For now, let's query existing questions and build a set of known IDs
  log('Checking database for existing questions...');

  const allIds = allQuestions.map((q) => q.id).filter(Boolean);

  // Query in batches of 500 (Supabase limit)
  const existingIds = new Set();
  for (let i = 0; i < allIds.length; i += 500) {
    const batch = allIds.slice(i, i + 500);
    const { data, error } = await supabase
      .from('med_questions')
      .select('payload')
      .filter('payload->>question_id', 'in', `(${batch.join(',')})`);

    if (!error && data) {
      data.forEach((row) => {
        if (row.payload?.question_id) existingIds.add(row.payload.question_id);
      });
    }
  }

  // Also check by question_text hash as fallback
  // (in case questions were imported without our ID in payload)

  const newQuestions = allQuestions.filter((q) => !existingIds.has(q.id));
  const skippedCount = allQuestions.length - newQuestions.length;

  log(`Already in DB: ${skippedCount} (will skip)`);
  log(`New to insert: ${newQuestions.length}\n`);

  if (newQuestions.length === 0) {
    log('Nothing new to insert. All questions already in DB.', 'ok');
    printSummary(fileResults, allQuestions.length, 0, skippedCount, 0);
    process.exit(0);
  }

  if (dryRun) {
    log('DRY RUN complete. Would insert these questions:', 'warn');
    newQuestions.forEach((q) => log(`  [${q.id}] ${q.question_text?.substring(0, 60)}...`));
    printSummary(fileResults, allQuestions.length, 0, skippedCount, 0);
    process.exit(0);
  }

  // Insert new questions
  let insertedCount = 0;
  let errorCount = 0;

  for (const q of newQuestions) {
    try {
      const subjectId = SUBJECT_MAP[q._subject] || q._subject;
      const chapterId = resolveChapterId(q._subject, q._chapter, q.id);

      if (!chapterId) {
        throw new Error(`No chapter mapping for question ID "${q.id}" (folder: ${q._chapter}). Add a mapping to TOPIC_TO_CHAPTER.`);
      }

      // Insert main question record
      const { data: insertedQ, error: qError } = await supabase
        .from('med_questions')
        .insert({
          subject_id: subjectId,
          chapter_id: chapterId,
          question_type: q.question_type || 'mcq',
          difficulty: q.difficulty || 'medium',
          question_text: q.question_text,
          correct_answer: q.correct_answer,
          explanation: q.explanation || '',
          status: 'active',
          concept_tags: q.concept_tags || [],
          exam_ids: q.exam_suitability || ['NEET'],
          payload: {
            question_id: q.id, // Store our custom ID for dedup
            topic: q.topic,
            subtopic: q.subtopic,
            bloom_level: q.bloom_level,
            source: 'bulk-import',
          },
        })
        .select()
        .single();

      if (qError) throw qError;

      // Insert options
      if (q.options && q.options.length > 0) {
        const options = q.options.map((opt, idx) => ({
          question_id: insertedQ.id,
          option_key: opt.key || String.fromCharCode(65 + idx),
          option_text: opt.text,
          is_correct: opt.is_correct || opt.key === q.correct_answer,
          sort_order: idx,
        }));

        const { error: optError } = await supabase.from('med_question_options').insert(options);
        if (optError) log(`  Options error for ${q.id}: ${optError.message}`, 'warn');
      }

      // Insert elimination hints
      if (q.elimination_hints && q.elimination_hints.length > 0) {
        const hints = q.elimination_hints.map((h) => ({
          question_id: insertedQ.id,
          option_key: h.option_key,
          hint_text: h.hint,
          misconception: h.misconception || '',
        }));

        const { error: hintError } = await supabase.from('med_elimination_hints').insert(hints);
        if (hintError) log(`  Hints error for ${q.id}: ${hintError.message}`, 'warn');
      }

      insertedCount++;
      if (insertedCount % 20 === 0) {
        log(`Progress: ${insertedCount}/${newQuestions.length} inserted...`);
      }
    } catch (err) {
      errorCount++;
      log(`${q.id}: ${err.message}`, 'fail');
    }
  }

  log(`\nInsert complete: ${insertedCount} inserted, ${errorCount} errors`, insertedCount > 0 ? 'ok' : 'fail');
  printSummary(fileResults, allQuestions.length, insertedCount, skippedCount, errorCount);
}

// ============================================================================
// CHAPTER ID RESOLVER
// ============================================================================
// Maps question ID prefixes to DB chapter IDs (med_chapters.id).
// Longest-prefix matching: more-specific entries must come before shorter ones
// when they share the same prefix (e.g. zoo-biotech before zoo-bio).
const TOPIC_TO_CHAPTER = {
  // ── Botany (17 chapters) ──────────────────────────────
  'bot-cell':         'bot-cell-unit',
  'bot-cycle':        'bot-cell-cycle',
  'bot-div':          'bot-cell-cycle',
  'bot-class':        'bot-biological-classification',
  'bot-plant-growth': 'bot-plant-growth',
  'bot-plant':        'bot-plant-kingdom',
  'bot-morph':        'bot-morphology-flowering',
  'bot-anat':         'bot-anatomy-flowering',
  'bot-photo':        'bot-photosynthesis',
  'bot-resp':         'bot-respiration',
  'bot-growth':       'bot-plant-growth',
  'bot-mineral':      'bot-plant-growth',       // Mineral Nutrition → Plant Growth & Development
  'bot-trans':        'bot-plant-growth',        // Transport in Plants → Plant Growth & Development
  'bot-repro':        'bot-sexual-reproduction',
  'bot-inherit':      'bot-inheritance',
  'bot-inher':        'bot-inheritance',
  'bot-mol':          'bot-molecular-inheritance',
  'bot-eco':          'bot-ecosystem',
  'bot-living':       'bot-living-world',
  'bot-biological':   'bot-biological-classification',
  'bot-microbes':     'bot-microbes-welfare',
  'bot-organisms':    'bot-organisms-populations',
  'bot-biodiv':       'bot-biodiversity',

  // ── Zoology (15 chapters) ─────────────────────────────
  'zoo-biotech':  'zoo-biotechnology-principles',
  'zoo-bioapp':   'zoo-biotechnology-applications',
  'zoo-kingdom':  'zoo-animal-kingdom',
  'zoo-struct':   'zoo-structural-organization',
  'zoo-bio':      'zoo-biomolecules',
  'zoo-breath':   'zoo-breathing',
  'zoo-blood':    'zoo-body-fluids',
  'zoo-excr':     'zoo-excretion',
  'zoo-loco':     'zoo-locomotion',
  'zoo-neural':   'zoo-neural-control',
  'zoo-chem':     'zoo-chemical-coordination',
  'zoo-repro':    'zoo-human-reproduction',
  'zoo-rephealth':'zoo-reproductive-health',  // zoo-rephealth-infertility
  'zoo-rh':       'zoo-reproductive-health',
  'zoo-evo':      'zoo-evolution',
  'zoo-health':   'zoo-human-health',

  // ── Physics (20 chapters) ─────────────────────────────
  'phy-world':    'phy-units-measurement',   // Ch1 maps to closest
  'phy-units':    'phy-units-measurement',
  'phy-motion1d': 'phy-kinematics',
  'phy-motion2d': 'phy-kinematics',
  'phy-kin':      'phy-kinematics',
  'phy-newton':   'phy-laws-of-motion',      // phy-newton-laws, phy-newton-friction, phy-newton-circular
  'phy-laws':     'phy-laws-of-motion',
  'phy-energy':   'phy-work-energy-power',   // phy-energy-work, phy-energy-conservation, phy-energy-collisions
  'phy-wep':      'phy-work-energy-power',
  'phy-work':     'phy-work-energy-power',
  'phy-rot':      'phy-rotational-motion',
  'phy-grav':     'phy-gravitation',
  'phy-solid':    'phy-properties-matter',
  'phy-fluid':    'phy-properties-matter',
  'phy-prop':     'phy-properties-matter',
  'phy-thermal':  'phy-thermodynamics',
  'phy-thermo':   'phy-thermodynamics',
  'phy-kinetic':  'phy-kinetic-theory',
  'phy-osc':      'phy-oscillations-waves',
  'phy-wave':     'phy-oscillations-waves',
  'phy-elec-semiconductor': 'phy-electronic-devices',
  'phy-elec-diode':         'phy-electronic-devices',
  'phy-elec-transistor':    'phy-electronic-devices',
  'phy-elec-logic':         'phy-electronic-devices',
  'phy-semi':     'phy-electronic-devices',
  'phy-pot':      'phy-electrostatics',      // phy-pot-potential, phy-pot-capacitor, phy-pot-dielectric
  'phy-capacitance': 'phy-electrostatics',
  'phy-elec':     'phy-electrostatics',
  'phy-curr':     'phy-current-electricity',
  'phy-mag':      'phy-magnetic-effects',
  'phy-ac':       'phy-em-induction',
  'phy-emi':      'phy-em-induction',
  'phy-emwave':   'phy-em-waves',
  'phy-emw':      'phy-em-waves',
  'phy-ray':      'phy-optics',             // phy-ray-reflection, phy-ray-prism, phy-ray-instruments
  'phy-rayopt':   'phy-optics',
  'phy-waveopt':  'phy-optics',
  'phy-opt':      'phy-optics',
  'phy-dual':     'phy-dual-nature',
  'phy-atom':     'phy-atoms-nuclei',
  'phy-nucl':     'phy-atoms-nuclei',
  'phy-exp':      'phy-experimental',

  // ── Chemistry (20 chapters) ───────────────────────────
  'chem-basic':    'chem-basic-concepts',
  'chem-states':   'chem-basic-concepts',     // States of Matter → Basic Concepts
  'chem-hydrogen': 'chem-basic-concepts',     // Hydrogen → Basic Concepts
  'chem-atom':     'chem-atomic-structure',
  'chem-bond':     'chem-chemical-bonding',
  'chem-thermo':   'chem-thermodynamics',
  'chem-eq':       'chem-equilibrium',
  'chem-redox':    'chem-redox',
  'chem-sol':      'chem-solutions',
  'chem-surface':  'chem-solutions',          // Surface Chemistry → Solutions
  'chem-electro':  'chem-electrochemistry',
  'chem-kin':      'chem-kinetics',
  'chem-sblock':   'chem-periodicity',        // s-Block Elements → Periodicity
  'chem-period':   'chem-periodicity',
  'chem-pblock':   'chem-p-block',            // pblock11-*, pblock12-* → p-Block
  'chem-p-block':  'chem-p-block',
  'chem-metallurgy': 'chem-d-f-block',        // Metallurgy → d-f Block
  'chem-dblock':   'chem-d-f-block',          // d-Block topics → d-f Block
  'chem-d-f':      'chem-d-f-block',
  'chem-coord':    'chem-coordination',
  'chem-org':      'chem-organic-basics',
  'chem-hydrocarbon': 'chem-hydrocarbons',    // chem-hydrocarbon-alkanes/alkenes/alkynes/aromatic
  'chem-hc':       'chem-hydrocarbons',
  'chem-halo':     'chem-haloalkanes',
  'chem-phenol':   'chem-alcohols-ethers',    // Phenol reactions → Alcohols/Ethers
  'chem-ether':    'chem-alcohols-ethers',    // Ether reactions → Alcohols/Ethers
  'chem-alcohol':  'chem-alcohols-ethers',
  'chem-carbonyl': 'chem-aldehydes-ketones',  // Carbonyl compounds → Aldehydes/Ketones
  'chem-carboxylic': 'chem-aldehydes-ketones', // Carboxylic acids → Aldehydes/Ketones chapter
  'chem-ald':      'chem-aldehydes-ketones',
  'chem-amine':    'chem-amines',
  'chem-polymer':  'chem-biomolecules',       // Polymers → Biomolecules
  'chem-everyday': 'chem-biomolecules',       // Chemistry in Everyday Life → Biomolecules
  'chem-environment': 'chem-biomolecules',    // Environmental Chemistry → Biomolecules
  'chem-biomol':   'chem-biomolecules',
};

function resolveChapterId(subject, chapterFolder, questionId) {
  // Primary: match question ID prefix against TOPIC_TO_CHAPTER
  if (questionId) {
    for (const [prefix, chapterId] of Object.entries(TOPIC_TO_CHAPTER)) {
      if (questionId.startsWith(prefix)) return chapterId;
    }
  }
  // Fallback: return null so we can log a clear warning
  return null;
}

// ============================================================================
// SUMMARY
// ============================================================================
function printSummary(fileResults, total, inserted, skipped, errors) {
  console.log('\n\x1b[1m========================================\x1b[0m');
  console.log('\x1b[1m  Summary\x1b[0m');
  console.log('\x1b[1m========================================\x1b[0m\n');

  // Per-file breakdown
  console.log('Files scanned:');
  for (const f of fileResults) {
    const icon = f.status === 'ok' ? '\x1b[32m✓\x1b[0m' : '\x1b[31m✗\x1b[0m';
    const detail = f.status === 'ok' ? `${f.count} questions` : f.reason;
    console.log(`  ${icon} ${f.file} — ${detail}`);
  }

  console.log('\nTotals:');
  console.log(`  Questions loaded:  ${total}`);
  console.log(`  Already in DB:     ${skipped} (skipped)`);
  console.log(`  Newly inserted:    \x1b[32m${inserted}\x1b[0m`);
  if (errors > 0) console.log(`  Errors:            \x1b[31m${errors}\x1b[0m`);
  console.log('');
}

// ============================================================================
// RUN
// ============================================================================
main().catch((err) => {
  log(`Fatal error: ${err.message}`, 'fail');
  console.error(err);
  process.exit(1);
});
