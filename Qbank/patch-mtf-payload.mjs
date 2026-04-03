#!/usr/bin/env node
/**
 * Patch existing DB records for match-the-following questions:
 * merges column_a and column_b into payload from local JSON files.
 *
 * Usage:
 *   node Qbank/patch-mtf-payload.mjs              # patch all history MTF
 *   node Qbank/patch-mtf-payload.mjs --dry-run    # preview only
 */
import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONFIG_PATH = join(__dirname, 'config.json');
const HISTORY_DIR = join(__dirname, 'CUET/history');

function loadConfig() {
  if (!existsSync(CONFIG_PATH)) { console.error('config.json not found'); process.exit(1); }
  return JSON.parse(readFileSync(CONFIG_PATH, 'utf-8'));
}

function log(msg, type = 'info') {
  const p = { ok:'  [OK]', fail:'[FAIL]', warn:'[WARN]', info:'[INFO]', skip:'[SKIP]' }[type] || '[INFO]';
  console.log(`${p} ${msg}`);
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');

  console.log('\n========================================');
  console.log('  Patch MTF payload (column_a / column_b)');
  console.log('========================================\n');
  if (dryRun) log('DRY RUN — no DB changes', 'warn');

  const config = loadConfig();
  const supabase = createClient(config.supabase.url, config.supabase.anonKey);

  // Parse "1-P, 2-Q, 3-R" → { "1": "P", "2": "Q", "3": "R" }
  function parseCorrectMapping(options, correctKey) {
    const correctOpt = options.find(o => o.key === correctKey);
    if (!correctOpt) return null;
    const mapping = {};
    const pairs = correctOpt.text.split(/,\s*/);
    for (const pair of pairs) {
      const m = pair.trim().match(/^(\w+)-(\w+)$/);
      if (m) mapping[m[1]] = m[2];
    }
    return Object.keys(mapping).length > 0 ? mapping : null;
  }

  // Collect all MTF questions with column data from JSON files
  const mtfMap = new Map(); // question_id -> { column_a, column_b, correct_mapping }
  const files = readdirSync(HISTORY_DIR).filter(f => f.endsWith('.json')).sort();

  for (const file of files) {
    const data = JSON.parse(readFileSync(join(HISTORY_DIR, file), 'utf-8'));
    for (const q of data) {
      if (q.question_type !== 'match-the-following') continue;
      const col_a = q.payload?.column_a || q.column_a;
      const col_b = q.payload?.column_b || q.column_b;
      const correct_mapping = parseCorrectMapping(q.options || [], q.correct_answer);
      if (col_a && col_b) {
        mtfMap.set(q.id, { column_a: col_a, column_b: col_b, correct_mapping });
      }
    }
  }

  log(`Found ${mtfMap.size} MTF questions with column data in JSON files`);

  const qIds = Array.from(mtfMap.keys());

  // Fetch matching DB rows
  const { data: rows, error } = await supabase
    .from('med_questions')
    .select('id, payload')
    .in('payload->>question_id', qIds);

  if (error) { log(`Fetch failed: ${error.message}`, 'fail'); process.exit(1); }
  log(`Found ${rows.length} matching DB rows\n`);

  let updated = 0, skipped = 0, errors = 0;

  for (const row of rows) {
    const qid = row.payload?.question_id;
    const colData = mtfMap.get(qid);
    if (!colData) { skipped++; continue; }

    // Already patched?
    if (row.payload?.column_a) {
      log(`${qid}: already has column_a — skipping`, 'skip');
      skipped++;
      continue;
    }

    const newPayload = { ...row.payload, column_a: colData.column_a, column_b: colData.column_b };
    if (colData.correct_mapping) newPayload.correct_mapping = colData.correct_mapping;

    if (dryRun) {
      log(`Would patch ${qid}: col_a=${colData.column_a.length}items, col_b=${colData.column_b.length}items, mapping=${JSON.stringify(colData.correct_mapping)}`);
      updated++;
      continue;
    }

    const { error: upErr } = await supabase
      .from('med_questions')
      .update({ payload: newPayload })
      .eq('id', row.id);

    if (upErr) {
      log(`${qid}: FAILED — ${upErr.message}`, 'fail');
      errors++;
    } else {
      log(`${qid}: patched`, 'ok');
      updated++;
    }
  }

  console.log('\n========================================');
  console.log(`  Updated: ${updated}  Skipped: ${skipped}  Errors: ${errors}`);
  console.log('========================================\n');
}

main().catch(e => { console.error(e); process.exit(1); });
