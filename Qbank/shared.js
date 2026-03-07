/**
 * Qbank Admin - Shared Utilities (v2025.03.05)
 * Config loader, Auth, Supabase client, Gemini client, UI helpers
 */

// ============================================================================
// STATE
// ============================================================================
let CONFIG = null;
let SUPABASE = null;
let CURRENT_USER = null;

// ============================================================================
// EXAM-SUBJECT MAPPING
// ============================================================================
const EXAM_CONFIG = {
  NEET: {
    name: 'NEET',
    fullName: 'National Eligibility cum Entrance Test',
    icon: '🩺',
    description: 'Medical Entrance',
    subjects: ['PHYSICS', 'CHEMISTRY', 'BOTANY', 'ZOOLOGY']
  },
  CUET: {
    name: 'CUET',
    fullName: 'Common University Entrance Test',
    icon: '🎓',
    description: 'University Entrance',
    subjects: ['CUET-PHYSICS', 'CUET-CHEMISTRY', 'CUET-BIOLOGY', 'MATHEMATICS', 'ACCOUNTANCY', 'BUSINESS-STUDIES', 'ECONOMICS']
  }
};

const SUBJECT_META = {
  // NEET subjects
  'PHYSICS':          { name: 'Physics',          emoji: '⚡', color: '#3b82f6', bg: '#dbeafe' },
  'CHEMISTRY':        { name: 'Chemistry',        emoji: '🧪', color: '#10b981', bg: '#d1fae5' },
  'BOTANY':           { name: 'Botany',           emoji: '🌿', color: '#22c55e', bg: '#dcfce7' },
  'ZOOLOGY':          { name: 'Zoology',          emoji: '🦁', color: '#f59e0b', bg: '#fef3c7' },
  // CUET subjects (cuet-physics, cuet-chemistry, cuet-biology use distinct DB subject_ids)
  'CUET-PHYSICS':     { name: 'Physics',          emoji: '⚡', color: '#3b82f6', bg: '#dbeafe' },
  'CUET-CHEMISTRY':   { name: 'Chemistry',        emoji: '🧪', color: '#10b981', bg: '#d1fae5' },
  'CUET-BIOLOGY':     { name: 'Biology',          emoji: '🧬', color: '#8b5cf6', bg: '#ede9fe' },
  'MATHEMATICS':      { name: 'Mathematics',      emoji: '📐', color: '#ef4444', bg: '#fee2e2' },
  'ACCOUNTANCY':      { name: 'Accountancy',      emoji: '📊', color: '#14b8a6', bg: '#ccfbf1' },
  'BUSINESS-STUDIES': { name: 'Business Studies', emoji: '💼', color: '#6366f1', bg: '#e0e7ff' },
  'ECONOMICS':        { name: 'Economics',        emoji: '💰', color: '#f97316', bg: '#ffedd5' }
};

function getExamConfig(examId) {
  return EXAM_CONFIG[examId] || null;
}

function getExamSubjects(examId) {
  return EXAM_CONFIG[examId]?.subjects || [];
}

function getSubjectMeta(subjectId) {
  const key = (subjectId || '').toUpperCase();
  return SUBJECT_META[key] || { name: subjectId, emoji: '📚', color: '#6b7280', bg: '#f3f4f6' };
}

// Normalize IDs to lowercase for case-insensitive DB matching
function normalizeId(id) {
  return (id || '').toLowerCase();
}

function normalizeIds(ids) {
  return (ids || []).map(id => id.toLowerCase());
}

// ============================================================================
// CONFIG LOADER
// ============================================================================
async function loadConfig() {
  if (CONFIG) return CONFIG;

  try {
    const response = await fetch('./config.json');
    if (!response.ok) throw new Error('Config not found');
    CONFIG = await response.json();
    return CONFIG;
  } catch (error) {
    console.error('Failed to load config:', error);
    showToast('Configuration file not found. Please create config.json', 'error');
    return null;
  }
}

// ============================================================================
// AUTHENTICATION
// ============================================================================
function getSession() {
  const session = localStorage.getItem('qbank_session');
  if (!session) return null;

  try {
    const parsed = JSON.parse(session);
    // Session expires after 24 hours
    if (Date.now() - parsed.timestamp > 24 * 60 * 60 * 1000) {
      localStorage.removeItem('qbank_session');
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function setSession(code, user) {
  localStorage.setItem('qbank_session', JSON.stringify({
    code,
    user,
    timestamp: Date.now()
  }));
}

function clearSession() {
  localStorage.removeItem('qbank_session');
}

async function authenticate(code) {
  const config = await loadConfig();
  if (!config) return { success: false, error: 'Config not loaded' };

  const user = config.users[code];
  if (!user) return { success: false, error: 'Invalid access code' };

  setSession(code, user);
  CURRENT_USER = user;
  return { success: true, user };
}

async function requireAuth(allowedRoles = ['admin', 'reviewer']) {
  const session = getSession();

  if (!session) {
    window.location.href = './login.html';
    return null;
  }

  CURRENT_USER = session.user;

  if (!allowedRoles.includes(CURRENT_USER.role)) {
    showToast('Access denied for this page', 'error');
    setTimeout(() => window.location.href = './index.html', 1500);
    return null;
  }

  const config = await loadConfig();
  if (!config) {
    showToast('Config file missing. Create Qbank/config.json from config.example.json', 'error', 8000);
    return CURRENT_USER; // Still return user so page partially renders
  }

  await initSupabase();

  return CURRENT_USER;
}

function isAdmin() {
  return CURRENT_USER?.role === 'admin';
}

function logout() {
  clearSession();
  window.location.href = './login.html';
}

// ============================================================================
// SUPABASE CLIENT
// ============================================================================
async function initSupabase() {
  if (SUPABASE) return SUPABASE;

  const config = await loadConfig();
  if (!config?.supabase) {
    showToast('Supabase configuration missing', 'error');
    return null;
  }

  // Check for placeholder credentials
  if (config.supabase.url.includes('your-project') || config.supabase.anonKey.includes('your-')) {
    console.warn('Supabase credentials are placeholders. Update config.json with real credentials.');
    showToast('Supabase not configured. Update config.json with your Supabase URL and key.', 'warning', 5000);
    return null;
  }

  // Load Supabase from CDN if not already loaded
  if (!window.supabase) {
    try {
      await loadScript('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js');
    } catch (err) {
      console.error('Failed to load Supabase SDK:', err);
      showToast('Failed to load Supabase SDK. Check your internet connection.', 'error');
      return null;
    }
  }

  SUPABASE = window.supabase.createClient(config.supabase.url, config.supabase.anonKey);
  return SUPABASE;
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

// ============================================================================
// SUPABASE DATA HELPERS
// ============================================================================
async function fetchSubjects() {
  if (!SUPABASE) return [];
  const { data, error } = await SUPABASE
    .from('med_subjects')
    .select('*')
    .order('sort_order');

  if (error) {
    console.error('Error fetching subjects:', error);
    return [];
  }

  // Filter by user's allowed subjects (case-insensitive)
  if (CURRENT_USER && CURRENT_USER.role === 'reviewer') {
    const allowed = normalizeIds(CURRENT_USER.subjects);
    return data.filter(s => allowed.includes(normalizeId(s.id)));
  }

  return data;
}

async function fetchChapters(subjectId = null, examId = null) {
  if (!SUPABASE) return [];
  let query = SUPABASE
    .from('med_chapters')
    .select('*')
    .order('chapter_number');

  if (subjectId) {
    query = query.ilike('subject_id', subjectId);
  } else if (CURRENT_USER?.role === 'reviewer') {
    // Use OR filter for case-insensitive in() equivalent
    const subjects = CURRENT_USER.subjects;
    query = query.or(subjects.map(s => `subject_id.ilike.${s}`).join(','));
  }

  // Filter by exam if specified (chapters have exam_ids array)
  if (examId) {
    query = query.contains('exam_ids', [examId]);
  }

  const { data, error } = await query;
  if (error) {
    console.error('Error fetching chapters:', error);
    return [];
  }
  return data;
}

async function fetchTopics(chapterId) {
  if (!SUPABASE) return [];
  const { data, error } = await SUPABASE
    .from('med_topics')
    .select('*')
    .eq('chapter_id', chapterId)
    .order('sort_order');

  if (error) {
    console.error('Error fetching topics:', error);
    return [];
  }
  return data;
}

async function fetchGenerationJobs(status = null) {
  if (!SUPABASE) return [];
  let query = SUPABASE
    .from('med_generation_jobs')
    .select('*')
    .order('created_at', { ascending: false });

  if (status) {
    query = query.eq('status', status);
  }

  if (CURRENT_USER?.role === 'reviewer') {
    const subjects = CURRENT_USER.subjects;
    query = query.or(subjects.map(s => `subject_id.ilike.${s}`).join(','));
  }

  const { data, error } = await query;
  if (error) {
    console.error('Error fetching jobs:', error);
    return [];
  }
  return data;
}

async function createGenerationJob(jobData) {
  if (!SUPABASE) return null;
  const { data, error } = await SUPABASE
    .from('med_generation_jobs')
    .insert(jobData)
    .select()
    .single();

  if (error) {
    console.error('Error creating job:', error);
    return null;
  }
  return data;
}

async function updateGenerationJob(jobId, updates) {
  if (!SUPABASE) return null;
  const { data, error } = await SUPABASE
    .from('med_generation_jobs')
    .update(updates)
    .eq('id', jobId)
    .select()
    .single();

  if (error) {
    console.error('Error updating job:', error);
    return null;
  }
  return data;
}

/**
 * Build the JSONB payload for a question during import.
 * Includes type-specific fields that the app components need.
 */
function buildImportPayload(q) {
  const payload = {
    subtopic: q.subtopic || '',
    bloom_level: q.bloom_level || 'understand',
    topic_name: q.topic || '',
    question_id: q.id || '',
    options: q.options || [],
    elimination_hints: q.elimination_hints || [],
  };
  // diagram-based: image path + alt text
  if (q.image_uri) payload.image_uri = q.image_uri;
  if (q.image_alt) payload.image_alt = q.image_alt;
  // scenario-based: separate scenario text
  if (q.scenario) payload.scenario = q.scenario;
  // logical-sequence: items array + correct ordering
  if (q.items) payload.items = q.items;
  if (q.correct_order) payload.correct_order = q.correct_order;
  // If sequence but no items, parse numbered items from question_text
  if (q.question_type === 'logical-sequence' && !payload.items && q.question_text) {
    const parsed = _parseSequenceItems(q.question_text);
    if (parsed.length >= 2) {
      payload.items = parsed;
    }
    // Derive correct_order from the correct option (e.g. "4 → 3 → 1 → 2")
    if (!payload.correct_order && q.options && q.correct_answer) {
      const correctOpt = q.options.find(o => o.is_correct || o.key === q.correct_answer);
      if (correctOpt) {
        const order = _parseSequenceOrder(correctOpt.text);
        if (order.length >= 2) payload.correct_order = order;
      }
    }
  }
  // match-the-following: structured column data for drag-and-drop UI
  if (q.column_a || q.columnA) payload.columnA = q.column_a || q.columnA;
  if (q.column_b || q.columnB) payload.columnB = q.column_b || q.columnB;
  if (q.correct_mapping || q.correctMapping) payload.correctMapping = q.correct_mapping || q.correctMapping;
  // If MTF but no structured columns, parse from question_text
  if (q.question_type === 'match-the-following' && !payload.columnA && q.question_text) {
    const parsed = _parseMTFColumns(q.question_text);
    if (parsed.columnA.length > 0 && parsed.columnB.length > 0) {
      payload.columnA = parsed.columnA;
      payload.columnB = parsed.columnB;
    }
    // Derive correctMapping from the correct option
    if (!payload.correctMapping && q.options && q.correct_answer) {
      const correctOpt = q.options.find(o => o.is_correct || o.key === q.correct_answer);
      if (correctOpt) {
        payload.correctMapping = _parseOptionMapping(correctOpt.text);
      }
    }
  }
  return payload;
}

/**
 * Parse MTF column items from question text.
 * Handles: (P) text, A. text, A  text formats.
 * textTe is populated separately by the translation program.
 */
function _parseMTFColumns(text) {
  // ── Strategy 1: pipe-delimited table rows ──
  // Format: "... Column I | Column II A. leftText | 1. rightText B. leftText | 2. rightText"
  const pipeRows = _parseMTFPipeTable(text);
  if (pipeRows.columnA.length >= 2 && pipeRows.columnB.length >= 2) {
    return pipeRows;
  }

  // ── Strategy 2: arrow-separated row pairs ──
  // Format: "(P) lacZ → (i) Codes for permease\n(Q) lacY → (ii) Codes for beta-galactosidase"
  // Appears after a "Column I ... → Column II ..." header line
  {
    const arrowRowRe = /\(([A-Z])\)\s+(.+?)\s*→\s*\(([A-Za-z0-9]+(?:i{1,3}v?|v)?)\)\s+(.+?)(?=\s*\([A-Z]\)\s|Choose\b|\n\s*\n|$)/gs;
    const colA = [], colB = [];
    let m;
    while ((m = arrowRowRe.exec(text)) !== null) {
      colA.push({ id: m[1], text: m[2].trim(), textTe: '' });
      colB.push({ id: m[3], text: m[4].trim(), textTe: '' });
    }
    if (colA.length >= 2 && colB.length >= 2) return { columnA: colA, columnB: colB };
  }

  // ── Strategy 3: column header split (original logic) ──
  // Split on "Column II" with optional parenthetical label and/or delimiter
  // Handles: "Column II:", "Column II (Function)", "Column II (Label):", "→ Column II"
  const colSplit = text.split(/column\s*[-–]?\s*(?:ii|II|2|b|B)\s*(?:\([^)]*\)\s*[:\-–→]?|[:\-–→)])/i);
  if (colSplit.length < 2) return { columnA: [], columnB: [] };

  // Use LAST part as Column II body, everything before as Column I area
  const col2Body = colSplit[colSplit.length - 1];
  const col1Raw = colSplit.slice(0, -1).join(' ');
  const col1Body = col1Raw.replace(/.*column\s*[-–]?\s*(?:i|I|1|a|A)\s*(?:\([^)]*\)\s*[:\-–→]?|[:\-–→)])/i, '');

  function extractItems(body) {
    let items = [];
    let m;
    // Try parenthesized: (P) text, (Q) text
    const parenRe = /\(([A-Za-z0-9]+(?:i{1,3}v?|v)?)\)\s*([^\n(]+)/g;
    while ((m = parenRe.exec(body)) !== null) {
      items.push({ id: m[1].trim(), text: m[2].trim(), textTe: '' });
    }
    if (items.length >= 2) return items;

    // Try dotted: A. text, B. text, 1. text
    items = [];
    const dotRe = /(?:^|\n)\s*([A-Za-z0-9]+)\.\s+(.+?)(?=\n\s*[A-Za-z0-9]+\.|$)/gs;
    while ((m = dotRe.exec(body)) !== null) {
      items.push({ id: m[1].trim(), text: m[2].trim(), textTe: '' });
    }
    return items;
  }

  return { columnA: extractItems(col1Body), columnB: extractItems(col2Body) };
}

/**
 * Parse pipe-delimited MTF table format.
 * Handles: "... Column I | Column II A. leftText | 1. rightText B. leftText | 2. rightText ..."
 * Key: uses GREEDY .* to strip up to the LAST "Column II/B/2" header,
 * then matches complete row pairs with "letter. text | number. text".
 */
function _parseMTFPipeTable(text) {
  // Must mention column headers
  if (!/column\s*[-–]?\s*(?:i{1,2}|[12ab])/i.test(text)) {
    return { columnA: [], columnB: [] };
  }

  // Strip up to LAST "Column II/B/2" header using GREEDY .* (not .*?)
  // This skips "Column II" in the intro sentence and finds the table header
  // Also handles arrow → separator and parenthetical labels like (Function)
  let body = text.replace(/^.*column\s*[-–]?\s*(?:ii|2|b)\s*(?:\([^)]*\))?[:\-–→|]?\s*/is, '');
  if (body === text || body.length < 5) return { columnA: [], columnB: [] };

  const columnA = [];
  const columnB = [];
  let m;

  // Match complete row pairs: "A. leftText | 1. rightText"
  // The lookahead stops right text at the next "X. " letter-item or end-of-string
  const rowRe = /([A-Z])\.\s+(.+?)\s*\|\s*(\d+)\.\s+(.+?)(?=\s+[A-Z]\.\s|$)/gs;
  while ((m = rowRe.exec(body)) !== null) {
    columnA.push({ id: m[1], text: m[2].trim(), textTe: '' });
    columnB.push({ id: m[3], text: m[4].trim(), textTe: '' });
  }

  if (columnA.length >= 2) return { columnA, columnB };

  // Fallback: try parenthesized row pairs with pipe: "(a) leftText | (i) rightText"
  // Supports uppercase/lowercase letters and roman numeral IDs
  const parenRowRe = /\(([A-Za-z])\)\s+(.+?)\s*\|\s*\(([A-Za-z0-9]+(?:i{1,3}v?|v)?)\)\s+(.+?)(?=\s*\([A-Za-z]\)\s|Choose\b|\n\s*\n|$)/gs;
  while ((m = parenRowRe.exec(body)) !== null) {
    columnA.push({ id: m[1], text: m[2].trim(), textTe: '' });
    columnB.push({ id: m[3], text: m[4].trim(), textTe: '' });
  }

  if (columnA.length >= 2) return { columnA, columnB };

  // Fallback: arrow-separated row pairs "(P) lacZ → (i) Codes for permease"
  // Handles both uppercase letters and roman numerals as IDs
  const arrowRowRe = /\(([A-Za-z0-9]+)\)\s+(.+?)\s*→\s*\(([A-Za-z0-9]+(?:i{1,3}v?|v)?)\)\s+(.+?)(?=\s+\([A-Z]\)\s|Choose\b|\n\s*\n|$)/gs;
  while ((m = arrowRowRe.exec(body)) !== null) {
    columnA.push({ id: m[1], text: m[2].trim(), textTe: '' });
    columnB.push({ id: m[3], text: m[4].trim(), textTe: '' });
  }

  return { columnA, columnB };
}

