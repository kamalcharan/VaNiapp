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
const AUTH_VERIFIER_KEY = 'supabase_pkce_verifier';

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
 * Exchange an auth code for a Supabase session.
 * Reads the stored PKCE verifier from AsyncStorage.
 * Safe to call from both signInWithGoogle and the callback screen —
 * whichever runs first consumes the verifier, the second is a no-op.
 */
export async function exchangeAuthCode(code: string): Promise<void> {
  if (!supabase) throw new Error('Supabase is not configured.');

  const codeVerifier = await AsyncStorage.getItem(AUTH_VERIFIER_KEY);
  if (!codeVerifier) return; // Already consumed by the other path

  await AsyncStorage.removeItem(AUTH_VERIFIER_KEY);

  const { error } = await supabase.auth.exchangeCodeForSession(code, codeVerifier);
  if (error) throw error;
}

/**
 * Sign in with Google via Supabase OAuth.
 * Uses expo-web-browser + expo-linking directly (no expo-auth-session).
 * The PKCE verifier is stored in AsyncStorage so both this function
 * and app/auth/callback.tsx can exchange the code (whichever fires first).
 */
export async function signInWithGoogle() {
  if (!supabase) {
    throw new Error('Supabase is not configured. Check your .env file.');
  }

  // PKCE: generate verifier and challenge
  const codeVerifier = generateVerifier();
  const codeChallenge = await generateChallenge(codeVerifier);

  // Persist verifier so the callback screen can also exchange the code
  await AsyncStorage.setItem(AUTH_VERIFIER_KEY, codeVerifier);

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
    await AsyncStorage.removeItem(AUTH_VERIFIER_KEY);
    throw new Error(error?.message || 'Failed to get Google auth URL');
  }

  // Open the browser for Google sign-in
  const WebBrowser = require('expo-web-browser');
  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUri);

  if (result.type === 'success' && result.url) {
    // Browser returned the URL — try to exchange here
    const url = new URL(result.url);
    const code = url.searchParams.get('code');
    if (code) {
      await exchangeAuthCode(code);
    }
    return { cancelled: false };
  }

  // User cancelled — clean up
  await AsyncStorage.removeItem(AUTH_VERIFIER_KEY);
  return { cancelled: true };
}

/**
 * Sign out the current user.
 */
export async function signOut() {
  if (!supabase) return;
  await supabase.auth.signOut();
}
