#!/usr/bin/env node

/**
 * VaNi Question Import Script
 * ────────────────────────────
 * Bulk-imports questions from a JSON file into Supabase, automatically
 * uploading local images to Supabase Storage for diagram-based questions.
 *
 * Usage:
 *   node scripts/import-questions.mjs --file=questions.json [options]
 *
 * Options:
 *   --file=<path>         Path to the JSON file containing questions (required)
 *   --images-dir=<path>   Directory containing image files (default: same dir as JSON file)
 *   --dry-run             Validate and report without writing to DB or uploading images
 *   --help                Show this help message
 *
 * Environment variables:
 *   SUPABASE_URL          Supabase project URL
 *   SUPABASE_SERVICE_KEY  Service-role key (bypasses RLS)
 *
 * CLI argument overrides:
 *   --url=<url>           Override SUPABASE_URL
 *   --key=<key>           Override SUPABASE_SERVICE_KEY
 *
 * JSON format: see scripts/sample-import.json for a complete example.
 */

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync, statSync } from 'fs';
import { resolve, dirname, basename, extname, join } from 'path';
import { randomUUID } from 'crypto';

// ─────────────────────────────────────────────────────────────────────────────
// CLI parsing
// ─────────────────────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const args = {};
  for (const arg of argv.slice(2)) {
    if (arg === '--dry-run') args.dryRun = true;
    else if (arg === '--help' || arg === '-h') args.help = true;
    else if (arg.startsWith('--file=')) args.file = arg.split('=').slice(1).join('=');
    else if (arg.startsWith('--images-dir=')) args.imagesDir = arg.split('=').slice(1).join('=');
    else if (arg.startsWith('--url=')) args.url = arg.split('=').slice(1).join('=');
    else if (arg.startsWith('--key=')) args.key = arg.split('=').slice(1).join('=');
  }
  return args;
}

function printUsage() {
  console.log(`
VaNi Question Import Script
============================

Imports questions from a JSON file into Supabase. For diagram-based questions,
automatically uploads local image files to Supabase Storage and maps the public
URLs into the database.

Usage:
  node scripts/import-questions.mjs --file=questions.json [options]

Options:
  --file=<path>         Path to the JSON file (required)
  --images-dir=<path>   Directory containing images (default: same dir as JSON file)
  --dry-run             Validate only, no writes
  --help, -h            Show this help

Credentials (env vars or CLI):
  SUPABASE_URL / --url=<url>           Project URL
  SUPABASE_SERVICE_KEY / --key=<key>   Service-role key

JSON format:
  {
    "questions": [
      {
        "id": "optional-uuid",
        "subject_id": "physics",
        "chapter_id": "physics-laws-of-motion",
        "topic_id": null,
        "question_type": "diagram-based",
        "difficulty": "medium",
        "question_text": "Observe the diagram and answer.",
        "question_text_te": "...",
        "explanation": "...",
        "explanation_te": "...",
        "image_file": "free-body-diagram.png",
        "image_alt": "Description of the diagram",
        "correct_answer": "b",
        "options": [
          { "key": "a", "text": "Option A", "text_te": "...", "is_correct": false },
          { "key": "b", "text": "Option B", "text_te": "...", "is_correct": true },
          ...
        ],
        "elimination_hints": [
          { "option_key": "a", "hint": "...", "hint_te": "...", "misconception": "...", "misconception_te": "..." }
        ],
        "payload": { ... }
      }
    ]
  }

  For diagram-based questions, "image_file" is a filename relative to --images-dir.
  The script uploads it to Supabase Storage and sets the public URL automatically.
`);
}

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const STORAGE_BUCKET = 'question-images';
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000;
const VALID_QUESTION_TYPES = [
  'mcq', 'assertion-reasoning', 'match-the-following', 'true-false',
  'diagram-based', 'logical-sequence', 'fill-in-blanks', 'scenario-based',
];
const VALID_DIFFICULTIES = ['easy', 'medium', 'hard'];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB
const VALID_IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp', '.svg'];

