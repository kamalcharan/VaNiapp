#!/usr/bin/env node

/**
 * Quick verification script — checks what was imported into the question bank.
 *
 * Usage:
 *   node scripts/verify-import.mjs
 */

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.EXPO_SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY in env.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function main() {
  console.log('\n=== Chapters ===');
  const { data: chapters, error: chErr } = await supabase
    .from('med_chapters')
    .select('id, subject_id, name')
    .order('id');
  if (chErr) console.error('  Error:', chErr.message);
  else if (chapters.length === 0) console.log('  (none)');
  else chapters.forEach((c) => console.log(`  ${c.id}  |  ${c.subject_id}  |  ${c.name}`));

  console.log('\n=== Questions ===');
  const { data: questions, error: qErr } = await supabase
    .from('med_questions')
    .select('id, subject_id, chapter_id, question_type, difficulty, question_text')
    .order('created_at');
  if (qErr) console.error('  Error:', qErr.message);
  else if (questions.length === 0) console.log('  (none)');
  else {
    console.log(`  Total: ${questions.length}\n`);
    questions.forEach((q, i) => {
      const text = q.question_text.length > 80 ? q.question_text.slice(0, 80) + '...' : q.question_text;
      console.log(`  [${i + 1}] ${q.id}`);
      console.log(`      type: ${q.question_type}  |  difficulty: ${q.difficulty}`);
      console.log(`      chapter: ${q.chapter_id}`);
      console.log(`      ${text}\n`);
    });
  }

  console.log('=== Options ===');
  const { data: opts, error: oErr } = await supabase
    .from('med_question_options')
    .select('question_id, option_key, option_text, is_correct')
    .order('question_id')
    .order('sort_order');
  if (oErr) console.error('  Error:', oErr.message);
  else console.log(`  Total: ${opts.length}`);

  console.log('\n=== Elimination Hints ===');
  const { data: hints, error: hErr } = await supabase
    .from('med_elimination_hints')
    .select('question_id, option_key, hint_text')
    .order('question_id');
  if (hErr) console.error('  Error:', hErr.message);
  else console.log(`  Total: ${hints.length}`);

  console.log('');
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
