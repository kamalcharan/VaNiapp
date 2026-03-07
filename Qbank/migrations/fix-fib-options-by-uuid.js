#!/usr/bin/env node
/**
 * Migration: Insert MCQ options for 26 fill-in-blank questions by UUID.
 *
 * Usage:
 *   node Qbank/migrations/fix-fib-options-by-uuid.js
 *   node Qbank/migrations/fix-fib-options-by-uuid.js --dry-run
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
// UUID → 4 options (A is always correct)
// ═══════════════════════════════════════════════════════════════════
const QUESTIONS = {
  // When goodwill is raised and written off on retirement...
  "3a2156a6-2e86-425d-bd4a-2fb73dc11566": {
    correctKey: "A",
    options: [
      { key: "A", text: "Old, New" },
      { key: "B", text: "New, Old" },
      { key: "C", text: "Gaining, Sacrificing" },
      { key: "D", text: "Capital, Profit-sharing" },
    ],
  },
  // The sum of gains of all remaining partners must be equal to the _______ partner's share.
  "9a6e0f74-bcba-4755-a4d7-c6a2379cee7e": {
    correctKey: "A",
    options: [
      { key: "A", text: "Retiring" },
      { key: "B", text: "Incoming" },
      { key: "C", text: "Managing" },
      { key: "D", text: "Senior" },
    ],
  },
  // Revaluation profit or loss is transferred to all partners' capital accounts in their _______ ratio.
  "934cdf01-209b-4716-a89e-cefdf84709b1": {
    correctKey: "A",
    options: [
      { key: "A", text: "Old" },
      { key: "B", text: "New" },
      { key: "C", text: "Gaining" },
      { key: "D", text: "Capital" },
    ],
  },
  // On retirement, accumulated reserves like General Reserve ... distributed to ... in ... ratio.
  "55ee0176-69c6-4c3f-95e3-ea8e5b08f138": {
    correctKey: "A",
    options: [
      { key: "A", text: "All, Old" },
      { key: "B", text: "Remaining, New" },
      { key: "C", text: "All, New" },
      { key: "D", text: "Remaining, Gaining" },
    ],
  },
  // Gaining Ratio = _______ Ratio − _______ Ratio.
  "e602b887-6d66-41f8-8389-b3981e40eeed": {
    correctKey: "A",
    options: [
      { key: "A", text: "New, Old" },
      { key: "B", text: "Old, New" },
      { key: "C", text: "Sacrificing, Gaining" },
      { key: "D", text: "Capital, Profit" },
    ],
  },
  // On retirement, the New Ratio ... share acquired from the _______ partner.
  "e1a9d1d6-ec0e-47e0-acbb-ca0039b50545": {
    correctKey: "A",
    options: [
      { key: "A", text: "Retiring" },
      { key: "B", text: "Incoming" },
      { key: "C", text: "Managing" },
      { key: "D", text: "Sleeping" },
    ],
  },
  // On dissolution, losses are first met out of _______, then out of _______, and lastly by partners.
  "192c5e86-ac7e-40aa-aca8-4829918c49fe": {
    correctKey: "A",
    options: [
      { key: "A", text: "Profits, Capital" },
      { key: "B", text: "Capital, Profits" },
      { key: "C", text: "Reserves, Loans" },
      { key: "D", text: "Assets, Liabilities" },
    ],
  },
  // When an asset is taken over by a partner ... partner's _______ Account is debited and _______ credited.
  "b8165bc3-033d-43a7-9094-fd8feab78e2e": {
    correctKey: "A",
    options: [
      { key: "A", text: "Capital, Realisation" },
      { key: "B", text: "Realisation, Capital" },
      { key: "C", text: "Current, Realisation" },
      { key: "D", text: "Loan, Cash" },
    ],
  },
  // On dissolution, partner's loan ranks _______ external creditors but _______ partner's capital.
  "ce49394b-5a7a-4d13-bf70-42e431714a17": {
    correctKey: "A",
    options: [
      { key: "A", text: "After, Before" },
      { key: "B", text: "Before, After" },
      { key: "C", text: "Equal to, Above" },
      { key: "D", text: "Below, Equal to" },
    ],
  },
  // On dissolution, all assets (except _______ and _______) are transferred to Realisation.
  "43b77a4d-906d-460e-af1c-3db83705373b": {
    correctKey: "A",
    options: [
      { key: "A", text: "Cash/Bank, Fictitious assets" },
      { key: "B", text: "Goodwill, Investments" },
      { key: "C", text: "Land, Building" },
      { key: "D", text: "Debtors, Stock" },
    ],
  },
  // In a partnership-at-will, the firm may be dissolved by any partner giving _______.
  "2efa04a6-d6d8-4287-a997-5bb0954ed2f6": {
    correctKey: "A",
    options: [
      { key: "A", text: "Notice in writing" },
      { key: "B", text: "Verbal notice" },
      { key: "C", text: "Court order" },
      { key: "D", text: "Registered letter" },
    ],
  },
  // An unrecorded liability discovered and paid ... debited to _______ Account and credited to _______.
  "520e2656-d787-4f62-b3e7-e507e4b2aeab": {
    correctKey: "A",
    options: [
      { key: "A", text: "Realisation, Cash/Bank" },
      { key: "B", text: "Cash/Bank, Realisation" },
      { key: "C", text: "Capital, Realisation" },
      { key: "D", text: "Profit & Loss, Bank" },
    ],
  },
  // The balance remaining in Share Forfeiture Account after reissue is transferred to _______ Account.
  "b7f66c77-4cd1-4e2f-abd2-a7d8bc12597c": {
    correctKey: "A",
    options: [
      { key: "A", text: "Capital Reserve" },
      { key: "B", text: "Securities Premium" },
      { key: "C", text: "General Reserve" },
      { key: "D", text: "Share Capital" },
    ],
  },
  // Under Section 53 ... cannot issue shares at a _______.
  "5937a9a9-660d-427f-a46a-538a06f40ffa": {
    correctKey: "A",
    options: [
      { key: "A", text: "Discount" },
      { key: "B", text: "Premium" },
      { key: "C", text: "Par value" },
      { key: "D", text: "Face value" },
    ],
  },
  // On forfeiture of shares, Share Capital Account is debited with the _______ amount.
  "4f090eb9-294b-4122-b6df-8ab2dc5a50fa": {
    correctKey: "A",
    options: [
      { key: "A", text: "Called-up" },
      { key: "B", text: "Paid-up" },
      { key: "C", text: "Nominal" },
      { key: "D", text: "Market" },
    ],
  },
  // When shares are issued at a price higher than their face value ... credited to _______.
  "215246e9-b977-4fff-9aa8-79adcaf1b49f": {
    correctKey: "A",
    options: [
      { key: "A", text: "Securities Premium Reserve" },
      { key: "B", text: "Capital Reserve" },
      { key: "C", text: "General Reserve" },
      { key: "D", text: "Share Capital" },
    ],
  },
  // After redemption, DRR is transferred to _______ Reserve.
  "452c3645-ac1e-4b80-aeb6-7e9d1360f4f3": {
    correctKey: "A",
    options: [
      { key: "A", text: "General" },
      { key: "B", text: "Capital" },
      { key: "C", text: "Securities Premium" },
      { key: "D", text: "Revenue" },
    ],
  },
  // When debentures are redeemed, _______ Account is debited.
  "58564b0d-4fdd-48f2-9ae3-7e798f3711f8": {
    correctKey: "A",
    options: [
      { key: "A", text: "Debentures" },
      { key: "B", text: "Bank" },
      { key: "C", text: "Share Capital" },
      { key: "D", text: "Profit & Loss" },
    ],
  },
  // Debentures not backed by any charge ... called _______ debentures.
  "b7a43420-33cf-4870-8347-b01d15937b25": {
    correctKey: "A",
    options: [
      { key: "A", text: "Unsecured (or naked)" },
      { key: "B", text: "Secured" },
      { key: "C", text: "Convertible" },
      { key: "D", text: "Registered" },
    ],
  },
  // TDS on debenture interest is deducted at the rate of _______ %.
  "034e8a96-8a64-43d2-9688-1a4e3d47c7e1": {
    correctKey: "A",
    options: [
      { key: "A", text: "10" },
      { key: "B", text: "5" },
      { key: "C", text: "15" },
      { key: "D", text: "20" },
    ],
  },
  // Debenture interest is a _______ against profits, while dividend is an _______ of profits.
  "cd5be0aa-6245-4201-a305-42603a70755b": {
    correctKey: "A",
    options: [
      { key: "A", text: "Charge, Appropriation" },
      { key: "B", text: "Appropriation, Charge" },
      { key: "C", text: "Expense, Distribution" },
      { key: "D", text: "Deduction, Allocation" },
    ],
  },
  // When debentures are issued at a price below their face value ... called _______.
  "d2e35397-0270-4fb6-b233-7147fdac63ee": {
    correctKey: "A",
    options: [
      { key: "A", text: "Discount" },
      { key: "B", text: "Premium" },
      { key: "C", text: "Loss" },
      { key: "D", text: "Rebate" },
    ],
  },
  // The minimum DRR to be created is _______ %.
  "c5eb475d-8e2e-4b3e-8964-80541de4f33f": {
    correctKey: "A",
    options: [
      { key: "A", text: "25" },
      { key: "B", text: "10" },
      { key: "C", text: "50" },
      { key: "D", text: "15" },
    ],
  },
  // DRR stands for Debenture _______ Reserve.
  "861c7ce2-8091-4d58-8614-32265421359f": {
    correctKey: "A",
    options: [
      { key: "A", text: "Redemption" },
      { key: "B", text: "Repayment" },
      { key: "C", text: "Recovery" },
      { key: "D", text: "Replacement" },
    ],
  },
  // Assets in the Balance Sheet under Schedule III are classified as _______ Assets and _______ Assets.
  "b513f4ab-9090-4a62-b838-ce2d83ff04c5": {
    correctKey: "A",
    options: [
      { key: "A", text: "Non-Current, Current" },
      { key: "B", text: "Fixed, Floating" },
      { key: "C", text: "Tangible, Intangible" },
      { key: "D", text: "Long-term, Short-term" },
    ],
  },
  // The Balance Sheet of a company under Schedule III has two sides: _______ and _______.
  "d36ed8f0-5d80-4e58-889f-cc75fe42a53e": {
    correctKey: "A",
    options: [
      { key: "A", text: "Equity and Liabilities, Assets" },
      { key: "B", text: "Debit, Credit" },
      { key: "C", text: "Income, Expenditure" },
      { key: "D", text: "Sources, Applications" },
    ],
  },
};

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

  console.log(`\nFix FIB Empty Options (by UUID)${dryRun ? ' — DRY RUN' : ''}`);
  console.log('═'.repeat(55));
  console.log(`Questions to fix: ${Object.keys(QUESTIONS).length}\n`);

  // Check which already have options
  const uuids = Object.keys(QUESTIONS);
  const { data: existingOpts } = await supabase
    .from('med_question_options')
    .select('question_id')
    .in('question_id', uuids);

  const alreadyHas = new Set((existingOpts || []).map(o => o.question_id));

  let fixed = 0;
  let skipped = 0;
  let errors = 0;

  for (const [qid, data] of Object.entries(QUESTIONS)) {
    if (alreadyHas.has(qid)) {
      console.log(`  SKIP  ${qid} — already has options`);
      skipped++;
      continue;
    }

    if (dryRun) {
      console.log(`  [dry] ${qid} → A: ${data.options[0].text} | B: ${data.options[1].text} | C: ${data.options[2].text} | D: ${data.options[3].text}`);
      fixed++;
      continue;
    }

    // Insert 4 options
    const records = data.options.map((opt, idx) => ({
      question_id: qid,
      option_key: opt.key,
      option_text: opt.text,
      is_correct: opt.key === data.correctKey,
      sort_order: idx,
    }));

    const { error: insertErr } = await supabase
      .from('med_question_options')
      .insert(records);

    if (insertErr) {
      console.error(`  FAIL  ${qid}: ${insertErr.message}`);
      errors++;
      continue;
    }

    // Update correct_answer to the key
    await supabase
      .from('med_questions')
      .update({ correct_answer: data.correctKey })
      .eq('id', qid);

    console.log(`  OK    ${qid} → A: ${data.options[0].text} ✓`);
    fixed++;
  }

  console.log(`\n${'═'.repeat(55)}`);
  console.log(`Fixed: ${fixed}  Skipped: ${skipped}  Errors: ${errors}`);
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
