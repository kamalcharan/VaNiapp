#!/usr/bin/env node
/**
 * Upload Batch 3 diagram images to Supabase Storage + update DB image_url.
 *
 * Usage:
 *   node Qbank/corrections/upload_batch3_diagrams.js
 *   node Qbank/corrections/upload_batch3_diagrams.js --dry-run
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
// All 28 diagrams: question_id → { file, storagePath }
// ═══════════════════════════════════════════════════════════════════
const DIAGRAMS = [
  // ── EM Induction (remaining) ──
  { questionId: 'cuet-phy-emi-faraday-d01',  file: 'cuet-phy-emi-faraday-d01.png',  storagePath: 'cuet-physics/em-induction/cuet-phy-emi-faraday-d01.png' },
  { questionId: 'cuet-phy-emi-faraday-d02',  file: 'cuet-phy-emi-faraday-d02.png',  storagePath: 'cuet-physics/em-induction/cuet-phy-emi-faraday-d02.png' },
  { questionId: 'cuet-phy-emi-induct-d01',   file: 'cuet-phy-emi-induct-d01.png',   storagePath: 'cuet-physics/em-induction/cuet-phy-emi-induct-d01.png' },
  { questionId: 'cuet-phy-emi-induct-d02',   file: 'cuet-phy-emi-induct-d02.png',   storagePath: 'cuet-physics/em-induction/cuet-phy-emi-induct-d02.png' },

  // ── EM Waves ──
  { questionId: 'cuet-phy-emwave-d01', file: 'cuet-phy-emwave-d01.png', storagePath: 'cuet-physics/em-waves/cuet-phy-emwave-d01.png' },
  { questionId: 'cuet-phy-emwave-d02', file: 'cuet-phy-emwave-d02.png', storagePath: 'cuet-physics/em-waves/cuet-phy-emwave-d02.png' },

  // ── Magnetic Effects ──
  { questionId: 'cuet-phy-mag-biot-d01',   file: 'cuet-phy-mag-biot-d01.png',   storagePath: 'cuet-physics/magnetic-effects/cuet-phy-mag-biot-d01.png' },
  { questionId: 'cuet-phy-mag-biot-d02',   file: 'cuet-phy-mag-biot-d02.png',   storagePath: 'cuet-physics/magnetic-effects/cuet-phy-mag-biot-d02.png' },
  { questionId: 'cuet-phy-mag-force-d01',  file: 'cuet-phy-mag-force-d01.png',  storagePath: 'cuet-physics/magnetic-effects/cuet-phy-mag-force-d01.png' },
  { questionId: 'cuet-phy-mag-force-d02',  file: 'cuet-phy-mag-force-d02.png',  storagePath: 'cuet-physics/magnetic-effects/cuet-phy-mag-force-d02.png' },
  { questionId: 'cuet-phy-mag-device-d01', file: 'cuet-phy-mag-device-d01.png', storagePath: 'cuet-physics/magnetic-effects/cuet-phy-mag-device-d01.png' },
  { questionId: 'cuet-phy-mag-device-d02', file: 'cuet-phy-mag-device-d02.png', storagePath: 'cuet-physics/magnetic-effects/cuet-phy-mag-device-d02.png' },
  { questionId: 'cuet-phy-mag-dipole-d01', file: 'cuet-phy-mag-dipole-d01.png', storagePath: 'cuet-physics/magnetic-effects/cuet-phy-mag-dipole-d01.png' },
  { questionId: 'cuet-phy-mag-dipole-d02', file: 'cuet-phy-mag-dipole-d02.png', storagePath: 'cuet-physics/magnetic-effects/cuet-phy-mag-dipole-d02.png' },
  { questionId: 'cuet-phy-mag-mat-d01',    file: 'cuet-phy-mag-mat-d01.png',    storagePath: 'cuet-physics/magnetic-effects/cuet-phy-mag-mat-d01.png' },
  { questionId: 'cuet-phy-mag-mat-d02',    file: 'cuet-phy-mag-mat-d02.png',    storagePath: 'cuet-physics/magnetic-effects/cuet-phy-mag-mat-d02.png' },

  // ── Optics (Ray + Wave) ──
  { questionId: 'cuet-phy-ray-reflect-d01',     file: 'cuet-phy-ray-reflect-d01.png',     storagePath: 'cuet-physics/optics/cuet-phy-ray-reflect-d01.png' },
  { questionId: 'cuet-phy-ray-reflect-d02',     file: 'cuet-phy-ray-reflect-d02.png',     storagePath: 'cuet-physics/optics/cuet-phy-ray-reflect-d02.png' },
  { questionId: 'cuet-phy-ray-prism-d01',       file: 'cuet-phy-ray-prism-d01.png',       storagePath: 'cuet-physics/optics/cuet-phy-ray-prism-d01.png' },
  { questionId: 'cuet-phy-ray-prism-d02',       file: 'cuet-phy-ray-prism-d02.png',       storagePath: 'cuet-physics/optics/cuet-phy-ray-prism-d02.png' },
  { questionId: 'cuet-phy-ray-instr-d01',       file: 'cuet-phy-ray-instr-d01.png',       storagePath: 'cuet-physics/optics/cuet-phy-ray-instr-d01.png' },
  { questionId: 'cuet-phy-ray-instr-d02',       file: 'cuet-phy-ray-instr-d02.png',       storagePath: 'cuet-physics/optics/cuet-phy-ray-instr-d02.png' },
  { questionId: 'cuet-phy-waveopt-interf-d01',  file: 'cuet-phy-waveopt-interf-d01.png',  storagePath: 'cuet-physics/optics/cuet-phy-waveopt-interf-d01.png' },
  { questionId: 'cuet-phy-waveopt-interf-d02',  file: 'cuet-phy-waveopt-interf-d02.png',  storagePath: 'cuet-physics/optics/cuet-phy-waveopt-interf-d02.png' },
  { questionId: 'cuet-phy-waveopt-diff-d01',    file: 'cuet-phy-waveopt-diff-d01.png',    storagePath: 'cuet-physics/optics/cuet-phy-waveopt-diff-d01.png' },
  { questionId: 'cuet-phy-waveopt-diff-d02',    file: 'cuet-phy-waveopt-diff-d02.png',    storagePath: 'cuet-physics/optics/cuet-phy-waveopt-diff-d02.png' },
  { questionId: 'cuet-phy-waveopt-polar-d01',   file: 'cuet-phy-waveopt-polar-d01.png',   storagePath: 'cuet-physics/optics/cuet-phy-waveopt-polar-d01.png' },
  { questionId: 'cuet-phy-waveopt-polar-d02',   file: 'cuet-phy-waveopt-polar-d02.png',   storagePath: 'cuet-physics/optics/cuet-phy-waveopt-polar-d02.png' },
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

  console.log(`\nBatch 3 Diagram Upload${dryRun ? ' (DRY RUN)' : ''}`);
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
      .eq('source', 'correction-batch-3')
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

  console.log('\nAll done! 28 diagrams uploaded and linked.');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