/**
 * Parse option mapping text like "A-2, B-3, C-4, D-1" into { A: "2", B: "3", ... }
 */
function _parseOptionMapping(text) {
  const mapping = {};
  for (const part of text.split(/[,;]\s*/)) {
    const m = part.trim().match(/^([A-Za-z0-9]+)\s*[-–→]\s*\(?([A-Za-z0-9]+(?:i{1,3}v?|v)?)\)?$/);
    if (m) mapping[m[1].trim()] = m[2].trim();
  }
  return mapping;
}

/**
 * Parse numbered sequence items from question text.
 * Extracts "1. text", "2. text" etc. into [{id: "1", text: "..."}]
 */
function _parseSequenceItems(text) {
  const items = [];
  const re = /(?:^|\n)\s*(\d+)\.\s+(.+?)(?=\n\s*\d+\.|$)/gs;
  let m;
  while ((m = re.exec(text)) !== null) {
    items.push({ id: m[1], text: m[2].trim() });
  }
  return items;
}

/**
 * Parse sequence correct order from option text like "4 → 3 → 1 → 2"
 * Returns array of string IDs: ["4", "3", "1", "2"]
 */
function _parseSequenceOrder(text) {
  // Split on arrows, dashes, or "then" connectors
  return text.split(/\s*[→\-–]\s*/).map(s => s.trim()).filter(s => /^\d+$/.test(s));
}

/**
 * Normalize a topic name for matching: lowercase, strip possessives ('s),
 * remove common filler words, trim.
 */
function _normalizeTopic(name) {
  return name.toLowerCase()
    .replace(/[''\u2019]s\b/g, '')   // strip possessive 's
    .replace(/\band\b/g, '')          // remove "and"
    .replace(/\bof\b/g, '')           // remove "of"
    .replace(/\bthe\b/g, '')          // remove "the"
    .replace(/[,()]/g, '')            // remove punctuation
    .replace(/\s+/g, ' ')            // collapse whitespace
    .trim();
}

/**
 * Resolve topic_id from a topic name and chapter_id.
 * Fetches all topics for the chapter, then matches by:
 *   1. Exact case-insensitive match
 *   2. Normalized match (strip possessives, filler words)
 *   3. DB topic name contained within the payload topic name (or vice versa)
 *   4. Best keyword overlap score
 * Uses a per-chapter cache so repeated calls don't hit the DB.
 * Returns the topic id string, or null if no match found.
 */
const _topicCache = {}; // chapterId -> [{ id, nameLower, nameNorm, words }]
async function resolveTopicId(chapterId, topicName) {
  if (!SUPABASE || !chapterId || !topicName) return null;

  // Build cache for this chapter if needed
  if (!_topicCache[chapterId]) {
    const { data, error } = await SUPABASE
      .from('med_topics')
      .select('id, name')
      .eq('chapter_id', chapterId);
    if (error || !data) {
      console.warn('[resolveTopicId] Failed to fetch topics for', chapterId, error);
      return null;
    }
    _topicCache[chapterId] = data.map(t => {
      const norm = _normalizeTopic(t.name);
      return { id: t.id, nameLower: t.name.toLowerCase().trim(), nameNorm: norm, words: new Set(norm.split(' ').filter(Boolean)) };
    });
  }

  const topics = _topicCache[chapterId];
  const needle = topicName.toLowerCase().trim();
  const needleNorm = _normalizeTopic(topicName);
  const needleWords = new Set(needleNorm.split(' ').filter(Boolean));

  // 1. Exact match
  const exact = topics.find(t => t.nameLower === needle);
  if (exact) return exact.id;

  // 2. Normalized exact match (e.g. "Kirchhoff's Laws" → "kirchhoff laws" matches "kirchhoff laws")
  const normExact = topics.find(t => t.nameNorm === needleNorm);
  if (normExact) return normExact.id;

  // 3. Contains match on normalized names
  const contains = topics.find(t => needleNorm.includes(t.nameNorm) || t.nameNorm.includes(needleNorm));
  if (contains) return contains.id;

  // 4. Best keyword overlap — pick topic where most DB words appear in the payload topic
  let bestScore = 0, bestTopic = null;
  for (const t of topics) {
    if (t.words.size === 0) continue;
    let overlap = 0;
    for (const w of t.words) { if (needleWords.has(w)) overlap++; }
    const score = overlap / t.words.size; // fraction of DB topic words matched
    if (score > bestScore && overlap >= 2) { bestScore = score; bestTopic = t; }
  }
  if (bestScore >= 0.5 && bestTopic) return bestTopic.id;

  console.warn(`[resolveTopicId] No topic match for "${topicName}" in chapter ${chapterId}`);
  return null;
}

async function insertQuestions(questions) {
  if (!SUPABASE) return { success: false, error: 'Supabase not initialized' };
  const { data, error } = await SUPABASE
    .from('med_questions')
    .insert(questions)
    .select();

  if (error) {
    console.error('Error inserting questions:', error);
    return { success: false, error };
  }
  return { success: true, data };
}

async function insertQuestionOptions(options) {
  if (!SUPABASE) return { success: false, error: 'Supabase not initialized' };
  const { data, error } = await SUPABASE
    .from('med_question_options')
    .insert(options)
    .select();

  if (error) {
    console.error('Error inserting options:', error);
    return { success: false, error };
  }
  return { success: true, data };
}

async function insertEliminationHints(hints) {
  if (!SUPABASE) return { success: false, error: 'Supabase not initialized' };
  const { data, error } = await SUPABASE
    .from('med_elimination_hints')
    .insert(hints)
    .select();

  if (error) {
    console.error('Error inserting hints:', error);
    return { success: false, error };
  }
  return { success: true, data };
}

// Insert questions from a generation job to DB
async function insertJobQuestionsToDb(job) {
  if (!SUPABASE) return { success: false, error: 'Supabase not initialized' };
  if (!job.output_json?.questions || job.output_json.questions.length === 0) {
    return { success: false, error: 'No questions in job' };
  }

  const questions = job.output_json.questions;
  let insertedCount = 0;
  let errorCount = 0;

  for (const q of questions) {
    try {
      // Prepare question record
      const questionRecord = {
        subject_id: job.subject_id,
        chapter_id: job.chapter_id,
        topic_id: await resolveTopicId(job.chapter_id, q.topic),
        exam_ids: q.exam_suitability || job.exam_ids || ['NEET'],
        question_type: q.question_type,
        difficulty: q.difficulty || 'medium',
        strength_required: 'just-started',
        question_text: q.question_text,
        explanation: q.explanation,
        payload: buildImportPayload(q),
        correct_answer: q.correct_answer,
        source: 'gemini',
        generation_job_id: job.id,
        concept_tags: q.concept_tags || [],
        status: 'draft' // Will be reviewed later
      };

      // Insert question
      const { data: insertedQ, error: qError } = await SUPABASE
        .from('med_questions')
        .insert(questionRecord)
        .select()
        .single();

      if (qError) {
        console.error('Error inserting question:', qError);
        errorCount++;
        continue;
      }

      // Insert options
      if (q.options && q.options.length > 0) {
        const optionRecords = q.options.map((opt, idx) => ({
          question_id: insertedQ.id,
          option_key: opt.key,
          option_text: opt.text,
          is_correct: opt.is_correct || opt.key === q.correct_answer,
          sort_order: idx
        }));

        const { error: optError } = await SUPABASE
          .from('med_question_options')
          .insert(optionRecords);

        if (optError) {
          console.error('Error inserting options:', optError);
        }
      }

      // Insert elimination hints
      if (q.elimination_hints && q.elimination_hints.length > 0) {
        const hintRecords = q.elimination_hints.map(hint => ({
          question_id: insertedQ.id,
          option_key: hint.option_key,
          hint_text: hint.hint,
          misconception: hint.misconception
        }));

        const { error: hintError } = await SUPABASE
          .from('med_elimination_hints')
          .insert(hintRecords);

        if (hintError) {
          console.error('Error inserting hints:', hintError);
        }
      }

      insertedCount++;
    } catch (err) {
      console.error('Error processing question:', err);
      errorCount++;
    }
  }

  // Update job status
  await updateGenerationJob(job.id, {
    status: 'inserted',
    questions_count: insertedCount
  });

  return {
    success: true,
    insertedCount,
    errorCount,
    total: questions.length
  };
}

