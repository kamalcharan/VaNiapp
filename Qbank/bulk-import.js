#!/usr/bin/env node
/**
 * Qbank Bulk Import — Scan generated JSON files and insert into Supabase
 *
 * Usage:
 *   node Qbank/bulk-import.js                             # Scan all sources (generated + CUET + NEET)
 *   node Qbank/bulk-import.js --source cuet               # Scan only Qbank/CUET/
 *   node Qbank/bulk-import.js --source neet               # Scan only Qbank/NEET/
 *   node Qbank/bulk-import.js --source generated          # Scan only Qbank/generated/ (legacy)
 *   node Qbank/bulk-import.js --subject physics           # Filter by subject
 *   node Qbank/bulk-import.js --source cuet --dry-run     # Preview CUET import
 *   node Qbank/bulk-import.js --subject zoo --chapter biomolecules
 *
 * Reads Supabase creds from Qbank/config.json
 * Scans Qbank/generated/, Qbank/CUET/, Qbank/NEET/ for JSON files
 * Validates IDs, checks for duplicates in DB, inserts new questions only
 * Supports diagram-based questions: auto-uploads local images to Supabase Storage
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, basename, relative, extname, dirname as pathDirname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ============================================================================
// CONFIG
// ============================================================================
const GENERATED_DIR = join(__dirname, 'generated');
const CUET_DIR = join(__dirname, 'CUET');
const NEET_DIR = join(__dirname, 'NEET');
const CONFIG_PATH = join(__dirname, 'config.json');

const STORAGE_BUCKET = 'question-images';

// Subject folder → subject_id mapping
const SUBJECT_MAP = {
  zoo: 'zoology',
  botany: 'botany',
  physics: 'physics',
  chemistry: 'chemistry',
  'cuet-physics': 'cuet-physics',
  'cuet-chemistry': 'cuet-chemistry',
  'cuet-biology': 'biology',
  'business-studies': 'business-studies',
};

// ============================================================================
// TOPIC RESOLUTION  (chapterId + topicName → topic_id from med_topics)
// ============================================================================
function _normalizeTopic(name) {
  return name.toLowerCase()
    .replace(/[''\u2019]s\b/g, '')
    .replace(/\band\b/g, '').replace(/\bof\b/g, '').replace(/\bthe\b/g, '')
    .replace(/[,()]/g, '').replace(/\s+/g, ' ').trim();
}

const _topicCache = {}; // chapterId -> [{ id, nameLower, nameNorm, words }]
async function resolveTopicId(supabase, chapterId, topicName) {
  if (!chapterId || !topicName) return null;
  if (!_topicCache[chapterId]) {
    const { data, error } = await supabase
      .from('med_topics')
      .select('id, name')
      .eq('chapter_id', chapterId);
    if (error || !data) {
      log(`Failed to fetch topics for ${chapterId}: ${error?.message}`, 'warn');
      return null;
    }
    _topicCache[chapterId] = data.map(t => {
      const norm = _normalizeTopic(t.name);
      return { id: t.id, nameLower: t.name.toLowerCase().trim(), nameNorm: norm, words: new Set(norm.split(' ').filter(Boolean)) };
    });
  }
  const topics = _topicCache[chapterId];
  const needle = topicName.toLowerCase().trim();
  const needleNorm = _normalizeTopic(topicName);
  const needleWords = new Set(needleNorm.split(' ').filter(Boolean));
  // 1. Exact match
  const exact = topics.find(t => t.nameLower === needle);
  if (exact) return exact.id;
  // 2. Normalized exact match
  const normExact = topics.find(t => t.nameNorm === needleNorm);
  if (normExact) return normExact.id;
  // 3. Contains match
  const contains = topics.find(t => needleNorm.includes(t.nameNorm) || t.nameNorm.includes(needleNorm));
  if (contains) return contains.id;
  // 4. Best keyword overlap
  let bestScore = 0, bestTopic = null;
  for (const t of topics) {
    if (t.words.size === 0) continue;
    let overlap = 0;
    for (const w of t.words) { if (needleWords.has(w)) overlap++; }
    const score = overlap / t.words.size;
    if (score > bestScore && overlap >= 2) { bestScore = score; bestTopic = t; }
  }
  if (bestScore >= 0.5 && bestTopic) return bestTopic.id;
  log(`No topic match for "${topicName}" in chapter ${chapterId}`, 'warn');
  return null;
}

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

      // Collect JSON files from chapter dir AND any subdirectories (e.g., new-2026-03-01/)
      const collectJsons = (dir) => {
        const entries = readdirSync(dir);
        for (const entry of entries) {
          const fullPath = join(dir, entry);
          if (statSync(fullPath).isDirectory()) {
            // Recurse into subfolders like new-{date}/ or diagrams/ (skip diagrams)
            if (entry !== 'diagrams') collectJsons(fullPath);
          } else if (entry.endsWith('.json')) {
            files.push({
              path: fullPath,
              dir: dir, // directory containing this JSON (for resolving relative image paths)
              subject,
              chapter,
              filename: entry,
              relPath: relative(baseDir, fullPath),
            });
          }
        }
      };

      collectJsons(chapterDir);
    }
  }

  return files;
}

// ============================================================================
// IMAGE UPLOAD — Upload local diagram images to Supabase Storage
// ============================================================================
async function uploadDiagramImage(supabase, localImagePath, storagePath) {
  if (!existsSync(localImagePath)) {
    return { error: `File not found: ${localImagePath}` };
  }

  const fileBuffer = readFileSync(localImagePath);
  const ext = extname(localImagePath).toLowerCase();
  const mimeTypes = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
  };
  const contentType = mimeTypes[ext] || 'image/png';

  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(storagePath, fileBuffer, {
      contentType,
      upsert: true, // overwrite if exists (safe for re-imports)
    });

  if (error) {
    return { error: error.message };
  }

  // Build public URL
  const { data: urlData } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(storagePath);

  return { url: urlData.publicUrl };
}

/**
 * For each question with a local image_uri, upload to Storage and replace with public URL.
 * Local path convention: relative to JSON file dir, e.g., "diagrams/question-id.png"
 */
