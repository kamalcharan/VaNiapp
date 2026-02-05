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
// JSON PARSER (handles markdown code blocks)
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

  try {
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error('JSON parse error:', error);
    console.log('Raw text (first 500 chars):', text.substring(0, 500));
    console.log('Attempted to parse:', jsonStr.substring(0, 500));
    throw new Error('Failed to parse Gemini response as JSON');
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
  getQuestionStats,

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
