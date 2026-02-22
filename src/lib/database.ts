import { supabase } from './supabase';
import type { ExamType, Language, SubjectId, OnboardingFlowConfig } from '../types';

// ── Types ────────────────────────────────────────────────────

export interface MedProfile {
  id: string;
  display_name: string;
  avatar_url: string;
  email: string;
  phone: string;
  country_code: string;
  college: string;
  city: string;
  exam: ExamType | null;
  language: Language;
  target_year: number | null;
  app_version: string | null;
  onboarding_completed: boolean;
  vani_override: boolean; // Secret admin setting: overrides VaNi AI decisions
  created_at: string;
  updated_at: string;
}

// Question mix configuration for practice exams
export interface QuestionMixConfig {
  // Difficulty percentages (sum to 100)
  easy_pct: number;
  medium_pct: number;
  hard_pct: number;
  // Question type percentages (sum to 100)
  mcq_pct: number;
  assertion_reasoning_pct: number;
  match_following_pct: number;
  true_false_pct: number;
  diagram_based_pct: number;
  logical_sequence_pct: number;
  fill_blanks_pct: number;
  scenario_based_pct: number;
}

// Default mix for when no override exists
const DEFAULT_QUESTION_MIX: QuestionMixConfig = {
  easy_pct: 30,
  medium_pct: 50,
  hard_pct: 20,
  mcq_pct: 60,
  assertion_reasoning_pct: 10,
  match_following_pct: 10,
  true_false_pct: 5,
  diagram_based_pct: 5,
  logical_sequence_pct: 3,
  fill_blanks_pct: 4,
  scenario_based_pct: 3,
};

// ── Profile ──────────────────────────────────────────────────