// ─────────────────────────────────────────────────────────────────────────────
// Utilities
// ─────────────────────────────────────────────────────────────────────────────

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function withRetry(fn, label, retries = MAX_RETRIES) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt === retries) throw err;
      const delayMs = RETRY_DELAY_MS * attempt;
      console.warn(`  [retry] ${label} — attempt ${attempt}/${retries} failed: ${err.message}. Retrying in ${delayMs}ms...`);
      await sleep(delayMs);
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Validation
// ─────────────────────────────────────────────────────────────────────────────

function validateQuestion(q, index, imagesDir) {
  const errors = [];
  const prefix = `questions[${index}]`;

  if (!q.subject_id) errors.push(`${prefix}: missing subject_id`);
  if (!q.chapter_id) errors.push(`${prefix}: missing chapter_id`);
  if (!q.question_type) errors.push(`${prefix}: missing question_type`);
  else if (!VALID_QUESTION_TYPES.includes(q.question_type))
    errors.push(`${prefix}: invalid question_type "${q.question_type}"`);
  if (!q.difficulty) errors.push(`${prefix}: missing difficulty`);
  else if (!VALID_DIFFICULTIES.includes(q.difficulty))
    errors.push(`${prefix}: invalid difficulty "${q.difficulty}"`);
  if (!q.question_text) errors.push(`${prefix}: missing question_text`);
  if (!q.correct_answer) errors.push(`${prefix}: missing correct_answer`);

  // Options validation
  if (!q.options || !Array.isArray(q.options) || q.options.length < 2) {
    errors.push(`${prefix}: must have at least 2 options`);
  } else {
    const correctCount = q.options.filter((o) => o.is_correct).length;
    if (correctCount !== 1) errors.push(`${prefix}: exactly 1 option must have is_correct=true (found ${correctCount})`);
    for (const opt of q.options) {
      if (!opt.key) errors.push(`${prefix}: option missing key`);
      if (!opt.text) errors.push(`${prefix}: option "${opt.key}" missing text`);
    }
  }

  // Diagram-based: validate image file exists
  if (q.question_type === 'diagram-based') {
    if (!q.image_file && !q.image_url) {
      errors.push(`${prefix}: diagram-based question must have image_file or image_url`);
    }
    if (q.image_file) {
      const imgPath = resolve(imagesDir, q.image_file);
      if (!existsSync(imgPath)) {
        errors.push(`${prefix}: image file not found: ${imgPath}`);
      } else {
        const ext = extname(q.image_file).toLowerCase();
        if (!VALID_IMAGE_EXTENSIONS.includes(ext)) {
          errors.push(`${prefix}: invalid image type "${ext}" (allowed: ${VALID_IMAGE_EXTENSIONS.join(', ')})`);
        }
        const size = statSync(imgPath).size;
        if (size > MAX_IMAGE_SIZE) {
          errors.push(`${prefix}: image file too large (${(size / 1024 / 1024).toFixed(1)} MB, max 5 MB)`);
        }
      }
    }
  }

  return errors;
}

// ─────────────────────────────────────────────────────────────────────────────
// Image upload
// ─────────────────────────────────────────────────────────────────────────────

const MIME_TYPES = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
};

/**
 * Upload a local image to Supabase Storage.
 * Returns the public URL.
 *
 * Storage path: {subject_id}/{chapter_id}/{filename}
 */
