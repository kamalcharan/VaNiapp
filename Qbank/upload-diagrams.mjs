#!/usr/bin/env node
/**
 * Upload local diagram PNGs to Supabase Storage and update med_questions.image_url
 *
 * Usage:
 *   node Qbank/upload-diagrams.js                  # upload all
 *   node Qbank/upload-diagrams.js --dry-run        # preview only
 *   node Qbank/upload-diagrams.js --subject chemistry
 */
import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join, basename } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const CONFIG_PATH = join(__dirname, 'config.json');
const STORAGE_BUCKET = 'question-images';

// All diagram directories to scan
const DIAGRAM_SOURCES = [
  { base: join(__dirname, 'CUET/chemistry'), subject: 'chemistry' },
  { base: join(__dirname, 'CUET/economics'), subject: 'economics' },
];

function loadConfig() {
  if (!existsSync(CONFIG_PATH)) {
    console.error('config.json not found. Copy config.example.json and add credentials.');
    process.exit(1);
  }
  return JSON.parse(readFileSync(CONFIG_PATH, 'utf-8'));
}

function log(msg, type = 'info') {
  const prefix = { ok: '  [OK]', fail: '[FAIL]', warn: '[WARN]', info: '[INFO]' }[type] || '[INFO]';
  console.log(`${prefix} ${msg}`);
}

// Collect all diagram PNGs
function collectDiagrams(subjectFilter) {
  const diagrams = [];
  for (const { base, subject } of DIAGRAM_SOURCES) {
    if (subjectFilter && subject !== subjectFilter) continue;
    if (!existsSync(base)) continue;

    const chapters = readdirSync(base).filter(d => statSync(join(base, d)).isDirectory());
    for (const chapter of chapters) {
      const diagramDir = join(base, chapter, 'diagrams');
      if (!existsSync(diagramDir)) continue;

      const pngs = readdirSync(diagramDir).filter(f => f.endsWith('.png'));
      for (const png of pngs) {
        // Extract question ID from filename (e.g. cuet-chem-electrochem-mixed-19.png → cuet-chem-electrochem-mixed-19)
        const questionId = png.replace('.png', '');
        diagrams.push({
          localPath: join(diagramDir, png),
          storagePath: `${subject}/${chapter}/${png}`,
          questionId,
          subject,
          chapter,
          filename: png,
        });
      }
    }
  }
  return diagrams;
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const subjectIdx = args.indexOf('--subject');
  const subjectFilter = subjectIdx >= 0 ? args[subjectIdx + 1] : null;

  console.log('\n========================================');
  console.log('  Diagram Upload to Supabase Storage');
  console.log('========================================\n');

  if (dryRun) log('DRY RUN — no changes will be made', 'warn');

  const config = loadConfig();
  const supabase = createClient(config.supabase.url, config.supabase.anonKey);
  log(`Connected to Supabase: ${config.supabase.url}`);

  const diagrams = collectDiagrams(subjectFilter);
  log(`Found ${diagrams.length} diagram PNG(s) to upload\n`);

  if (diagrams.length === 0) {
    log('No diagrams found.', 'warn');
    process.exit(0);
  }

  let uploaded = 0;
  let updated = 0;
  let errors = 0;

  for (const d of diagrams) {
    try {
      // 1. Upload to Storage
      if (dryRun) {
        log(`Would upload: ${d.storagePath}`);
      } else {
        const fileBuffer = readFileSync(d.localPath);
        const { error: uploadErr } = await supabase.storage
          .from(STORAGE_BUCKET)
          .upload(d.storagePath, fileBuffer, { contentType: 'image/png', upsert: true });

        if (uploadErr) {
          log(`Upload failed for ${d.filename}: ${uploadErr.message}`, 'fail');
          errors++;
          continue;
        }
        uploaded++;
      }

      // 2. Get public URL
      const { data: urlData } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(d.storagePath);
      const publicUrl = urlData.publicUrl;

      // 3. Update med_questions.image_url where payload->question_id matches
      if (dryRun) {
        log(`Would update question ${d.questionId} → image_url = ${publicUrl}`);
      } else {
        const { data: rows, error: fetchErr } = await supabase
          .from('med_questions')
          .select('id, payload')
          .eq('payload->>question_id', d.questionId);

        if (fetchErr) {
          log(`Query failed for ${d.questionId}: ${fetchErr.message}`, 'fail');
          errors++;
          continue;
        }

        if (!rows || rows.length === 0) {
          log(`No question found with payload.question_id = ${d.questionId} (not yet imported?)`, 'warn');
          continue;
        }

        for (const row of rows) {
          const updatedPayload = { ...row.payload, image_uri: publicUrl };
          const { error: updateErr } = await supabase
            .from('med_questions')
            .update({ image_url: publicUrl, payload: updatedPayload })
            .eq('id', row.id);

          if (updateErr) {
            log(`Update failed for ${d.questionId} (${row.id}): ${updateErr.message}`, 'fail');
            errors++;
          } else {
            updated++;
            log(`${d.questionId} → ${publicUrl}`, 'ok');
          }
        }
      }
    } catch (err) {
      log(`Error processing ${d.filename}: ${err.message}`, 'fail');
      errors++;
    }
  }

  console.log('\n========================================');
  console.log('  Summary');
  console.log('========================================\n');
  console.log(`  Diagrams found:    ${diagrams.length}`);
  console.log(`  Uploaded:          ${dryRun ? '(dry run)' : uploaded}`);
  console.log(`  Questions updated: ${dryRun ? '(dry run)' : updated}`);
  console.log(`  Errors:            ${errors}`);
  console.log('');
}

main().catch(console.error);