// Insert only approved questions from a job to DB
async function insertApprovedQuestionsToDb(job, approvedQuestions) {
  if (!SUPABASE) return { success: false, error: 'Supabase not initialized' };
  if (!approvedQuestions || approvedQuestions.length === 0) {
    return { success: false, error: 'No approved questions to insert' };
  }

  let insertedCount = 0;
  let errorCount = 0;

  for (const q of approvedQuestions) {
    try {
      // Prepare question record
      const questionRecord = {
        subject_id: job.subject_id,
        chapter_id: job.chapter_id,
        topic_id: await resolveTopicId(job.chapter_id, q.topic),
        exam_ids: q.exam_suitability || job.exam_ids || ['NEET'],
        question_type: q.question_type,
        difficulty: q.difficulty || 'medium',
        strength_required: 'just-started',
        question_text: q.question_text,
        explanation: q.explanation,
        payload: buildImportPayload(q),
        correct_answer: q.correct_answer,
        source: 'gemini',
        generation_job_id: job.id,
        concept_tags: q.concept_tags || [],
        status: 'active' // Approved questions go directly to active
      };

      // Insert question
      const { data: insertedQ, error: qError } = await SUPABASE
        .from('med_questions')
        .insert(questionRecord)
        .select()
        .single();

      if (qError) {
        console.error('Error inserting question:', qError);
        errorCount++;
        continue;
      }

      // Insert options
      if (q.options && q.options.length > 0) {
        const optionRecords = q.options.map((opt, idx) => ({
          question_id: insertedQ.id,
          option_key: opt.key,
          option_text: opt.text,
          is_correct: opt.is_correct || opt.key === q.correct_answer,
          sort_order: idx
        }));

        const { error: optError } = await SUPABASE
          .from('med_question_options')
          .insert(optionRecords);

        if (optError) {
          console.error('Error inserting options:', optError);
        }
      }

      // Insert elimination hints
      if (q.elimination_hints && q.elimination_hints.length > 0) {
        const hintRecords = q.elimination_hints.map(hint => ({
          question_id: insertedQ.id,
          option_key: hint.option_key,
          hint_text: hint.hint,
          misconception: hint.misconception
        }));

        const { error: hintError } = await SUPABASE
          .from('med_elimination_hints')
          .insert(hintRecords);

        if (hintError) {
          console.error('Error inserting hints:', hintError);
        }
      }

      insertedCount++;
    } catch (err) {
      console.error('Error processing question:', err);
      errorCount++;
    }
  }

  // Update job status to 'inserted'
  await updateGenerationJob(job.id, {
    status: 'inserted',
    questions_count: insertedCount
  });

  return {
    success: true,
    insertedCount,
    errorCount,
    total: approvedQuestions.length
  };
}

// Check for old jobs (>12 hours) and auto-insert
async function autoInsertOldJobs() {
  if (!SUPABASE) return { processed: 0 };
  const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString();

  // Get jobs that are pending and older than 12 hours
  const { data: oldJobs, error } = await SUPABASE
    .from('med_generation_jobs')
    .select('*')
    .in('status', ['pending', 'generating'])
    .lt('created_at', twelveHoursAgo);

  if (error) {
    console.error('Error fetching old jobs:', error);
    return { processed: 0 };
  }

  let processed = 0;
  for (const job of oldJobs || []) {
    console.log(`Auto-inserting old job ${job.id} (created ${job.created_at})`);
    const result = await insertJobQuestionsToDb(job);
    if (result.success) {
      processed++;
    }
  }

  return { processed, total: oldJobs?.length || 0 };
}

// Get time remaining before auto-insert (in ms)
function getAutoInsertTimeRemaining(jobCreatedAt) {
  const created = new Date(jobCreatedAt).getTime();
  const deadline = created + 12 * 60 * 60 * 1000; // 12 hours
  const remaining = deadline - Date.now();
  return Math.max(0, remaining);
}

async function getQuestionStats() {
  if (!SUPABASE) return [];

  // Paginate to avoid Supabase default 1000-row limit
  const PAGE_SIZE = 1000;
  let allData = [];
  let from = 0;

  while (true) {
    const { data, error } = await SUPABASE
      .from('med_questions')
      .select('subject_id, chapter_id, question_type, difficulty, status, exam_ids')
      .range(from, from + PAGE_SIZE - 1);

    if (error) {
      console.error('Error fetching stats:', error);
      return allData.length > 0 ? allData : null;
    }

    if (!data || data.length === 0) break;
    allData = allData.concat(data);
    if (data.length < PAGE_SIZE) break;
    from += PAGE_SIZE;
  }

  return allData;
}

async function fetchQuestionsByChapter(chapterId, options = {}) {
  if (!SUPABASE) return { data: [], total: 0 };
  let query = SUPABASE
    .from('med_questions')
    .select('id, subject_id, chapter_id, question_type, difficulty, status, question_text, correct_answer, explanation, payload, concept_tags, created_at')
    .eq('chapter_id', chapterId)
    .order('created_at', { ascending: false });

  if (options.status) {
    query = query.eq('status', options.status);
  }

  const pageSize = options.pageSize || 10;
  const page = options.page || 1;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;
  if (error) {
    console.error('Error fetching questions:', error);
    return { data: [], total: 0 };
  }
  return { data: data || [], total: count };
}

async function fetchQuestionDetails(questionId) {
  if (!SUPABASE) return null;

  // Fetch options and hints in parallel
  const [optRes, hintRes] = await Promise.all([
    SUPABASE.from('med_question_options').select('*').eq('question_id', questionId).order('sort_order'),
    SUPABASE.from('med_elimination_hints').select('*').eq('question_id', questionId)
  ]);

  return {
    options: optRes.data || [],
    hints: hintRes.data || []
  };
}

async function bulkUpdateQuestionStatus(questionIds, newStatus) {
  if (!SUPABASE || questionIds.length === 0) return null;
  const { data, error } = await SUPABASE
    .from('med_questions')
    .update({ status: newStatus })
    .in('id', questionIds)
    .select();

  if (error) {
    console.error('Error bulk updating status:', error);
    return null;
  }
  return data;
}

async function fetchQuestionsCountByChapter(subjectId, examId = null) {
  if (!SUPABASE) return {};

  // Paginate to avoid Supabase default 1000-row limit
  const PAGE_SIZE = 1000;
  let allData = [];
  let from = 0;

  while (true) {
    let query = SUPABASE
      .from('med_questions')
      .select('chapter_id, status, exam_ids')
      .ilike('subject_id', subjectId)
      .range(from, from + PAGE_SIZE - 1);

    if (examId) {
      query = query.contains('exam_ids', [examId]);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching question counts:', error);
      return {};
    }

    if (!data || data.length === 0) break;
    allData = allData.concat(data);
    if (data.length < PAGE_SIZE) break;
    from += PAGE_SIZE;
  }

  // Group by chapter_id and status
  const counts = {};
  allData.forEach(q => {
    if (!counts[q.chapter_id]) {
      counts[q.chapter_id] = { total: 0, active: 0, draft: 0, pending: 0 };
    }
    counts[q.chapter_id].total++;
    if (q.status === 'active') counts[q.chapter_id].active++;
    else if (q.status === 'draft') counts[q.chapter_id].draft++;
    else counts[q.chapter_id].pending++;
  });
  return counts;
}

async function fetchTypeDistribution(subjectId, examId = null) {
  if (!SUPABASE) return {};
  const PAGE_SIZE = 1000;
  let allData = [];
  let from = 0;

  while (true) {
    let query = SUPABASE
      .from('med_questions')
      .select('question_type, status')
      .ilike('subject_id', subjectId)
      .range(from, from + PAGE_SIZE - 1);

    if (examId) {
      query = query.contains('exam_ids', [examId]);
    }

    const { data, error } = await query;
    if (error) { console.error('Error fetching type distribution:', error); return {}; }
    if (!data || data.length === 0) break;
    allData = allData.concat(data);
    if (data.length < PAGE_SIZE) break;
    from += PAGE_SIZE;
  }

  const dist = {};
  allData.forEach(q => {
    const t = q.question_type || 'unknown';
    if (!dist[t]) dist[t] = { total: 0, active: 0, draft: 0 };
    dist[t].total++;
    if (q.status === 'active') dist[t].active++;
    else if (q.status === 'draft') dist[t].draft++;
  });
  return dist;
}

async function fetchTopicCountsByChapter(chapterId) {
  if (!SUPABASE) return { topics: [], counts: {} };

  const [topicsRes, questionsRes] = await Promise.all([
    SUPABASE.from('med_topics').select('id, name, sort_order, is_important').eq('chapter_id', chapterId).order('sort_order'),
    SUPABASE.from('med_questions').select('topic_id, status, payload').eq('chapter_id', chapterId)
  ]);

  const topics = topicsRes.data || [];
  const questions = questionsRes.data || [];

  // Build topic list for fuzzy matching (reuse shared normalizer)
  const topicList = topics.map(t => {
    const norm = _normalizeTopic(t.name);
    return { id: t.id, nameLower: t.name.toLowerCase().trim(), nameNorm: norm, words: new Set(norm.split(' ').filter(Boolean)) };
  });

  function matchTopicId(payloadTopicName) {
    const needle = payloadTopicName.toLowerCase().trim();
    const needleNorm = _normalizeTopic(payloadTopicName);
    const needleWords = new Set(needleNorm.split(' ').filter(Boolean));
    // 1. Exact match
    const exact = topicList.find(t => t.nameLower === needle);
    if (exact) return exact.id;
    // 2. Normalized exact match
    const normExact = topicList.find(t => t.nameNorm === needleNorm);
    if (normExact) return normExact.id;
    // 3. Contains match (DB name in payload name, or vice versa)
    const contains = topicList.find(t => needleNorm.includes(t.nameNorm) || t.nameNorm.includes(needleNorm));
    if (contains) return contains.id;
    // 4. Best keyword overlap
    let bestScore = 0, bestTopic = null;
    for (const t of topicList) {
      if (t.words.size === 0) continue;
      let overlap = 0;
      for (const w of t.words) { if (needleWords.has(w)) overlap++; }
      const score = overlap / t.words.size;
      if (score > bestScore && overlap >= 2) { bestScore = score; bestTopic = t; }
    }
    if (bestScore >= 0.5 && bestTopic) return bestTopic.id;
    return null;
  }

  const counts = {};
  let unmatchedTopics = new Set();
  questions.forEach(q => {
    // Try topic_id first, then fall back to fuzzy-matching payload topic name
    let tid = q.topic_id;
    if (!tid) {
      const pTopicName = q.payload?.topic_name || q.payload?.topic || '';
      if (pTopicName) {
        tid = matchTopicId(pTopicName) || '__none__';
      }
    }
    if (!tid) tid = '__none__';

    if (tid === '__none__') {
      const pName = q.payload?.topic_name || q.payload?.topic || '';
      if (pName) unmatchedTopics.add(pName);
    }

    if (!counts[tid]) counts[tid] = { total: 0, active: 0, draft: 0 };
    counts[tid].total++;
    if (q.status === 'active') counts[tid].active++;
    else if (q.status === 'draft') counts[tid].draft++;
  });

  if (unmatchedTopics.size > 0) {
    console.warn('[TopicMatch] Unmatched topic names from payload:', [...unmatchedTopics]);
  }

  return { topics, counts };
}

async function updateQuestionStatus(questionId, newStatus) {
  if (!SUPABASE) return null;
  const { data, error } = await SUPABASE
    .from('med_questions')
    .update({ status: newStatus })
    .eq('id', questionId)
    .select()
    .single();

  if (error) {
    console.error('Error updating question status:', error);
    return null;
  }
  return data;
}

// ============================================================================
// GEMINI CLIENT
// ============================================================================
// Track token usage for the session
let SESSION_TOKEN_USAGE = {
  totalInputTokens: 0,
  totalOutputTokens: 0,
  calls: []
};

