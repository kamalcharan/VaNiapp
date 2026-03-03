#!/usr/bin/env node
/**
 * Upload Batch 1 diagram images to Supabase Storage + update DB image_url.
 *
 * Usage:
 *   node Qbank/corrections/upload_batch1_diagrams.js
 *   node Qbank/corrections/upload_batch1_diagrams.js --dry-run
 *
 * Reads Supabase creds from Qbank/config.json
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const CONFIG_PATH = join(__dirname, '..', 'config.json');
const DIAGRAMS_DIR = join(__dirname, 'diagrams');
const STORAGE_BUCKET = 'question-images';

const dryRun = process.argv.includes('--dry-run');

// ═══════════════════════════════════════════════════════════════════
// All 14 diagrams: question_id → { file, storagePath }
// ═══════════════════════════════════════════════════════════════════
const DIAGRAMS = [
  // Atoms & Nuclei — Bohr
  { questionId: 'cuet-phy-atom-bohr-d01',    file: 'cuet-phy-atom-bohr-d01.png',    storagePath: 'cuet-physics/atoms-nuclei/cuet-phy-atom-bohr-d01.png' },
  { questionId: 'cuet-phy-atom-bohr-d02',    file: 'cuet-phy-atom-bohr-d02.png',    storagePath: 'cuet-physics/atoms-nuclei/cuet-phy-atom-bohr-d02.png' },
  // Atoms & Nuclei — Spectra
  { questionId: 'cuet-phy-atom-spectra-d01', file: 'cuet-phy-atom-spectra-d01.png', storagePath: 'cuet-physics/atoms-nuclei/cuet-phy-atom-spectra-d01.png' },
  { questionId: 'cuet-phy-atom-spectra-d02', file: 'cuet-phy-atom-spectra-d02.png', storagePath: 'cuet-physics/atoms-nuclei/cuet-phy-atom-spectra-d02.png' },
  // Atoms & Nuclei — Decay
  { questionId: 'cuet-phy-nuclei-decay-d01', file: 'cuet-phy-nuclei-decay-d01.png', storagePath: 'cuet-physics/atoms-nuclei/cuet-phy-nuclei-decay-d01.png' },
  { questionId: 'cuet-phy-nuclei-decay-d02', file: 'cuet-phy-nuclei-decay-d02.png', storagePath: 'cuet-physics/atoms-nuclei/cuet-phy-nuclei-decay-d02.png' },
  // Atoms & Nuclei — Properties
  { questionId: 'cuet-phy-nuclei-prop-d01',  file: 'cuet-phy-nuclei-prop-d01.png',  storagePath: 'cuet-physics/atoms-nuclei/cuet-phy-nuclei-prop-d01.png' },
  { questionId: 'cuet-phy-nuclei-prop-d02',  file: 'cuet-phy-nuclei-prop-d02.png',  storagePath: 'cuet-physics/atoms-nuclei/cuet-phy-nuclei-prop-d02.png' },
  // Current Electricity — Ohm
  { questionId: 'cuet-phy-current-ohm-d01',  file: 'cuet-phy-current-ohm-d01.png',  storagePath: 'cuet-physics/current-electricity/cuet-phy-current-ohm-d01.png' },
  { questionId: 'cuet-phy-current-ohm-d02',  file: 'cuet-phy-current-ohm-d02.png',  storagePath: 'cuet-physics/current-electricity/cuet-phy-current-ohm-d02.png' },
  // Current Electricity — Kirchhoff
  { questionId: 'cuet-phy-current-kirch-d01', file: 'cuet-phy-current-kirch-d01.png', storagePath: 'cuet-physics/current-electricity/cuet-phy-current-kirch-d01.png' },
  { questionId: 'cuet-phy-current-kirch-d02', file: 'cuet-phy-current-kirch-d02.png', storagePath: 'cuet-physics/current-electricity/cuet-phy-current-kirch-d02.png' },
  // Current Electricity — Instruments
  { questionId: 'cuet-phy-current-instr-d01', file: 'cuet-phy-current-instr-d01.png', storagePath: 'cuet-physics/current-electricity/cuet-phy-current-instr-d01.png' },
  { questionId: 'cuet-phy-current-instr-d02', file: 'cuet-phy-current-instr-d02.png', storagePath: 'cuet-physics/current-electricity/cuet-phy-current-instr-d02.png' },
];

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

  console.log(`\nBatch 1 Diagram Upload${dryRun ? ' (DRY RUN)' : ''}`);
  console.log(`${'═'.repeat(50)}`);
  console.log(`Storage bucket: ${STORAGE_BUCKET}`);
  console.log(`Diagrams dir:   ${DIAGRAMS_DIR}`);
  console.log(`Total images:   ${DIAGRAMS.length}\n`);

  let uploaded = 0;
  let updated = 0;
  let errors = 0;

  for (const diag of DIAGRAMS) {
    const localPath = join(DIAGRAMS_DIR, diag.file);

    // Check file exists
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

    // --- Step 2: Update DB ---
    const { data: updateData, error: updateError } = await supabase
      .from('med_questions')
      .update({ image_url: publicUrl })
      .eq('source', 'correction-batch-1')
      .filter('payload->>question_id', 'eq', diag.questionId);

    if (updateError) {
      console.error(`  FAIL update ${diag.questionId}: ${updateError.message}`);
      errors++;
      continue;
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

  console.log('\nAll done! 14 diagrams uploaded and linked.');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
