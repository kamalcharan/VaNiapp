import './crypto-polyfill';
import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';
const GOOGLE_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || '';

const isSupabaseConfigured =
  SUPABASE_URL.startsWith('https://') && SUPABASE_ANON_KEY.length > 0;

export const supabase = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
        flowType: 'pkce',
      },
    })
  : null;

export const isSupabaseReady = () => isSupabaseConfigured && supabase !== null;

/**
 * Exchange an auth code for a Supabase session.
 * The Supabase client stores the PKCE verifier internally
 * (when flowType is 'pkce'), so we only pass the code.
 */
export async function exchangeAuthCode(code: string): Promise<void> {
  if (!supabase) throw new Error('Supabase is not configured.');

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) throw error;
}

/**
 * Sign in with Google via Supabase OAuth.
 *
 * Uses openAuthSessionAsync to capture the redirect URL directly
 * inside Chrome Custom Tab — this prevents the redirect from
 * becoming a deep link (which triggers the ngrok/dev-server crash
 * in Expo Go).
 */
export async function signInWithGoogle(): Promise<{ cancelled: boolean }> {
  if (!supabase) {
    throw new Error('Supabase is not configured. Check your .env file.');
  }

  const WebBrowser = require('expo-web-browser');

  // Use the custom 'vani://' scheme instead of 'exp://'.
  // In Expo Go, 'exp://' redirects conflict with Expo Go's main activity
  // (causing the ngrok/dev-server crash). 'vani://' has no such conflict,
  // so openAuthSessionAsync's WebBrowserRedirectActivity can capture it cleanly.
  const redirectUri = 'vani://auth/callback';

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectUri,
      skipBrowserRedirect: true,
    },
  });

  if (error || !data.url) {
    throw new Error(error?.message || 'Failed to get Google auth URL');
  }

  // openAuthSessionAsync opens Chrome Custom Tab and waits for the
  // redirect URL. When Chrome Custom Tab navigates to a URL matching
  // the redirectUri scheme, it captures the URL and returns it
  // WITHOUT triggering a deep link to the dev server.
  const result = await WebBrowser.openAuthSessionAsync(
    data.url,
    redirectUri,
    { showInRecents: false }
  );

  if (result.type === 'success' && result.url) {
    const code = extractParam(result.url, 'code');
    if (code) {
      await exchangeAuthCode(code);
      return { cancelled: false };
    }
    throw new Error('No auth code in redirect URL');
  }

  if (result.type === 'cancel' || result.type === 'dismiss') {
    return { cancelled: true };
  }

  throw new Error(`Auth session ended with type: ${result.type}`);
}

/**
 * Extract a param from a URL's query string OR hash fragment.
 * Works with any scheme (exp://, https://) unlike new URL().
 */
function extractParam(url: string, param: string): string | null {
  // Check query string first (?code=xxx)
  const qIdx = url.indexOf('?');
  if (qIdx !== -1) {
    const qs = url.substring(qIdx + 1).split('#')[0];
    for (const part of qs.split('&')) {
      const [key, ...rest] = part.split('=');
      if (decodeURIComponent(key) === param) {
        return decodeURIComponent(rest.join('='));
      }
    }
  }

  // Check hash fragment (#code=xxx)
  const hIdx = url.indexOf('#');
  if (hIdx !== -1) {
    const hash = url.substring(hIdx + 1);
    for (const part of hash.split('&')) {
      const [key, ...rest] = part.split('=');
      if (decodeURIComponent(key) === param) {
        return decodeURIComponent(rest.join('='));
      }
    }
  }

  return null;
}

/**
 * Sign in with email + password.
 * No browser redirect needed — works in Expo Go.
 */
export async function signInWithEmail(
  email: string,
  password: string
): Promise<void> {
  if (!supabase) throw new Error('Supabase is not configured.');
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
}

/**
 * Sign up with email + password.
 * Supabase sends a confirmation email by default — user must click
 * the link before they can sign in.
 */
export async function signUpWithEmail(
  email: string,
  password: string
): Promise<{ needsConfirmation: boolean }> {
  if (!supabase) throw new Error('Supabase is not configured.');
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return { needsConfirmation: !data.session };
}

/**
 * Sign out the current user.
 */
export async function signOut() {
  if (!supabase) return;
  await supabase.auth.signOut();
}
