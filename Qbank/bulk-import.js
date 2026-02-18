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

      // Insert main question record
      const { data: insertedQ, error: qError } = await supabase
        .from('med_questions')
        .insert({
          subject_id: subjectId,
          chapter_id: resolveChapterId(q._subject, q._chapter),
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
// Maps subject/chapter folder names to DB chapter IDs
// Update this mapping as you add more chapters to the DB
function resolveChapterId(subject, chapterFolder) {
  // Convention: {subject_short}-{chapter_folder}
  // e.g., zoo + animal-kingdom → zoo-animal-kingdom
  return `${subject}-${chapterFolder}`;
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