/** Fetch the current user's profile. */
export async function getProfile(): Promise<MedProfile | null> {
  if (!supabase) return null;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('med_profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error || !data) return null;
  return data as MedProfile;
}

/**
 * Check if onboarding is truly complete — flag is true AND critical fields filled.
 * Catches users who had onboarding_completed set by the old quick flow with empty profile.
 */
export function isOnboardingActuallyComplete(profile: MedProfile | null): boolean {
  if (!profile) return false;
  if (!profile.onboarding_completed) return false;

  // Critical fields that must be filled during onboarding
  const hasName = (profile.display_name ?? '').trim().length >= 2;
  const hasPhone = (profile.phone ?? '').trim().length >= 4;
  const hasCollege = (profile.college ?? '').trim().length >= 2;
  const hasCity = (profile.city ?? '').trim().length >= 2;
  const hasExam = !!profile.exam;

  return hasName && hasPhone && hasCollege && hasCity && hasExam;
}

// ── Complete onboarding (batch save) ─────────────────────────

interface OnboardingPayload {
  displayName?: string;
  phone: string;
  countryCode: string;
  college: string;
  city: string;
  exam: ExamType;
  subjects: SubjectId[];
  language: Language;
  targetYear?: number;
}

/**
 * Save all onboarding data in one go:
 *  1. Upsert med_profiles with phone, college, city, exam, language
 *  2. Replace med_user_subjects
 *  3. Mark onboarding_completed = true
 */
export async function completeOnboarding(payload: OnboardingPayload): Promise<void> {
  if (!supabase) throw new Error('Supabase is not configured.');

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated.');

  // 1. Upsert profile (handles users who signed up before migration)
  const { error: profileErr } = await supabase
    .from('med_profiles')
    .upsert({
      id: user.id,
      display_name: payload.displayName || user.user_metadata?.full_name || user.user_metadata?.name || '',
      avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || '',
      email: user.email || '',
      phone: payload.phone,
      country_code: payload.countryCode,
      college: payload.college,
      city: payload.city,
      exam: payload.exam,
      language: payload.language,
      target_year: payload.targetYear ?? null,
      onboarding_completed: true,
    }, { onConflict: 'id' });

  if (profileErr) throw profileErr;

  // 2. Replace subjects: delete old, insert new
  const { error: delErr } = await supabase
    .from('med_user_subjects')
    .delete()
    .eq('user_id', user.id);

  if (delErr) throw delErr;

  if (payload.subjects.length > 0) {
    const rows = payload.subjects.map((sid) => ({
      user_id: user.id,
      subject_id: sid,
    }));

    const { error: insertErr } = await supabase
      .from('med_user_subjects')
      .insert(rows);

    if (insertErr) throw insertErr;
  }
}

// ── User subjects ───────────────────────────────────────────

/** Get the current user's selected subject IDs. */
export async function getUserSubjectIds(): Promise<string[]> {
  if (!supabase) return [];

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('med_user_subjects')
    .select('subject_id')
    .eq('user_id', user.id);

  if (error || !data) return [];
  return data.map((row: any) => row.subject_id);
}

/** Update the current user's selected subjects (replaces all). */
export async function updateUserSubjects(subjectIds: string[]): Promise<void> {
  if (!supabase) throw new Error('Supabase is not configured.');

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated.');

  // Delete existing subjects
  const { error: delErr } = await supabase
    .from('med_user_subjects')
    .delete()
    .eq('user_id', user.id);

  if (delErr) throw delErr;

  // Insert new subjects
  if (subjectIds.length > 0) {
    const rows = subjectIds.map((sid) => ({
      user_id: user.id,
      subject_id: sid,
    }));

    const { error: insertErr } = await supabase
      .from('med_user_subjects')
      .insert(rows);

    if (insertErr) throw insertErr;
  }
}

// ── Update profile ──────────────────────────────────────────

/** Update specific profile fields. */
export async function updateProfile(
  fields: Partial<Pick<MedProfile, 'display_name' | 'phone' | 'country_code' | 'college' | 'city' | 'exam' | 'language' | 'target_year'>>
): Promise<void> {
  if (!supabase) throw new Error('Supabase is not configured.');

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated.');

  const { error } = await supabase
    .from('med_profiles')
    .update(fields)
    .eq('id', user.id);

  if (error) throw error;
}

// ── App version tracking ─────────────────────────────────────

/**
 * Report the current app version to Supabase so the WhatsApp bot
 * can notify users running outdated versions.
 * Called once on startup; skips the update if already current.
 */
export async function reportAppVersion(profile: MedProfile): Promise<void> {
  if (!supabase) return;

  // Read version from app.json via Expo Constants
  const Constants = require('expo-constants').default;
  const currentVersion: string = Constants.expoConfig?.version ?? '0.0.0';

  // Skip DB write if already up to date
  if (profile.app_version === currentVersion) return;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from('med_profiles')
    .update({ app_version: currentVersion })
    .eq('id', user.id);
}

// ── Sign out ────────────────────────────────────────────────

/** Sign out the current user — clears Supabase session AND local Redux/storage. */
export async function signOut(): Promise<void> {
  // Reset all Redux slices to initial state and stop persisting
  const { resetAllData } = require('../store');
  resetAllData();

  if (!supabase) return;
  await supabase.auth.signOut();
}

// ── Referral codes ───────────────────────────────────────────

/** Generate a 6-char referral code for the current user. */
export async function generateReferralCode(): Promise<string> {
  if (!supabase) throw new Error('Supabase is not configured.');

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated.');

  // Check if user already has a code
  const { data: existing } = await supabase
    .from('med_referral_codes')
    .select('code')
    .eq('user_id', user.id)
    .limit(1)
    .single();

  if (existing?.code) return existing.code;

  // Generate a random 6-char alphanumeric code
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no 0/O/1/I confusion
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }

  const { error } = await supabase
    .from('med_referral_codes')
    .insert({ user_id: user.id, code });

  if (error) throw error;
  return code;
}

