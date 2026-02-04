import { supabase } from './supabase';
import type { ExamType, Language, SubjectId } from '../types';

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
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

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

// ── Complete onboarding (batch save) ─────────────────────────

interface OnboardingPayload {
  phone: string;
  countryCode: string;
  college: string;
  city: string;
  exam: ExamType;
  subjects: SubjectId[];
  language: Language;
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
      display_name: user.user_metadata?.full_name || user.user_metadata?.name || '',
      avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || '',
      email: user.email || '',
      phone: payload.phone,
      country_code: payload.countryCode,
      college: payload.college,
      city: payload.city,
      exam: payload.exam,
      language: payload.language,
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
