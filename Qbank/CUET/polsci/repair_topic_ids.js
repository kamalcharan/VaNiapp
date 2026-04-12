#!/usr/bin/env node
/**
 * Repair NULL topic_id on polsci CUET questions.
 *
 * Queries med_questions WHERE topic_id IS NULL AND chapter_id LIKE 'cuet-pol-%',
 * reads payload.topic_name, finds or creates the topic in med_topics,
 * then updates topic_id in batch.
 *
 * Usage:
 *   node Qbank/CUET/polsci/repair_topic_ids.js
 *   node Qbank/CUET/polsci/repair_topic_ids.js --dry-run
 *
 * Reads Supabase creds from Qbank/config.json
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const CONFIG_PATH = join(__dirname, '..', '..', 'config.json');
const dryRun = process.argv.includes('--dry-run');

// ── Topic name normaliser (mirrors shared.js _normalizeTopic) ────────────────
function normalizeTopic(name) {
  return name
    .toLowerCase()
    .replace(/[''`]/g, '')          // strip apostrophes
    .replace(/[^a-z0-9\s]/g, ' ')  // non-alphanum → space
    .replace(/\s+/g, ' ')
    .trim();
}

// ── Fuzzy match against cached topics (mirrors shared.js resolveTopicId) ─────
function findInCache(cache, topicName) {
  const needle     = topicName.toLowerCase().trim();
  const needleNorm = normalizeTopic(topicName);
  const needleWords = new Set(needleNorm.split(' ').filter(Boolean));

  // 1. Exact
  const exact = cache.find(t => t.nameLower === needle);
  if (exact) return exact.id;

  // 2. Normalised exact
  const normExact = cache.find(t => t.nameNorm === needleNorm);
  if (normExact) return normExact.id;

  // 3. Substring
  const contains = cache.find(t => needleNorm.includes(t.nameNorm) || t.nameNorm.includes(needleNorm));
  if (contains) return contains.id;

  // 4. Best keyword overlap
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

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  if (!existsSync(CONFIG_PATH)) {
    console.error(`ERROR: Config not found at ${CONFIG_PATH}`);
    process.exit(1);
  }

  const config = JSON.parse(readFileSync(CONFIG_PATH, 'utf-8'));
  const { url, serviceKey, anonKey } = config.supabase || {};
  const key = serviceKey || anonKey;
  if (!url || !key) {
    console.error('ERROR: config.json must have supabase.url and supabase.serviceKey');
    process.exit(1);
  }

  const supabase = createClient(url, key);

  console.log(`\nPolsci topic_id repair${dryRun ? ' (DRY RUN)' : ''}`);
  console.log('═'.repeat(50));

  // ── Step 1: fetch all NULL-topic polsci questions ─────────────────────────
  console.log('\n[1] Fetching questions with topic_id IS NULL …');

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

  // ── Step 2: group by (chapter_id, topic_name) ─────────────────────────────
  const groups = {}; // "chapter_id|||topic_name" -> [row_id, ...]
  for (const row of allRows) {
    const topicName = row.payload?.topic_name || '';
    const key = `${row.chapter_id}|||${topicName}`;
    if (!groups[key]) groups[key] = { chapterId: row.chapter_id, topicName, rowIds: [] };
    groups[key].rowIds.push(row.id);
  }

  const uniqueGroups = Object.values(groups);
  console.log(`    Unique (chapter, topic) combos: ${uniqueGroups.length}`);

  // ── Step 3: build per-chapter topic cache from med_topics ─────────────────
  console.log('\n[2] Loading existing topics from med_topics …');
  const topicCache = {}; // chapterId -> [{ id, nameLower, nameNorm, words }]

  const chapterIds = [...new Set(uniqueGroups.map(g => g.chapterId))];
  for (const cid of chapterIds) {
    const { data, error } = await supabase
      .from('med_topics')
      .select('id, name')
      .eq('chapter_id', cid);
    if (error || !data) {
      console.warn(`  WARN: failed to load topics for ${cid}:`, error?.message);
      topicCache[cid] = [];
      continue;
    }
    topicCache[cid] = data.map(t => {
      const norm = normalizeTopic(t.name);
      return { id: t.id, nameLower: t.name.toLowerCase().trim(), nameNorm: norm, words: new Set(norm.split(' ').filter(Boolean)) };
    });
    console.log(`    ${cid}: ${data.length} topics loaded`);
  }

  // ── Step 4: resolve/create topic_id for each group ────────────────────────
  console.log('\n[3] Resolving topics …');
  let resolved = 0, created = 0, failed = 0;

  const assignments = []; // { topicId, rowIds }

  for (const grp of uniqueGroups) {
    const { chapterId, topicName, rowIds } = grp;

    if (!topicName) {
      console.warn(`  SKIP (empty topic): ${chapterId} — ${rowIds.length} rows`);
      failed += rowIds.length;
      continue;
    }

    // Try to find in cache
    let topicId = findInCache(topicCache[chapterId] || [], topicName);

    if (topicId) {
      console.log(`  MATCH: "${topicName}" → ${topicId.slice(0,8)}… (${rowIds.length} rows)`);
      resolved++;
    } else if (dryRun) {
      console.log(`  [dry] Would CREATE: "${topicName}" in ${chapterId} (${rowIds.length} rows)`);
      created++;
    } else {
      // Create new topic
      const { data: newTopic, error: createErr } = await supabase
        .from('med_topics')
        .insert({ chapter_id: chapterId, name: topicName, sort_order: 0, is_important: false })
        .select('id')
        .single();

      if (createErr || !newTopic) {
        console.error(`  FAIL create "${topicName}" in ${chapterId}: ${createErr?.message}`);
        failed += rowIds.length;
        continue;
      }

      topicId = newTopic.id;
      // Add to cache for subsequent matches
      const norm = normalizeTopic(topicName);
      topicCache[chapterId].push({ id: topicId, nameLower: topicName.toLowerCase().trim(), nameNorm: norm, words: new Set(norm.split(' ').filter(Boolean)) });
      console.log(`  CREATE: "${topicName}" → ${topicId.slice(0,8)}… (${rowIds.length} rows)`);
      created++;
    }

    if (topicId) assignments.push({ topicId, rowIds });
  }

  if (dryRun) {
    console.log(`\n${'═'.repeat(50)}`);
    console.log(`Dry run complete. Would fix ${allRows.length} questions.`);
    console.log(`  Matches found: ${resolved}  Would create: ${created}  Skipped: ${failed}`);
    return;
  }

  // ── Step 5: batch update topic_id ─────────────────────────────────────────
  console.log(`\n[4] Updating topic_id in DB …`);
  let updated = 0, updateErrors = 0;

  for (const { topicId, rowIds } of assignments) {
    // Update in batches of 100
    for (let i = 0; i < rowIds.length; i += 100) {
      const batch = rowIds.slice(i, i + 100);
      const { error } = await supabase
        .from('med_questions')
        .update({ topic_id: topicId })
        .in('id', batch);

      if (error) {
        console.error(`  FAIL update batch: ${error.message}`);
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
  console.log(`  Skipped/errors:  ${failed + updateErrors}`);

  if (failed + updateErrors > 0) {
    console.log('\nSome rows were not fixed. Re-run to retry.');
    process.exit(1);
  }
  console.log('\nAll done! topic_id repaired for all polsci questions.');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
