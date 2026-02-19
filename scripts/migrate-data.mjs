#!/usr/bin/env node

/**
 * VaNi Data Migration Script
 * ──────────────────────────
 * Migrates catalog and question-bank data from an OLD Supabase project
 * to a NEW Supabase project. User data is NOT migrated (users re-register).
 *
 * Usage:
 *   node scripts/migrate-data.mjs [options]
 *
 * Options:
 *   --dry-run       Read from old DB and report counts without writing
 *   --help          Show this help message
 *
 * Environment variables (or pass via CLI args):
 *   OLD_SUPABASE_URL          URL of the source Supabase project
 *   OLD_SUPABASE_SERVICE_KEY  Service-role key for the source project
 *   NEW_SUPABASE_URL          URL of the destination Supabase project
 *   NEW_SUPABASE_SERVICE_KEY  Service-role key for the destination project
 *
 * CLI argument overrides (take precedence over env vars):
 *   --old-url=<url>
 *   --old-key=<key>
 *   --new-url=<url>
 *   --new-key=<key>
 */

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

// ─────────────────────────────────────────────────────────────────────────────
// CLI helpers
// ─────────────────────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const args = {};
  for (const arg of argv.slice(2)) {
    if (arg === '--dry-run') {
      args.dryRun = true;
    } else if (arg === '--help' || arg === '-h') {
      args.help = true;
    } else if (arg.startsWith('--old-url=')) {
      args.oldUrl = arg.split('=').slice(1).join('=');
    } else if (arg.startsWith('--old-key=')) {
      args.oldKey = arg.split('=').slice(1).join('=');
    } else if (arg.startsWith('--new-url=')) {
      args.newUrl = arg.split('=').slice(1).join('=');
    } else if (arg.startsWith('--new-key=')) {
      args.newKey = arg.split('=').slice(1).join('=');
    }
  }
  return args;
}

function printUsage() {
  console.log(`
VaNi Data Migration Script
==========================

Migrates catalog and question-bank data from an OLD Supabase project
to a NEW Supabase project. User data is NOT migrated.

Usage:
  node scripts/migrate-data.mjs [options]

Options:
  --dry-run                Read from old DB and report counts only (no writes)
  --help, -h               Show this help message

Credentials (env vars or CLI args):
  OLD_SUPABASE_URL / --old-url=<url>        Source project URL
  OLD_SUPABASE_SERVICE_KEY / --old-key=<key> Source service-role key
  NEW_SUPABASE_URL / --new-url=<url>        Destination project URL
  NEW_SUPABASE_SERVICE_KEY / --new-key=<key> Destination service-role key

Tables migrated (in order):
  1. med_exams              (catalog)
  2. med_subjects            (catalog)
  3. med_languages           (catalog)
  4. med_chapters            (references med_subjects)
  5. med_topics              (references med_chapters)
  6. med_questions           (references med_subjects, med_chapters, med_topics)
  7. med_question_options    (references med_questions)
  8. med_elimination_hints   (references med_questions)
  9. med_generation_jobs     (standalone)
 10. med_question_mix_defaults (standalone)

Tables NOT migrated (user data):
  - med_profiles
  - med_user_subjects
  - med_referral_codes
  - med_user_question_mix
  - med_chapter_progress
`);
}

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Tables to migrate in dependency order.
 *
 * Each entry specifies:
 *   table       - Supabase table name
 *   primaryKey  - column(s) used for upsert conflict resolution
 *   select      - columns to fetch (default '*')
 *   batchSize   - rows per upsert call (default 500)
 */
const TABLES = [
  {
    table: 'med_exams',
    primaryKey: 'id',
  },
  {
    table: 'med_subjects',
    primaryKey: 'id',
  },
  {
    table: 'med_languages',
    primaryKey: 'id',
  },
  {
    table: 'med_chapters',
    primaryKey: 'id',
  },
  {
    table: 'med_topics',
    primaryKey: 'id',
  },
  {
    table: 'med_questions',
    primaryKey: 'id',
    batchSize: 200,
  },
  {
    table: 'med_question_options',
    primaryKey: 'id',
    batchSize: 500,
  },
  {
    table: 'med_elimination_hints',
    primaryKey: 'id',
    batchSize: 500,
  },
  {
    table: 'med_generation_jobs',
    primaryKey: 'id',
    batchSize: 100,
  },
  {
    table: 'med_question_mix_defaults',
    primaryKey: 'id',
  },
];

const DEFAULT_BATCH_SIZE = 500;
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000;

// ─────────────────────────────────────────────────────────────────────────────
// Utilities
// ─────────────────────────────────────────────────────────────────────────────

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Fetch ALL rows from a Supabase table, handling the 1 000-row default limit
 * by paginating with range queries.
 */
async function fetchAllRows(client, table, select = '*') {
  const PAGE_SIZE = 1000;
  let allRows = [];
  let from = 0;

  while (true) {
    const { data, error } = await client
      .from(table)
      .select(select)
      .range(from, from + PAGE_SIZE - 1);

    if (error) {
      throw new Error(`Failed to read ${table} (offset ${from}): ${error.message}`);
    }

    if (!data || data.length === 0) {
      break;
    }

    allRows = allRows.concat(data);
    from += data.length;

    // If we received fewer rows than PAGE_SIZE, we have reached the end.
    if (data.length < PAGE_SIZE) {
      break;
    }
  }

  return allRows;
}

/**
 * Upsert a batch of rows into the destination table.
 * Uses `onConflict` with `ignoreDuplicates: true` to make the operation
 * idempotent (on conflict do nothing).
 */