async function callGemini(prompt, options = {}) {
  const config = await loadConfig();
  if (!config?.gemini?.apiKey) {
    throw new Error('Gemini API key not configured');
  }

  const model = options.model || config.gemini.model || 'gemini-2.5-flash';
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${config.gemini.apiKey}`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: options.temperature || 0.7,
        maxOutputTokens: options.maxTokens || 8192,
      }
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Gemini API error');
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error('No response from Gemini');
  }

  // Track token usage
  const usage = data.usageMetadata || {};
  const inputTokens = usage.promptTokenCount || 0;
  const outputTokens = usage.candidatesTokenCount || 0;

  SESSION_TOKEN_USAGE.totalInputTokens += inputTokens;
  SESSION_TOKEN_USAGE.totalOutputTokens += outputTokens;
  SESSION_TOKEN_USAGE.calls.push({
    timestamp: new Date().toISOString(),
    model,
    inputTokens,
    outputTokens
  });

  // Log token usage to console
  console.log(`📊 Token Usage: ${inputTokens} in / ${outputTokens} out (Total session: ${SESSION_TOKEN_USAGE.totalInputTokens} in / ${SESSION_TOKEN_USAGE.totalOutputTokens} out)`);

  // Return text by default, or full response if requested
  if (options.returnFullResponse) {
    return { text, usage: { inputTokens, outputTokens }, raw: data };
  }

  return text;
}

function getTokenUsage() {
  return SESSION_TOKEN_USAGE;
}

// ============================================================================
// INTELLIGENT PROMPT: DB ANALYSIS
// ============================================================================
async function fetchChapterCoverage(chapterId) {
  if (!SUPABASE) return null;

  // Fetch all existing questions for this chapter (lightweight: just key fields)
  const { data, error } = await SUPABASE
    .from('med_questions')
    .select('question_type, difficulty, question_text, concept_tags, payload')
    .eq('chapter_id', chapterId);

  if (error) {
    console.error('Error fetching chapter coverage:', error);
    return null;
  }

  // Also fetch pending/reviewed jobs for this chapter (not yet in DB)
  const { data: jobs } = await SUPABASE
    .from('med_generation_jobs')
    .select('output_json, status')
    .eq('chapter_id', chapterId)
    .in('status', ['pending', 'reviewed']);

  // Collect questions from pending jobs too
  const jobQuestions = [];
  (jobs || []).forEach(job => {
    (job.output_json?.questions || []).forEach(q => {
      jobQuestions.push({
        question_type: q.question_type,
        difficulty: q.difficulty,
        question_text: q.question_text,
        topic: q.topic,
        subtopic: q.subtopic
      });
    });
  });

  const allQuestions = [...(data || []), ...jobQuestions];

  // Analyze coverage
  const coverage = {
    total: allQuestions.length,
    byDifficulty: { easy: 0, medium: 0, hard: 0 },
    byType: {},
    byTopic: {},
    existingStems: []
  };

  allQuestions.forEach(q => {
    // Difficulty counts
    const diff = (q.difficulty || 'medium').toLowerCase();
    if (coverage.byDifficulty[diff] !== undefined) coverage.byDifficulty[diff]++;

    // Type counts
    const type = q.question_type || 'mcq';
    coverage.byType[type] = (coverage.byType[type] || 0) + 1;

    // Topic counts (from payload or direct field)
    const topic = q.topic || q.payload?.topic || 'Unknown';
    const subtopic = q.subtopic || q.payload?.subtopic || '';
    if (!coverage.byTopic[topic]) coverage.byTopic[topic] = { count: 0, subtopics: {} };
    coverage.byTopic[topic].count++;
    if (subtopic) {
      coverage.byTopic[topic].subtopics[subtopic] = (coverage.byTopic[topic].subtopics[subtopic] || 0) + 1;
    }

    // Collect stems for dedup (first 80 chars to keep prompt size manageable)
    if (q.question_text) {
      coverage.existingStems.push(q.question_text.substring(0, 80));
    }
  });

  return coverage;
}

function buildCoverageContext(coverage, topics) {
  if (!coverage || coverage.total === 0) {
    return `\nDATABASE STATUS: No questions exist yet for this chapter. This is a fresh start — generate a well-rounded set.\n`;
  }

  let ctx = `\n═══════════════════════════════════════════════════════════════════════════════
DATABASE ANALYSIS — EXISTING QUESTIONS FOR THIS CHAPTER: ${coverage.total} total
═══════════════════════════════════════════════════════════════════════════════

DIFFICULTY DISTRIBUTION:
- Easy: ${coverage.byDifficulty.easy} questions
- Medium: ${coverage.byDifficulty.medium} questions
- Hard: ${coverage.byDifficulty.hard} questions

QUESTION TYPE DISTRIBUTION:
${Object.entries(coverage.byType).map(([t, c]) => `- ${t}: ${c} questions`).join('\n')}

TOPIC COVERAGE:
`;

  // Show which topics have how many questions, and highlight gaps
  const topicNames = topics.map(t => t.name);
  const coveredTopics = [];
  const gapTopics = [];

  topicNames.forEach(tName => {
    const match = Object.entries(coverage.byTopic).find(
      ([k]) => k.toLowerCase().trim() === tName.toLowerCase().trim()
    );
    if (match) {
      const [, data] = match;
      coveredTopics.push(`- ${tName}: ${data.count} questions (subtopics: ${Object.keys(data.subtopics).join(', ') || 'various'})`);
    } else {
      gapTopics.push(tName);
    }
  });

  ctx += coveredTopics.join('\n');

  if (gapTopics.length > 0) {
    ctx += `\n\n⚠️ UNCOVERED TOPICS (PRIORITY — generate questions for these):
${gapTopics.map(t => `- ${t}: 0 questions — NEEDS COVERAGE`).join('\n')}`;
  }

  // Add dedup context (limit to 30 stems to avoid huge prompts)
  const stems = coverage.existingStems.slice(0, 30);
  if (stems.length > 0) {
    ctx += `\n\nEXISTING QUESTION STEMS (DO NOT duplicate these):
${stems.map((s, i) => `${i + 1}. "${s}..."`).join('\n')}`;
  }

  ctx += `\n
GENERATION STRATEGY:
1. PRIORITIZE uncovered topics listed above
2. For covered topics, focus on DIFFERENT subtopics and concepts
3. Balance difficulty distribution — generate more of what's missing
4. DO NOT create questions that test the same concept as existing ones
5. Each question should add NEW coverage to the question bank
═══════════════════════════════════════════════════════════════════════════════\n`;

  return ctx;
}

// ============================================================================
// PROMPT BUILDERS
// ============================================================================
function buildQuestionGenerationPrompt(params) {
  const { exam, examIds, subject, chapter, topics, questionTypes, count, difficulty, includeHints, coverage } = params;

  // Build topic list - always explicit
  let topicList;
  if (topics.length > 0) {
    topicList = topics.map(t => `- ${t.name}`).join('\n');
  } else {
    // No topics defined - use chapter's important_topics if available
    topicList = chapter.important_topics && chapter.important_topics.length > 0
      ? chapter.important_topics.map(t => `- ${t}`).join('\n')
      : `- General concepts from ${chapter.name}`;
  }

  const typeInstructions = {
    'mcq': 'Multiple Choice Question with 4 options (A, B, C, D)',
    'true-false': 'True/False statement — options must be: A="True", B="False", C="---", D="---"',
    'assertion-reasoning': 'Assertion-Reasoning format — question_text must contain "Assertion (A): ... \\nReason (R): ..." — use standard NEET options about A and R relationship',
    'match-the-following': 'Match the Following — question_text must contain "Column I: ... Column II: ..." with labeled items (P), (Q), (R) and (i), (ii), (iii)',
    'fill-in-blanks': 'Fill in the Blanks with one or more blanks (provide answer in correct_answer)',
    'diagram-based': 'Diagram-based question — MUST include "image_uri" (storage path like "question-images/{subject}/{chapter}/{id}.png") and "image_alt" (description of diagram). question_text describes what to observe in the diagram and asks the question',
    'logical-sequence': 'Logical Sequence — MUST include "items" array [{id, text}] for the steps/events and "correct_order" array of item IDs in correct sequence. Options should be different orderings like "P → Q → R → S"',
    'scenario-based': 'Scenario/Case-based — MUST include separate "scenario" field (3-5 sentence context paragraph). question_text contains ONLY the specific question. Do NOT put the scenario inside question_text'
  };

  const selectedTypes = questionTypes.map(t => `- ${typeInstructions[t] || t}`).join('\n');

  // Exam context
  const examName = exam === 'BOTH' ? 'NEET and CUET' : exam;
  const examContext = exam === 'NEET'
    ? 'NEET (National Eligibility cum Entrance Test) for medical admissions in India'
    : exam === 'CUET'
    ? 'CUET (Common University Entrance Test) for university admissions in India'
    : 'Both NEET (medical) and CUET (university) entrance exams in India';

  let prompt = `You are an expert ${examName} exam question creator for ${subject}.

TARGET EXAM: ${examContext}

TASK: Generate ${count} high-quality questions for ${examName} preparation.

═══════════════════════════════════════════════════════════════════════════════
IMPORTANT: Generate questions ONLY from the specific chapter and topics below.
DO NOT generate questions from other chapters or topics.
═══════════════════════════════════════════════════════════════════════════════

SUBJECT: ${subject}
CHAPTER: ${chapter.name}
CLASS: ${chapter.class_level || 'Not specified'}
WEIGHTAGE IN EXAM: ${chapter.weightage || 'Not specified'}%

TOPICS TO COVER (generate questions ONLY from these topics):
${topicList}

QUESTION TYPES TO GENERATE:
${selectedTypes}

DIFFICULTY: ${difficulty}
- easy: Direct recall, basic concepts
- medium: Application of concepts, moderate complexity
- hard: Multi-concept integration, analytical thinking
${coverage ? buildCoverageContext(coverage, topics) : ''}
OUTPUT FORMAT (JSON array):
\`\`\`json
[
  {
    "question_type": "mcq",
    "question_text": "The question stem here",
    "options": [
      { "key": "A", "text": "First option", "is_correct": false },
      { "key": "B", "text": "Second option", "is_correct": true },
      { "key": "C", "text": "Third option", "is_correct": false },
      { "key": "D", "text": "Fourth option", "is_correct": false }
    ],
    "correct_answer": "B",
    "explanation": "Detailed explanation of why B is correct and others are wrong",
    "difficulty": "${difficulty}",
    "exam_suitability": ["NEET", "CUET"],
    "topic": "Exact topic name from the list provided",
    "subtopic": "Specific subtopic/concept within the topic",
    "concept_tags": ["specific-concept-1", "specific-concept-2"],
    "bloom_level": "remember|understand|apply|analyze"${includeHints ? `,
    "elimination_hints": [
      { "option_key": "A", "hint": "Why A can be eliminated", "misconception": "Common mistake students make" },
      { "option_key": "C", "hint": "Why C can be eliminated", "misconception": "Common mistake students make" },
      { "option_key": "D", "hint": "Why D can be eliminated", "misconception": "Common mistake students make" }
    ]` : ''}
  }
]
\`\`\`

TAGGING REQUIREMENTS:
- "exam_suitability": Which exams this question is suitable for (${examIds.join(', ')})
- "topic": Must match exactly one of the topics provided above
- "subtopic": A specific concept within that topic (e.g., "Newton's Third Law" within "Newton Laws of Motion")
- "concept_tags": 2-4 specific concepts tested (for student weakness tracking)
- "bloom_level": Cognitive level - remember (recall), understand (explain), apply (use), analyze (compare/contrast)

IMPORTANT GUIDELINES:
1. CRITICAL: Generate questions ONLY from "${chapter.name}" chapter - NO questions from other chapters
2. Questions must be ${examName}-level, appropriate for Indian competitive exams
3. Each question should test a specific concept from the topics listed above
4. Distractors (wrong options) should be plausible, not obviously wrong
5. Explanations should be educational, helping students learn
6. Cover different topics from the list provided
7. For assertion-reasoning: question_text MUST contain "Assertion (A): ... \\nReason (R): ..."
8. For match-the-following: question_text MUST contain "Column I: ... Column II: ..." with labeled items
9. Match the difficulty and style expected in ${examName} exams

TYPE-SPECIFIC REQUIRED FIELDS (the app will break without these):
- diagram-based: MUST include "image_uri" (e.g. "question-images/physics/electrostatics/q-d01.png") and "image_alt" (description)
- scenario-based: MUST include separate "scenario" field (context paragraph). DO NOT put scenario in question_text
- logical-sequence: MUST include "items" array [{id:"1", text:"Step A"}, ...] and "correct_order" array ["2","1","4","3"]
- true-false: Options MUST be A="True", B="False", C="---", D="---"

Generate exactly ${count} questions from "${chapter.name}" ONLY. Output ONLY the JSON array, no additional text.`;

  return prompt;
}

function buildTeluguTranslationPrompt(questions) {
  const questionTexts = questions.map((q, i) => `
Question ${i + 1}:
Text: ${q.question_text}
Explanation: ${q.explanation || 'N/A'}
Options: ${q.options ? q.options.map(o => `${o.key}. ${o.text}`).join(' | ') : 'N/A'}
`).join('\n---\n');

  return `You are an expert translator for educational content from English to Telugu.

TASK: Translate the following NEET exam questions to Telugu.

GUIDELINES:
1. Maintain scientific accuracy - use correct Telugu technical terms
2. Keep the same meaning and nuance
3. Scientific terms can remain in English if commonly used that way in Telugu medium
4. Format should match the original structure

QUESTIONS TO TRANSLATE:
${questionTexts}

OUTPUT FORMAT (JSON array):
\`\`\`json
[
  {
    "index": 0,
    "question_text_te": "Telugu translation of question",
    "explanation_te": "Telugu translation of explanation",
    "options_te": [
      { "key": "A", "text_te": "Telugu option A" },
      { "key": "B", "text_te": "Telugu option B" },
      { "key": "C", "text_te": "Telugu option C" },
      { "key": "D", "text_te": "Telugu option D" }
    ]
  }
]
\`\`\`

Output ONLY the JSON array, no additional text.`;
}

