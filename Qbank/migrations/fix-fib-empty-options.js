#!/usr/bin/env node
/**
 * Migration: Add MCQ options to fill-in-blank questions that have empty options.
 *
 * Usage:
 *   node Qbank/migrations/fix-fib-empty-options.js
 *   node Qbank/migrations/fix-fib-empty-options.js --dry-run
 *
 * Reads Supabase creds from Qbank/config.json
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const CONFIG_PATH = join(__dirname, '..', 'config.json');
const dryRun = process.argv.includes('--dry-run');

// ═══════════════════════════════════════════════════════════════════
// Options data for each fill-in-blank question (keyed by correct_answer text)
// Each entry: { correct: "answer text", options: [A, B, C, D], correctKey: "A" }
// ═══════════════════════════════════════════════════════════════════
const FIB_OPTIONS = {
  // DRR stands for Debenture _______ Reserve.
  "DRR stands for Debenture": {
    options: [
      { key: "A", text: "Redemption" },
      { key: "B", text: "Repayment" },
      { key: "C", text: "Recovery" },
      { key: "D", text: "Replacement" },
    ],
    correctKey: "A",
  },
  // The minimum DRR to be created is _______ %
  "minimum DRR to be created": {
    options: [
      { key: "A", text: "25" },
      { key: "B", text: "10" },
      { key: "C", text: "50" },
      { key: "D", text: "15" },
    ],
    correctKey: "A",
  },
  // When debentures are issued at a price below their face value, the difference is called _______
  "issued at a price below their face value": {
    options: [
      { key: "A", text: "Discount" },
      { key: "B", text: "Premium" },
      { key: "C", text: "Loss" },
      { key: "D", text: "Rebate" },
    ],
    correctKey: "A",
  },
  // TDS on debenture interest is deducted at the rate of _______ %
  "TDS on debenture interest": {
    options: [
      { key: "A", text: "10" },
      { key: "B", text: "5" },
      { key: "C", text: "15" },
      { key: "D", text: "20" },
    ],
    correctKey: "A",
  },
  // When debentures are redeemed, _______ Account is debited
  "debentures are redeemed": {
    options: [
      { key: "A", text: "Debentures" },
      { key: "B", text: "Bank" },
      { key: "C", text: "Share Capital" },
      { key: "D", text: "Profit & Loss" },
    ],
    correctKey: "A",
  },
  // After redemption, DRR is transferred to _______ Reserve
  "DRR is transferred to": {
    options: [
      { key: "A", text: "General" },
      { key: "B", text: "Capital" },
      { key: "C", text: "Securities Premium" },
      { key: "D", text: "Revenue" },
    ],
    correctKey: "A",
  },
  // Debentures that are not backed by any charge ... called _______ debentures
  "not backed by any charge": {
    options: [
      { key: "A", text: "Unsecured (or naked)" },
      { key: "B", text: "Secured" },
      { key: "C", text: "Convertible" },
      { key: "D", text: "Registered" },
    ],
    correctKey: "A",
  },
  // Debenture interest is a _______ against profits, while dividend is an _______ of profits
  "interest is a _______ against profits": {
    options: [
      { key: "A", text: "Charge, Appropriation" },
      { key: "B", text: "Appropriation, Charge" },
      { key: "C", text: "Expense, Distribution" },
      { key: "D", text: "Deduction, Allocation" },
    ],
    correctKey: "A",
  },
  // On dissolution, all assets (except _______ and _______) are transferred to ... Realisation
  "assets (except": {
    options: [
      { key: "A", text: "Cash/Bank, Fictitious assets" },
      { key: "B", text: "Goodwill, Investments" },
      { key: "C", text: "Land, Building" },
      { key: "D", text: "Debtors, Stock" },
    ],
    correctKey: "A",
  },
  // When an asset is taken over by a partner ... partner's _______ Account is debited
  "asset is taken over by a partner": {
    options: [
      { key: "A", text: "Capital, Realisation" },
      { key: "B", text: "Realisation, Capital" },
      { key: "C", text: "Current, Realisation" },
      { key: "D", text: "Loan, Cash" },
    ],
    correctKey: "A",
  },
  // On dissolution of a firm, losses are first met out of _______
  "losses are first met out of": {
    options: [
      { key: "A", text: "Profits, Capital" },
      { key: "B", text: "Capital, Profits" },
      { key: "C", text: "Reserves, Loans" },
      { key: "D", text: "Assets, Liabilities" },
    ],
    correctKey: "A",
  },
  // In a partnership-at-will, the firm may be dissolved by any partner giving _______
  "partnership-at-will": {
    options: [
      { key: "A", text: "Notice in writing" },
      { key: "B", text: "Verbal notice" },
      { key: "C", text: "Court order" },
      { key: "D", text: "Registered letter" },
    ],
    correctKey: "A",
  },
  // On dissolution, partner's loan ranks _______ external creditors but _______ partner's capital
  "partner's loan ranks": {
    options: [
      { key: "A", text: "After, Before" },
      { key: "B", text: "Before, After" },
      { key: "C", text: "Equal to, Above" },
      { key: "D", text: "Below, Equal to" },
    ],
    correctKey: "A",
  },
  // An unrecorded liability discovered and paid ... debited to _______ Account
  "unrecorded liability discovered": {
    options: [
      { key: "A", text: "Realisation, Cash/Bank" },
      { key: "B", text: "Cash/Bank, Realisation" },
      { key: "C", text: "Capital, Realisation" },
      { key: "D", text: "Profit & Loss, Bank" },
    ],
    correctKey: "A",
  },
  // The Balance Sheet of a company under Schedule III has two sides: _______ and _______
  "Schedule III has two sides": {
    options: [
      { key: "A", text: "Equity and Liabilities, Assets" },
      { key: "B", text: "Debit, Credit" },
      { key: "C", text: "Income, Expenditure" },
      { key: "D", text: "Sources, Applications" },
    ],
    correctKey: "A",
  },
  // Assets in the Balance Sheet under Schedule III are classified as _______ Assets and _______ Assets
  "classified as _______ Assets and": {
    options: [
      { key: "A", text: "Non-Current, Current" },
      { key: "B", text: "Fixed, Floating" },
      { key: "C", text: "Tangible, Intangible" },
      { key: "D", text: "Long-term, Short-term" },
    ],
    correctKey: "A",
  },
  // Gaining Ratio = _______ Ratio − _______ Ratio
  "Gaining Ratio =": {
    options: [
      { key: "A", text: "New, Old" },
      { key: "B", text: "Old, New" },
      { key: "C", text: "Sacrificing, Gaining" },
      { key: "D", text: "Capital, Profit" },
    ],
    correctKey: "A",
  },
  // The sum of gains of all remaining partners must be equal to the _______ partner's share
  "sum of gains of all remaining": {
    options: [
      { key: "A", text: "Retiring" },
      { key: "B", text: "Incoming" },
      { key: "C", text: "Managing" },
      { key: "D", text: "Senior" },
    ],
    correctKey: "A",
  },
  // When goodwill is raised and written off on retirement, goodwill is raised by crediting all partners
  "goodwill is raised and written off": {
    options: [
      { key: "A", text: "Old, New" },
      { key: "B", text: "New, Old" },
      { key: "C", text: "Gaining, Sacrificing" },
      { key: "D", text: "Capital, Profit-sharing" },
    ],
    correctKey: "A",
  },
  // On retirement, the New Ratio ... share acquired from the _______ partner
  "share acquired from the": {
    options: [
      { key: "A", text: "Retiring" },
      { key: "B", text: "Incoming" },
      { key: "C", text: "Managing" },
      { key: "D", text: "Sleeping" },
    ],
    correctKey: "A",
  },
  // Revaluation profit or loss is transferred ... in their _______ ratio
  "Revaluation profit or loss is transferred": {
    options: [
      { key: "A", text: "Old" },
      { key: "B", text: "New" },
      { key: "C", text: "Gaining" },
      { key: "D", text: "Capital" },
    ],
    correctKey: "A",
  },
  // On retirement, accumulated reserves ... distributed to _______ partners in _______ ratio
  "accumulated reserves like General Reserve": {
    options: [
      { key: "A", text: "All, Old" },
      { key: "B", text: "Remaining, New" },
      { key: "C", text: "All, New" },
      { key: "D", text: "Remaining, Gaining" },
    ],
    correctKey: "A",
  },
  // The balance remaining in Share Forfeiture Account ... transferred to _______ Account
  "Share Forfeiture Account after reissue": {
    options: [
      { key: "A", text: "Capital Reserve" },
      { key: "B", text: "Securities Premium" },
      { key: "C", text: "General Reserve" },
      { key: "D", text: "Share Capital" },
    ],
    correctKey: "A",
  },
  // On forfeiture of shares, Share Capital Account is debited with the _______ amount
  "forfeiture of shares, Share Capital Account is debited": {
    options: [
      { key: "A", text: "Called-up" },
      { key: "B", text: "Paid-up" },
      { key: "C", text: "Nominal" },
      { key: "D", text: "Market" },
    ],
    correctKey: "A",
  },
  // When shares are issued at a price higher than their face value ... credited to _______
  "issued at a price higher than their face value": {
    options: [
      { key: "A", text: "Securities Premium Reserve" },
      { key: "B", text: "Capital Reserve" },
      { key: "C", text: "General Reserve" },
      { key: "D", text: "Share Capital" },
    ],
    correctKey: "A",
  },
  // Under Section 53 ... cannot issue shares at a _______
  "Section 53": {
    options: [
      { key: "A", text: "Discount" },
      { key: "B", text: "Premium" },
      { key: "C", text: "Par value" },
      { key: "D", text: "Face value" },
    ],
    correctKey: "A",
  },
};

// ═══════════════════════════════════════════════════════════════════
// Match a DB question to its options by checking if question_text contains a key phrase
// ═══════════════════════════════════════════════════════════════════
function findOptionsForQuestion(questionText) {
  for (const [phrase, data] of Object.entries(FIB_OPTIONS)) {
    if (questionText.includes(phrase)) {
      return data;
    }
  }
  return null;
}

// ═══════════════════════════════════════════════════════════════════
// Main
// ═══════════════════════════════════════════════════════════════════
async function main() {
  const config = JSON.parse(readFileSync(CONFIG_PATH, 'utf-8'));
  const { url, serviceKey, anonKey } = config.supabase || {};
  const key = serviceKey || anonKey;

  if (!url || !key) {
    console.error('ERROR: config.json must have supabase.url and supabase.serviceKey (or anonKey)');
    process.exit(1);
  }

  const supabase = createClient(url, key);

  console.log(`\nFix Fill-in-Blank Empty Options${dryRun ? ' (DRY RUN)' : ''}`);
  console.log('═'.repeat(55));

  // 1. Fetch all fill_in_blank questions
  const { data: allFIB, error: fetchErr } = await supabase
    .from('med_questions')
    .select('id, question_text, correct_answer, question_type')
    .eq('question_type', 'fill-in-blanks')
    .eq('status', 'active');

  if (fetchErr) {
    console.error('Failed to fetch questions:', fetchErr.message);
    process.exit(1);
  }

  console.log(`Found ${allFIB.length} fill_in_blank questions total`);

  // 2. Check which ones already have options
  const questionIds = allFIB.map(q => q.id);
  const { data: existingOpts } = await supabase
    .from('med_question_options')
    .select('question_id')
    .in('question_id', questionIds);

  const hasOptions = new Set((existingOpts || []).map(o => o.question_id));
  const needOptions = allFIB.filter(q => !hasOptions.has(q.id));

  console.log(`${hasOptions.size} already have options, ${needOptions.length} need options\n`);

  let fixed = 0;
  let skipped = 0;
  let errors = 0;

  for (const q of needOptions) {
    const match = findOptionsForQuestion(q.question_text);

    if (!match) {
      console.log(`  SKIP  ${q.id} — no matching options data`);
      console.log(`        "${q.question_text.substring(0, 80)}..."`);
      skipped++;
      continue;
    }

    if (dryRun) {
      console.log(`  [dry] ${q.id} — would insert 4 options (correct: ${match.correctKey})`);
      console.log(`        "${q.question_text.substring(0, 80)}..."`);
      console.log(`        A: ${match.options[0].text} | B: ${match.options[1].text} | C: ${match.options[2].text} | D: ${match.options[3].text}`);
      fixed++;
      continue;
    }

    // Insert options
    const optionRecords = match.options.map((opt, idx) => ({
      question_id: q.id,
      option_key: opt.key,
      option_text: opt.text,
      is_correct: opt.key === match.correctKey,
      sort_order: idx,
    }));

    const { error: insertErr } = await supabase
      .from('med_question_options')
      .insert(optionRecords);

    if (insertErr) {
      console.error(`  FAIL  ${q.id}: ${insertErr.message}`);
      errors++;
      continue;
    }

    // Update correct_answer to the key
    const { error: updateErr } = await supabase
      .from('med_questions')
      .update({ correct_answer: match.correctKey })
      .eq('id', q.id);

    if (updateErr) {
      console.error(`  WARN  ${q.id}: options inserted but correct_answer update failed: ${updateErr.message}`);
    }

    console.log(`  OK    ${q.id} — ${match.options.map(o => `${o.key}: ${o.text}`).join(' | ')}`);
    fixed++;
  }

  console.log(`\n${'═'.repeat(55)}`);
  console.log(`Results:`);
  console.log(`  Fixed:   ${fixed}`);
  console.log(`  Skipped: ${skipped}`);
  console.log(`  Errors:  ${errors}`);

  if (fixed > 0 && !dryRun) {
    console.log(`\nDone! ${fixed} questions now have options.`);
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