async function uploadImage(supabase, supabaseUrl, imagePath, subjectId, chapterId) {
  const fileBuffer = readFileSync(imagePath);
  const ext = extname(imagePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  // Use a deterministic path based on subject/chapter/filename for idempotency
  const fileName = basename(imagePath);
  const storagePath = `${subjectId}/${chapterId}/${fileName}`;

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(storagePath, fileBuffer, {
      contentType,
      upsert: true, // overwrite if exists (idempotent re-runs)
    });

  if (error) {
    throw new Error(`Failed to upload ${fileName}: ${error.message}`);
  }

  // Build public URL
  const publicUrl = `${supabaseUrl}/storage/v1/object/public/${STORAGE_BUCKET}/${storagePath}`;
  return publicUrl;
}

// ─────────────────────────────────────────────────────────────────────────────
// DB upsert
// ─────────────────────────────────────────────────────────────────────────────

async function upsertQuestions(supabase, questions) {
  const { error } = await supabase
    .from('med_questions')
    .upsert(questions, { onConflict: 'id', ignoreDuplicates: false });

  if (error) throw new Error(`Failed to upsert questions: ${error.message}`);
}

async function upsertOptions(supabase, options) {
  if (options.length === 0) return;
  const { error } = await supabase
    .from('med_question_options')
    .upsert(options, { onConflict: 'id', ignoreDuplicates: false });

  if (error) throw new Error(`Failed to upsert options: ${error.message}`);
}

async function upsertHints(supabase, hints) {
  if (hints.length === 0) return;
  const { error } = await supabase
    .from('med_elimination_hints')
    .upsert(hints, { onConflict: 'id', ignoreDuplicates: false });

  if (error) throw new Error(`Failed to upsert hints: ${error.message}`);
}

// ─────────────────────────────────────────────────────────────────────────────
// Build DB rows from JSON input
// ─────────────────────────────────────────────────────────────────────────────

function buildPayload(q) {
  // If the user provided an explicit payload object, use it (advanced mode)
  if (q.payload) return q.payload;

  // Otherwise, build a type-appropriate payload from the flat fields
  const options = (q.options || []).map((o) => ({
    id: o.key,
    text: o.text,
    textTe: o.text_te || '',
  }));

  const correctOpt = (q.options || []).find((o) => o.is_correct);
  const correctOptionId = correctOpt?.key || q.correct_answer;

  switch (q.question_type) {
    case 'diagram-based':
      return {
        type: 'diagram-based',
        imageUri: q._resolved_image_url || q.image_url || '',
        imageAlt: q.image_alt || '',
        options,
        correctOptionId,
      };

    case 'true-false':
      return {
        type: 'true-false',
        statement: q.statement || q.question_text,
        statementTe: q.statement_te || q.question_text_te || '',
        correctAnswer: q.correct_answer === 'true' || q.correct_answer === true,
      };

    case 'assertion-reasoning':
      return {
        type: 'assertion-reasoning',
        assertion: q.assertion || '',
        assertionTe: q.assertion_te || '',
        reason: q.reason || '',
        reasonTe: q.reason_te || '',
        options,
        correctOptionId,
      };

    case 'match-the-following':
      return {
        type: 'match-the-following',
        columnA: q.column_a || [],
        columnB: q.column_b || [],
        correctMapping: q.correct_mapping || {},
        options,
        correctOptionId,
      };

    case 'logical-sequence':
      return {
        type: 'logical-sequence',
        items: q.items || [],
        correctOrder: q.correct_order || [],
        options,
        correctOptionId,
      };

    case 'fill-in-blanks':
      return {
        type: 'fill-in-blanks',
        textWithBlanks: q.text_with_blanks || '',
        textWithBlanksTe: q.text_with_blanks_te || '',
        options,
        correctOptionId,
      };

    case 'scenario-based':
      return {
        type: 'scenario-based',
        scenario: q.scenario || '',
        scenarioTe: q.scenario_te || '',
        options,
        correctOptionId,
      };

    case 'mcq':
    default:
      return {
        type: 'mcq',
        options,
        correctOptionId,
      };
  }
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function toUUID(val) {
  return val && UUID_RE.test(val) ? val : randomUUID();
}

function buildDbRows(q, index) {
  const questionId = toUUID(q.id);
  const payload = buildPayload(q);

  // Main question row
  const questionRow = {
    id: questionId,
    subject_id: q.subject_id,
    chapter_id: q.chapter_id,
    topic_id: q.topic_id || null,
    question_type: q.question_type,
    difficulty: q.difficulty,
    strength_required: q.strength_required || 'just-started',
    question_text: q.question_text,
    question_text_te: q.question_text_te || null,
    explanation: q.explanation || null,
    explanation_te: q.explanation_te || null,
    payload,
    image_url: q._resolved_image_url || q.image_url || null,
    image_alt: q.image_alt || null,
    correct_answer: q.correct_answer,
    status: q.status || 'active',
    concept_tags: q.concept_tags || [],
  };

  // Option rows (always generate UUID for composite IDs)
  const optionRows = (q.options || []).map((o, idx) => ({
    id: randomUUID(),
    question_id: questionId,
    option_key: o.key,
    option_text: o.text,
    option_text_te: o.text_te || null,
    is_correct: o.is_correct,
    sort_order: idx + 1,
  }));

  // Elimination hint rows
  const hintRows = (q.elimination_hints || []).map((h) => ({
    id: randomUUID(),
    question_id: questionId,
    option_key: h.option_key,
    hint_text: h.hint || h.hint_text || '',
    hint_text_te: h.hint_te || h.hint_text_te || null,
    misconception: h.misconception || null,
    misconception_te: h.misconception_te || null,
  }));

  return { questionRow, optionRows, hintRows };
}

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  const args = parseArgs(process.argv);

  if (args.help) {
    printUsage();
    process.exit(0);
  }

  if (!args.file) {
    console.error('ERROR: --file=<path> is required. Run with --help for usage.');
    process.exit(1);
  }

  const dryRun = args.dryRun ?? false;
  const filePath = resolve(args.file);
  const imagesDir = resolve(args.imagesDir || dirname(filePath));

  if (!existsSync(filePath)) {
    console.error(`ERROR: File not found: ${filePath}`);
    process.exit(1);
  }

  // Parse JSON
  let data;
  try {
    data = JSON.parse(readFileSync(filePath, 'utf-8'));
  } catch (err) {
    console.error(`ERROR: Failed to parse JSON: ${err.message}`);
    process.exit(1);
  }

  const questions = data.questions;
  if (!Array.isArray(questions) || questions.length === 0) {
    console.error('ERROR: JSON must contain a "questions" array with at least 1 entry.');
    process.exit(1);
  }

  // Validate all questions
  console.log('');
  console.log('='.repeat(60));
  console.log('  VaNi Question Import');
  console.log('='.repeat(60));
  console.log(`  Mode       : ${dryRun ? 'DRY RUN (validate only)' : 'LIVE IMPORT'}`);
  console.log(`  File       : ${filePath}`);
  console.log(`  Images dir : ${imagesDir}`);
  console.log(`  Questions  : ${questions.length}`);
  console.log('='.repeat(60));
  console.log('');

  console.log('Validating questions...');
  const allErrors = [];
  for (let i = 0; i < questions.length; i++) {
    const errs = validateQuestion(questions[i], i, imagesDir);
    allErrors.push(...errs);
  }

  if (allErrors.length > 0) {
    console.error(`\nValidation failed with ${allErrors.length} error(s):\n`);
    for (const e of allErrors) console.error(`  - ${e}`);
    console.error('');
    process.exit(1);
  }

  console.log(`  All ${questions.length} questions passed validation.`);

  // Count types
  const typeCounts = {};
  for (const q of questions) {
    typeCounts[q.question_type] = (typeCounts[q.question_type] || 0) + 1;
  }
  console.log('  Type breakdown:');
  for (const [type, count] of Object.entries(typeCounts)) {
    console.log(`    ${type}: ${count}`);
  }

  const diagramCount = typeCounts['diagram-based'] || 0;
  if (diagramCount > 0) {
    console.log(`\n  ${diagramCount} diagram-based question(s) — images will be uploaded.`);
  }

  if (dryRun) {
    console.log('\n  Dry run complete. No data written.');
    process.exit(0);
  }

  // Resolve credentials
  const supabaseUrl = args.url || process.env.SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL;
  const supabaseKey = args.key || process.env.SUPABASE_SERVICE_KEY || process.env.EXPO_SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    const missing = [];
    if (!supabaseUrl) missing.push('SUPABASE_URL / --url');
    if (!supabaseKey) missing.push('SUPABASE_SERVICE_KEY / --key');
    console.error(`\nERROR: Missing credentials: ${missing.join(', ')}`);
    console.error('The import script requires a service-role key to bypass RLS.');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // ── Phase 1: Upload images ──────────────────────────────────
  console.log('\nPhase 1: Uploading images...');
  let uploadCount = 0;
  let skipCount = 0;

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];

    if (q.question_type !== 'diagram-based') continue;

    // If image_url is already a full URL, skip upload
    if (q.image_url && q.image_url.startsWith('http')) {
      questions[i]._resolved_image_url = q.image_url;
      skipCount++;
      continue;
    }

    if (!q.image_file) continue;

    const imgPath = resolve(imagesDir, q.image_file);

    try {
      const publicUrl = await withRetry(
        () => uploadImage(supabase, supabaseUrl, imgPath, q.subject_id, q.chapter_id),
        `upload ${q.image_file}`,
      );
      questions[i]._resolved_image_url = publicUrl;
      uploadCount++;
      console.log(`  [${uploadCount}] Uploaded: ${q.image_file} → ${publicUrl}`);
    } catch (err) {
      console.error(`  ERROR uploading ${q.image_file}: ${err.message}`);
      process.exit(1);
    }
  }

  console.log(`  Images uploaded: ${uploadCount}, skipped (already URL): ${skipCount}`);

  // ── Phase 1.5: Ensure referenced chapters exist ────────────
  console.log('\nPhase 1.5: Ensuring chapters exist...');

  const chapterMap = new Map(); // chapter_id → subject_id
  for (const q of questions) {
    if (!chapterMap.has(q.chapter_id)) {
      chapterMap.set(q.chapter_id, q.subject_id);
    }
  }

  // Derive a human-readable name from the chapter_id
  // e.g. "physics-laws-of-motion" → strip subject prefix → "Laws Of Motion"
  function chapterNameFromId(chapterId, subjectId) {
    let slug = chapterId;
    if (slug.startsWith(subjectId + '-')) {
      slug = slug.slice(subjectId.length + 1);
    }
    return slug
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }

  const chapterRows = [];
  for (const [chapterId, subjectId] of chapterMap) {
    chapterRows.push({
      id: chapterId,
      subject_id: subjectId,
      name: chapterNameFromId(chapterId, subjectId),
    });
  }

  // Use onConflict so existing chapters are left untouched
  const { error: chapterErr } = await supabase
    .from('med_chapters')
    .upsert(chapterRows, { onConflict: 'id', ignoreDuplicates: true });

  if (chapterErr) {
    console.error(`  ERROR ensuring chapters: ${chapterErr.message}`);
    process.exit(1);
  }
  console.log(`  Ensured ${chapterRows.length} chapter(s): ${[...chapterMap.keys()].join(', ')}`);

  // ── Phase 2: Build and upsert DB rows ──────────────────────
  console.log('\nPhase 2: Importing questions to database...');

  const allQuestionRows = [];
  const allOptionRows = [];
  const allHintRows = [];

  for (let i = 0; i < questions.length; i++) {
    const { questionRow, optionRows, hintRows } = buildDbRows(questions[i], i);
    allQuestionRows.push(questionRow);
    allOptionRows.push(...optionRows);
    allHintRows.push(...hintRows);
  }

  // Upsert in batches
  const BATCH_SIZE = 200;

  // Questions
  for (let i = 0; i < allQuestionRows.length; i += BATCH_SIZE) {
    const batch = allQuestionRows.slice(i, i + BATCH_SIZE);
    await withRetry(
      () => upsertQuestions(supabase, batch),
      `upsert questions batch ${Math.floor(i / BATCH_SIZE) + 1}`,
    );
  }
  console.log(`  Questions upserted: ${allQuestionRows.length}`);

  // Options
  for (let i = 0; i < allOptionRows.length; i += BATCH_SIZE) {
    const batch = allOptionRows.slice(i, i + BATCH_SIZE);
    await withRetry(
      () => upsertOptions(supabase, batch),
      `upsert options batch ${Math.floor(i / BATCH_SIZE) + 1}`,
    );
  }
  console.log(`  Options upserted: ${allOptionRows.length}`);

  // Hints
  for (let i = 0; i < allHintRows.length; i += BATCH_SIZE) {
    const batch = allHintRows.slice(i, i + BATCH_SIZE);
    await withRetry(
      () => upsertHints(supabase, batch),
      `upsert hints batch ${Math.floor(i / BATCH_SIZE) + 1}`,
    );
  }
  console.log(`  Elimination hints upserted: ${allHintRows.length}`);

  // ── Summary ─────────────────────────────────────────────────
  console.log('');
  console.log('='.repeat(60));
  console.log('  IMPORT SUMMARY');
  console.log('='.repeat(60));
  console.log(`  Questions imported : ${allQuestionRows.length}`);
  console.log(`  Options imported   : ${allOptionRows.length}`);
  console.log(`  Hints imported     : ${allHintRows.length}`);
  console.log(`  Images uploaded    : ${uploadCount}`);
  console.log(`  Images skipped     : ${skipCount}`);
  console.log('='.repeat(60));
  console.log('');
  console.log('Done.');
  process.exit(0);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
