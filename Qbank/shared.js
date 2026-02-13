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

  await loadConfig();
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

  // Load Supabase from CDN if not already loaded
  if (!window.supabase) {
    await loadScript('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js');
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
  const { data, error } = await SUPABASE
    .from('med_subjects')
    .select('*')
    .order('sort_order');

  if (error) {
    console.error('Error fetching subjects:', error);
    return [];
  }

  // Filter by user's allowed subjects
  if (CURRENT_USER && CURRENT_USER.role === 'reviewer') {
    return data.filter(s => CURRENT_USER.subjects.includes(s.id));
  }

  return data;
}

async function fetchChapters(subjectId = null) {
  let query = SUPABASE
    .from('med_chapters')
    .select('*')
    .order('chapter_number');

  if (subjectId) {
    query = query.eq('subject_id', subjectId);
  } else if (CURRENT_USER?.role === 'reviewer') {
    query = query.in('subject_id', CURRENT_USER.subjects);
  }

  const { data, error } = await query;
  if (error) {
    console.error('Error fetching chapters:', error);
    return [];
  }
  return data;
}

async function fetchTopics(chapterId) {
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
  let query = SUPABASE
    .from('med_generation_jobs')
    .select('*')
    .order('created_at', { ascending: false });

  if (status) {
    query = query.eq('status', status);
  }

  if (CURRENT_USER?.role === 'reviewer') {
    query = query.in('subject_id', CURRENT_USER.subjects);
  }

  const { data, error } = await query;
  if (error) {
    console.error('Error fetching jobs:', error);
    return [];
  }
  return data;
}

