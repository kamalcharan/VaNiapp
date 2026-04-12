#!/usr/bin/env node
/**
 * Repair NULL topic_id on polsci CUET questions.
 *
 * Loads topic/chapter data from the JSON source files on disk (not from
 * payload.topic_name in the DB, which may be empty for older rows).
 * Then for each null-topic question in the DB, resolves or creates the
 * topic in med_topics and updates med_questions.topic_id.
 *
 * Usage:
 *   node Qbank/CUET/polsci/repair_topic_ids.js
 *   node Qbank/CUET/polsci/repair_topic_ids.js --dry-run
 *
 * Reads Supabase creds from Qbank/config.json
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const CONFIG_PATH  = join(__dirname, '..', '..', 'config.json');
const POLSCI_DIR   = __dirname;  // JSON files live here
const dryRun       = process.argv.includes('--dry-run');

// ── Topic name normaliser (mirrors shared.js _normalizeTopic) ────────────────
function normalizeTopic(name) {
  return name
    .toLowerCase()
    .replace(/[''`]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// ── Fuzzy match against cached topics (mirrors shared.js resolveTopicId) ─────
function findInCache(cache, topicName) {
  const needle      = topicName.toLowerCase().trim();
  const needleNorm  = normalizeTopic(topicName);
  const needleWords = new Set(needleNorm.split(' ').filter(Boolean));

  const exact = cache.find(t => t.nameLower === needle);
  if (exact) return exact.id;

  const normExact = cache.find(t => t.nameNorm === needleNorm);
  if (normExact) return normExact.id;

  const contains = cache.find(t =>
    needleNorm.includes(t.nameNorm) || t.nameNorm.includes(needleNorm)
  );
  if (contains) return contains.id;

  let bestScore = 0, bestTopic = null;
  for (const t of cache) {
    if (t.words.size === 0) continue;
    let overlap = 0;
    for (const w of t.words) { if (needleWords.has(w)) overlap++; }
    const score = overlap / t.words.size;
    if (score > bestScore && overlap >= 2) { bestScore = score; bestTopic = t; }
  }
  if (bestScore >= 0.5 && bestTopic) return bestTopic.id;

  return null;
}

// ── Load JSON files → question_id → { topic, chapter_id } ────────────────────
function buildJsonMap(dir) {
  const map = {};
  const files = readdirSync(dir).filter(f => f.endsWith('.json'));
  for (const fname of files) {
    try {
      const data = JSON.parse(readFileSync(join(dir, fname), 'utf-8'));
      const arr = Array.isArray(data) ? data : (data.questions || []);
      for (const q of arr) {
        const qid = q.id || q.question_id || '';
        if (qid && q.topic && q.chapter_id) {
          map[qid] = { topic: q.topic, chapter_id: q.chapter_id };
        }
      }
    } catch { /* skip unreadable files */ }
  }
  return map;
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  if (!existsSync(CONFIG_PATH)) {
    console.error(`ERROR: Config not found at ${CONFIG_PATH}`);
    process.exit(1);
  }

  const config  = JSON.parse(readFileSync(CONFIG_PATH, 'utf-8'));
  const { url, serviceKey, anonKey } = config.supabase || {};
  const key = serviceKey || anonKey;
  if (!url || !key) {
    console.error('ERROR: config.json must have supabase.url and supabase.serviceKey');
    process.exit(1);
  }

  const supabase = createClient(url, key);

  console.log(`\nPolsci topic_id repair v2${dryRun ? ' (DRY RUN)' : ''}`);
  console.log('═'.repeat(50));

  // ── Step 1: Load JSON files → question_id → { topic, chapter_id } ───────
  console.log('\n[1] Loading question data from JSON files …');
  const jsonMap = buildJsonMap(POLSCI_DIR);
  console.log(`    ${Object.keys(jsonMap).length} questions indexed from JSON files`);

  // ── Step 2: Fetch all NULL-topic polsci questions from DB ────────────────
  console.log('\n[2] Fetching questions with topic_id IS NULL …');
  let allRows = [];
  let from = 0;
  const PAGE = 1000;
  while (true) {
    const { data, error } = await supabase
      .from('med_questions')
      .select('id, chapter_id, payload')
      .is('topic_id', null)
      .like('chapter_id', 'cuet-pol-%')
      .range(from, from + PAGE - 1);

    if (error) { console.error('Query error:', error.message); process.exit(1); }
    if (!data || data.length === 0) break;
    allRows = allRows.concat(data);
    if (data.length < PAGE) break;
    from += PAGE;
  }

  console.log(`    Found ${allRows.length} questions with NULL topic_id`);
  if (allRows.length === 0) {
    console.log('\nNothing to fix. All done!');
    return;
  }

  // ── Step 3: Resolve topic for each row ───────────────────────────────────
  // Primary: JSON file map (by question_id from payload)
  // Fallback: payload.topic_name from DB
  console.log('\n[3] Resolving topic for each question …');

  const groups = {}; // "chapterId|||topicName" -> { chapterId, topicName, rowIds }
  let noTopicCount = 0;

  for (const row of allRows) {
    const payloadQid  = row.payload?.question_id || '';
    const fromJson    = jsonMap[payloadQid];
    const topicName   = fromJson?.topic || row.payload?.topic_name || '';
    const chapterId   = fromJson?.chapter_id || row.chapter_id || '';

    if (!topicName || !chapterId) {
      console.warn(`  SKIP (no topic/chapter): db_id=${row.id.slice(0,8)} qid="${payloadQid}"`);
      noTopicCount++;
      continue;
    }

    const key = `${chapterId}|||${topicName}`;
    if (!groups[key]) groups[key] = { chapterId, topicName, rowIds: [] };
    groups[key].rowIds.push(row.id);
  }

  const uniqueGroups = Object.values(groups);
  console.log(`    Unique (chapter, topic) groups: ${uniqueGroups.length}`);
  if (noTopicCount > 0) console.log(`    Skipped (no topic data): ${noTopicCount}`);

  // ── Step 4: Load topic caches from DB ────────────────────────────────────
  console.log('\n[4] Loading existing topics from med_topics …');
  const topicCache = {};
  const chapterIds = [...new Set(uniqueGroups.map(g => g.chapterId))];

  for (const cid of chapterIds) {
    const { data, error } = await supabase
      .from('med_topics')
      .select('id, name')
      .eq('chapter_id', cid);
    if (error || !data) {
      console.warn(`  WARN: failed to load topics for ${cid}: ${error?.message}`);
      topicCache[cid] = [];
    } else {
      topicCache[cid] = data.map(t => {
        const norm = normalizeTopic(t.name);
        return { id: t.id, nameLower: t.name.toLowerCase().trim(), nameNorm: norm, words: new Set(norm.split(' ').filter(Boolean)) };
      });
      console.log(`    ${cid}: ${data.length} topics`);
    }
  }

  // ── Step 5: Resolve/create topic_id per group ────────────────────────────
  console.log('\n[5] Resolving topics …');
  const assignments = [];
  let resolved = 0, created = 0, failed = 0;

  for (const grp of uniqueGroups) {
    const { chapterId, topicName, rowIds } = grp;
    const cache = topicCache[chapterId] || [];

    let topicId = findInCache(cache, topicName);

    if (topicId) {
      console.log(`  MATCH: "${topicName.slice(0,50)}" → ${topicId.slice(0,8)}… (${rowIds.length} rows)`);
      resolved++;
    } else if (dryRun) {
      console.log(`  [dry] CREATE: "${topicName.slice(0,50)}" in ${chapterId} (${rowIds.length} rows)`);
      created++;
    } else {
      const { data: newTopic, error: createErr } = await supabase
        .from('med_topics')
        .insert({ chapter_id: chapterId, name: topicName, sort_order: 0, is_important: false })
        .select('id')
        .single();

      if (createErr || !newTopic) {
        console.error(`  FAIL create "${topicName.slice(0,50)}" in ${chapterId}: ${createErr?.message}`);
        failed += rowIds.length;
        continue;
      }

      topicId = newTopic.id;
      const norm = normalizeTopic(topicName);
      topicCache[chapterId].push({
        id: topicId, nameLower: topicName.toLowerCase().trim(),
        nameNorm: norm, words: new Set(norm.split(' ').filter(Boolean)),
      });
      console.log(`  CREATE: "${topicName.slice(0,50)}" in ${chapterId} (${rowIds.length} rows)`);
      created++;
    }

    if (topicId) assignments.push({ topicId, rowIds });
  }

  if (dryRun) {
    const totalWouldFix = assignments.reduce((s, a) => s + a.rowIds.length, 0);
    console.log(`\n${'═'.repeat(50)}`);
    console.log(`Dry run — would fix: ${totalWouldFix}  matches: ${resolved}  creates: ${created}  skip: ${noTopicCount}`);
    return;
  }

  // ── Step 6: Batch update topic_id ────────────────────────────────────────
  console.log('\n[6] Updating topic_id in DB …');
  let updated = 0, updateErrors = 0;

  for (const { topicId, rowIds } of assignments) {
    for (let i = 0; i < rowIds.length; i += 100) {
      const batch = rowIds.slice(i, i + 100);
      const { error } = await supabase
        .from('med_questions')
        .update({ topic_id: topicId })
        .in('id', batch);

      if (error) {
        console.error(`  FAIL batch update: ${error.message}`);
        updateErrors += batch.length;
      } else {
        updated += batch.length;
      }
    }
  }

  // ── Summary ───────────────────────────────────────────────────────────────
  console.log(`\n${'═'.repeat(50)}`);
  console.log(`Results:`);
  console.log(`  Topics matched:  ${resolved}`);
  console.log(`  Topics created:  ${created}`);
  console.log(`  Questions fixed: ${updated}`);
  console.log(`  Skipped:         ${noTopicCount}`);
  console.log(`  Errors:          ${failed + updateErrors}`);

  if (failed + updateErrors > 0) {
    console.log('\nSome rows failed. Check error messages above.');
    process.exit(1);
  }
  console.log('\nAll done!');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