/** Join using someone else's referral code. */
export async function joinWithReferralCode(code: string): Promise<boolean> {
  if (!supabase) return false;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data, error } = await supabase
    .from('med_referral_codes')
    .update({ used_by: user.id })
    .eq('code', code.toUpperCase())
    .is('used_by', null)
    .select('id')
    .single();

  return !error && !!data;
}

// ── Question Mix Configuration ───────────────────────────────

/**
 * Get the question mix config for the current user.
 * If vani_override is true and user has custom mix, use that.
 * Otherwise, use the default global mix.
 */
export async function getQuestionMixConfig(): Promise<QuestionMixConfig> {
  if (!supabase) return DEFAULT_QUESTION_MIX;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return DEFAULT_QUESTION_MIX;

  // Check if user has override enabled
  const profile = await getProfile();
  if (!profile?.vani_override) {
    return DEFAULT_QUESTION_MIX;
  }

  // Fetch user's custom mix if override is enabled
  const { data, error } = await supabase
    .from('med_user_question_mix')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error || !data) return DEFAULT_QUESTION_MIX;

  return {
    easy_pct: data.easy_pct,
    medium_pct: data.medium_pct,
    hard_pct: data.hard_pct,
    mcq_pct: data.mcq_pct,
    assertion_reasoning_pct: data.assertion_reasoning_pct,
    match_following_pct: data.match_following_pct,
    true_false_pct: data.true_false_pct,
    diagram_based_pct: data.diagram_based_pct,
    logical_sequence_pct: data.logical_sequence_pct,
    fill_blanks_pct: data.fill_blanks_pct,
    scenario_based_pct: data.scenario_based_pct,
  };
}

/**
 * Get the default question mix by type (trial or paid).
 */
export async function getDefaultQuestionMix(
  type: 'trial_default' | 'paid_default' = 'trial_default'
): Promise<QuestionMixConfig> {
  if (!supabase) return DEFAULT_QUESTION_MIX;

  const { data, error } = await supabase
    .from('med_question_mix_defaults')
    .select('*')
    .eq('name', type)
    .single();

  if (error || !data) return DEFAULT_QUESTION_MIX;

  return {
    easy_pct: data.easy_pct,
    medium_pct: data.medium_pct,
    hard_pct: data.hard_pct,
    mcq_pct: data.mcq_pct,
    assertion_reasoning_pct: data.assertion_reasoning_pct,
    match_following_pct: data.match_following_pct,
    true_false_pct: data.true_false_pct,
    diagram_based_pct: data.diagram_based_pct,
    logical_sequence_pct: data.logical_sequence_pct,
    fill_blanks_pct: data.fill_blanks_pct,
    scenario_based_pct: data.scenario_based_pct,
  };
}

// ── App Config (med_app_config) ──────────────────────────────

const DEFAULT_ONBOARDING_FLOW: OnboardingFlowConfig = {
  mode: 'full',
  quick_until: '2000-01-01T00:00:00Z',
  default_exam: 'NEET',
  auto_assign_subjects: true,
  default_language: 'en',
};

let _cachedFlowConfig: OnboardingFlowConfig | null = null;

/**
 * Fetch the onboarding flow config from med_app_config.
 * Cached in-memory for the session — call clearOnboardingFlowCache() to refresh.
 */
export async function getOnboardingFlowConfig(): Promise<OnboardingFlowConfig> {
  if (_cachedFlowConfig) return _cachedFlowConfig;
  if (!supabase) return DEFAULT_ONBOARDING_FLOW;

  try {
    const { data, error } = await supabase
      .from('med_app_config')
      .select('value')
      .eq('key', 'onboarding_flow')
      .single();

    if (error || !data?.value) return DEFAULT_ONBOARDING_FLOW;

    _cachedFlowConfig = data.value as OnboardingFlowConfig;
    return _cachedFlowConfig;
  } catch {
    return DEFAULT_ONBOARDING_FLOW;
  }
}

export function clearOnboardingFlowCache(): void {
  _cachedFlowConfig = null;
}