// ============================================================================
// UI HELPERS
// ============================================================================
function showToast(message, type = 'info', duration = 3000) {
  // Remove existing toast
  const existing = document.querySelector('.qbank-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `qbank-toast toast-${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${type === 'success' ? '✓' : type === 'error' ? '✕' : type === 'warning' ? '!' : 'i'}</span>
    <span class="toast-message">${message}</span>
  `;

  document.body.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => toast.classList.add('show'));

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

function showLoader(container, message = 'Loading...') {
  const loader = document.createElement('div');
  loader.className = 'qbank-loader';
  loader.innerHTML = `
    <div class="loader-spinner"></div>
    <p class="loader-message">${message}</p>
  `;
  container.innerHTML = '';
  container.appendChild(loader);
}

function hideLoader(container) {
  const loader = container.querySelector('.qbank-loader');
  if (loader) loader.remove();
}

function createModal(title, content, actions = []) {
  const modal = document.createElement('div');
  modal.className = 'qbank-modal-overlay';
  modal.innerHTML = `
    <div class="qbank-modal">
      <div class="modal-header">
        <h3>${title}</h3>
        <button class="modal-close" onclick="this.closest('.qbank-modal-overlay').remove()">×</button>
      </div>
      <div class="modal-body">${content}</div>
      <div class="modal-actions">
        ${actions.map(a => `<button class="btn ${a.class || 'btn-secondary'}" onclick="${a.onclick}">${a.label}</button>`).join('')}
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  requestAnimationFrame(() => modal.classList.add('show'));
  return modal;
}

function closeModal(modal) {
  modal.classList.remove('show');
  setTimeout(() => modal.remove(), 300);
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function getSubjectColor(subjectId) {
  return getSubjectMeta(subjectId).color;
}

function getSubjectEmoji(subjectId) {
  return getSubjectMeta(subjectId).emoji;
}

function getDifficultyBadge(difficulty) {
  const badges = {
    'easy': '<span class="badge badge-easy">Easy</span>',
    'medium': '<span class="badge badge-medium">Medium</span>',
    'hard': '<span class="badge badge-hard">Hard</span>'
  };
  return badges[difficulty] || difficulty;
}

function getStatusBadge(status) {
  const badges = {
    'pending': '<span class="badge badge-pending">Pending Review</span>',
    'reviewed': '<span class="badge badge-reviewed">Reviewed</span>',
    'approved': '<span class="badge badge-approved">Approved</span>',
    'inserted': '<span class="badge badge-inserted">In Database</span>',
    'rejected': '<span class="badge badge-rejected">Rejected</span>'
  };
  return badges[status] || status;
}

function getQuestionTypeBadge(type) {
  const labels = {
    'mcq': 'MCQ',
    'true-false': 'T/F',
    'assertion-reasoning': 'A-R',
    'match-the-following': 'Match',
    'fill-in-blanks': 'Fill',
    'diagram-based': 'Diagram',
    'logical-sequence': 'Sequence',
    'scenario-based': 'Scenario'
  };
  return `<span class="badge badge-type">${labels[type] || type}</span>`;
}

// ============================================================================
// HTML ESCAPING (XSS prevention)
// ============================================================================
const _escapeEl = document.createElement('div');
function escapeHtml(str) {
  if (!str) return '';
  _escapeEl.textContent = str;
  return _escapeEl.innerHTML.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// ============================================================================
// NAVIGATION HEADER
// ============================================================================
function renderNavHeader() {
  const header = document.getElementById('nav-header');
  if (!header) return;

  const currentPage = window.location.pathname.split('/').pop().replace('.html', '');
  const isAdminUser = isAdmin();

  const navItems = [
    { id: 'index', label: 'Dashboard', icon: '📊', adminOnly: false },
    { id: 'generate', label: 'Generate', icon: '🤖', adminOnly: true },
    { id: 'review', label: 'Review', icon: '👁️', adminOnly: false },
    { id: 'insert', label: 'Insert', icon: '💾', adminOnly: true },
    { id: 'import', label: 'Import', icon: '📥', adminOnly: true },
    { id: 'bulkinsert', label: 'Bulk Insert', icon: '📦', adminOnly: true },
    { id: 'translate', label: 'Translate', icon: '🌐', adminOnly: true },
    { id: 'explore', label: 'Explore', icon: '🔍', adminOnly: false }
  ];

  const visibleItems = navItems.filter(item => !item.adminOnly || isAdminUser);

  header.innerHTML = `
    <div class="nav-brand">
      <span class="brand-icon">🎯</span>
      <span class="brand-text">Qbank Admin</span>
    </div>
    <nav class="nav-links">
      ${visibleItems.map(item => `
        <a href="./${item.id}.html" class="nav-link ${currentPage === item.id ? 'active' : ''}">
          <span class="nav-icon">${item.icon}</span>
          <span class="nav-label">${item.label}</span>
        </a>
      `).join('')}
    </nav>
    <div class="nav-user">
      <span class="user-name">${CURRENT_USER?.name || 'User'}</span>
      <span class="user-role badge ${isAdminUser ? 'badge-admin' : 'badge-reviewer'}">${CURRENT_USER?.role || 'guest'}</span>
      <button class="btn btn-sm btn-ghost" onclick="logout()">Logout</button>
    </div>
  `;
}

// ============================================================================
// JSON PARSER (handles markdown code blocks and common issues)
// ============================================================================
function parseJsonResponse(text) {
  let jsonStr = text.trim();

  // Try multiple patterns to extract JSON from markdown code blocks
  // Pattern 1: ```json ... ```
  let match = jsonStr.match(/```json\s*([\s\S]*?)```/);
  if (match) {
    jsonStr = match[1].trim();
  } else {
    // Pattern 2: ``` ... ``` (without json label)
    match = jsonStr.match(/```\s*([\s\S]*?)```/);
    if (match) {
      jsonStr = match[1].trim();
    }
  }

  // Pattern 3: If still starts with [ or {, use as-is
  // Pattern 4: Find first [ or { and last ] or }
  if (!jsonStr.startsWith('[') && !jsonStr.startsWith('{')) {
    const startBracket = jsonStr.indexOf('[');
    const startBrace = jsonStr.indexOf('{');
    const start = startBracket === -1 ? startBrace :
                  startBrace === -1 ? startBracket :
                  Math.min(startBracket, startBrace);

    if (start !== -1) {
      const isArray = jsonStr[start] === '[';
      const endChar = isArray ? ']' : '}';
      const end = jsonStr.lastIndexOf(endChar);
      if (end > start) {
        jsonStr = jsonStr.substring(start, end + 1);
      }
    }
  }

  // Try to fix common JSON issues
  function tryFixJson(str) {
    // Remove trailing commas before } or ]
    str = str.replace(/,(\s*[}\]])/g, '$1');

    // Fix unescaped newlines in strings (common LLM issue)
    // This is tricky - we need to be careful not to break valid JSON

    return str;
  }

  // First attempt: parse as-is
  try {
    return JSON.parse(jsonStr);
  } catch (firstError) {
    console.warn('First JSON parse attempt failed, trying fixes...');

    // Second attempt: try with fixes
    try {
      const fixedJson = tryFixJson(jsonStr);
      return JSON.parse(fixedJson);
    } catch (secondError) {
      // Third attempt: try to extract individual question objects
      console.warn('Fixed JSON parse failed, trying to extract objects...');

      try {
        // Find all complete JSON objects in the array
        const objects = [];
        let depth = 0;
        let start = -1;

        for (let i = 0; i < jsonStr.length; i++) {
          const char = jsonStr[i];
          if (char === '{') {
            if (depth === 0) start = i;
            depth++;
          } else if (char === '}') {
            depth--;
            if (depth === 0 && start !== -1) {
              const objStr = jsonStr.substring(start, i + 1);
              try {
                const obj = JSON.parse(tryFixJson(objStr));
                objects.push(obj);
              } catch (e) {
                // Skip malformed object
                console.warn('Skipping malformed object');
              }
              start = -1;
            }
          }
        }

        if (objects.length > 0) {
          console.log(`Recovered ${objects.length} questions from malformed JSON`);
          return objects;
        }
      } catch (thirdError) {
        // All attempts failed
      }

      console.error('JSON parse error:', firstError);
      console.log('Raw text (first 1000 chars):', text.substring(0, 1000));
      console.log('Attempted to parse (first 1000 chars):', jsonStr.substring(0, 1000));
      throw new Error('Failed to parse Gemini response as JSON. The AI response may be malformed.');
    }
  }
}

// ============================================================================
// QUALITY CHECKER — language-aware validators
// ============================================================================

// Issue type definitions (severity is the default; can be overridden)
const QUALITY_ISSUE_TYPES = {
  // Data integrity — critical issues that break the question
  EMPTY_QUESTION_TEXT:    { severity: 'high',   label: 'Empty question text' },
  QUESTION_TOO_SHORT:    { severity: 'high',   label: 'Question text too short' },
  EMPTY_OPTIONS:          { severity: 'high',   label: 'No answer options' },
  EMPTY_OPTION_TEXT:      { severity: 'high',   label: 'Option has empty text' },
  FEW_OPTIONS:            { severity: 'medium', label: 'Less than 4 options' },
  NO_CORRECT_ANSWER:      { severity: 'high',   label: 'No correct answer marked' },
  MULTIPLE_CORRECT:       { severity: 'medium', label: 'Multiple correct answers' },
  CORRECT_ID_MISMATCH:   { severity: 'high',   label: 'Correct answer key invalid' },
  DUPLICATE_OPTIONS:      { severity: 'high',   label: 'Duplicate option text' },

  // Type-specific — checks content in both question_text and payload
  IMAGE_URI_EMPTY:        { severity: 'high',   label: 'Diagram has no image' },
  ASSERTION_MALFORMED:    { severity: 'high',   label: 'Missing assertion or reason' },
  MTF_MALFORMED:          { severity: 'medium', label: 'Match columns not detected' },
  BLANKS_NO_BLANKS:       { severity: 'high',   label: 'Fill-in-blanks has no ___' },

  // Content quality
  EMPTY_EXPLANATION:      { severity: 'medium', label: 'No explanation' },
  NO_ELIMINATION_HINTS:   { severity: 'high',   label: 'No hints (mandatory for all types)' },

  // Data integrity — topic/chapter mapping
  MISSING_TOPIC_ID:       { severity: 'high',   label: 'No topic_id set' },
  MISSING_CHAPTER_ID:     { severity: 'high',   label: 'No chapter_id set' },

  // Type-specific payload issues (custom UI can't render)
  MTF_NO_COLUMN_DATA:     { severity: 'high',   label: 'MTF missing column A/B data (custom UI broken)' },
  SEQ_NO_ITEMS:           { severity: 'high',   label: 'Sequence question missing items list' },
  SEQ_INCOMPLETE_TEXT:    { severity: 'high',   label: 'Sequence question text has no items to arrange' },
  MTF_DUPLICATE_KEYS:     { severity: 'high',   label: 'MTF has duplicate option/column keys (drag broken)' },

  // Translation (parameterized via details.language)
  MISSING_TRANSLATION:    { severity: 'low',    label: 'Missing translation' },

  // User-reported
  USER_REPORTED:          { severity: 'medium', label: 'User reported issue' },

  // Runtime auto-detected (source: 'auto')
  IMAGE_LOAD_FAILED:      { severity: 'high',   label: 'Image failed to load' },
};

/**
 * Derive column suffix from language id.
 * Convention: language id 'te' → column suffix '_te', 'hi' → '_hi', etc.
 * This means adding a new language to med_languages automatically enables
 * translation quality checks — no code changes needed.
 */
function getLanguageSuffix(langId) {
  return '_' + langId;
}

// Translatable fields on med_questions
const QUESTION_TRANSLATABLE_FIELDS = ['question_text', 'explanation'];
// Translatable fields on med_question_options
const OPTION_TRANSLATABLE_FIELDS = ['option_text'];
// Translatable fields on med_elimination_hints
const HINT_TRANSLATABLE_FIELDS = ['hint_text', 'misconception'];

// Payload fields that need translation per question type
// Only checked if the English field actually exists in payload (rich payload pattern)
const PAYLOAD_TRANSLATABLE_FIELDS = {
  'assertion-reasoning': ['assertion', 'reason'],
  'scenario-based':      ['scenario'],
  'true-false':          ['statement'],
  'fill-in-blanks':     ['text_with_blanks'],
  'match-the-following': [],
  'logical-sequence':    [],
};

/**
 * Fetch active languages (non-English) from med_languages.
 * These are the languages we need translations for.
 */
let _cachedLanguages = null;
async function fetchActiveLanguages() {
  if (_cachedLanguages) return _cachedLanguages;
  if (!SUPABASE) return [];

  const { data, error } = await SUPABASE
    .from('med_languages')
    .select('id, label, native, emoji')
    .eq('is_active', true)
    .neq('id', 'en')
    .order('sort_order');

  if (error) {
    console.error('[quality] Failed to fetch languages:', error);
    return [];
  }

  _cachedLanguages = data || [];
  return _cachedLanguages;
}

/**
 * Run all quality validators on a set of questions.
 * Returns an array of issue objects ready for DB insert.
 *
 * @param {Array} questions - Full question rows with options and hints
 * @param {Array} languages - Active languages from fetchActiveLanguages()
 * @param {string} chapterId - The chapter being scanned
 * @returns {Array} issues
 */
function runQualityValidators(questions, languages, chapterId) {
  const issues = [];

  for (const q of questions) {
    const opts = q.options || q.med_question_options || [];
    const hints = q.hints || q.med_elimination_hints || [];
    const qText = (q.question_text || '').trim();
    const payload = q.payload || {};

    // ── Data integrity ──────────────────────────────────────
    if (!qText) {
      issues.push(makeIssue(q, chapterId, 'EMPTY_QUESTION_TEXT'));
    } else if (qText.length < 15) {
      issues.push(makeIssue(q, chapterId, 'QUESTION_TOO_SHORT', { length: qText.length }));
    }

    if (opts.length === 0 && q.question_type !== 'true-false') {
      issues.push(makeIssue(q, chapterId, 'EMPTY_OPTIONS'));
    } else if (opts.length > 0 && opts.length < 4 && q.question_type !== 'true-false') {
      issues.push(makeIssue(q, chapterId, 'FEW_OPTIONS', { optionCount: opts.length }));
    }

    if (opts.length > 0) {
      // Check for empty option text — skip C & D for true-false (placeholder by design)
      const isTFq = q.question_type === 'true-false';
      const emptyOpts = opts.filter(o => {
        if (isTFq && ['C', 'D'].includes((o.option_key || o.key || '').toUpperCase())) return false;
        const text = (o.option_text || o.text || '').trim();
        return !text;
      });
      if (emptyOpts.length > 0) {
        issues.push(makeIssue(q, chapterId, 'EMPTY_OPTION_TEXT', {
          emptyKeys: emptyOpts.map(o => o.option_key || o.key)
        }));
      }

      const correctOpts = opts.filter(o => o.is_correct);
      if (correctOpts.length === 0 && q.question_type !== 'true-false') {
        issues.push(makeIssue(q, chapterId, 'NO_CORRECT_ANSWER'));
      } else if (correctOpts.length > 1 && q.question_type === 'mcq') {
        issues.push(makeIssue(q, chapterId, 'MULTIPLE_CORRECT', {
          correctKeys: correctOpts.map(o => o.option_key || o.key)
        }));
      }

      // Check correct_answer key matches an option
      if (q.correct_answer && opts.length > 0) {
        const keys = opts.map(o => (o.option_key || o.key || '').toUpperCase());
        const caUpper = q.correct_answer.toUpperCase();
        if (!keys.includes(caUpper) || q.correct_answer.length > 2) {
          // Try to resolve the correct key via multiple strategies:
          // 1. Exact text match
          const textMatch = opts.find(o =>
            (o.option_text || o.text || '').trim().toLowerCase() === q.correct_answer.trim().toLowerCase()
          );
          // 2. Text contains / is contained in correct_answer
          const partialMatch = !textMatch && opts.find(o => {
            const oText = (o.option_text || o.text || '').trim().toLowerCase();
            const caText = q.correct_answer.trim().toLowerCase();
            return oText && caText && (oText.includes(caText) || caText.includes(oText));
          });
          // 3. is_correct flag on exactly one option
          const correctFlagOpts = opts.filter(o => o.is_correct === true);
          const flagMatch = !textMatch && !partialMatch && correctFlagOpts.length === 1
            ? correctFlagOpts[0] : null;

          const resolved = textMatch || partialMatch || flagMatch;
          const resolvedKey = resolved ? (resolved.option_key || resolved.key) : null;
          issues.push(makeIssue(q, chapterId, 'CORRECT_ID_MISMATCH', {
            correct_answer: q.correct_answer,
            available_keys: keys,
            resolvedKey  // non-null means auto-fixable
          }));
        }
      }

      // Duplicate option texts (case-sensitive — R vs r, M vs m matter in formulas)
      // For true-false, filter out placeholder "—" options (C & D) before checking
      const isTF = q.question_type === 'true-false';
      const textsToCheck = opts
        .filter(o => !isTF || ['A', 'B'].includes((o.option_key || o.key || '').toUpperCase()))
        .map(o => (o.option_text || o.text || '').trim())
        .filter(Boolean);
      const dupes = textsToCheck.filter((t, i) => textsToCheck.indexOf(t) !== i);
      if (dupes.length > 0) {
        issues.push(makeIssue(q, chapterId, 'DUPLICATE_OPTIONS', { duplicates: [...new Set(dupes)] }));
      }
    }

    // ── Type-specific ───────────────────────────────────────
    // Checks handle BOTH data patterns:
    //   Lean payload: content in question_text, payload = metadata only
    //   Rich payload: content in payload fields (CUET-style)

    switch (q.question_type) {
      case 'diagram-based': {
        const uri = payload.image_uri || payload.imageUri || q.image_url || '';
        if (!uri) {
          issues.push(makeIssue(q, chapterId, 'IMAGE_URI_EMPTY'));
        }
        break;
      }
      case 'assertion-reasoning': {
        // Rich payload: payload.assertion + payload.reason
        // Lean payload: "Assertion (A): ...\nReason (R): ..." in question_text
        const hasPayloadAR = (payload.assertion || '').trim() && (payload.reason || '').trim();
        const hasTextAssertion = /assertion\s*\(?a\)?/i.test(qText);
        const hasTextReason = /reason\s*\(?r\)?/i.test(qText);
        const hasTextAR = hasTextAssertion && hasTextReason;

        if (!hasPayloadAR && !hasTextAR) {
          issues.push(makeIssue(q, chapterId, 'ASSERTION_MALFORMED', {
            hasAssertion: hasPayloadAR || hasTextAssertion,
            hasReason: hasPayloadAR || hasTextReason
          }));
        }
        break;
      }
      case 'match-the-following': {
        // Rich payload: payload.column_a + payload.column_b
        // Lean payload: "Column A/B" or "Column I/II" or "Column-I/-II" or "Column 1/2" in question_text
        const hasPayloadCols = (Array.isArray(payload.column_a || payload.columnA) &&
          (payload.column_a || payload.columnA).length > 0);
        const hasTextCols = /column\s*[-_]?\s*[abI12]|match.*(?:following|column)/i.test(qText);

        if (!hasPayloadCols && !hasTextCols) {
          issues.push(makeIssue(q, chapterId, 'MTF_MALFORMED'));
        }
        break;
      }
      case 'fill-in-blanks': {
        const blanksText = payload.text_with_blanks || payload.textWithBlanks || qText;
        if (!blanksText.includes('___') && !blanksText.includes('______')) {
          issues.push(makeIssue(q, chapterId, 'BLANKS_NO_BLANKS'));
        }
        break;
      }
      case 'logical-sequence': {
        // Custom UI needs payload.items array with text for each item
        const seqItems = payload.items || payload.Items || [];
        if (!Array.isArray(seqItems) || seqItems.length === 0) {
          issues.push(makeIssue(q, chapterId, 'SEQ_NO_ITEMS'));
        } else {
          // Check if items have actual text content
          const emptyItems = seqItems.filter(it => !(it.text || '').trim());
          if (emptyItems.length > 0) {
            issues.push(makeIssue(q, chapterId, 'SEQ_NO_ITEMS', {
              emptyCount: emptyItems.length, total: seqItems.length
            }));
          }
        }
        // Also check question_text — "Arrange the following in the correct order." with no items is meaningless
        if (qText && /arrange.*following/i.test(qText) && !/\([ivxIVX]+\)|\d\)|\d\./.test(qText)) {
          // Text says "arrange the following" but doesn't list any items inline
          if (!Array.isArray(seqItems) || seqItems.length === 0) {
            issues.push(makeIssue(q, chapterId, 'SEQ_INCOMPLETE_TEXT'));
          }
        }
        break;
      }
      // scenario-based: content is in question_text — emptiness already caught above
    }

    // ── Match-the-following: custom UI needs column_a + column_b arrays ──
    if (q.question_type === 'match-the-following') {
      const colA = payload.column_a || payload.columnA || [];
      const colB = payload.column_b || payload.columnB || [];
      if (!Array.isArray(colA) || colA.length === 0 || !Array.isArray(colB) || colB.length === 0) {
        issues.push(makeIssue(q, chapterId, 'MTF_NO_COLUMN_DATA', {
          hasColumnA: Array.isArray(colA) && colA.length > 0,
          hasColumnB: Array.isArray(colB) && colB.length > 0
        }));
      }
      // Check for duplicate keys in columns or options — breaks drag-and-drop
      if (Array.isArray(colA) && colA.length > 0) {
        const aIds = colA.map(c => c.id);
        const bIds = (Array.isArray(colB) ? colB : []).map(c => c.id);
        const allIds = [...aIds, ...bIds];
        const dupeIds = allIds.filter((id, i) => allIds.indexOf(id) !== i);
        if (dupeIds.length > 0) {
          issues.push(makeIssue(q, chapterId, 'MTF_DUPLICATE_KEYS', {
            duplicateIds: [...new Set(dupeIds)]
          }));
        }
      }
      // Also check payload.options for duplicate IDs/keys
      const mtfOpts = payload.options || [];
      if (Array.isArray(mtfOpts) && mtfOpts.length > 0) {
        const optIds = mtfOpts.map(o => o.id || o.key).filter(Boolean);
        if (optIds.length > 0) {
          const dupeOptIds = optIds.filter((id, i) => optIds.indexOf(id) !== i);
          if (dupeOptIds.length > 0) {
            issues.push(makeIssue(q, chapterId, 'MTF_DUPLICATE_KEYS', {
              duplicateOptionIds: [...new Set(dupeOptIds)]
            }));
          }
        }
      }
    }

    // ── Data integrity: chapter & topic ──────────────────────
    if (!q.chapter_id) {
      issues.push(makeIssue(q, chapterId, 'MISSING_CHAPTER_ID'));
    }
    if (!q.topic_id) {
      issues.push(makeIssue(q, chapterId, 'MISSING_TOPIC_ID'));
    }

    // ── Content quality ─────────────────────────────────────
    if (!q.explanation || q.explanation.trim() === '') {
      issues.push(makeIssue(q, chapterId, 'EMPTY_EXPLANATION'));
    }

    if (hints.length === 0) {
      issues.push(makeIssue(q, chapterId, 'NO_ELIMINATION_HINTS'));
    }

    // ── Translation checks (per active language) ────────────
    for (const lang of languages) {
      const suffix = getLanguageSuffix(lang.id);

      const missingFields = [];

      // Check question-level translatable fields
      for (const field of QUESTION_TRANSLATABLE_FIELDS) {
        const colName = field + suffix;
        const value = q[colName];
        // Only flag if English field exists and translation is missing
        if (q[field] && q[field].trim() && (!value || !value.trim())) {
          missingFields.push(field);
        }
      }

      // Check options
      if (opts.length > 0) {
        const optsNeedingTranslation = opts.filter(o => {
          const engText = o.option_text || o.text || '';
          const teText = o['option_text' + suffix] || o['text' + suffix] || '';
          return engText.trim() && !teText.trim();
        });
        if (optsNeedingTranslation.length > 0) {
          missingFields.push(`options[${optsNeedingTranslation.map(o => o.option_key || o.key).join(',')}]`);
        }
      }

      // Check hints
      if (hints.length > 0) {
        const hintsNeedingTranslation = hints.filter(h => {
          const engText = h.hint_text || '';
          const teText = h['hint_text' + suffix] || '';
          return engText.trim() && !teText.trim();
        });
        if (hintsNeedingTranslation.length > 0) {
          missingFields.push(`hints[${hintsNeedingTranslation.map(h => h.option_key).join(',')}]`);
        }
      }

      // Check payload-level translatable fields
      const payloadFields = PAYLOAD_TRANSLATABLE_FIELDS[q.question_type] || [];
      for (const field of payloadFields) {
        const engValue = payload[field] || '';
        const teKey = field + suffix;
        const teValue = payload[teKey] || '';
        if (engValue.trim() && !teValue.trim()) {
          missingFields.push('payload.' + field);
        }
      }

      if (missingFields.length > 0) {
        issues.push(makeIssue(q, chapterId, 'MISSING_TRANSLATION', {
          language: lang.id,
          languageLabel: lang.label,
          fields: missingFields
        }));
      }
    }
  }

  return issues;
}

