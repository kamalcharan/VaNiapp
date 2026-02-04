import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

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
 * With flowType: 'pkce', signInWithOAuth automatically:
 *   - generates the PKCE code verifier + challenge
 *   - stores the verifier in AsyncStorage
 *   - adds the challenge to the OAuth URL
 *
 * We just open the URL in a browser. When the redirect fires,
 * the root layout's deep link listener calls exchangeAuthCode(code).
 */
export async function signInWithGoogle() {
  if (!supabase) {
    throw new Error('Supabase is not configured. Check your .env file.');
  }

  const Linking = require('expo-linking');
  const redirectUri = Linking.createURL('auth/callback');

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

  const WebBrowser = require('expo-web-browser');
  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUri);

  if (result.type === 'success' && result.url) {
    // Browser returned the URL directly — try to exchange here
    const code = extractParam(result.url, 'code');
    if (code) {
      await exchangeAuthCode(code);
    }
    return { cancelled: false };
  }

  return { cancelled: result.type === 'cancel' || result.type === 'dismiss' };
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
 * Sign out the current user.
 */
export async function signOut() {
  if (!supabase) return;
  await supabase.auth.signOut();
}
