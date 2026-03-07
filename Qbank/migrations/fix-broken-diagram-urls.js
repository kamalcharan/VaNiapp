#!/usr/bin/env node
/**
 * Upload 41 broken diagram images to Supabase Storage and update DB.
 *
 * Usage:
 *   node Qbank/migrations/fix-broken-diagram-urls.js
 *   node Qbank/migrations/fix-broken-diagram-urls.js --dry-run
 *
 * Reads Supabase creds from Qbank/config.json
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, '..', '..');
const CONFIG_PATH = join(__dirname, '..', 'config.json');
const STORAGE_BUCKET = 'question-images';
const dryRun = process.argv.includes('--dry-run');

// ═══════════════════════════════════════════════════════════════════
// UUID → { localFile (relative to repo root), storagePath (in bucket) }
// ═══════════════════════════════════════════════════════════════════

const BST_BASE = 'Qbank/CUET/business-studies';
const EG_IMG = 'Qbank/CUET/engineering-graphics/eg-chapter/images';

const BROKEN = [
  // ── BST Consumer Protection (3) ──
  { id: '3b597f70-9187-45db-8746-5432a1377792', local: `${BST_BASE}/ch12-consumer-protection/batch-2026-03-06/diagrams/cuet-bst-consumer-protection-62.png`, storage: 'business-studies/consumer-protection/cuet-bst-consumer-protection-62.png' },
  { id: '0825d00e-5481-4da3-801b-961c7ca244a0', local: `${BST_BASE}/ch12-consumer-protection/batch-2026-03-06/diagrams/cuet-bst-consumer-protection-63.png`, storage: 'business-studies/consumer-protection/cuet-bst-consumer-protection-63.png' },
  { id: 'f18beaa8-349b-44d4-a8a8-c99caf3d63ee', local: `${BST_BASE}/ch12-consumer-protection/batch-2026-03-06/diagrams/cuet-bst-consumer-protection-61.png`, storage: 'business-studies/consumer-protection/cuet-bst-consumer-protection-61.png' },

  // ── BST Organising (3) ──
  { id: 'ac5316e4-864f-4ee9-8c67-05411f00c722', local: `${BST_BASE}/ch05-organising/batch-2026-03-05/diagrams/cuet-bst-organising-63.png`, storage: 'business-studies/organising/cuet-bst-organising-63.png' },
  { id: '116575ab-4d7a-413d-98ec-da7c1ef96f01', local: `${BST_BASE}/ch05-organising/batch-2026-03-05/diagrams/cuet-bst-organising-62.png`, storage: 'business-studies/organising/cuet-bst-organising-62.png' },
  { id: 'b6bd7881-0476-43fa-97a1-9c4dfeae78de', local: `${BST_BASE}/ch05-organising/batch-2026-03-05/diagrams/cuet-bst-organising-61.png`, storage: 'business-studies/organising/cuet-bst-organising-61.png' },

  // ── BST Planning (3) ──
  { id: 'd114d21a-d3df-4d1e-b9b9-928f20955c16', local: `${BST_BASE}/ch04-planning/batch-2026-03-05/diagrams/cuet-bst-planning-62.png`, storage: 'business-studies/planning/cuet-bst-planning-62.png' },
  { id: '2ce58f0c-449e-423c-914c-f748b32655ea', local: `${BST_BASE}/ch04-planning/batch-2026-03-05/diagrams/cuet-bst-planning-63.png`, storage: 'business-studies/planning/cuet-bst-planning-63.png' },
  { id: '488a2ed2-5fa7-4a1f-829c-91cfe0320e50', local: `${BST_BASE}/ch04-planning/batch-2026-03-05/diagrams/cuet-bst-planning-61.png`, storage: 'business-studies/planning/cuet-bst-planning-61.png' },

  // ── Engineering Graphics — Planes (4) ──
  { id: '92fbfbcf-9b04-4662-9e95-2fbb7e966496', local: `${EG_IMG}/cuet-eg-planes-31-perp-vp-inclined-hp.png`, storage: 'engineering-graphics/planes/cuet-eg-planes-31-perp-vp-inclined-hp.png' },
  { id: '92b8e4ca-4b9a-4604-869d-775695d784ae', local: `${EG_IMG}/cuet-eg-planes-32-parallel-hp.png`, storage: 'engineering-graphics/planes/cuet-eg-planes-32-parallel-hp.png' },
  { id: '7365a3c9-fdff-4674-8996-5bc2c2055ae0', local: `${EG_IMG}/cuet-eg-planes-33-two-step-method.png`, storage: 'engineering-graphics/planes/cuet-eg-planes-33-two-step-method.png' },
  { id: '5eeadae4-f2c1-45e8-b8c7-d3a2bd1aecbd', local: `${EG_IMG}/cuet-eg-planes-34-inclined-both.png`, storage: 'engineering-graphics/planes/cuet-eg-planes-34-inclined-both.png' },

  // ── Engineering Graphics — Projections (4) ──
  { id: 'adea060f-d80e-4726-b1d3-f1353ea2e99f', local: `${EG_IMG}/cuet-eg-projections-21-point-projections.png`, storage: 'engineering-graphics/projections/cuet-eg-projections-21-point-projections.png' },
  { id: '718850a6-b098-4c8b-a8a8-8f2b0a5c1f06', local: `${EG_IMG}/cuet-eg-projections-22-line-inclined-hp.png`, storage: 'engineering-graphics/projections/cuet-eg-projections-22-line-inclined-hp.png' },
  { id: 'b348b360-6610-4831-b91c-80dc1fbe910f', local: `${EG_IMG}/cuet-eg-projections-23-line-both-planes.png`, storage: 'engineering-graphics/projections/cuet-eg-projections-23-line-both-planes.png' },
  { id: 'cc0108eb-d649-455d-b5e5-e7a4c56118c8', local: `${EG_IMG}/cuet-eg-projections-24-true-length-rotation.png`, storage: 'engineering-graphics/projections/cuet-eg-projections-24-true-length-rotation.png' },

  // ── Engineering Graphics — Development/Solids (4) ──
  { id: '2f1151e3-46dd-4d6c-b1dc-9fccc0cc9735', local: `${EG_IMG}/cuet-eg-development-61-cylinder.png`, storage: 'engineering-graphics/solids/cuet-eg-development-61-cylinder.png' },
  { id: 'f7c55519-ef92-49c3-9907-8c53aff99d93', local: `${EG_IMG}/cuet-eg-development-62-cone.png`, storage: 'engineering-graphics/solids/cuet-eg-development-62-cone.png' },
  { id: '1579edda-87ab-4769-9838-e860746f59fc', local: `${EG_IMG}/cuet-eg-development-63-prism.png`, storage: 'engineering-graphics/solids/cuet-eg-development-63-prism.png' },
  { id: '5398bff9-0c53-4fc4-a1f0-66c6b85360fc', local: `${EG_IMG}/cuet-eg-development-64-pyramid.png`, storage: 'engineering-graphics/solids/cuet-eg-development-64-pyramid.png' },

  // ── Engineering Graphics — Scales (4) ──
  { id: 'fa8c648a-b922-4099-88e2-8cb76167c1e9', local: `${EG_IMG}/cuet-eg-scales-21-plain-scale.png`, storage: 'engineering-graphics/scales/cuet-eg-scales-21-plain-scale.png' },
  { id: 'd12cbeb3-77aa-4878-808e-b7c8f3d5615f', local: `${EG_IMG}/cuet-eg-scales-22-ellipse-concentric.png`, storage: 'engineering-graphics/scales/cuet-eg-scales-22-ellipse-concentric.png' },
  { id: 'a2a09c74-0fb5-4c2d-b840-418f72861139', local: `${EG_IMG}/cuet-eg-scales-23-cycloid.png`, storage: 'engineering-graphics/scales/cuet-eg-scales-23-cycloid.png' },
  { id: '68267897-69b5-47a0-bb82-81712a50cc80', local: `${EG_IMG}/cuet-eg-scales-24-diagonal-scale.png`, storage: 'engineering-graphics/scales/cuet-eg-scales-24-diagonal-scale.png' },

  // ── Engineering Graphics — Sections (4) ──
  { id: 'e09d4c1e-da38-4f9e-a348-5be27edca5e0', local: `${EG_IMG}/cuet-eg-sections-51-cylinder-section.png`, storage: 'engineering-graphics/solids/cuet-eg-sections-51-cylinder-section.png' },
  { id: 'eefb07bc-08d0-487a-b1da-f4cb96b625a3', local: `${EG_IMG}/cuet-eg-sections-52-cone-conic-sections.png`, storage: 'engineering-graphics/solids/cuet-eg-sections-52-cone-conic-sections.png' },
  { id: 'a8765f1d-bc0b-482e-833a-f417bc50be46', local: `${EG_IMG}/cuet-eg-sections-53-prism-section.png`, storage: 'engineering-graphics/solids/cuet-eg-sections-53-prism-section.png' },
  { id: '4033598a-5773-40f0-9b4f-6bbd706fcb14', local: `${EG_IMG}/cuet-eg-sections-54-pyramid-section.png`, storage: 'engineering-graphics/solids/cuet-eg-sections-54-pyramid-section.png' },

  // ── Engineering Graphics — Solids (4) ──
  { id: '854882d8-87a6-4b31-84a6-0d8da9d02329', local: `${EG_IMG}/cuet-eg-solids-41-axis-vertical.png`, storage: 'engineering-graphics/solids/cuet-eg-solids-41-axis-vertical.png' },
  { id: '0b9c1b6d-9108-47f8-868c-8cc95a101d22', local: `${EG_IMG}/cuet-eg-solids-42-cone-vertical.png`, storage: 'engineering-graphics/solids/cuet-eg-solids-42-cone-vertical.png' },
  { id: 'c5a854a9-f9c7-4ccd-b7d1-26cfe3a5f1aa', local: `${EG_IMG}/cuet-eg-solids-43-cylinder-inclined.png`, storage: 'engineering-graphics/solids/cuet-eg-solids-43-cylinder-inclined.png' },
  { id: '4656e704-d320-47c0-b3d6-5088a710412e', local: `${EG_IMG}/cuet-eg-solids-44-pyramid-inclined-both.png`, storage: 'engineering-graphics/solids/cuet-eg-solids-44-pyramid-inclined-both.png' },

  // ── Engineering Graphics — Isometric (4) ──
  { id: '39e0f691-c5e6-4ae9-86d1-c4dc27d87693', local: `${EG_IMG}/cuet-eg-isometric-71-axes-scale.png`, storage: 'engineering-graphics/solids/cuet-eg-isometric-71-axes-scale.png' },
  { id: 'ac863f1c-bc87-4454-9eee-a71b6d798a1d', local: `${EG_IMG}/cuet-eg-isometric-72-block.png`, storage: 'engineering-graphics/solids/cuet-eg-isometric-72-block.png' },
  { id: 'f75d0489-b746-470c-8503-e2a76842f095', local: `${EG_IMG}/cuet-eg-isometric-73-circle-ellipse.png`, storage: 'engineering-graphics/solids/cuet-eg-isometric-73-circle-ellipse.png' },
  { id: '6606e353-ecec-4af3-af70-57a548345e23', local: `${EG_IMG}/cuet-eg-isometric-74-stepped-block.png`, storage: 'engineering-graphics/solids/cuet-eg-isometric-74-stepped-block.png' },

  // ── Engineering Graphics — Orthographic (4) ──
  { id: 'f58ec4bc-a2be-441f-b9b0-6ce6fbbecefe', local: `${EG_IMG}/cuet-eg-orthographic-81-angle-symbols.png`, storage: 'engineering-graphics/solids/cuet-eg-orthographic-81-angle-symbols.png' },
  { id: 'fb18677f-07b0-4d97-a039-363d948eda9c', local: `${EG_IMG}/cuet-eg-orthographic-82-three-views.png`, storage: 'engineering-graphics/solids/cuet-eg-orthographic-82-three-views.png' },
  { id: 'c76f49da-53e2-403f-8949-ddb71c23e25a', local: `${EG_IMG}/cuet-eg-orthographic-83-quadrants.png`, storage: 'engineering-graphics/solids/cuet-eg-orthographic-83-quadrants.png' },
  { id: '9a338d2e-8efc-41d1-8787-e72c05f301f3', local: `${EG_IMG}/cuet-eg-orthographic-84-six-views.png`, storage: 'engineering-graphics/solids/cuet-eg-orthographic-84-six-views.png' },
];

// ═══════════════════════════════════════════════════════════════════

async function main() {
  if (!existsSync(CONFIG_PATH)) {
    console.error(`ERROR: Config not found at ${CONFIG_PATH}\nCopy config.example.json → config.json and add your Supabase keys.`);
    process.exit(1);
  }

  const config = JSON.parse(readFileSync(CONFIG_PATH, 'utf-8'));
  const { url, serviceKey, anonKey } = config.supabase || {};
  const key = serviceKey || anonKey;
  if (!url || !key) { console.error('ERROR: config.json missing supabase.url / key'); process.exit(1); }

  const supabase = createClient(url, key);

  console.log(`\nFix Broken Diagram URLs${dryRun ? ' (DRY RUN)' : ''}`);
  console.log('═'.repeat(55));
  console.log(`Bucket: ${STORAGE_BUCKET}  |  Questions: ${BROKEN.length}\n`);

  // Verify all local files exist first
  let missing = 0;
  for (const item of BROKEN) {
    const full = join(ROOT, item.local);
    if (!existsSync(full)) {
      console.error(`  MISSING: ${item.local}`);
      missing++;
    }
  }
  if (missing > 0) {
    console.error(`\n${missing} local files not found. Aborting.`);
    process.exit(1);
  }
  console.log(`All ${BROKEN.length} local files verified.\n`);

  let uploaded = 0, dbUpdated = 0, errors = 0;

  for (const item of BROKEN) {
    const localPath = join(ROOT, item.local);
    const label = item.storage.split('/').pop();

    // 1. Upload to storage
    if (!dryRun) {
      const fileBuffer = readFileSync(localPath);
      const { error: upErr } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(item.storage, fileBuffer, { contentType: 'image/png', upsert: true });

      if (upErr) {
        console.error(`  FAIL upload ${label}: ${upErr.message}`);
        errors++;
        continue;
      }
    }

    // 2. Get public URL
    const { data: urlData } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(item.storage);
    const publicUrl = urlData.publicUrl;

    uploaded++;
    if (dryRun) {
      console.log(`  [dry] ${label} → ${publicUrl}`);
    } else {
      console.log(`  UP  ${label}`);
    }

    // 3. Update med_questions.image_url by UUID
    if (!dryRun) {
      const { error: dbErr } = await supabase
        .from('med_questions')
        .update({ image_url: publicUrl })
        .eq('id', item.id);

      if (dbErr) {
        console.error(`  FAIL DB ${item.id}: ${dbErr.message}`);
        errors++;
        continue;
      }

      // Also update payload.image_uri if payload exists
      const { data: row } = await supabase
        .from('med_questions')
        .select('payload')
        .eq('id', item.id)
        .single();

      if (row?.payload) {
        const payload = { ...row.payload, image_uri: publicUrl };
        await supabase.from('med_questions').update({ payload }).eq('id', item.id);
      }
    }

    dbUpdated++;
    if (!dryRun) console.log(`  DB  ${item.id} → image_url set`);
  }

  console.log(`\n${'═'.repeat(55)}`);
  console.log(`Uploaded: ${uploaded}  DB updated: ${dbUpdated}  Errors: ${errors}`);
  if (errors === 0) console.log('\nAll 41 diagram URLs fixed!');
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