/**
 * Build an issue object ready for DB insert.
 */
function makeIssue(question, chapterId, issueType, details = {}) {
  const typeDef = QUALITY_ISSUE_TYPES[issueType] || { severity: 'medium', label: issueType };
  return {
    question_id: question.id,
    chapter_id: chapterId,
    issue_type: issueType,
    severity: typeDef.severity,
    source: 'explore',
    details: details,
    status: 'open'
  };
}

/**
 * Fetch full question data for a chapter (with options + hints) for scanning.
 * Dynamically includes translation columns for all active languages.
 */
async function fetchQuestionsForScan(chapterId) {
  if (!SUPABASE) return [];

  // Build dynamic translation column list from active languages
  const langs = await fetchActiveLanguages();
  const qLangCols = langs.flatMap(l => QUESTION_TRANSLATABLE_FIELDS.map(f => f + '_' + l.id)).join(', ');
  const optLangCols = langs.flatMap(l => OPTION_TRANSLATABLE_FIELDS.map(f => f + '_' + l.id)).join(', ');
  const hintLangCols = langs.flatMap(l => HINT_TRANSLATABLE_FIELDS.map(f => f + '_' + l.id)).join(', ');

  const selectStr = `
      id, subject_id, chapter_id, topic_id, question_type, difficulty, status,
      question_text, explanation, correct_answer, payload, image_url, concept_tags,
      corrected_at, last_translated_at
      ${qLangCols ? ', ' + qLangCols : ''},
      med_question_options (option_key, option_text, is_correct, sort_order${optLangCols ? ', ' + optLangCols : ''}),
      med_elimination_hints (option_key, hint_text, misconception${hintLangCols ? ', ' + hintLangCols : ''})
    `;

  const { data, error } = await SUPABASE
    .from('med_questions')
    .select(selectStr)
    .eq('chapter_id', chapterId)
    .in('status', ['active', 'draft']);

  if (error) {
    console.error('[quality] Failed to fetch questions for scan:', error);
    return [];
  }

  return data || [];
}

/**
 * Save quality issues to DB (insert, skip duplicates).
 * Returns { saved, skipped, savedIssues } where savedIssues has DB ids.
 */
async function saveQualityIssues(issues) {
  if (!SUPABASE || issues.length === 0) return { saved: 0, skipped: 0, savedIssues: [] };

  let saved = 0;
  let skipped = 0;
  const savedIssues = [];

  for (const issue of issues) {
    const { data, error } = await SUPABASE
      .from('med_quality_issues')
      .insert(issue)
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        skipped++;
      } else {
        console.error('[quality] Error saving issue:', error);
        skipped++;
      }
    } else {
      saved++;
      if (data) savedIssues.push(data);
    }
  }

  return { saved, skipped, savedIssues };
}

/**
 * Fetch existing quality issues for a chapter.
 */
async function fetchQualityIssues(chapterId, options = {}) {
  if (!SUPABASE) return [];

  let query = SUPABASE
    .from('med_quality_issues')
    .select('*')
    .eq('chapter_id', chapterId)
    .order('severity', { ascending: true })
    .order('created_at', { ascending: false });

  if (options.status) {
    query = query.eq('status', options.status);
  }
  if (options.issueType) {
    query = query.eq('issue_type', options.issueType);
  }

  const { data, error } = await query;
  if (error) {
    console.error('[quality] Failed to fetch issues:', error);
    return [];
  }
  return data || [];
}

/**
 * Resolve a quality issue.
 */
async function resolveQualityIssue(issueId, resolution = 'resolved') {
  if (!SUPABASE) return null;

  const { data, error } = await SUPABASE
    .from('med_quality_issues')
    .update({
      status: resolution,
      resolved_at: new Date().toISOString()
    })
    .eq('id', issueId)
    .select()
    .single();

  if (error) {
    console.error('[quality] Failed to resolve issue:', error);
    return null;
  }
  return data;
}

