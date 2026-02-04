import { Session, User } from '@supabase/supabase-js';
import { supabase } from './supabase';

/**
 * Auth states:
 *   loading    — checking for existing session on app start
 *   unauthenticated — no session, show onboarding/sign-in
 *   authenticated   — session active, proceed to post-auth flow
 */
export type AuthStatus = 'loading' | 'unauthenticated' | 'authenticated';

export interface AuthState {
  status: AuthStatus;
  session: Session | null;
  user: User | null;
}

export const initialAuthState: AuthState = {
  status: 'loading',
  session: null,
  user: null,
};

/**
 * Check for an existing Supabase session on app start.
 * Returns the current auth state.
 */
export async function getInitialAuthState(): Promise<AuthState> {
  if (!supabase) {
    return { status: 'unauthenticated', session: null, user: null };
  }

  try {
    const { data, error } = await supabase.auth.getSession();

    if (error || !data.session) {
      return { status: 'unauthenticated', session: null, user: null };
    }

    return {
      status: 'authenticated',
      session: data.session,
      user: data.session.user,
    };
  } catch {
    return { status: 'unauthenticated', session: null, user: null };
  }
}

/**
 * Subscribe to auth state changes (sign in, sign out, token refresh).
 * Returns an unsubscribe function.
 */
export function onAuthStateChange(
  callback: (state: AuthState) => void
): () => void {
  if (!supabase) {
    callback({ status: 'unauthenticated', session: null, user: null });
    return () => {};
  }

  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    if (session) {
      callback({
        status: 'authenticated',
        session,
        user: session.user,
      });
    } else {
      callback({
        status: 'unauthenticated',
        session: null,
        user: null,
      });
    }
  });

  return () => data.subscription.unsubscribe();
}
