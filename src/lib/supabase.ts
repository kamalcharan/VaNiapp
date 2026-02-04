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
      },
    })
  : null;

export const isSupabaseReady = () => isSupabaseConfigured && supabase !== null;

// PKCE helpers using expo-crypto (lazy-loaded to avoid startup init)
const CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function generateVerifier(size = 128): string {
  const ExpoCrypto = require('expo-crypto');
  const randomValues = ExpoCrypto.getRandomValues(new Uint8Array(size));
  return Array.from(randomValues)
    .map((b: number) => CHARSET[b % CHARSET.length])
    .join('');
}

async function generateChallenge(verifier: string): Promise<string> {
  const ExpoCrypto = require('expo-crypto');
  const hash = await ExpoCrypto.digestStringAsync(
    ExpoCrypto.CryptoDigestAlgorithm.SHA256,
    verifier,
    { encoding: ExpoCrypto.CryptoEncoding.BASE64 }
  );
  return hash.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

/**
 * Sign in with Google via Supabase OAuth.
 * Uses expo-web-browser + expo-linking directly (no expo-auth-session).
 */
export async function signInWithGoogle() {
  if (!supabase) {
    throw new Error('Supabase is not configured. Check your .env file.');
  }

  // PKCE: generate verifier and challenge
  const codeVerifier = generateVerifier();
  const codeChallenge = await generateChallenge(codeVerifier);

  // Build redirect URI using expo-linking (already installed via expo-router)
  const Linking = require('expo-linking');
  const redirectUri = Linking.createURL('auth/callback');

  // Get the OAuth URL from Supabase
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectUri,
      queryParams: {
        code_challenge: codeChallenge,
        code_challenge_method: 'S256',
      },
      skipBrowserRedirect: true,
    },
  });

  if (error || !data.url) {
    throw new Error(error?.message || 'Failed to get Google auth URL');
  }

  // Open the browser for Google sign-in using expo-web-browser
  const WebBrowser = require('expo-web-browser');
  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUri);

  if (result.type !== 'success' || !result.url) {
    return { session: null, cancelled: result.type === 'cancel' || result.type === 'dismiss' };
  }

  // Extract the auth code from the callback URL
  const url = new URL(result.url);
  const code = url.searchParams.get('code');

  if (!code) {
    throw new Error('No authorization code returned from Google');
  }

  // Exchange the code for a session using the PKCE verifier
  const { data: sessionData, error: sessionError } =
    await supabase.auth.exchangeCodeForSession(code, codeVerifier);

  if (sessionError) {
    throw new Error(sessionError.message);
  }

  return { session: sessionData.session, cancelled: false };
}

/**
 * Sign out the current user.
 */
export async function signOut() {
  if (!supabase) return;
  await supabase.auth.signOut();
}