/**
 * Fetch open quality issue summary (counts by severity + affected chapters).
 * Lightweight query for dashboard cards.
 */
async function fetchQualityIssueSummary() {
  if (!SUPABASE) return { total: 0, high: 0, medium: 0, low: 0, chapters: 0 };

  const { data, error } = await SUPABASE
    .from('med_quality_issues')
    .select('severity, chapter_id')
    .eq('status', 'open');

  if (error) {
    console.error('[quality] Failed to fetch issue summary:', error);
    return { total: 0, high: 0, medium: 0, low: 0, chapters: 0 };
  }

  const issues = data || [];
  return {
    total: issues.length,
    high: issues.filter(i => i.severity === 'high').length,
    medium: issues.filter(i => i.severity === 'medium').length,
    low: issues.filter(i => i.severity === 'low').length,
    chapters: new Set(issues.map(i => i.chapter_id)).size
  };
}

/**
 * Clear all open explore-sourced issues for a chapter (before re-scan).
 */
async function clearExploreIssues(chapterId) {
  if (!SUPABASE) return;

  const { error } = await SUPABASE
    .from('med_quality_issues')
    .delete()
    .eq('chapter_id', chapterId)
    .eq('source', 'explore')
    .eq('status', 'open');

  if (error) {
    console.error('[quality] Failed to clear explore issues:', error);
  }
}

// ============================================================================
// AUTO-FIX: correct_answer text → option key
// ============================================================================

/**
 * For questions where correct_answer stores option text instead of the key,
 * find the matching option and update the DB to use the key (A/B/C/D).
 *
 * @param {Array} questions - Full question rows (from fetchQuestionsForScan)
 * @returns {{ fixed: number, skipped: number, errors: number, details: Array }}
 */
async function fixCorrectAnswerKeys(questions) {
  if (!SUPABASE) return { fixed: 0, skipped: 0, errors: 0, details: [] };

  const results = { fixed: 0, skipped: 0, errors: 0, details: [] };

  for (const q of questions) {
    const opts = q.options || q.med_question_options || [];
    const ca = (q.correct_answer || '').trim();
    if (!ca || !opts.length) { results.skipped++; continue; }

    // Already a valid key — skip
    const keys = opts.map(o => (o.option_key || o.key || '').toUpperCase());
    if (keys.includes(ca.toUpperCase()) && ca.length <= 2) {
      results.skipped++;
      continue;
    }

    // Try multiple strategies to find the correct option:
    // 1. Exact text match
    const exactMatch = opts.find(o => {
      const text = (o.option_text || o.text || '').trim();
      return text.toLowerCase() === ca.toLowerCase();
    });
    // 2. Partial text match (contains / is contained)
    const partialMatch = !exactMatch && opts.find(o => {
      const text = (o.option_text || o.text || '').trim().toLowerCase();
      const caLower = ca.toLowerCase();
      return text && caLower && (text.includes(caLower) || caLower.includes(text));
    });
    // 3. is_correct flag (exactly one option marked correct)
    const correctFlagOpts = opts.filter(o => o.is_correct === true);
    const flagMatch = !exactMatch && !partialMatch && correctFlagOpts.length === 1
      ? correctFlagOpts[0] : null;

    const match = exactMatch || partialMatch || flagMatch;
    if (!match) {
      results.skipped++;
      continue;
    }

    const correctKey = (match.option_key || match.key || '').toUpperCase();

    // Also set is_correct on the matching option (and clear others)
    const optionUpdates = opts.map(o => {
      const k = (o.option_key || o.key || '').toUpperCase();
      return SUPABASE
        .from('med_question_options')
        .update({ is_correct: k === correctKey })
        .eq('question_id', q.id)
        .eq('option_key', o.option_key || o.key);
    });

    const { error } = await SUPABASE
      .from('med_questions')
      .update({ correct_answer: correctKey, corrected_at: new Date().toISOString() })
      .eq('id', q.id);

    if (error) {
      console.error(`[fix] Failed to update ${q.id}:`, error);
      results.errors++;
      results.details.push({ id: q.id, status: 'error', error: error.message });
    } else {
      // Fire option updates (best-effort)
      await Promise.all(optionUpdates);
      results.fixed++;
      results.details.push({ id: q.id, status: 'fixed', from: ca, to: correctKey });
    }
  }

  return results;
}

// ============================================================================
// AUTO-FIX: add missing options to a question
// ============================================================================

/**
 * Insert options for a question that has none, and set correct_answer.
 *
 * @param {string} questionId
 * @param {{ key: string, text: string }[]} options - e.g. [{key:'A', text:'180 litres'}, ...]
 * @param {string} correctKey - e.g. 'A'
 * @returns {{ success: boolean, error?: string }}
 */
async function fixEmptyOptions(questionId, options, correctKey) {
  if (!SUPABASE) return { success: false, error: 'Supabase not initialized' };

  const optionRecords = options.map((opt, idx) => ({
    question_id: questionId,
    option_key: opt.key,
    option_text: opt.text,
    is_correct: opt.key === correctKey,
    sort_order: idx
  }));

  const { error: optErr } = await SUPABASE
    .from('med_question_options')
    .insert(optionRecords);

  if (optErr) {
    console.error('[fix] Failed to insert options:', optErr);
    return { success: false, error: optErr.message };
  }

  const { error: qErr } = await SUPABASE
    .from('med_questions')
    .update({ correct_answer: correctKey, corrected_at: new Date().toISOString() })
    .eq('id', questionId);

  if (qErr) {
    console.error('[fix] Failed to update correct_answer:', qErr);
    return { success: false, error: qErr.message };
  }

  return { success: true };
}

// ============================================================================
// AUTO-FIX: MTF payload — parse columnA/columnB from question_text
// ============================================================================

/**
 * Fix MTF questions that are missing columnA/columnB in payload.
 * Parses the question_text to extract column items and derives correctMapping
 * from the correct option text.
 *
 * @param {Array} questions - Full question rows (from fetchQuestionsForScan)
 * @returns {{ fixed: number, skipped: number, errors: number, details: Array }}
 */
async function fixMTFPayload(questions) {
  if (!SUPABASE) return { fixed: 0, skipped: 0, errors: 0, details: [] };

  const results = { fixed: 0, skipped: 0, errors: 0, details: [] };

  for (const q of questions) {
    if (q.question_type !== 'match-the-following') { results.skipped++; continue; }

    const payload = q.payload || {};
    // Skip if already has column data
    const existingColA = payload.column_a || payload.columnA || [];
    const existingColB = payload.column_b || payload.columnB || [];
    if (Array.isArray(existingColA) && existingColA.length > 0 &&
        Array.isArray(existingColB) && existingColB.length > 0) {
      results.skipped++;
      continue;
    }

    const text = q.question_text || '';
    if (!text) { results.skipped++; continue; }

    // Parse columns from question text
    const parsed = _parseMTFColumns(text);
    if (parsed.columnA.length < 2 || parsed.columnB.length < 2) {
      results.skipped++;
      results.details.push({
        id: q.id,
        status: 'skipped',
        reason: `Parsed colA=${parsed.columnA.length}, colB=${parsed.columnB.length}`
      });
      continue;
    }

    // Derive correctMapping from the correct option
    const opts = q.med_question_options || q.options || [];
    const correctOpt = opts.find(o => o.is_correct === true) ||
                       opts.find(o => (o.option_key || o.key) === q.correct_answer);
    let mapping = {};
    if (correctOpt) {
      mapping = _parseOptionMapping(correctOpt.option_text || correctOpt.text || '');
    }

    // Ensure all column IDs are unique using indexed scheme (a-0, b-0, etc.)
    // This handles: intra-column dupes, cross-column overlap, and missing IDs
    const allParsedIds = [...parsed.columnA.map(c => c.id), ...parsed.columnB.map(c => c.id)];
    const needsDedup = allParsedIds.some((id, i) => allParsedIds.indexOf(id) !== i)
                    || allParsedIds.some(id => id === undefined || id === null || id === '');
    if (needsDedup) {
      const aIdMap = {};
      const bIdMap = {};
      parsed.columnA.forEach((item, i) => { aIdMap[item.id] = 'a-' + i; });
      parsed.columnB.forEach((item, i) => { bIdMap[item.id] = 'b-' + i; });
      parsed.columnA = parsed.columnA.map((item, i) => ({ ...item, id: 'a-' + i }));
      parsed.columnB = parsed.columnB.map((item, i) => ({ ...item, id: 'b-' + i }));
      // Update mapping to use new IDs
      const newMapping = {};
      for (const [k, v] of Object.entries(mapping)) {
        newMapping[aIdMap[k] || k] = bIdMap[v] || v;
      }
      mapping = newMapping;
    }

    // Update payload in DB — remove stale snake_case keys
    const newPayload = { ...payload };
    delete newPayload.column_a;
    delete newPayload.column_b;
    delete newPayload.correct_mapping;
    newPayload.columnA = parsed.columnA;
    newPayload.columnB = parsed.columnB;
    newPayload.correctMapping = mapping;

    const { error } = await SUPABASE
      .from('med_questions')
      .update({ payload: newPayload, corrected_at: new Date().toISOString() })
      .eq('id', q.id);

    if (error) {
      console.error(`[fixMTF] Failed to update ${q.id}:`, error);
      results.errors++;
      results.details.push({ id: q.id, status: 'error', error: error.message });
    } else {
      results.fixed++;
      results.details.push({
        id: q.id,
        status: 'fixed',
        colA: parsed.columnA.length,
        colB: parsed.columnB.length,
        mappingKeys: Object.keys(mapping).length
      });
    }
  }

  return results;
}

// ============================================================================
// AUTO-FIX: MTF duplicate column keys — prefix Column B IDs with "b-"
// ============================================================================

/**
 * Fix MTF questions with duplicate keys. Handles TWO cases:
 *   1. Column A/B ID overlap → prefix Column B IDs with "b-"
 *   2. Duplicate option_key in med_question_options → reassign unique keys (A, B, C, D)
 *
 * @param {Array} questions - Full question rows (from fetchQuestionsForScan)
 * @returns {{ fixed: number, skipped: number, errors: number, details: Array }}
 */
