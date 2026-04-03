#!/usr/bin/env node
/**
 * Generate elimination_hints for history questions missing them.
 * Uses Gemini API (REST/fetch) — reads key from Qbank/config.json
 *
 * Usage:
 *   node Qbank/generate-hints.mjs                        # all history files
 *   node Qbank/generate-hints.mjs --file cuet_hist_col_batch1.json
 *   node Qbank/generate-hints.mjs --dry-run              # show counts only
 */
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONFIG_PATH = join(__dirname, 'config.json');
const HISTORY_DIR = join(__dirname, 'CUET/history');

const BATCH_SIZE = 5;        // questions per API call
const DELAY_MS   = 1500;     // ms between API calls (rate limit safety)

// ── helpers ─────────────────────────────────────────────────────────────────

function loadConfig() {
  if (!existsSync(CONFIG_PATH)) {
    console.error('config.json not found.');
    process.exit(1);
  }
  return JSON.parse(readFileSync(CONFIG_PATH, 'utf-8'));
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function log(msg, type = 'info') {
  const p = { ok:'  [OK]', fail:'[FAIL]', warn:'[WARN]', info:'[INFO]', skip:'[SKIP]' }[type] || '[INFO]';
  console.log(`${p} ${msg}`);
}

// ── Gemini call ─────────────────────────────────────────────────────────────

async function callGemini(apiKey, model, prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.3, responseMimeType: 'application/json' }
  };
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Gemini HTTP ${res.status}: ${txt.slice(0, 300)}`);
  }
  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Empty response from Gemini');
  return text;
}

// ── prompt builder ──────────────────────────────────────────────────────────

function buildPrompt(questions) {
  const items = questions.map(q => {
    const wrongOpts = q.options
      .filter(o => o.key !== q.correct_answer)
      .map(o => `    ${o.key}: "${o.text}"`)
      .join('\n');
    const correctOpt = q.options.find(o => o.key === q.correct_answer);
    return `ID: ${q.id}
Question: ${q.question_text.slice(0, 300)}
Correct: ${q.correct_answer} — ${correctOpt?.text || ''}
Wrong options:
${wrongOpts}
Explanation: ${(q.explanation || '').slice(0, 400)}`;
  }).join('\n\n---\n\n');

  return `You are an expert CUET History educator generating elimination hints for students.

For each question below, generate elimination hints for EACH WRONG option only.
Each hint tells the student WHY that option is wrong and WHAT misconception leads to choosing it.

Rules:
- Be concise (hint ≤ 20 words, misconception ≤ 12 words)
- Focus on the specific historical error in each wrong option
- Do NOT reference "correct answer" directly in the hint

Return a JSON array (one object per question):
[
  {
    "id": "question-id",
    "elimination_hints": [
      { "option_key": "A", "hint": "short reason why A is wrong", "misconception": "what students wrongly believe" },
      ...
    ]
  }
]

Questions:
${items}`;
}

// ── parse Gemini JSON response ───────────────────────────────────────────────

function parseResponse(text) {
  // Strip markdown code fences if present
  const clean = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/, '').trim();
  return JSON.parse(clean);
}

// ── main ─────────────────────────────────────────────────────────────────────

async function processFile(filePath, apiKey, model, dryRun) {
  const fname = filePath.split(/[/\\]/).pop();
  const data = JSON.parse(readFileSync(filePath, 'utf-8'));

  const needsHints = data.filter(q =>
    !q.elimination_hints || q.elimination_hints.length === 0
  );

  if (needsHints.length === 0) {
    log(`${fname}: all hints present — skipping`, 'skip');
    return 0;
  }

  log(`${fname}: ${needsHints.length} questions need hints`);
  if (dryRun) return needsHints.length;

  const hintMap = {};
  const batches = [];
  for (let i = 0; i < needsHints.length; i += BATCH_SIZE) {
    batches.push(needsHints.slice(i, i + BATCH_SIZE));
  }

  for (let bi = 0; bi < batches.length; bi++) {
    const batch = batches[bi];
    const prompt = buildPrompt(batch);
    try {
      const raw = await callGemini(apiKey, model, prompt);
      const results = parseResponse(raw);
      for (const r of results) {
        if (r.id && Array.isArray(r.elimination_hints)) {
          hintMap[r.id] = r.elimination_hints;
        }
      }
      log(`  batch ${bi + 1}/${batches.length} done (${batch.length}q)`, 'ok');
    } catch (err) {
      log(`  batch ${bi + 1}/${batches.length} FAILED: ${err.message}`, 'fail');
    }
    if (bi < batches.length - 1) await sleep(DELAY_MS);
  }

  // Merge hints back into data
  let updated = 0;
  for (const q of data) {
    if (hintMap[q.id]) {
      q.elimination_hints = hintMap[q.id];
      updated++;
    }
  }

  writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
  log(`${fname}: wrote ${updated} hints`, 'ok');
  return updated;
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const fileArg = args.indexOf('--file') >= 0 ? args[args.indexOf('--file') + 1] : null;

  const config = loadConfig();
  const apiKey = config.gemini?.apiKey;
  const model  = config.gemini?.model || 'gemini-2.0-flash';

  if (!apiKey || apiKey === 'your-gemini-api-key-here') {
    console.error('Add your Gemini API key to Qbank/config.json under gemini.apiKey');
    process.exit(1);
  }

  console.log('\n========================================');
  console.log('  Elimination Hints Generator');
  console.log('========================================\n');
  if (dryRun) log('DRY RUN — no files will be modified', 'warn');
  log(`Model: ${model}`);

  let files = [];
  if (fileArg) {
    const p = join(HISTORY_DIR, fileArg);
    if (!existsSync(p)) { console.error(`File not found: ${p}`); process.exit(1); }
    files = [p];
  } else {
    files = readdirSync(HISTORY_DIR)
      .filter(f => f.endsWith('.json'))
      .map(f => join(HISTORY_DIR, f))
      .sort();
  }

  let totalUpdated = 0;
  for (const f of files) {
    totalUpdated += await processFile(f, apiKey, model, dryRun);
    await sleep(300);
  }

  console.log('\n========================================');
  console.log(`  Done — ${totalUpdated} hints ${dryRun ? 'would be' : ''} generated`);
  console.log('========================================\n');
}

main().catch(err => { console.error(err); process.exit(1); });
