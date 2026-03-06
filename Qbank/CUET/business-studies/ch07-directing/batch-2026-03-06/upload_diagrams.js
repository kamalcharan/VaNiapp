#!/usr/bin/env node
/**
 * Upload Ch7 Directing diagram images to Supabase Storage + update DB.
 *
 * Usage:
 *   node Qbank/CUET/business-studies/ch07-directing/batch-2026-03-06/upload_diagrams.js
 *   node Qbank/CUET/business-studies/ch07-directing/batch-2026-03-06/upload_diagrams.js --dry-run
 *
 * Reads Supabase creds from Qbank/config.json
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const CONFIG_PATH = join(__dirname, '..', '..', '..', '..', 'config.json');
const DIAGRAMS_DIR = join(__dirname, 'diagrams');
const STORAGE_BUCKET = 'question-images';

const dryRun = process.argv.includes('--dry-run');

// ═══════════════════════════════════════════════════════════════════
// 3 diagrams: question_id → { file, storagePath }
// ═══════════════════════════════════════════════════════════════════
const DIAGRAMS = [
  { questionId: 'cuet-bst-directing-61', file: 'cuet-bst-directing-61.png', storagePath: 'business-studies/directing/cuet-bst-directing-61.png' },
  { questionId: 'cuet-bst-directing-62', file: 'cuet-bst-directing-62.png', storagePath: 'business-studies/directing/cuet-bst-directing-62.png' },
  { questionId: 'cuet-bst-directing-63', file: 'cuet-bst-directing-63.png', storagePath: 'business-studies/directing/cuet-bst-directing-63.png' },
];

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

  console.log(`\nBST Ch7 Directing Diagram Upload${dryRun ? ' (DRY RUN)' : ''}`);
  console.log(`${'═'.repeat(50)}`);
  console.log(`Storage bucket: ${STORAGE_BUCKET}`);
  console.log(`Diagrams dir:   ${DIAGRAMS_DIR}`);
  console.log(`Total images:   ${DIAGRAMS.length}\n`);

  let uploaded = 0;
  let updated = 0;
  let errors = 0;

  for (const diag of DIAGRAMS) {
    const localPath = join(DIAGRAMS_DIR, diag.file);

    if (!existsSync(localPath)) {
      console.error(`  SKIP: ${diag.file} — file not found`);
      errors++;
      continue;
    }

    if (dryRun) {
      console.log(`  [dry] Would upload: ${diag.file} → ${STORAGE_BUCKET}/${diag.storagePath}`);
      console.log(`  [dry] Would update: ${diag.questionId} image_url`);
      uploaded++;
      updated++;
      continue;
    }

    // --- Step 1: Upload to Storage ---
    const fileBuffer = readFileSync(localPath);
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(diag.storagePath, fileBuffer, {
        contentType: 'image/png',
        upsert: true,
      });

    if (uploadError) {
      console.error(`  FAIL upload ${diag.file}: ${uploadError.message}`);
      errors++;
      continue;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(diag.storagePath);

    const publicUrl = urlData.publicUrl;
    uploaded++;
    console.log(`  UP: ${diag.file} → ${publicUrl}`);

    // --- Step 2: Update DB image_url ---
    const { error: updateError } = await supabase
      .from('med_questions')
      .update({ image_url: publicUrl })
      .filter('payload->>question_id', 'eq', diag.questionId);

    if (updateError) {
      console.error(`  FAIL update ${diag.questionId}: ${updateError.message}`);
      errors++;
      continue;
    }

    // --- Step 3: Also update payload.image_uri with public URL ---
    const { data: rows } = await supabase
      .from('med_questions')
      .select('id, payload')
      .filter('payload->>question_id', 'eq', diag.questionId);

    if (rows && rows.length > 0) {
      const row = rows[0];
      const payload = { ...row.payload, image_uri: publicUrl };
      await supabase.from('med_questions').update({ payload }).eq('id', row.id);
    }

    updated++;
    console.log(`  DB: ${diag.questionId} → image_url set`);
  }

  console.log(`\n${'═'.repeat(50)}`);
  console.log(`Results: ${uploaded} uploaded, ${updated} DB updated, ${errors} errors`);

  if (errors > 0) {
    console.log('\nSome operations failed. Re-run to retry (upsert is safe).');
    process.exit(1);
  }

  console.log(`\nAll done! ${DIAGRAMS.length} diagrams uploaded and linked.`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