async function fixMTFDuplicateKeys(questions) {
  if (!SUPABASE) return { fixed: 0, skipped: 0, errors: 0, details: [] };

  const results = { fixed: 0, skipped: 0, errors: 0, details: [] };
  const OPTION_KEYS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

  for (const q of questions) {
    if (q.question_type !== 'match-the-following') { results.skipped++; continue; }

    const fixes = [];
    let payloadDirty = false;

    // Use a MUTABLE copy of the payload — all cases accumulate changes here,
    // then we do a SINGLE DB write at the end. Previous bug: Case 3 was
    // spreading the original payload, undoing Case 1's column-overlap fix.
    const payload = { ...(q.payload || {}) };

    // Normalize: remove snake_case keys upfront, keep only camelCase
    // (bulk-import writes column_a/column_b; we standardize to columnA/columnB)
    if (payload.column_a && !payload.columnA) payload.columnA = payload.column_a;
    if (payload.column_b && !payload.columnB) payload.columnB = payload.column_b;
    if (payload.correct_mapping && !payload.correctMapping) payload.correctMapping = payload.correct_mapping;
    delete payload.column_a;
    delete payload.column_b;
    delete payload.correct_mapping;

    // ── Case 1: Ensure ALL column IDs are unique (within + across columns) ──
    // The validator flags duplicates in [...colA ids, ...colB ids] combined,
    // so we must fix: (a) missing/undefined IDs, (b) intra-column dupes,
    // (c) cross-column overlap.
    let colA = Array.isArray(payload.columnA) ? payload.columnA : [];
    let colB = Array.isArray(payload.columnB) ? payload.columnB : [];

    if (colA.length > 0 || colB.length > 0) {
      // Collect all IDs to check for ANY duplicates (same logic as validator)
      const allIdsBefore = [...colA.map(c => c.id), ...colB.map(c => c.id)];
      const hasDupes = allIdsBefore.some((id, i) => allIdsBefore.indexOf(id) !== i)
                    || allIdsBefore.some(id => id === undefined || id === null || id === '');

      if (hasDupes) {
        // Assign guaranteed-unique IDs: Column A gets "a-0", "a-1", ...
        // Column B gets "b-0", "b-1", ... — no possibility of overlap
        payload.columnA = colA.map((item, i) => ({ ...item, id: 'a-' + i }));
        payload.columnB = colB.map((item, i) => ({ ...item, id: 'b-' + i }));

        // Rebuild correctMapping: old A id → new A id, old B id → new B id
        const oldMapping = payload.correctMapping || {};
        if (Object.keys(oldMapping).length > 0) {
          const aIdMap = {};  // old colA id → new colA id
          const bIdMap = {};  // old colB id → new colB id
          colA.forEach((item, i) => { aIdMap[item.id] = 'a-' + i; });
          colB.forEach((item, i) => { bIdMap[item.id] = 'b-' + i; });

          const newMapping = {};
          for (const [oldAId, oldBId] of Object.entries(oldMapping)) {
            const newAId = aIdMap[oldAId] || oldAId;
            const newBId = bIdMap[oldBId] || oldBId;
            newMapping[newAId] = newBId;
          }
          payload.correctMapping = newMapping;
        }

        payloadDirty = true;
        fixes.push('column-ids-deduped');
      }
    }

    // ── Case 2: Duplicate option_key in med_question_options ──
    const opts = q.med_question_options || [];
    if (Array.isArray(opts) && opts.length > 0) {
      const optKeys = opts.map(o => o.option_key);
      const hasDupeOpts = optKeys.some((k, i) => optKeys.indexOf(k) !== i);
      if (hasDupeOpts) {
        const { data: dbOpts, error: fetchErr } = await SUPABASE
          .from('med_question_options')
          .select('id, option_key, is_correct, sort_order')
          .eq('question_id', q.id)
          .order('sort_order');

        // NOTE: Do NOT use `continue` on error here — Case 1 may have set
        // payloadDirty, and we must still reach the payload write at the end.
        if (fetchErr || !dbOpts || dbOpts.length === 0) {
          console.error(`[fixMTFDuplicateKeys] Failed to fetch options for ${q.id}:`, fetchErr);
          fixes.push('duplicate-option-keys:error:' + (fetchErr?.message || 'no options'));
        } else {
          const correctOpt = dbOpts.find(o => o.is_correct === true);
          const correctIdx = correctOpt ? dbOpts.indexOf(correctOpt) : -1;

          let optFixFailed = false;
          for (let i = 0; i < dbOpts.length; i++) {
            const newKey = OPTION_KEYS[i] || `opt_${i}`;
            const { error: upErr } = await SUPABASE
              .from('med_question_options')
              .update({ option_key: newKey })
              .eq('id', dbOpts[i].id);
            if (upErr) {
              console.error(`[fixMTFDuplicateKeys] Failed to update option ${dbOpts[i].id}:`, upErr);
              optFixFailed = true;
            }
          }

          if (optFixFailed) {
            fixes.push('duplicate-option-keys:partial-error');
          } else {
            if (correctIdx >= 0) {
              const newCorrectKey = OPTION_KEYS[correctIdx] || `opt_${correctIdx}`;
              await SUPABASE
                .from('med_questions')
                .update({ correct_answer: newCorrectKey, corrected_at: new Date().toISOString() })
                .eq('id', q.id);
            }

            const { data: dbHints } = await SUPABASE
              .from('med_elimination_hints')
              .select('id, option_key')
              .eq('question_id', q.id)
              .order('option_key');
            if (dbHints && dbHints.length > 0) {
              const keyMap = {};
              for (let i = 0; i < dbOpts.length; i++) {
                keyMap[dbOpts[i].option_key] = OPTION_KEYS[i] || `opt_${i}`;
              }
              for (const hint of dbHints) {
                const newKey = keyMap[hint.option_key];
                if (newKey && newKey !== hint.option_key) {
                  await SUPABASE
                    .from('med_elimination_hints')
                    .update({ option_key: newKey })
                    .eq('id', hint.id);
                }
              }
            }

            fixes.push('duplicate-option-keys');
          }
        }
      }
    }

    // ── Case 3: Duplicate IDs in payload.options (JSONB) ──
    const payloadOpts = payload.options || [];
    if (Array.isArray(payloadOpts) && payloadOpts.length > 0) {
      const pIds = payloadOpts.map(o => o.id || o.key).filter(Boolean);
      const hasDupePayloadOpts = pIds.length > 0 && pIds.some((id, i) => pIds.indexOf(id) !== i);
      if (hasDupePayloadOpts) {
        payload.options = payloadOpts.map((o, i) => ({
          ...o,
          id: OPTION_KEYS[i] || `opt_${i}`
        }));
        payloadDirty = true;
        fixes.push('payload-options-dupes');
      }
    }

    // ── Single DB write for all payload changes ──
    if (payloadDirty) {
      const { error } = await SUPABASE
        .from('med_questions')
        .update({ payload, corrected_at: new Date().toISOString() })
        .eq('id', q.id);

      if (error) {
        console.error(`[fixMTFDuplicateKeys] Failed to update payload for ${q.id}:`, error);
        results.errors++;
        results.details.push({ id: q.id, status: 'error', fixes, error: error.message });
        continue;
      }
    }

    if (fixes.length > 0) {
      results.fixed++;
      results.details.push({ id: q.id, status: 'fixed', fixes });
    } else {
      results.skipped++;
    }
  }

  return results;
}

// ============================================================================
// AUTO-FIX: Backfill missing elimination hints
// ============================================================================

/**
 * For questions flagged NO_ELIMINATION_HINTS, insert hints into med_elimination_hints.
 *
 * Tries two sources in order:
 *   1. payload.elimination_hints (future imports will store these)
 *   2. sourceData — array of source JSON questions matched by question_text
 *
 * @param {Array} questions  - DB question rows (from fetchQuestionsForScan)
 * @param {Array} sourceData - Optional: parsed source JSON questions with elimination_hints
 * @returns {{ fixed: number, skipped: number, errors: number, details: Array }}
 */
async function fixMissingHints(questions, sourceData) {
  if (!SUPABASE) return { fixed: 0, skipped: 0, errors: 0, details: [] };

  const results = { fixed: 0, skipped: 0, errors: 0, details: [] };

  // Build lookup from source data by normalised question_text
  const sourceMap = new Map();
  if (Array.isArray(sourceData)) {
    for (const sq of sourceData) {
      if (sq.elimination_hints && sq.elimination_hints.length > 0) {
        const key = _normalizeText(sq.question_text || '');
        if (key) sourceMap.set(key, sq.elimination_hints);
      }
    }
  }

  for (const q of questions) {
    // Check if hints already exist in the table (avoid duplicates)
    const { data: existing } = await SUPABASE
      .from('med_elimination_hints')
      .select('option_key')
      .eq('question_id', q.id);

    if (existing && existing.length > 0) {
      results.skipped++;
      continue;
    }

    // Source 1: payload.elimination_hints
    const payload = q.payload || {};
    let rawHints = payload.elimination_hints || [];

    // Source 2: match from uploaded source JSON by question text
    if ((!Array.isArray(rawHints) || rawHints.length === 0) && sourceMap.size > 0) {
      const key = _normalizeText(q.question_text || '');
      rawHints = sourceMap.get(key) || [];
    }

    if (!Array.isArray(rawHints) || rawHints.length === 0) {
      results.skipped++;
      results.details.push({ id: q.id, status: 'skipped', reason: 'No hints in payload or source' });
      continue;
    }

    // Insert hints — handle both formats:
    //   1. Array of objects: [{option_key, hint, misconception}]
    //   2. Array of strings: ["A incorrectly assumes...", "B ignores..."]
    const hintRecords = rawHints.map(h => {
      if (typeof h === 'string') {
        // Parse option key from start of string: "A incorrectly..." → key="A", text="incorrectly..."
        const match = h.match(/^([A-D])\s+(.+)$/s);
        if (match) {
          return { question_id: q.id, option_key: match[1], hint_text: match[2].trim(), misconception: '' };
        }
        return null;
      }
      return {
        question_id: q.id,
        option_key: h.option_key,
        hint_text: h.hint || h.hint_text || '',
        misconception: h.misconception || ''
      };
    }).filter(h => h && h.option_key && h.hint_text);

    if (hintRecords.length === 0) {
      results.skipped++;
      results.details.push({ id: q.id, status: 'skipped', reason: 'Hints have no text' });
      continue;
    }

    const { error } = await SUPABASE
      .from('med_elimination_hints')
      .insert(hintRecords);

    if (error) {
      console.error(`[fixMissingHints] Failed to insert hints for ${q.id}:`, error);
      results.errors++;
      results.details.push({ id: q.id, status: 'error', error: error.message });
    } else {
      results.fixed++;
      results.details.push({ id: q.id, status: 'fixed', hintsInserted: hintRecords.length });
    }
  }

  return results;
}

/**
 * Diagnose existing elimination hints for a given exam tag.
 * Returns counts of good vs bad hints, plus sample bad rows.
 */
async function auditHints(examTag) {
  const PAGE = 1000;
  let from = 0;
  let totalQuestions = 0, withHints = 0, withoutHints = 0;
  let goodHints = 0, badHints = 0;
  const badSamples = [];

  while (true) {
    const { data: questions, error } = await SUPABASE
      .from('med_questions')
      .select('id, question_text')
      .contains('tags', [examTag])
      .range(from, from + PAGE - 1);

    if (error) throw error;
    if (!questions || questions.length === 0) break;

    for (const q of questions) {
      totalQuestions++;
      const { data: hints } = await SUPABASE
        .from('med_elimination_hints')
        .select('*')
        .eq('question_id', q.id);

      if (!hints || hints.length === 0) {
        withoutHints++;
        continue;
      }

      withHints++;
      for (const h of hints) {
        const isGood = h.option_key && /^[A-D]$/.test(h.option_key) && h.hint_text && h.hint_text.length > 5;
        if (isGood) {
          goodHints++;
        } else {
          badHints++;
          if (badSamples.length < 10) {
            badSamples.push({
              question_id: h.question_id,
              option_key: h.option_key,
              hint_text: (h.hint_text || '').substring(0, 80),
              misconception: h.misconception
            });
          }
        }
      }
    }

    if (questions.length < PAGE) break;
    from += PAGE;
  }

  return { totalQuestions, withHints, withoutHints, goodHints, badHints, badSamples };
}

/** Normalize text for fuzzy matching — lowercase, collapse whitespace, strip punctuation */
function _normalizeText(text) {
  return (text || '').toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim();
}

// ============================================================================
// AUTO-FIX: Backfill missing sequence items from question_text
// ============================================================================

/**
 * For sequence questions flagged SEQ_NO_ITEMS, parse numbered items from
 * question_text and derive correct_order from the correct option.
 *
 * @param {Array} questions - Full question rows (from fetchQuestionsForScan)
 * @returns {{ fixed: number, skipped: number, errors: number, details: Array }}
 */
async function fixMissingSequenceItems(questions) {
  if (!SUPABASE) return { fixed: 0, skipped: 0, errors: 0, details: [] };

  const results = { fixed: 0, skipped: 0, errors: 0, details: [] };

  for (const q of questions) {
    if (q.question_type !== 'logical-sequence') { results.skipped++; continue; }

    const payload = q.payload || {};
    // Skip if already has items
    if (Array.isArray(payload.items) && payload.items.length > 0) {
      results.skipped++;
      continue;
    }

    const text = q.question_text || '';
    const items = _parseSequenceItems(text);
    if (items.length < 2) {
      results.skipped++;
      results.details.push({ id: q.id, status: 'skipped', reason: `Parsed ${items.length} items` });
      continue;
    }

    // Derive correct_order from the correct option
    const opts = q.med_question_options || q.options || [];
    const correctOpt = opts.find(o => o.is_correct === true) ||
                       opts.find(o => (o.option_key || o.key) === q.correct_answer);
    let correctOrder = [];
    if (correctOpt) {
      correctOrder = _parseSequenceOrder(correctOpt.option_text || correctOpt.text || '');
    }

    const newPayload = { ...payload, items };
    if (correctOrder.length >= 2) newPayload.correct_order = correctOrder;

    const { error } = await SUPABASE
      .from('med_questions')
      .update({ payload: newPayload, corrected_at: new Date().toISOString() })
      .eq('id', q.id);

    if (error) {
      console.error(`[fixSeqItems] Failed to update ${q.id}:`, error);
      results.errors++;
      results.details.push({ id: q.id, status: 'error', error: error.message });
    } else {
      results.fixed++;
      results.details.push({ id: q.id, status: 'fixed', itemCount: items.length, hasOrder: correctOrder.length >= 2 });
    }
  }

  return results;
}

// ============================================================================
// EXPORT FOR USE IN HTML
// ============================================================================
window.Qbank = {
  // Config
  loadConfig,

  // Auth
  authenticate,
  requireAuth,
  isAdmin,
  logout,
  getSession,

  // Exam & Subject mapping
  EXAM_CONFIG,
  SUBJECT_META,
  getExamConfig,
  getExamSubjects,
  getSubjectMeta,
  normalizeId,
  normalizeIds,

  // Supabase
  get supabase() { return SUPABASE; },
  initSupabase,
  fetchSubjects,
  fetchChapters,
  fetchTopics,
  fetchGenerationJobs,
  createGenerationJob,
  updateGenerationJob,
  resolveTopicId,
  insertQuestions,
  insertQuestionOptions,
  insertEliminationHints,
  insertJobQuestionsToDb,
  insertApprovedQuestionsToDb,
  autoInsertOldJobs,
  getAutoInsertTimeRemaining,
  getQuestionStats,
  fetchQuestionsByChapter,
  fetchQuestionDetails,
  fetchQuestionsCountByChapter,
  fetchTypeDistribution,
  fetchTopicCountsByChapter,
  updateQuestionStatus,
  bulkUpdateQuestionStatus,

  // AI Generation
  callGemini,
  getTokenUsage,
  buildQuestionGenerationPrompt,
  buildTeluguTranslationPrompt,
  parseJsonResponse,
  fetchChapterCoverage,
  buildCoverageContext,

  // UI
  escapeHtml,
  showToast,
  showLoader,
  hideLoader,
  createModal,
  closeModal,
  formatDate,
  getSubjectColor,
  getSubjectEmoji,
  getDifficultyBadge,
  getStatusBadge,
  getQuestionTypeBadge,
  renderNavHeader,

  // Quality checker
  QUALITY_ISSUE_TYPES,
  fetchActiveLanguages,
  runQualityValidators,
  fetchQuestionsForScan,
  saveQualityIssues,
  fetchQualityIssues,
  fetchQualityIssueSummary,
  resolveQualityIssue,
  clearExploreIssues,
  fixCorrectAnswerKeys,
  fixEmptyOptions,
  fixMTFPayload,
  fixMTFDuplicateKeys,
  fixMissingHints,
  auditHints,
  fixMissingSequenceItems,

  // State access
  get config() { return CONFIG; },
  get user() { return CURRENT_USER; },
  get supabase() { return SUPABASE; }
};
