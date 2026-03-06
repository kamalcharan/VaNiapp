#!/usr/bin/env node
/**
 * Upload Engineering Graphics diagram images to Supabase Storage.
 *
 * Usage:
 *   node Qbank/CUET/engineering-graphics/eg-chapter/upload_diagrams.js
 *   node Qbank/CUET/engineering-graphics/eg-chapter/upload_diagrams.js --dry-run
 *
 * Reads Supabase creds from Qbank/config.json
 * Scans all B01–B08 JSON files for diagram-based questions,
 * maps each image_uri to the local images/ folder,
 * and uploads to the question-images bucket at the path specified by image_uri.
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, dirname, basename } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const STORAGE_BUCKET = 'question-images';
const IMAGES_DIR = join(__dirname, 'images');
const CONFIG_PATH = join(__dirname, '..', '..', '..', 'config.json');

function log(msg, type = 'info') {
  const prefix = {
    info: '\x1b[36mINFO\x1b[0m',
    ok: '\x1b[32m  OK\x1b[0m',
    skip: '\x1b[33mSKIP\x1b[0m',
    fail: '\x1b[31mFAIL\x1b[0m',
  };
  console.log(`[${prefix[type] || prefix.info}] ${msg}`);
}

function loadConfig() {
  if (!existsSync(CONFIG_PATH)) {
    log(`Config not found at ${CONFIG_PATH}. Copy config.example.json → config.json`, 'fail');
    process.exit(1);
  }
  return JSON.parse(readFileSync(CONFIG_PATH, 'utf-8'));
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  if (dryRun) log('DRY RUN — no files will be uploaded');

  const config = loadConfig();
  const supabase = createClient(config.supabase.url, config.supabase.anonKey);

  if (!existsSync(IMAGES_DIR)) {
    log(`Images directory not found: ${IMAGES_DIR}`, 'fail');
    process.exit(1);
  }

  // Collect all diagram image_uri → local file mappings from the JSON files
  const jsonFiles = readdirSync(__dirname).filter(f => f.match(/^cuet-eg-.*-b0\d\.json$/));
  const uploads = []; // { storagePath, localPath, questionId }

  for (const jf of jsonFiles) {
    const data = JSON.parse(readFileSync(join(__dirname, jf), 'utf-8'));
    for (const q of data) {
      if (q.question_type === 'diagram-based' && q.image_uri) {
        // image_uri format: "question-images/engineering-graphics/solids/filename.png"
        // Storage path is everything after "question-images/"
        const storagePath = q.image_uri.startsWith('question-images/')
          ? q.image_uri.slice('question-images/'.length)
          : q.image_uri;
        const filename = basename(q.image_uri);
        const localPath = join(IMAGES_DIR, filename);
        uploads.push({ storagePath, localPath, filename, questionId: q.id });
      }
    }
  }

  log(`Found ${uploads.length} diagram images across ${jsonFiles.length} JSON files`);

  let uploaded = 0;
  let errors = 0;
  let skipped = 0;

  for (const { storagePath, localPath, filename, questionId } of uploads) {
    if (!existsSync(localPath)) {
      log(`${filename} (${questionId}): local file not found at ${localPath}`, 'fail');
      errors++;
      continue;
    }

    if (dryRun) {
      log(`Would upload: ${filename} → ${STORAGE_BUCKET}/${storagePath}`);
      uploaded++;
      continue;
    }

    try {
      const fileBuffer = readFileSync(localPath);
      const { error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(storagePath, fileBuffer, {
          contentType: 'image/png',
          upsert: true,
        });

      if (error) {
        log(`${filename}: ${error.message}`, 'fail');
        errors++;
        continue;
      }

      const { data: urlData } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(storagePath);

      log(`${filename} → ${urlData.publicUrl}`, 'ok');
      uploaded++;
    } catch (err) {
      log(`${filename}: ${err.message}`, 'fail');
      errors++;
    }
  }

  console.log(`\nDone! Uploaded: ${uploaded}, Errors: ${errors}, Skipped: ${skipped}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
