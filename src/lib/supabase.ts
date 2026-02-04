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

/**
 * Sign in with Google via Supabase OAuth + expo-auth-session.
 * Dependencies are lazy-loaded to avoid native module init at startup.
 */
export async function signInWithGoogle() {
  if (!supabase) {
    throw new Error('Supabase is not configured. Check your .env file.');
  }

  // Lazy-load to avoid native module initialization at app startup
  const AuthSession = require('expo-auth-session');
  const Crypto = require('expo-crypto');

  // PKCE flow: generate verifier and challenge
  const codeVerifier = AuthSession.generateCodeVerifier();
  const codeChallenge = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    codeVerifier,
    { encoding: Crypto.CryptoEncoding.BASE64 }
  );

  // Make the challenge URL-safe base64
  const codeChallengeUrlSafe = codeChallenge
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  // Build the redirect URI that Expo Go can handle
  // In Expo Go: exp://192.168.x.x:port/--/auth/callback
  // In standalone: vani://auth/callback
  const redirectUri = AuthSession.makeRedirectUri({ path: 'auth/callback' });

  // Get the OAuth URL from Supabase
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectUri,
      queryParams: {
        code_challenge: codeChallengeUrlSafe,
        code_challenge_method: 'S256',
      },
      skipBrowserRedirect: true,
    },
  });

  if (error || !data.url) {
    throw new Error(error?.message || 'Failed to get Google auth URL');
  }

  // Open the browser for Google sign-in
  const result = await AuthSession.openAuthSessionAsync(data.url, redirectUri);

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