async function createGenerationJob(jobData) {
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
  if (!job.output_json?.questions || job.output_json.questions.length === 0) {
    return { success: false, error: 'No questions in job' };
  }

  // Fetch topics for this chapter to match topic_id
  const chapterTopics = await fetchTopics(job.chapter_id);

  const questions = job.output_json.questions;
  let insertedCount = 0;
  let errorCount = 0;

  for (const q of questions) {
    try {
      // Match topic name to topic_id
      const resolvedTopicId = matchTopicId(q.topic, chapterTopics);

      // Prepare question record
      const questionRecord = {
        subject_id: job.subject_id,
        chapter_id: job.chapter_id,
        topic_id: resolvedTopicId,
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
  if (!approvedQuestions || approvedQuestions.length === 0) {
    return { success: false, error: 'No approved questions to insert' };
  }

  // Fetch topics for this chapter to match topic_id
  const chapterTopics = await fetchTopics(job.chapter_id);

  let insertedCount = 0;
  let errorCount = 0;

  for (const q of approvedQuestions) {
    try {
      // Match topic name to topic_id
      const resolvedTopicId = matchTopicId(q.topic, chapterTopics);

      // Prepare question record
      const questionRecord = {
        subject_id: job.subject_id,
        chapter_id: job.chapter_id,
        topic_id: resolvedTopicId,
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
  const { data, error } = await SUPABASE
    .from('med_questions')
    .select('subject_id, question_type, difficulty, status');

  if (error) {
    console.error('Error fetching stats:', error);
    return null;
  }
  return data;
}

// ============================================================================
// CHAPTER TARGETS & ANALYTICS
// ============================================================================
const CHAPTER_TARGETS = {
  totalPerChapter: 600,
  difficultyMix: { easy: 0.30, medium: 0.45, hard: 0.25 },
  typeMix: {
    NEET: {
      'mcq': 0.60, 'assertion-reasoning': 0.15, 'match-the-following': 0.10,
      'true-false': 0.05, 'diagram-based': 0.05, 'scenario-based': 0.03,
      'fill-in-blanks': 0.02
    },
    CUET: {
      'mcq': 0.70, 'assertion-reasoning': 0.10, 'match-the-following': 0.05,
      'true-false': 0.05, 'fill-in-blanks': 0.05, 'scenario-based': 0.05
    }
  }
};

function getTargetsForChapter(exam = 'NEET') {
  const total = CHAPTER_TARGETS.totalPerChapter;
  const diff = CHAPTER_TARGETS.difficultyMix;
  const types = CHAPTER_TARGETS.typeMix[exam] || CHAPTER_TARGETS.typeMix.NEET;

  return {
    total,
    byDifficulty: {
      easy: Math.round(total * diff.easy),
      medium: Math.round(total * diff.medium),
      hard: Math.round(total * diff.hard)
    },
    byType: Object.fromEntries(
      Object.entries(types).map(([t, pct]) => [t, Math.round(total * pct)])
    )
  };
}

async function fetchSubjectQuestionStats(subjectId) {
  const { data, error } = await SUPABASE
    .from('med_questions')
    .select('chapter_id, topic_id, question_type, difficulty, status, exam_ids, payload')
    .eq('subject_id', subjectId);

  if (error) {
    console.error('Error fetching subject stats:', error);
    return [];
  }
  return data || [];
}

// Fetch existing question stems for a chapter (for deduplication)
async function fetchExistingStems(chapterId, limit = 50) {
  const { data, error } = await SUPABASE
    .from('med_questions')
    .select('question_text, question_type')
    .eq('chapter_id', chapterId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching existing stems:', error);
    return [];
  }
  return (data || []).map(q => q.question_text);
}

// Match a topic name from Gemini output to a med_topics row
function matchTopicId(topicName, topicsList) {
  if (!topicName || !topicsList || topicsList.length === 0) return null;
  const lower = topicName.toLowerCase().trim();

  // Exact match first
  const exact = topicsList.find(t => t.name.toLowerCase().trim() === lower);
  if (exact) return exact.id;

  // Partial match — topic name contains or is contained by
  const partial = topicsList.find(t =>
    lower.includes(t.name.toLowerCase().trim()) ||
    t.name.toLowerCase().trim().includes(lower)
  );
  return partial ? partial.id : null;
}

function computeChapterHealth(chapterRows, exam = 'NEET') {
  const targets = getTargetsForChapter(exam);
  const total = chapterRows.length;

  // Count by type
  const byType = {};
  const byDifficulty = { easy: 0, medium: 0, hard: 0 };
  const byStatus = { active: 0, draft: 0 };
  const byExam = { NEET: 0, CUET: 0, BOTH: 0 };
  const byTopic = {};  // topic_id or topic_name → count

  chapterRows.forEach(q => {
    // Type
    byType[q.question_type] = (byType[q.question_type] || 0) + 1;
    // Difficulty
    if (byDifficulty[q.difficulty] !== undefined) byDifficulty[q.difficulty]++;
    // Status
    if (q.status === 'active') byStatus.active++;
    else byStatus.draft++;
    // Exam tags
    const exams = q.exam_ids || [];
    if (exams.includes('NEET') && exams.includes('CUET')) byExam.BOTH++;
    else if (exams.includes('NEET')) byExam.NEET++;
    else if (exams.includes('CUET')) byExam.CUET++;
    // Topic — use topic_id if available, fall back to payload.topic_name
    const topicKey = q.topic_id || q.payload?.topic_name || 'Untagged';
    byTopic[topicKey] = (byTopic[topicKey] || 0) + 1;
  });

  // Health: green >= 80%, yellow >= 40%, red < 40%
  const pct = targets.total > 0 ? (total / targets.total) * 100 : 0;
  const health = pct >= 80 ? 'green' : pct >= 40 ? 'yellow' : 'red';

  return { total, targets, byType, byDifficulty, byStatus, byExam, byTopic, health, pct };
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
  const {
    exam, examIds, subject, chapter, topics, questionTypes,
    count, difficulty, includeHints, focusTopic, existingStems = []
  } = params;

  // ── Exam context ──
  const examName = exam === 'BOTH' ? 'NEET and CUET' : exam;
  const examContext = exam === 'NEET'
    ? 'NEET (National Eligibility cum Entrance Test) for medical admissions in India. NEET has negative marking (-1 for wrong answers), so questions must test genuine understanding — not trick students.'
    : exam === 'CUET'
    ? 'CUET (Common University Entrance Test) for university admissions in India. Questions should match CUET-UG NTA style.'
    : 'Both NEET (medical) and CUET (university) entrance exams in India.';

  // ── Topic list ──
  let topicList;
  if (topics.length > 0) {
    topicList = topics.map(t => `- ${t.name}`).join('\n');
  } else {
    topicList = chapter.important_topics && chapter.important_topics.length > 0
      ? chapter.important_topics.map(t => `- ${t}`).join('\n')
      : `- General concepts from ${chapter.name}`;
  }

  // ── Focus topic instruction ──
  const focusInstruction = focusTopic
    ? `\n\n═══════════════════════════════════════════════════════════════════════════════\nFOCUS TOPIC: "${focusTopic}"\nALL ${count} questions MUST be specifically about "${focusTopic}". Cover different subtopics and angles within this topic. Do NOT generate questions about other topics.\n═══════════════════════════════════════════════════════════════════════════════`
    : '';

  // ── Difficulty calibration with Bloom's mapping ──
  let difficultySection;
  if (difficulty === 'mixed (distribute across easy, medium, hard)') {
    const easyCount = Math.round(count * 0.30);
    const hardCount = Math.round(count * 0.25);
    const mediumCount = count - easyCount - hardCount;
    difficultySection = `DIFFICULTY: Mixed — distribute as follows:
- ${easyCount} EASY questions (Bloom: Remember/Understand) — direct recall, single concept, single-step. Expected student accuracy: 75-85%.
- ${mediumCount} MEDIUM questions (Bloom: Understand/Apply) — application of 1-2 concepts, 2-step reasoning, compare/contrast. Expected accuracy: 55-70%.
- ${hardCount} HARD questions (Bloom: Apply/Analyze) — multi-concept integration, edge cases, analytical thinking, common misconceptions as distractors. Expected accuracy: 35-50%.

Set "bloom_level" consistent with difficulty: easy→remember/understand, medium→understand/apply, hard→apply/analyze.`;
  } else {
    const bloomMap = { easy: 'remember or understand', medium: 'understand or apply', hard: 'apply or analyze' };
    const accuracyMap = { easy: '75-85%', medium: '55-70%', hard: '35-50%' };
    difficultySection = `DIFFICULTY: ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
Bloom's level: ${bloomMap[difficulty] || 'understand'}
Expected student accuracy: ${accuracyMap[difficulty] || '60%'}
All ${count} questions must be ${difficulty} difficulty.`;
  }

  // ── Subject-specific difficulty guidance ──
  const subjectLower = subject.toLowerCase();
  let subjectDifficultyGuide = '';
  if (subjectLower.includes('physics')) {
    subjectDifficultyGuide = `
PHYSICS DIFFICULTY CALIBRATION:
- Easy: Direct formula application, single-step calculation, recall of units/constants
- Medium: 2-step problems, unit conversion required, basic conceptual reasoning
- Hard: Multi-concept problems (e.g., mechanics + energy), edge cases, tricky sign conventions`;
  } else if (subjectLower.includes('chemistry')) {
    subjectDifficultyGuide = `
CHEMISTRY DIFFICULTY CALIBRATION:
- Easy: Identify compound/element, name reaction type, recall periodic trends
- Medium: Predict products, balance equations, apply gas laws with calculation
- Hard: Mechanism steps, compare reaction rates/stability, multi-step stoichiometry`;
  } else if (subjectLower.includes('bio') || subjectLower.includes('botany') || subjectLower.includes('zoology')) {
    subjectDifficultyGuide = `
BIOLOGY DIFFICULTY CALIBRATION:
- Easy: Name structure/process, recall definition, identify from description
- Medium: Compare structures/functions, explain mechanism steps, cause-effect
- Hard: Disease mechanism reasoning, evolutionary logic, multi-system integration`;
  }

  // ── Per-type instructions with examples ──
  const typeBlocks = [];
  for (const type of questionTypes) {
    typeBlocks.push(getTypeInstruction(type));
  }

  // ── Deduplication section ──
  let dedupSection = '';
  if (existingStems.length > 0) {
    const stemList = existingStems.slice(0, 40).map((s, i) => `  ${i + 1}. ${s.slice(0, 120)}`).join('\n');
    dedupSection = `
═══════════════════════════════════════════════════════════════════════════════
DO NOT DUPLICATE — The following ${existingStems.length} questions already exist for this chapter.
Generate DIFFERENT questions testing different angles/subtopics/concepts.
═══════════════════════════════════════════════════════════════════════════════
${stemList}
`;
  }

  // ── Build full prompt ──
  const prompt = `You are an expert ${examName} exam question writer for ${subject}, specializing in creating high-quality practice questions that match the style of actual ${examName} papers.

TARGET EXAM: ${examContext}

TASK: Generate exactly ${count} questions for ${examName} preparation.

═══════════════════════════════════════════════════════════════════════════════
SCOPE — Generate questions ONLY from the chapter and topics below.
═══════════════════════════════════════════════════════════════════════════════

SUBJECT: ${subject}
CHAPTER: ${chapter.name}
CLASS: ${chapter.class_level || 'Not specified'}
WEIGHTAGE IN EXAM: ${chapter.weightage || 'Not specified'}%

TOPICS TO COVER:
${topicList}
${focusInstruction}

───────────────────────────────────────────────────────────────────────────────
${difficultySection}
${subjectDifficultyGuide}
───────────────────────────────────────────────────────────────────────────────

QUESTION TYPE INSTRUCTIONS:
${typeBlocks.join('\n\n')}

───────────────────────────────────────────────────────────────────────────────
QUALITY RULES — FOLLOW STRICTLY
───────────────────────────────────────────────────────────────────────────────

1. STEM VARIETY: Do NOT start every question with "Which of the following". Vary stems:
   - "Consider the process of...", "A student observes that...", "If X were to increase..."
   - "Statement: ... Identify the error", "What happens when...", "The correct order of..."
   - "In the context of...", "During the process of...", "Identify the correct statement about..."

2. DISTRACTOR DESIGN: Wrong options must be plausible. Build distractors from:
   - Common student misconceptions (e.g., confusing mitosis/meiosis stages)
   - Partial calculations or incomplete reasoning
   - Sign/unit errors (Physics), adjacent elements/compounds (Chemistry), similar structures (Biology)
   - Reversals (e.g., swapping reactant and product)
   Do NOT use absurd or obviously wrong options.

3. OPTION BALANCE:
   - All 4 options should be roughly equal in length (no "obviously long" correct answer)
   - Never use "All of the above" or "None of the above"
   - Distribute correct answers across A/B/C/D (don't make all answers "B")

4. EXPLANATIONS:
   - Must be educational, explaining WHY the correct answer is right
   - Must address why each wrong option is wrong (common mistakes)
   - Should help students learn, not just state the answer

5. PYQ STYLE: Match the language, complexity, and format of actual ${examName} previous year papers.
   - Use standard exam phrasing and conventions
   - For NEET: consider negative marking — questions should test real understanding, not trick

6. FACTUAL ACCURACY:
   - Every fact must be scientifically accurate and up-to-date
   - Use NCERT-aligned content (Class 11-12 level)
   - One unambiguous correct answer per question — never ambiguous
${dedupSection}
───────────────────────────────────────────────────────────────────────────────
OUTPUT FORMAT — JSON array, nothing else
───────────────────────────────────────────────────────────────────────────────

\`\`\`json
[
  {
    "question_type": "mcq",
    "question_text": "The question stem",
    "options": [
      { "key": "A", "text": "Option A text", "is_correct": false },
      { "key": "B", "text": "Option B text", "is_correct": true },
      { "key": "C", "text": "Option C text", "is_correct": false },
      { "key": "D", "text": "Option D text", "is_correct": false }
    ],
    "correct_answer": "B",
    "explanation": "Detailed explanation of why B is correct AND why A, C, D are wrong",
    "difficulty": "easy|medium|hard",
    "exam_suitability": ${JSON.stringify(examIds)},
    "topic": "Exact topic name from the list above",
    "subtopic": "Specific subtopic within the topic",
    "concept_tags": ["concept-1", "concept-2"],
    "bloom_level": "remember|understand|apply|analyze"${includeHints ? `,
    "elimination_hints": [
      { "option_key": "A", "hint": "Why A can be eliminated", "misconception": "Student mistake that leads to picking A" },
      { "option_key": "C", "hint": "Why C can be eliminated", "misconception": "Student mistake that leads to picking C" },
      { "option_key": "D", "hint": "Why D can be eliminated", "misconception": "Student mistake that leads to picking D" }
    ]` : ''}
  }
]
\`\`\`

TAGGING:
- "topic": Must match EXACTLY one topic from the list above
- "subtopic": A narrower concept within that topic (e.g., "Sliding friction" within "Laws of Motion")
- "concept_tags": 2-4 specific concepts tested (used for student weakness tracking)
- "bloom_level": Match to difficulty — easy→remember/understand, medium→apply, hard→analyze
- "exam_suitability": ${JSON.stringify(examIds)}

Generate exactly ${count} questions. Output ONLY the JSON array — no markdown, no explanation, no extra text.`;

  return prompt;
}

// ── Per-type instruction blocks with examples ──
function getTypeInstruction(type) {
  const instructions = {
    'mcq': `▸ MCQ (Multiple Choice Question)
  - 4 options labeled A, B, C, D
  - One unambiguous correct answer
  - Distractors from common misconceptions
  Example output:
  {
    "question_type": "mcq",
    "question_text": "The SI unit of force is:",
    "options": [
      {"key":"A","text":"Joule","is_correct":false},
      {"key":"B","text":"Newton","is_correct":true},
      {"key":"C","text":"Watt","is_correct":false},
      {"key":"D","text":"Pascal","is_correct":false}
    ],
    "correct_answer": "B",
    "difficulty": "easy", "bloom_level": "remember"
  }`,

    'assertion-reasoning': `▸ ASSERTION-REASONING
  Format: Assertion (A) is a statement. Reason (R) is a statement.
  MANDATORY — Use these exact 4 standard NEET options:
    A) Both A and R are correct and R is the correct explanation of A
    B) Both A and R are correct but R is NOT the correct explanation of A
    C) A is correct but R is incorrect
    D) A is incorrect but R is correct

  IMPORTANT: Distribute answers across all 4 options. Don't make all answers option A.
  Include cases where both true but unrelated (option B), and cases with one false (C or D).
  Example output:
  {
    "question_type": "assertion-reasoning",
    "question_text": "Assertion (A): Mitochondria are called the powerhouse of the cell.\\nReason (R): Mitochondria produce ATP through oxidative phosphorylation.",
    "options": [
      {"key":"A","text":"Both A and R are correct and R is the correct explanation of A","is_correct":true},
      {"key":"B","text":"Both A and R are correct but R is NOT the correct explanation of A","is_correct":false},
      {"key":"C","text":"A is correct but R is incorrect","is_correct":false},
      {"key":"D","text":"A is incorrect but R is correct","is_correct":false}
    ],
    "correct_answer": "A",
    "difficulty": "medium", "bloom_level": "analyze"
  }`,

    'match-the-following': `▸ MATCH THE FOLLOWING
  Column A (4-5 items): Terms, processes, structures, scientists
  Column B (4-5 items): Definitions, functions, discoveries, years
  Then provide 4 coded combination options in NEET style:

  question_text should contain the two columns formatted clearly.
  Options are combination codes like: "A-3, B-1, C-4, D-2"

  RULES:
  - All items in both columns must be used
  - Include at least one close/confusing pair
  - Options should represent plausible alternative matchings
  Example output:
  {
    "question_type": "match-the-following",
    "question_text": "Match Column A with Column B:\\n\\nColumn A | Column B\\nA. Golgi apparatus | 1. Protein synthesis\\nB. Ribosome | 2. Packaging & secretion\\nC. Lysosome | 3. ATP production\\nD. Mitochondria | 4. Intracellular digestion",
    "options": [
      {"key":"A","text":"A-2, B-1, C-4, D-3","is_correct":true},
      {"key":"B","text":"A-1, B-2, C-4, D-3","is_correct":false},
      {"key":"C","text":"A-2, B-1, C-3, D-4","is_correct":false},
      {"key":"D","text":"A-3, B-1, C-4, D-2","is_correct":false}
    ],
    "correct_answer": "A",
    "difficulty": "medium", "bloom_level": "understand"
  }`,

    'true-false': `▸ TRUE/FALSE
  A clear statement that is unambiguously true or false.
  Format as MCQ with options: A) True, B) False
  For false statements, include what the correct fact is in the explanation.

  RULES:
  - Mix roughly 50-50 true and false
  - False statements should contain a specific factual error (not vague)
  - For hard difficulty, the error should be subtle
  Example output:
  {
    "question_type": "true-false",
    "question_text": "Statement: The process of glycolysis occurs in the mitochondrial matrix.",
    "options": [
      {"key":"A","text":"True","is_correct":false},
      {"key":"B","text":"False","is_correct":true}
    ],
    "correct_answer": "B",
    "explanation": "False. Glycolysis occurs in the cytoplasm, not mitochondrial matrix. The Krebs cycle occurs in the mitochondrial matrix.",
    "difficulty": "easy", "bloom_level": "remember"
  }`,

    'diagram-based': `▸ DIAGRAM-BASED
  Describe the diagram/figure clearly in text (we'll add images later).
  The question_text should include a description of what the diagram shows.
  Then ask a question that requires understanding the diagram.

  Example: "In a diagram of the human heart, parts A, B, C, D are labeled pointing to the left atrium, right ventricle, aorta, and pulmonary artery respectively. Which labeled part carries deoxygenated blood away from the heart?"`,

    'logical-sequence': `▸ LOGICAL SEQUENCE
  Given items (P, Q, R, S) that need to be arranged in correct order.
  4 MCQ options showing different orderings.

  Types: Process steps, timeline, increasing/decreasing order, cause-effect chain.
  Example output:
  {
    "question_type": "logical-sequence",
    "question_text": "Arrange the following stages of mitosis in correct order:\\nP. Metaphase  Q. Anaphase  R. Prophase  S. Telophase",
    "options": [
      {"key":"A","text":"R → P → Q → S","is_correct":true},
      {"key":"B","text":"P → R → Q → S","is_correct":false},
      {"key":"C","text":"R → Q → P → S","is_correct":false},
      {"key":"D","text":"P → Q → R → S","is_correct":false}
    ],
    "correct_answer": "A",
    "difficulty": "medium", "bloom_level": "understand"
  }`,

    'scenario-based': `▸ SCENARIO-BASED / CASE STUDY
  Present a real-world scenario (2-4 sentences): clinical case, lab experiment, environmental situation, daily life.
  Then ask a question requiring application of chapter concepts.

  RULES:
  - Scenario must be realistic and relevant
  - Answer must be derivable from scenario + chapter knowledge
  - Should test application, not just recall
  Example: "A farmer notices crop yield decreased despite adequate water. Soil pH test shows 4.2. The crop is wheat (optimal pH 6-7). What is the most likely cause and solution?"`,

    'fill-in-blanks': `▸ FILL IN THE BLANKS
  Statement with _____ for blank. 4 options to fill the blank.
  Format as MCQ with the blank clearly marked.

  RULES:
  - Blank should test a key term/concept/value
  - All options must be grammatically valid in the blank
  - Distractors from same category (all organ names, all numbers, all process names)
  Example output:
  {
    "question_type": "fill-in-blanks",
    "question_text": "The process of _____ is responsible for oxygen production in plants.",
    "options": [
      {"key":"A","text":"Photosynthesis","is_correct":true},
      {"key":"B","text":"Respiration","is_correct":false},
      {"key":"C","text":"Fermentation","is_correct":false},
      {"key":"D","text":"Transpiration","is_correct":false}
    ],
    "correct_answer": "A",
    "difficulty": "easy", "bloom_level": "remember"
  }`
  };

  return instructions[type] || `▸ ${type.toUpperCase()}\n  Generate questions of type "${type}" with 4 options (A-D).`;
}

function buildTeluguTranslationPrompt(questions, optionsMap, hintsMap) {
  const questionTexts = questions.map((q, i) => {
    const opts = (optionsMap && optionsMap[q.id]) || q.options || [];
    const hints = (hintsMap && hintsMap[q.id]) || [];

    let text = `
Question ${i + 1}:
Text: ${q.question_text}
Explanation: ${q.explanation || 'N/A'}`;

    if (opts.length > 0) {
      const optStr = opts.map(o => `${o.option_key || o.key}. ${o.option_text || o.text}`).join(' | ');
      text += `\nOptions: ${optStr}`;
    }

    if (hints.length > 0) {
      const hintStr = hints.map(h => `${h.option_key}: ${h.hint_text}${h.misconception ? ' | Misconception: ' + h.misconception : ''}`).join('\n  ');
      text += `\nElimination Hints:\n  ${hintStr}`;
    }

    return text;
  }).join('\n---\n');

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
    ],
    "hints_te": [
      { "option_key": "A", "hint_text_te": "Telugu hint", "misconception_te": "Telugu misconception" }
    ]
  }
]
\`\`\`

NOTES:
- Include "options_te" only if the question has options.
- Include "hints_te" only if the question has elimination hints.
- Output ONLY the JSON array, no additional text.`;
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
  const colors = {
    'PHYSICS': '#3b82f6',
    'CHEMISTRY': '#10b981',
    'BOTANY': '#22c55e',
    'ZOOLOGY': '#f59e0b'
  };
  return colors[subjectId] || '#6b7280';
}

function getSubjectEmoji(subjectId) {
  const emojis = {
    'PHYSICS': '⚡',
    'CHEMISTRY': '🧪',
    'BOTANY': '🌿',
    'ZOOLOGY': '🦁'
  };
  return emojis[subjectId] || '📚';
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
  fetchSubjectQuestionStats,
  fetchExistingStems,
  computeChapterHealth,
  getTargetsForChapter,
  matchTopicId,
  CHAPTER_TARGETS,

  // Gemini
  callGemini,
  getTokenUsage,
  buildQuestionGenerationPrompt,
  buildTeluguTranslationPrompt,
  parseJsonResponse,

  // UI
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