async function resolveImageUris(supabase, questions, dryRun) {
  let uploadCount = 0;
  let uploadErrors = 0;

  for (const q of questions) {
    if (!q.image_uri) continue;

    // Already an HTTP URL — nothing to do
    if (q.image_uri.startsWith('http://') || q.image_uri.startsWith('https://')) continue;

    // Local file path — resolve relative to the JSON file's directory
    const jsonDir = q._dir || '.';
    const localImagePath = join(jsonDir, q.image_uri);

    // Storage path: {subject}/{chapter}/{filename}
    const imageFilename = basename(q.image_uri);
    const storagePath = `${q._subject}/${q._chapter}/${imageFilename}`;

    if (dryRun) {
      log(`  Would upload: ${q.image_uri} → ${STORAGE_BUCKET}/${storagePath}`);
      uploadCount++;
      continue;
    }

    const result = await uploadDiagramImage(supabase, localImagePath, storagePath);
    if (result.error) {
      log(`  Image upload failed for ${q.id}: ${result.error}`, 'fail');
      uploadErrors++;
    } else {
      q.image_uri = result.url; // Replace local path with public URL
      uploadCount++;
    }
  }

  return { uploadCount, uploadErrors };
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
  if (id && !id.startsWith('zoo-') && !id.startsWith('bot-') && !id.startsWith('phy-') && !id.startsWith('chem-') && !id.startsWith('cuet-')) {
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
  const sourceIdx = args.indexOf('--source');
  const subjectFilter = subjectIdx !== -1 ? args[subjectIdx + 1] : null;
  const chapterFilter = chapterIdx !== -1 ? args[chapterIdx + 1] : null;
  const sourceFilter = sourceIdx !== -1 ? args[sourceIdx + 1] : null; // 'cuet', 'neet', or 'generated'

  console.log('\n\x1b[1m========================================\x1b[0m');
  console.log('\x1b[1m  Qbank Bulk Import\x1b[0m');
  console.log('\x1b[1m========================================\x1b[0m\n');

  if (dryRun) log('DRY RUN — no database changes will be made', 'warn');

  // Load config and init Supabase
  const config = loadConfig();
  const supabase = createClient(config.supabase.url, config.supabase.anonKey);
  log(`Connected to Supabase: ${config.supabase.url}`);

  // Scan files from selected source(s)
  let files = [];
  const scanDirs = [];
  if (!sourceFilter || sourceFilter === 'generated') scanDirs.push({ dir: GENERATED_DIR, label: 'generated' });
  if (!sourceFilter || sourceFilter === 'cuet') scanDirs.push({ dir: CUET_DIR, label: 'CUET' });
  if (!sourceFilter || sourceFilter === 'neet') scanDirs.push({ dir: NEET_DIR, label: 'NEET' });

  for (const { dir, label } of scanDirs) {
    if (existsSync(dir)) {
      const found = scanJsonFiles(dir, subjectFilter, chapterFilter);
      // Tag each file with its source (cuet, neet, generated) for chapter_id resolution
      found.forEach((f) => (f.source = label.toLowerCase()));
      log(`[${label}] Found ${found.length} JSON files`);
      files.push(...found);
    }
  }

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
        q._dir = file.dir; // directory of the JSON file (for resolving relative image paths)
        q._source = file.source; // cuet, neet, or generated
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
    printSummary(fileResults, allQuestions.length, 0, skippedCount, 0, 0);
    process.exit(0);
  }

  // Upload diagram images (local paths → Supabase Storage public URLs)
  const diagramQuestions = newQuestions.filter((q) => q.image_uri && !q.image_uri.startsWith('http'));
  if (diagramQuestions.length > 0) {
    log(`\nFound ${diagramQuestions.length} diagram question(s) with local images — uploading to Storage...`);
    const { uploadCount, uploadErrors } = await resolveImageUris(supabase, newQuestions, dryRun);
    log(`Images uploaded: ${uploadCount}, errors: ${uploadErrors}`, uploadErrors > 0 ? 'warn' : 'ok');
  }

  if (dryRun) {
    log('\nDRY RUN complete. Would insert these questions:', 'warn');
    newQuestions.forEach((q) => log(`  [${q.id}] ${q.question_text?.substring(0, 60)}...`));
    printSummary(fileResults, allQuestions.length, 0, skippedCount, 0, diagramQuestions.length);
    process.exit(0);
  }

  // Insert new questions
  let insertedCount = 0;
  let errorCount = 0;

  for (const q of newQuestions) {
    try {
      const subjectId = SUBJECT_MAP[q._subject] || q._subject;
      const chapterId = q.chapter_id || resolveChapterId(q._source, q._subject, q._chapter);
      const topicId = await resolveTopicId(supabase, chapterId, q.topic);

      // Insert main question record
      const { data: insertedQ, error: qError } = await supabase
        .from('med_questions')
        .insert({
          subject_id: subjectId,
          chapter_id: chapterId,
          topic_id: topicId,
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
            // Diagram-based question fields
            ...(q.image_uri && { image_uri: q.image_uri }),
            ...(q.image_alt && { image_alt: q.image_alt }),
            // Match-the-following fields
            ...(q.column_a && { column_a: q.column_a }),
            ...(q.column_b && { column_b: q.column_b }),
            ...(q.correct_mapping && { correct_mapping: q.correct_mapping }),
            // Assertion-reasoning fields
            ...(q.assertion && { assertion: q.assertion }),
            ...(q.reason && { reason: q.reason }),
            // Fill-in-blanks fields
            ...(q.text_with_blanks && { text_with_blanks: q.text_with_blanks }),
            // Logical-sequence fields
            ...(q.items && { items: q.items }),
            ...(q.correct_order && { correct_order: q.correct_order }),
            // Scenario-based fields
            ...(q.scenario && { scenario: q.scenario }),
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
  printSummary(fileResults, allQuestions.length, insertedCount, skippedCount, errorCount, diagramQuestions.length);
}

// ============================================================================
// CHAPTER ID RESOLVER
// ============================================================================
// Maps (source, subject, chapterFolder) → DB chapter_id
// If JSON has explicit chapter_id field, that takes priority (see insert logic)

// CUET chapter folder → DB chapter_id
const CUET_CHAPTER_MAP = {
  // Physics (cuet-physics subject)
  'physics/electrostatics': 'cuet-phy-electrostatics',
  'physics/current-electricity': 'cuet-phy-current-electricity',
  'physics/magnetic-effects': 'cuet-phy-magnetic-effects',
  'physics/em-induction': 'cuet-phy-em-induction',
  'physics/em-waves': 'cuet-phy-em-waves',
  'physics/optics': 'cuet-phy-optics',
  'physics/dual-nature': 'cuet-phy-dual-nature',
  'physics/atoms-nuclei': 'cuet-phy-atoms-nuclei',
  'physics/electronic-devices': 'cuet-phy-electronic-devices',
  'physics/communication': 'cuet-phy-communication',
  // Chemistry (cuet-chemistry subject)
  'chemistry/solutions': 'cuet-chem-solutions',
  'chemistry/electrochemistry': 'cuet-chem-electrochemistry',
  'chemistry/kinetics': 'cuet-chem-kinetics',
  'chemistry/d-f-block': 'cuet-chem-d-f-block',
  'chemistry/coordination': 'cuet-chem-coordination',
  'chemistry/haloalkanes': 'cuet-chem-haloalkanes',
  'chemistry/alcohols-phenols': 'cuet-chem-alcohols-phenols',
  'chemistry/aldehydes-ketones': 'cuet-chem-aldehydes-ketones',
  'chemistry/amines': 'cuet-chem-amines',
  'chemistry/biomolecules': 'cuet-chem-biomolecules',
  // Biology (biology subject)
  'biology/sexual-repro-plants': 'cuet-bio-sexual-repro-plants',
  'biology/human-repro': 'cuet-bio-human-repro',
  'biology/repro-health': 'cuet-bio-repro-health',
  'biology/inheritance': 'cuet-bio-inheritance',
  'biology/molecular-inheritance': 'cuet-bio-molecular-inheritance',
  'biology/evolution': 'cuet-bio-evolution',
  'biology/human-health': 'cuet-bio-human-health',
  'biology/microbes-welfare': 'cuet-bio-microbes-welfare',
  'biology/biotech-principles': 'cuet-bio-biotech-principles',
  'biology/biotech-applications': 'cuet-bio-biotech-applications',
  'biology/organisms-populations': 'cuet-bio-organisms-populations',
  'biology/ecosystem': 'cuet-bio-ecosystem',
  'biology/biodiversity': 'cuet-bio-biodiversity',
  // Business Studies (cuet-business-studies subject)
  'business-studies/ch01-nature-significance': 'cuet-bst-nature-mgmt',
  'business-studies/ch02-principles': 'cuet-bst-principles-mgmt',
  'business-studies/ch03-environment': 'cuet-bst-environment',
  'business-studies/ch04-planning': 'cuet-bst-planning',
  'business-studies/ch05-organising': 'cuet-bst-organising',
  'business-studies/ch06-staffing': 'cuet-bst-staffing',
  'business-studies/ch07-directing': 'cuet-bst-directing',
  'business-studies/ch09-financial-mgmt': 'cuet-bst-financial-mgmt',
};

// NEET/generated physics folder → DB chapter_id (folder names don't match DB IDs)
const NEET_PHYSICS_CHAPTER_MAP = {
  'phy-electrostatics': 'phy-electrostatics',
  'phy-capacitance': 'phy-electrostatics',  // capacitance topics are under electrostatics chapter
  'phy-current': 'phy-current-electricity',
  'phy-magmov': 'phy-magnetic-effects',
  'phy-magmat': 'phy-magnetic-effects',
  'phy-emi': 'phy-em-induction',
  'phy-ac': 'phy-em-induction',
  'phy-emwave': 'phy-em-waves',
  'phy-rayopt': 'phy-optics',
  'phy-waveopt': 'phy-optics',
  'phy-dual': 'phy-dual-nature',
  'phy-atoms': 'phy-atoms-nuclei',
  'phy-nuclei': 'phy-atoms-nuclei',
  'phy-semi': 'phy-electronic-devices',
  'phy-units': 'phy-units-measurement',
  'phy-world': 'phy-units-measurement',
  'phy-motion1d': 'phy-kinematics',
  'phy-motion2d': 'phy-kinematics',
  'phy-newton': 'phy-laws-of-motion',
  'phy-energy': 'phy-work-energy-power',
  'phy-rotation': 'phy-rotational-motion',
  'phy-gravitation': 'phy-gravitation',
  'phy-solid': 'phy-properties-matter',
  'phy-fluid': 'phy-properties-matter',
  'phy-thermal': 'phy-thermodynamics',
  'phy-thermodynamics': 'phy-thermodynamics',
  'phy-kinetic': 'phy-kinetic-theory',
  'phy-oscillations': 'phy-oscillations-waves',
  'phy-waves': 'phy-oscillations-waves',
};

function resolveChapterId(source, subject, chapterFolder) {
  // 1) CUET source — use CUET mapping
  if (source === 'cuet') {
    const key = `${subject}/${chapterFolder}`;
    if (CUET_CHAPTER_MAP[key]) return CUET_CHAPTER_MAP[key];
    log(`  No CUET chapter mapping for "${key}" — using fallback`, 'warn');
  }

  // 2) NEET/generated physics — folder names don't match DB
  if (subject === 'physics' && NEET_PHYSICS_CHAPTER_MAP[chapterFolder]) {
    return NEET_PHYSICS_CHAPTER_MAP[chapterFolder];
  }

  // 3) NEET/generated botany — mixed folder naming
  if (subject === 'bot') {
    const NEET_BOT_CHAPTER_MAP = {
      'anatomy': 'bot-anatomy-flowering',
      'bot-biodiversity': 'bot-biodiversity',
      'bot-cell-division': 'bot-cell-cycle',
      'bot-cell': 'bot-cell-unit',
      'bot-ecology-pop': 'bot-organisms-populations',
      'bot-ecosystem': 'bot-ecosystem',
      'bot-environment': 'bot-biodiversity', // environment topics under biodiversity
      'bot-living-world': 'bot-living-world',
      'bot-mineral': 'bot-mineral-nutrition',
      'bot-respiration': 'bot-respiration',
      'bot-transport': 'bot-transport-plants',
      'classification': 'bot-biological-classification',
      'growth': 'bot-plant-growth',
      'inheritance': 'bot-inheritance',
      'molecular': 'bot-molecular-inheritance',
      'morphology': 'bot-morphology-flowering',
      'photosynthesis': 'bot-photosynthesis',
      'plant-kingdom': 'bot-plant-kingdom',
      'reproduction': 'bot-sexual-reproduction',
      'microbes': 'bot-microbes-welfare',
    };
    if (NEET_BOT_CHAPTER_MAP[chapterFolder]) return NEET_BOT_CHAPTER_MAP[chapterFolder];
  }

  // 4) NEET/generated chemistry — folders use chem- prefix
  if (subject === 'chem') {
    const NEET_CHEM_CHAPTER_MAP = {
      'chem-alcohols': 'chem-alcohols-ethers',
      'chem-amines': 'chem-amines',
      'chem-atom': 'chem-atomic-structure',
      'chem-basic': 'chem-basic-concepts',
      'chem-biomolecules': 'chem-biomolecules',
      'chem-bonding': 'chem-chemical-bonding',
      'chem-carbonyl': 'chem-aldehydes-ketones',
      'chem-coordination': 'chem-coordination',
      'chem-dblock': 'chem-d-f-block',
      'chem-electrochem': 'chem-electrochemistry',
      'chem-environment': 'chem-environment',
      'chem-equilibrium': 'chem-equilibrium',
      'chem-everyday': 'chem-everyday',
      'chem-haloalkanes': 'chem-haloalkanes',
      'chem-hydrocarbons': 'chem-hydrocarbons',
      'chem-hydrogen': 'chem-hydrogen',
      'chem-kinetics': 'chem-kinetics',
      'chem-metallurgy': 'chem-metallurgy',
      'chem-organic-basics': 'chem-organic-basics',
      'chem-pblock11': 'chem-p-block',
      'chem-pblock12': 'chem-p-block',
      'chem-periodic': 'chem-periodicity',
      'chem-polymers': 'chem-polymers',
      'chem-redox': 'chem-redox',
      'chem-sblock': 'chem-s-block',
      'chem-solid': 'chem-states-matter',
      'chem-solutions': 'chem-solutions',
      'chem-states': 'chem-states-matter',
      'chem-surface': 'chem-surface',
      'chem-thermo': 'chem-thermodynamics',
    };
    if (NEET_CHEM_CHAPTER_MAP[chapterFolder]) return NEET_CHEM_CHAPTER_MAP[chapterFolder];
  }

  // 5) Zoology — folders already match DB pattern (zoo + animal-kingdom → zoo-animal-kingdom)
  if (subject === 'zoo') {
    return `zoo-${chapterFolder}`;
  }

  // 6) Fallback — warn and use best guess
  log(`  No chapter mapping for subject="${subject}" folder="${chapterFolder}" — using fallback`, 'warn');
  return `${subject}-${chapterFolder}`;
}

// ============================================================================
// SUMMARY
// ============================================================================
function printSummary(fileResults, total, inserted, skipped, errors, diagramsUploaded = 0) {
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
  if (diagramsUploaded > 0) console.log(`  Diagrams uploaded: \x1b[35m${diagramsUploaded}\x1b[0m`);
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
