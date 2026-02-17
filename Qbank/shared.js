/**
 * Qbank Admin - Shared Utilities
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
    subjects: ['MATHEMATICS', 'BIOLOGY', 'PHYSICS', 'CHEMISTRY', 'ACCOUNTANCY', 'BUSINESS-STUDIES', 'ECONOMICS']
  }
};

const SUBJECT_META = {
  'PHYSICS':          { name: 'Physics',          emoji: '⚡', color: '#3b82f6', bg: '#dbeafe' },
  'CHEMISTRY':        { name: 'Chemistry',        emoji: '🧪', color: '#10b981', bg: '#d1fae5' },
  'BOTANY':           { name: 'Botany',           emoji: '🌿', color: '#22c55e', bg: '#dcfce7' },
  'ZOOLOGY':          { name: 'Zoology',          emoji: '🦁', color: '#f59e0b', bg: '#fef3c7' },
  'MATHEMATICS':      { name: 'Mathematics',      emoji: '📐', color: '#ef4444', bg: '#fee2e2' },
  'BIOLOGY':          { name: 'Biology',          emoji: '🧬', color: '#8b5cf6', bg: '#ede9fe' },
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

async function fetchChapters(subjectId = null) {
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
        topic_id: null, // Will be matched later if needed
        exam_ids: q.exam_suitability || job.exam_ids || ['NEET'],
        question_type: q.question_type,
        difficulty: q.difficulty || 'medium',
        strength_required: 'just-started',
        question_text: q.question_text,
        explanation: q.explanation,
        payload: {
          subtopic: q.subtopic,
          bloom_level: q.bloom_level,
          topic_name: q.topic
        },
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
        topic_id: null,
        exam_ids: q.exam_suitability || job.exam_ids || ['NEET'],
        question_type: q.question_type,
        difficulty: q.difficulty || 'medium',
        strength_required: 'just-started',
        question_text: q.question_text,
        explanation: q.explanation,
        payload: {
          subtopic: q.subtopic,
          bloom_level: q.bloom_level,
          topic_name: q.topic
        },
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
  const { data, error } = await SUPABASE
    .from('med_questions')
    .select('subject_id, question_type, difficulty, status');

  if (error) {
    console.error('Error fetching stats:', error);
    return null;
  }
  return data;
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

async function fetchQuestionsCountByChapter(subjectId) {
  if (!SUPABASE) return {};
  const { data, error } = await SUPABASE
    .from('med_questions')
    .select('chapter_id, status')
    .ilike('subject_id', subjectId);

  if (error) {
    console.error('Error fetching question counts:', error);
    return {};
  }

  // Group by chapter_id and status
  const counts = {};
  (data || []).forEach(q => {
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
// PROMPT BUILDERS
// ============================================================================
function buildQuestionGenerationPrompt(params) {
  const { exam, examIds, subject, chapter, topics, questionTypes, count, difficulty, includeHints } = params;

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
    'true-false': 'True/False statement',
    'assertion-reasoning': 'Assertion-Reasoning format with Assertion (A) and Reason (R) - use standard NEET options',
    'match-the-following': 'Match the Following with Column A and Column B items (4-5 items each)',
    'fill-in-blanks': 'Fill in the Blanks with one or more blanks (provide answer in correct_answer)',
    'diagram-based': 'Diagram-based question - describe the diagram/figure clearly, then ask question about it',
    'logical-sequence': 'Logical Sequence - arrange steps/events/processes in correct order',
    'scenario-based': 'Scenario/Case-based question - present a situation/case study, then ask analytical questions'
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
7. For assertion-reasoning: use standard format with options about A and R relationship
8. For match-the-following: provide clear matching pairs
9. Match the difficulty and style expected in ${examName} exams

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
    { id: 'translate', label: 'Translate', icon: '🌐', adminOnly: true }
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
  initSupabase,
  fetchSubjects,
  fetchChapters,
  fetchTopics,
  fetchGenerationJobs,
  createGenerationJob,
  updateGenerationJob,
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
  updateQuestionStatus,
  bulkUpdateQuestionStatus,

  // Gemini
  callGemini,
  getTokenUsage,
  buildQuestionGenerationPrompt,
  buildTeluguTranslationPrompt,
  parseJsonResponse,

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

  // State access
  get config() { return CONFIG; },
  get user() { return CURRENT_USER; },
  get supabase() { return SUPABASE; }
};
