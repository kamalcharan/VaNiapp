#!/usr/bin/env node
/**
 * Insert Ch12 Consumer Protection questions into Supabase DB.
 *
 * Usage:
 *   node Qbank/CUET/business-studies/ch12-consumer-protection/batch-2026-03-06/insert_questions.js
 *   node Qbank/CUET/business-studies/ch12-consumer-protection/batch-2026-03-06/insert_questions.js --dry-run
 *
 * Reads Supabase creds from Qbank/config.json
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const CONFIG_PATH = join(__dirname, '..', '..', '..', '..', 'config.json');
const BATCH_DIR = __dirname;

const SUBJECT_ID = 'cuet-business-studies';
const CHAPTER_ID = 'cuet-bst-consumer-protection';

const dryRun = process.argv.includes('--dry-run');

// ═══════════════════════════════════════════════════════════════════
// Build payload (mirrors shared.js buildImportPayload)
// ═══════════════════════════════════════════════════════════════════
function buildPayload(q) {
  const payload = {
    subtopic: q.subtopic || '',
    bloom_level: q.bloom_level || 'understand',
    topic_name: q.topic || '',
    question_id: q.id || '',
    options: q.options || [],
    elimination_hints: q.elimination_hints || [],
  };
  if (q.image_uri) payload.image_uri = q.image_uri;
  if (q.image_alt) payload.image_alt = q.image_alt;
  if (q.scenario) payload.scenario = q.scenario;
  if (q.items) payload.items = q.items;
  if (q.correct_order) payload.correct_order = q.correct_order;
  // match-the-following specific
  if (q.column_a) payload.column_a = q.column_a;
  if (q.column_b) payload.column_b = q.column_b;
  if (q.correct_mapping) payload.correct_mapping = q.correct_mapping;
  return payload;
}

// ═══════════════════════════════════════════════════════════════════
// Main
// ═══════════════════════════════════════════════════════════════════
async function main() {
  if (!existsSync(CONFIG_PATH)) {
    console.error(`ERROR: Config not found at ${CONFIG_PATH}`);
    console.error('Create it from config.example.json with your Supabase URL and service key.');
    process.exit(1);
  }

  const config = JSON.parse(readFileSync(CONFIG_PATH, 'utf-8'));
  const { url, serviceKey, anonKey } = config.supabase || {};
  const key = serviceKey || anonKey;

  if (!url || !key) {
    console.error('ERROR: config.json must have supabase.url and supabase.serviceKey (or anonKey)');
    process.exit(1);
  }

  const supabase = createClient(url, key);

  // Load all JSON question files from the batch directory
  const jsonFiles = readdirSync(BATCH_DIR)
    .filter(f => f.endsWith('.json') && f.startsWith('cuet-bst-consumer-protection'))
    .sort();

  if (jsonFiles.length === 0) {
    console.error('No question JSON files found in', BATCH_DIR);
    process.exit(1);
  }

  let allQuestions = [];
  for (const file of jsonFiles) {
    const data = JSON.parse(readFileSync(join(BATCH_DIR, file), 'utf-8'));
    allQuestions = allQuestions.concat(data);
    console.log(`  Loaded: ${file} (${data.length} questions)`);
  }

  console.log(`\nBST Ch12 Consumer Protection — Insert${dryRun ? ' (DRY RUN)' : ''}`);
  console.log(`${'═'.repeat(55)}`);
  console.log(`Subject:    ${SUBJECT_ID}`);
  console.log(`Chapter:    ${CHAPTER_ID}`);
  console.log(`Files:      ${jsonFiles.length}`);
  console.log(`Questions:  ${allQuestions.length}\n`);

  // Check for duplicates already in DB
  const { data: existing } = await supabase
    .from('med_questions')
    .select('payload')
    .eq('chapter_id', CHAPTER_ID);

  const existingIds = new Set(
    (existing || []).map(row => row.payload?.question_id).filter(Boolean)
  );

  const newQuestions = allQuestions.filter(q => !existingIds.has(q.id));
  const skipped = allQuestions.length - newQuestions.length;

  if (skipped > 0) {
    console.log(`  Skipping ${skipped} questions already in DB`);
  }

  if (newQuestions.length === 0) {
    console.log('\nAll questions already exist in DB. Nothing to insert.');
    process.exit(0);
  }

  console.log(`  Inserting ${newQuestions.length} new questions...\n`);

  let inserted = 0;
  let optionsInserted = 0;
  let hintsInserted = 0;
  let errors = 0;

  for (const q of newQuestions) {
    const label = `${q.id} (${q.question_type}, ${q.difficulty})`;

    if (dryRun) {
      console.log(`  [dry] ${label}: ${q.question_text.substring(0, 60)}...`);
      inserted++;
      continue;
    }

    try {
      // 1. Insert question record
      const questionRecord = {
        subject_id: SUBJECT_ID,
        chapter_id: CHAPTER_ID,
        topic_id: null,
        exam_ids: q.exam_suitability || ['CUET'],
        question_type: q.question_type,
        difficulty: q.difficulty || 'medium',
        strength_required: 'just-started',
        question_text: q.question_text,
        explanation: q.explanation,
        payload: buildPayload(q),
        correct_answer: q.correct_answer,
        source: 'gemini',
        concept_tags: q.concept_tags || [],
        status: 'active',
      };

      const { data: insertedQ, error: qError } = await supabase
        .from('med_questions')
        .insert(questionRecord)
        .select()
        .single();

      if (qError) {
        console.error(`  FAIL ${label}: ${qError.message}`);
        errors++;
        continue;
      }

      // 2. Insert options
      if (q.options && q.options.length > 0) {
        const optionRecords = q.options.map((opt, idx) => ({
          question_id: insertedQ.id,
          option_key: opt.key,
          option_text: opt.text,
          is_correct: opt.is_correct || opt.key === q.correct_answer,
          sort_order: idx,
        }));

        const { error: optError } = await supabase
          .from('med_question_options')
          .insert(optionRecords);

        if (optError) {
          console.error(`  WARN options ${q.id}: ${optError.message}`);
        } else {
          optionsInserted += optionRecords.length;
        }
      }

      // 3. Insert elimination hints
      if (q.elimination_hints && q.elimination_hints.length > 0) {
        const hintRecords = q.elimination_hints.map(h => ({
          question_id: insertedQ.id,
          option_key: h.option_key,
          hint_text: h.hint,
          misconception: h.misconception || null,
        }));

        const { error: hintError } = await supabase
          .from('med_elimination_hints')
          .insert(hintRecords);

        if (hintError) {
          console.error(`  WARN hints ${q.id}: ${hintError.message}`);
        } else {
          hintsInserted += hintRecords.length;
        }
      }

      inserted++;
      console.log(`  OK  ${label}`);
    } catch (err) {
      console.error(`  ERR ${label}: ${err.message}`);
      errors++;
    }
  }

  console.log(`\n${'═'.repeat(55)}`);
  console.log(`Results:`);
  console.log(`  Questions inserted: ${inserted}`);
  console.log(`  Options inserted:   ${optionsInserted}`);
  console.log(`  Hints inserted:     ${hintsInserted}`);
  console.log(`  Errors:             ${errors}`);
  console.log(`  Skipped (dups):     ${skipped}`);

  if (errors > 0) {
    console.log('\nSome operations failed. Re-run is safe (duplicates are auto-skipped).');
    process.exit(1);
  }

  console.log(`\nAll done! ${inserted} questions inserted for Ch12 Consumer Protection.`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