async function upsertBatch(client, table, rows, primaryKey) {
  const { error, count } = await client
    .from(table)
    .upsert(rows, {
      onConflict: primaryKey,
      ignoreDuplicates: true,
      count: 'exact',
    });

  if (error) {
    throw new Error(`Upsert into ${table} failed: ${error.message}`);
  }

  return count ?? rows.length;
}

/**
 * Retry wrapper with exponential back-off.
 */
async function withRetry(fn, label, retries = MAX_RETRIES) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt === retries) {
        throw err;
      }
      const delayMs = RETRY_DELAY_MS * attempt;
      console.warn(
        `  [retry] ${label} — attempt ${attempt}/${retries} failed: ${err.message}. ` +
        `Retrying in ${delayMs}ms...`
      );
      await sleep(delayMs);
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Core migration logic
// ─────────────────────────────────────────────────────────────────────────────

async function migrateTable(oldClient, newClient, spec, dryRun) {
  const { table, primaryKey, batchSize = DEFAULT_BATCH_SIZE } = spec;

  // 1. Read all rows from old project
  const rows = await withRetry(
    () => fetchAllRows(oldClient, table),
    `fetch ${table}`
  );

  if (rows.length === 0) {
    console.log(`  ${table} — 0 rows in source (skipped)`);
    return { table, fetched: 0, migrated: 0 };
  }

  if (dryRun) {
    console.log(`  ${table} — ${rows.length} rows found (dry-run, not writing)`);
    return { table, fetched: rows.length, migrated: 0 };
  }

  // 2. Upsert into new project in batches
  let totalMigrated = 0;

  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    const migrated = await withRetry(
      () => upsertBatch(newClient, table, batch, primaryKey),
      `upsert ${table} batch ${Math.floor(i / batchSize) + 1}`
    );
    totalMigrated += migrated;
  }

  console.log(`  Migrating ${table}... ${totalMigrated} rows migrated`);
  return { table, fetched: rows.length, migrated: totalMigrated };
}

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  const args = parseArgs(process.argv);

  if (args.help) {
    printUsage();
    process.exit(0);
  }

  const dryRun = args.dryRun ?? false;

  // Resolve credentials: CLI args take precedence over env vars
  const oldUrl = args.oldUrl || process.env.OLD_SUPABASE_URL;
  const oldKey = args.oldKey || process.env.OLD_SUPABASE_SERVICE_KEY;
  const newUrl = args.newUrl || process.env.NEW_SUPABASE_URL;
  const newKey = args.newKey || process.env.NEW_SUPABASE_SERVICE_KEY;

  // Validate
  const missing = [];
  if (!oldUrl) missing.push('OLD_SUPABASE_URL / --old-url');
  if (!oldKey) missing.push('OLD_SUPABASE_SERVICE_KEY / --old-key');
  if (!newUrl) missing.push('NEW_SUPABASE_URL / --new-url');
  if (!newKey) missing.push('NEW_SUPABASE_SERVICE_KEY / --new-key');

  if (missing.length > 0) {
    console.error('ERROR: Missing required credentials:');
    missing.forEach((m) => console.error(`  - ${m}`));
    console.error('\nRun with --help for usage information.');
    process.exit(1);
  }

  // Create Supabase clients with service-role keys (bypasses RLS)
  const oldClient = createClient(oldUrl, oldKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const newClient = createClient(newUrl, newKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // Header
  console.log('');
  console.log('='.repeat(60));
  console.log('  VaNi Data Migration');
  console.log('='.repeat(60));
  console.log(`  Mode       : ${dryRun ? 'DRY RUN (read-only)' : 'LIVE MIGRATION'}`);
  console.log(`  Source      : ${oldUrl}`);
  console.log(`  Destination : ${newUrl}`);
  console.log(`  Tables      : ${TABLES.length}`);
  console.log('='.repeat(60));
  console.log('');

  if (!dryRun) {
    console.log('Starting migration in 3 seconds... (Ctrl+C to abort)');
    await sleep(3000);
  }

  const results = [];
  let hasErrors = false;

  for (const spec of TABLES) {
    try {
      const result = await migrateTable(oldClient, newClient, spec, dryRun);
      results.push(result);
    } catch (err) {
      hasErrors = true;
      console.error(`  ERROR migrating ${spec.table}: ${err.message}`);
      results.push({ table: spec.table, fetched: '?', migrated: 0, error: err.message });
    }
  }

  // Summary
  console.log('');
  console.log('='.repeat(60));
  console.log(dryRun ? '  DRY RUN SUMMARY' : '  MIGRATION SUMMARY');
  console.log('='.repeat(60));
  console.log('');
  console.log(
    '  ' +
    'Table'.padEnd(30) +
    'Fetched'.padStart(10) +
    (dryRun ? '' : 'Migrated'.padStart(10)) +
    'Status'.padStart(10)
  );
  console.log('  ' + '-'.repeat(dryRun ? 50 : 60));

  for (const r of results) {
    const status = r.error ? 'FAILED' : 'OK';
    console.log(
      '  ' +
      r.table.padEnd(30) +
      String(r.fetched).padStart(10) +
      (dryRun ? '' : String(r.migrated).padStart(10)) +
      status.padStart(10)
    );
  }

  console.log('');

  if (hasErrors) {
    console.error('Migration completed with errors. Check the output above.');
    process.exit(2);
  }

  const totalFetched = results.reduce((sum, r) => sum + (typeof r.fetched === 'number' ? r.fetched : 0), 0);
  const totalMigrated = results.reduce((sum, r) => sum + r.migrated, 0);

  if (dryRun) {
    console.log(`  Total rows in source: ${totalFetched}`);
    console.log('  No data was written (dry-run mode).');
  } else {
    console.log(`  Total rows fetched : ${totalFetched}`);
    console.log(`  Total rows migrated: ${totalMigrated}`);
  }

  console.log('');
  console.log('Done.');
  process.exit(0);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
