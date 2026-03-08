import * as Sentry from '@sentry/react-native';
import { Platform } from 'react-native';
import { supabase } from './supabase';

// ── Types ────────────────────────────────────────────────────

type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';

const SENTRY_LEVEL: Record<ErrorSeverity, Sentry.SeverityLevel> = {
  low: 'info',
  medium: 'warning',
  high: 'error',
  critical: 'fatal',
};

// ── In-memory dedup ──────────────────────────────────────────
const _recentErrors = new Map<string, number>();
const DEDUP_WINDOW_MS = 30_000;

function isDuplicate(fingerprint: string): boolean {
  const now = Date.now();
  const lastSeen = _recentErrors.get(fingerprint);
  if (lastSeen && now - lastSeen < DEDUP_WINDOW_MS) return true;
  _recentErrors.set(fingerprint, now);
  if (_recentErrors.size > 100) {
    for (const [key, ts] of _recentErrors) {
      if (now - ts > DEDUP_WINDOW_MS) _recentErrors.delete(key);
    }
  }
  return false;
}

// ── Initialize Sentry ────────────────────────────────────────

export function initSentry(): void {
  const dsn = process.env.EXPO_PUBLIC_SENTRY_DSN || '';
  if (!dsn) {
    console.warn('[VaNi] EXPO_PUBLIC_SENTRY_DSN not set — error reporting disabled');
    return;
  }

  Sentry.init({
    dsn,
    debug: __DEV__,
    environment: __DEV__ ? 'development' : 'production',
    // Send 100% of errors, sample 20% of transactions for performance
    tracesSampleRate: __DEV__ ? 1.0 : 0.2,
    // Attach user info automatically
    sendDefaultPii: true,
    // Don't send in dev by default (noisy) — flip to true when testing Sentry
    enabled: !__DEV__,
  });
}

// ── Set user context (call after auth) ──────────────────────

export function setSentryUser(user: { id: string; email?: string; name?: string } | null): void {
  if (user) {
    Sentry.setUser({ id: user.id, email: user.email, username: user.name });
  } else {
    Sentry.setUser(null);
  }
}

// ── Core reporter ────────────────────────────────────────────

/**
 * Report an error to Sentry + console.
 * context = screen/function name, e.g. "PracticeExam.syncProgress"
 */
export function reportError(
  error: unknown,
  severity: ErrorSeverity = 'medium',
  context?: string,
  extra?: Record<string, unknown>,
): void {
  const err = toError(error);

  // Use console.log instead of console.warn to avoid React Native's
  // yellow warning banner in dev mode — these go to Sentry regardless.
  if (__DEV__) {
    console.log(`[VaNi Error] [${severity}] ${context ?? ''}:`, err.message);
  }

  const fingerprint = `${context}:${err.message}`;
  if (isDuplicate(fingerprint)) return;

  Sentry.withScope((scope) => {
    scope.setLevel(SENTRY_LEVEL[severity]);
    if (context) scope.setTag('context', context);
    if (extra) scope.setExtras(extra);
    scope.setTag('platform', Platform.OS);
    Sentry.captureException(err);
  });
}

/**
 * Capture a React Error Boundary crash — always critical.
 */
export function reportCrash(
  error: unknown,
  componentStack?: string,
): void {
  const err = toError(error);

  console.error('[VaNi CRASH]', err.message, componentStack);

  const fingerprint = `crash:${err.message}`;
  if (isDuplicate(fingerprint)) return;

  Sentry.withScope((scope) => {
    scope.setLevel('fatal');
    scope.setTag('context', 'ErrorBoundary');
    if (componentStack) {
      scope.setExtra('componentStack', componentStack);
    }
    Sentry.captureException(err);
  });
}

// ── Navigation tracking ──────────────────────────────────────

/**
 * Call when the active screen changes so Sentry breadcrumbs
 * and error reports include which page the user was on.
 */
export function setCurrentScreen(screenName: string): void {
  Sentry.addBreadcrumb({
    category: 'navigation',
    message: screenName,
    level: 'info',
  });
  Sentry.setTag('screen', screenName);
}

// ── Helpers ──────────────────────────────────────────────────

function toError(error: unknown): Error {
  if (error instanceof Error) return error;
  return new Error(String(error));
}

// ── Global JS error handler ─────────────────────────────────

/**
 * Attach a global handler for uncaught JS errors + unhandled promise rejections.
 * Sentry's init already does this, but we add context tags.
 */
export function installGlobalErrorHandler(): void {
  const originalHandler = (globalThis as any).onunhandledrejection;
  (globalThis as any).onunhandledrejection = (event: any) => {
    reportError(event?.reason ?? 'Unhandled promise rejection', 'high', 'unhandledRejection');
    originalHandler?.(event);
  };

  const originalErrorHandler = ErrorUtils?.getGlobalHandler?.();
  ErrorUtils?.setGlobalHandler?.((error: Error, isFatal?: boolean) => {
    reportError(error, isFatal ? 'critical' : 'high', 'globalHandler');
    originalErrorHandler?.(error, isFatal);
  });
}
