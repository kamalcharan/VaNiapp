#!/usr/bin/env node
/**
 * Universal diagram image fixer: finds ALL diagram-based questions in DB
 * with missing/non-HTTP image_url, matches them to local PNGs, uploads
 * to Supabase Storage, and updates the DB.
 *
 * Usage:
 *   node Qbank/corrections/upload_fix_all_diagrams.js --dry-run
 *   node Qbank/corrections/upload_fix_all_diagrams.js
 *
 * Reads Supabase creds from Qbank/config.json
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { globSync } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const CONFIG_PATH = join(__dirname, '..', 'config.json');
const STORAGE_BUCKET = 'question-images';

const dryRun = process.argv.includes('--dry-run');

// ═══════════════════════════════════════════════════════════════════
// All known PNG directories (add more as needed)
// ═══════════════════════════════════════════════════════════════════
const PNG_SEARCH_DIRS = [
  join(__dirname, 'diagrams'),                                            // corrections/diagrams/
  join(__dirname, '..', 'CUET', 'physics', 'electrostatics', 'new-2026-03-01', 'diagrams'), // CUET electrostatics
  join(__dirname, '..', 'NEET', 'physics', 'electrostatics', 'new-2026-03-01', 'diagrams'), // NEET electrostatics
];

/**
 * Build an index of all PNGs on disk: filename → full path
 */
function buildPngIndex() {
  const index = new Map();
  for (const dir of PNG_SEARCH_DIRS) {
    if (!existsSync(dir)) continue;
    const pngs = globSync('*.png', { cwd: dir });
    for (const file of pngs) {
      index.set(file, join(dir, file));
    }
  }
  // Also search recursively in Qbank/ for any we missed
  const allPngs = globSync('**/*.png', { cwd: join(__dirname, '..'), ignore: 'node_modules/**' });
  for (const rel of allPngs) {
    const file = rel.split('/').pop();
    if (!index.has(file)) {
      index.set(file, join(__dirname, '..', rel));
    }
  }
  return index;
}

/**
 * Guess the PNG filename from a question ID.
 * E.g. "cuet-phy-elec-coulomb-41" → "cuet-phy-elec-coulomb-41.png"
 */
function guessFilenames(questionId, imageUri) {
  const candidates = [];
  // 1. From the image_uri field directly
  if (imageUri) {
    const base = imageUri.split('/').pop();
    if (base) candidates.push(base);
  }
  // 2. From question ID
  candidates.push(`${questionId}.png`);
  return candidates;
}

/**
 * Determine storage path from question data.
 */
function buildStoragePath(row, filename) {
  const chapterId = row.chapter_id || 'unknown';
  // Determine exam prefix
  const exam = chapterId.startsWith('cuet-') ? 'cuet-physics' : 'neet-physics';
  // Determine topic from chapter_id (strip prefix)
  const topic = chapterId.replace(/^cuet-phy-|^phy-/, '');
  return `${exam}/${topic}/${filename}`;
}

// ═══════════════════════════════════════════════════════════════════
// Main
// ═══════════════════════════════════════════════════════════════════
async function main() {
  // Load config
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

  console.log(`\n🖼️  Universal Diagram Image Fixer${dryRun ? ' (DRY RUN)' : ''}`);
  console.log(`${'═'.repeat(55)}`);

  // Step 1: Query all diagram-based questions
  console.log('\n📡 Querying all diagram-based questions from DB...');
  const { data: allDiagrams, error: queryError } = await supabase
    .from('med_questions')
    .select('id, chapter_id, image_url, payload, source')
    .eq('question_type', 'diagram-based')
    .eq('status', 'active');

  if (queryError) {
    console.error(`Query failed: ${queryError.message}`);
    process.exit(1);
  }

  console.log(`  Found ${allDiagrams.length} diagram-based questions total.`);

  // Step 2: Find broken ones (no HTTP image_url)
  const broken = allDiagrams.filter(q => {
    const url = q.image_url || '';
    return !url.startsWith('http://') && !url.startsWith('https://');
  });

  const working = allDiagrams.length - broken.length;
  console.log(`  ✅ Working (HTTP URL): ${working}`);
  console.log(`  ❌ Broken (missing/local): ${broken.length}`);

  if (broken.length === 0) {
    console.log('\n🎉 All diagram images are working! Nothing to fix.');
    return;
  }

  // Step 3: Build PNG index from disk
  console.log('\n📁 Building local PNG index...');
  const pngIndex = buildPngIndex();
  console.log(`  Found ${pngIndex.size} PNGs on disk.`);

  // Step 4: Match broken questions to local PNGs
  console.log(`\n🔧 Fixing ${broken.length} broken diagram question(s):\n`);

  let uploaded = 0;
  let updated = 0;
  let notFound = 0;
  let errors = 0;

  for (const row of broken) {
    const qId = (row.payload && row.payload.question_id) || row.id;
    const imageUri = row.image_url || (row.payload && row.payload.image_uri) || '';

    // Try to find a matching PNG
    const candidates = guessFilenames(qId, imageUri);
    let localPath = null;
    let matchedFile = null;

    for (const candidate of candidates) {
      if (pngIndex.has(candidate)) {
        localPath = pngIndex.get(candidate);
        matchedFile = candidate;
        break;
      }
    }

    if (!localPath) {
      console.log(`  ⚠️  ${qId} (${row.chapter_id}) — NO matching PNG found`);
      console.log(`     Tried: ${candidates.join(', ')}`);
      console.log(`     Current image_url: ${imageUri || '(empty)'}`);
      notFound++;
      continue;
    }

    const storagePath = buildStoragePath(row, matchedFile);

    if (dryRun) {
      console.log(`  [dry] ${qId}`);
      console.log(`         PNG: ${localPath}`);
      console.log(`         → ${STORAGE_BUCKET}/${storagePath}`);
      uploaded++;
      updated++;
      continue;
    }

    // Upload to Storage
    const fileBuffer = readFileSync(localPath);
    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(storagePath, fileBuffer, {
        contentType: 'image/png',
        upsert: true,
      });

    if (uploadError) {
      console.error(`  ❌ Upload failed ${matchedFile}: ${uploadError.message}`);
      errors++;
      continue;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(storagePath);

    const publicUrl = urlData.publicUrl;
    uploaded++;

    // Update DB
    const { error: updateError } = await supabase
      .from('med_questions')
      .update({ image_url: publicUrl })
      .eq('id', row.id);

    if (updateError) {
      console.error(`  ❌ DB update failed ${qId}: ${updateError.message}`);
      errors++;
      continue;
    }

    updated++;
    console.log(`  ✅ ${qId} → ${publicUrl}`);
  }

  // Summary
  console.log(`\n${'═'.repeat(55)}`);
  console.log(`Results:`);
  console.log(`  ✅ Uploaded: ${uploaded}`);
  console.log(`  ✅ DB updated: ${updated}`);
  console.log(`  ⚠️  No PNG found: ${notFound}`);
  console.log(`  ❌ Errors: ${errors}`);

  if (notFound > 0) {
    console.log(`\n⚠️  ${notFound} question(s) need PNGs generated first.`);
    console.log('Run the diagram generation scripts (generate_diagrams_batch*.py) or create them manually.');
  }

  if (errors > 0) {
    console.log('\nSome operations failed. Re-run to retry (upsert is safe).');
    process.exit(1);
  }

  console.log('\nDone!');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
