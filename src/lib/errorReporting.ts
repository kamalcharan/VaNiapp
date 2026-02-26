import { Platform } from 'react-native';
import { supabase } from './supabase';

// ── Types ────────────────────────────────────────────────────

type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';

interface ErrorReport {
  message: string;
  stack?: string;
  severity: ErrorSeverity;
  context?: string;       // e.g. "RootLayout.auth", "QuizScreen.sync"
  componentStack?: string; // React error boundary componentStack
  userId?: string;
  extra?: Record<string, unknown>;
}

// ── In-memory dedup ──────────────────────────────────────────
// Prevents the same error from flooding the DB in a tight loop.
const _recentErrors = new Map<string, number>();
const DEDUP_WINDOW_MS = 30_000; // 30 seconds

function isDuplicate(fingerprint: string): boolean {
  const now = Date.now();
  const lastSeen = _recentErrors.get(fingerprint);
  if (lastSeen && now - lastSeen < DEDUP_WINDOW_MS) return true;
  _recentErrors.set(fingerprint, now);
  // Prune old entries
  if (_recentErrors.size > 100) {
    for (const [key, ts] of _recentErrors) {
      if (now - ts > DEDUP_WINDOW_MS) _recentErrors.delete(key);
    }
  }
  return false;
}

// ── Core reporter ────────────────────────────────────────────

/**
 * Report an error to Supabase `med_error_logs` table + console.warn.
 * Fire-and-forget — never throws.
 */
export function reportError(
  error: unknown,
  severity: ErrorSeverity = 'medium',
  context?: string,
  extra?: Record<string, unknown>,
): void {
  const report = normalizeError(error, severity, context, extra);

  // Always log to console for dev visibility
  console.warn(`[VaNi Error] [${report.severity}] ${report.context ?? ''}:`, report.message);

  const fingerprint = `${report.context}:${report.message}`;
  if (isDuplicate(fingerprint)) return;

  // Fire-and-forget persist to Supabase
  persistError(report).catch(() => {
    // Last-resort: if even persisting fails, there's nothing else we can do
  });
}

/**
 * Capture a React Error Boundary crash.
 */
export function reportCrash(
  error: unknown,
  componentStack?: string,
): void {
  const report = normalizeError(error, 'critical', 'ErrorBoundary');
  report.componentStack = componentStack ?? undefined;

  console.error('[VaNi CRASH]', report.message, componentStack);

  const fingerprint = `crash:${report.message}`;
  if (isDuplicate(fingerprint)) return;

  persistError(report).catch(() => {});
}

// ── Normalize any thrown value ───────────────────────────────

function normalizeError(
  error: unknown,
  severity: ErrorSeverity,
  context?: string,
  extra?: Record<string, unknown>,
): ErrorReport {
  if (error instanceof Error) {
    return {
      message: error.message,
      stack: error.stack,
      severity,
      context,
      extra,
    };
  }
  return {
    message: String(error),
    severity,
    context,
    extra,
  };
}

// ── Persist to Supabase ─────────────────────────────────────

async function persistError(report: ErrorReport): Promise<void> {
  if (!supabase) return;

  // Try to get current user ID (non-blocking)
  let userId: string | undefined;
  try {
    const { data } = await supabase.auth.getUser();
    userId = data.user?.id;
  } catch {
    // Can't get user — that's okay
  }

  const Constants = require('expo-constants').default;
  const appVersion: string = Constants.expoConfig?.version ?? '0.0.0';

  await supabase.from('med_error_logs').insert({
    user_id: userId ?? null,
    severity: report.severity,
    message: report.message.slice(0, 2000),
    stack: (report.stack ?? '').slice(0, 5000),
    component_stack: (report.componentStack ?? '').slice(0, 3000),
    context: report.context ?? null,
    extra: report.extra ?? null,
    app_version: appVersion,
    platform: Platform.OS,
  });
}

// ── Global JS error handler ─────────────────────────────────

/**
 * Attach a global handler for uncaught JS errors + unhandled promise rejections.
 * Call once in root layout.
 */
export function installGlobalErrorHandler(): void {
  // Unhandled promise rejections
  const originalHandler = (globalThis as any).onunhandledrejection;
  (globalThis as any).onunhandledrejection = (event: any) => {
    reportError(event?.reason ?? 'Unhandled promise rejection', 'high', 'unhandledRejection');
    originalHandler?.(event);
  };

  // Global JS errors (React Native)
  const originalErrorHandler = ErrorUtils?.getGlobalHandler?.();
  ErrorUtils?.setGlobalHandler?.((error: Error, isFatal?: boolean) => {
    reportError(error, isFatal ? 'critical' : 'high', 'globalHandler');
    originalErrorHandler?.(error, isFatal);
  });
}
