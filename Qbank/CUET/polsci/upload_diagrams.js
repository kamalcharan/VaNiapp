#!/usr/bin/env node
/**
 * Upload 20 polsci diagram images to Supabase Storage + update DB.
 *
 * Usage:
 *   node Qbank/CUET/polsci/upload_diagrams.js
 *   node Qbank/CUET/polsci/upload_diagrams.js --dry-run
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
const DIAGRAMS_DIR = join(__dirname, 'diagram_images');
const STORAGE_BUCKET = 'question-images';

const dryRun = process.argv.includes('--dry-run');

// ═══════════════════════════════════════════════════════════════════
// 20 polsci diagrams: question_id → { file, storagePath }
// ═══════════════════════════════════════════════════════════════════
const DIAGRAMS = [
  // Alternative Centres of Power
  { questionId: 'cuet-pol-altc-asean-20',            file: 'cuet-pol-altc-asean-20.png',            storagePath: 'political-science/alt-centres/cuet-pol-altc-asean-20.png' },
  { questionId: 'cuet-pol-altc-china-20',            file: 'cuet-pol-altc-china-20.png',            storagePath: 'political-science/alt-centres/cuet-pol-altc-china-20.png' },
  { questionId: 'cuet-pol-altc-china-economy-20',    file: 'cuet-pol-altc-china-economy-20.png',    storagePath: 'political-science/alt-centres/cuet-pol-altc-china-economy-20.png' },
  { questionId: 'cuet-pol-altc-eu-20',               file: 'cuet-pol-altc-eu-20.png',               storagePath: 'political-science/alt-centres/cuet-pol-altc-eu-20.png' },
  { questionId: 'cuet-pol-altc-india-china-asean-20',file: 'cuet-pol-altc-india-china-asean-20.png',storagePath: 'political-science/alt-centres/cuet-pol-altc-india-china-asean-20.png' },
  // Cold War Era
  { questionId: 'cuet-pol-cw-alliances-20',          file: 'cuet-pol-cw-alliances-20.png',          storagePath: 'political-science/cold-war/cuet-pol-cw-alliances-20.png' },
  { questionId: 'cuet-pol-cw-cuba-20',               file: 'cuet-pol-cw-cuba-20.png',               storagePath: 'political-science/cold-war/cuet-pol-cw-cuba-20.png' },
  { questionId: 'cuet-pol-cw-nam-20',                file: 'cuet-pol-cw-nam-20.png',                storagePath: 'political-science/cold-war/cuet-pol-cw-nam-20.png' },
  { questionId: 'cuet-pol-cw-nuclear-20',            file: 'cuet-pol-cw-nuclear-20.png',            storagePath: 'political-science/cold-war/cuet-pol-cw-nuclear-20.png' },
  { questionId: 'cuet-pol-cw-origins-20',            file: 'cuet-pol-cw-origins-20.png',            storagePath: 'political-science/cold-war/cuet-pol-cw-origins-20.png' },
  // End of Bipolarity (Soviet Withdrawal)
  { questionId: 'cuet-pol-sw-cis-20',                file: 'cuet-pol-sw-cis-20.png',                storagePath: 'political-science/end-bipolarity/cuet-pol-sw-cis-20.png' },
  { questionId: 'cuet-pol-sw-consequences-20',       file: 'cuet-pol-sw-consequences-20.png',       storagePath: 'political-science/end-bipolarity/cuet-pol-sw-consequences-20.png' },
  { questionId: 'cuet-pol-sw-disintegration-20',     file: 'cuet-pol-sw-disintegration-20.png',     storagePath: 'political-science/end-bipolarity/cuet-pol-sw-disintegration-20.png' },
  { questionId: 'cuet-pol-sw-india-soviet-20',       file: 'cuet-pol-sw-india-soviet-20.png',       storagePath: 'political-science/end-bipolarity/cuet-pol-sw-india-soviet-20.png' },
  { questionId: 'cuet-pol-sw-shock-therapy-20',      file: 'cuet-pol-sw-shock-therapy-20.png',      storagePath: 'political-science/end-bipolarity/cuet-pol-sw-shock-therapy-20.png' },
  // US Hegemony
  { questionId: 'cuet-pol-ush-911-20',               file: 'cuet-pol-ush-911-20.png',               storagePath: 'political-science/us-hegemony/cuet-pol-ush-911-20.png' },
  { questionId: 'cuet-pol-ush-constraints-20',       file: 'cuet-pol-ush-constraints-20.png',       storagePath: 'political-science/us-hegemony/cuet-pol-ush-constraints-20.png' },
  { questionId: 'cuet-pol-ush-india-us-20',          file: 'cuet-pol-ush-india-us-20.png',          storagePath: 'political-science/us-hegemony/cuet-pol-ush-india-us-20.png' },
  { questionId: 'cuet-pol-ush-nature-20',            file: 'cuet-pol-ush-nature-20.png',            storagePath: 'political-science/us-hegemony/cuet-pol-ush-nature-20.png' },
  { questionId: 'cuet-pol-ush-operations-20',        file: 'cuet-pol-ush-operations-20.png',        storagePath: 'political-science/us-hegemony/cuet-pol-ush-operations-20.png' },
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

  console.log(`\nPolsci Diagram Upload${dryRun ? ' (DRY RUN)' : ''}`);
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
      console.log(`  [dry] Would update: ${diag.questionId} image_url + payload.image_uri`);
      uploaded++;
      updated++;
      continue;
    }

    // --- Step 1: Upload to Storage ---
    const fileBuffer = readFileSync(localPath);
    const { error: uploadError } = await supabase.storage
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
      console.error(`  FAIL update image_url for ${diag.questionId}: ${updateError.message}`);
      errors++;
      continue;
    }

    // --- Step 3: Update payload.image_uri with public URL ---
    const { data: rows } = await supabase
      .from('med_questions')
      .select('id, payload')
      .filter('payload->>question_id', 'eq', diag.questionId);

    if (rows && rows.length > 0) {
      const row = rows[0];
      const payload = { ...row.payload, image_uri: publicUrl };
      const { error: payloadErr } = await supabase
        .from('med_questions')
        .update({ payload })
        .eq('id', row.id);
      if (payloadErr) {
        console.error(`  FAIL update payload for ${diag.questionId}: ${payloadErr.message}`);
        errors++;
        continue;
      }
    } else {
      console.error(`  WARN: No DB row found for ${diag.questionId}`);
      errors++;
      continue;
    }

    updated++;
    console.log(`  DB: ${diag.questionId} → image_url + payload.image_uri set`);
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
