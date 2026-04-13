/**
 * verify-play-purchase
 *
 * Verifies a Google Play subscription purchase token server-side using the
 * Google Play Developer API before the client activates the subscription.
 *
 * Required Supabase secrets (set via `supabase secrets set`):
 *   GOOGLE_PLAY_PACKAGE_NAME   — e.g. com.vikuna.vaniapp
 *   GOOGLE_PLAY_SERVICE_ACCOUNT_JSON — full JSON of the service account key
 *
 * Request body:
 *   { purchaseToken: string, productId: string, packageName: string }
 *
 * Response:
 *   200 { valid: true, expiryTimeMillis: string }
 *   400 { error: string }
 *   401 { error: "Unauthorized" }
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS });
  }

  // ── Auth: require valid Supabase JWT ────────────────────────
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: authHeader } } },
  );

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }

  // ── Parse body ──────────────────────────────────────────────
  let body: { purchaseToken?: string; productId?: string; packageName?: string };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }

  const { purchaseToken, productId, packageName } = body;
  if (!purchaseToken || !productId || !packageName) {
    return new Response(
      JSON.stringify({ error: 'purchaseToken, productId, and packageName are required' }),
      { status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } },
    );
  }

  // ── Load service account ────────────────────────────────────
  const serviceAccountJson = Deno.env.get('GOOGLE_PLAY_SERVICE_ACCOUNT_JSON');
  if (!serviceAccountJson) {
    return new Response(
      JSON.stringify({ error: 'Server misconfiguration: missing service account' }),
      { status: 500, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } },
    );
  }

  let serviceAccount: any;
  try {
    serviceAccount = JSON.parse(serviceAccountJson);
  } catch {
    return new Response(
      JSON.stringify({ error: 'Server misconfiguration: invalid service account JSON' }),
      { status: 500, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } },
    );
  }

  // ── Get Google OAuth2 access token ──────────────────────────
  let accessToken: string;
  try {
    accessToken = await getGoogleAccessToken(serviceAccount);
  } catch (e: any) {
    return new Response(
      JSON.stringify({ error: `Failed to authenticate with Google: ${e.message}` }),
      { status: 500, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } },
    );
  }

  // ── Call Play Developer API ─────────────────────────────────
  const apiUrl =
    `https://androidpublisher.googleapis.com/androidpublisher/v3/applications` +
    `/${packageName}/purchases/subscriptions/${productId}/tokens/${purchaseToken}`;

  const playRes = await fetch(apiUrl, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!playRes.ok) {
    const errBody = await playRes.text();
    return new Response(
      JSON.stringify({ error: `Play API error ${playRes.status}: ${errBody}` }),
      { status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } },
    );
  }

  const playData = await playRes.json();

  // paymentState: 0=pending, 1=received, 2=free trial, 3=deferred
  const isPaid = playData.paymentState === 1 || playData.paymentState === 2;
  if (!isPaid) {
    return new Response(
      JSON.stringify({ error: 'Payment not confirmed by Play Store', valid: false }),
      { status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } },
    );
  }

  return new Response(
    JSON.stringify({ valid: true, expiryTimeMillis: playData.expiryTimeMillis }),
    { status: 200, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } },
  );
});

// ── Helper: get short-lived Google access token via JWT ──────

async function getGoogleAccessToken(serviceAccount: any): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const claim = {
    iss: serviceAccount.client_email,
    scope: 'https://www.googleapis.com/auth/androidpublisher',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  };

  const header = { alg: 'RS256', typ: 'JWT' };
  const encode = (obj: object) =>
    btoa(JSON.stringify(obj)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

  const signingInput = `${encode(header)}.${encode(claim)}`;

  // Import the RSA private key
  const privateKeyPem = serviceAccount.private_key
    .replace(/-----BEGIN PRIVATE KEY-----/, '')
    .replace(/-----END PRIVATE KEY-----/, '')
    .replace(/\s/g, '');

  const keyData = Uint8Array.from(atob(privateKeyPem), (c) => c.charCodeAt(0));
  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8',
    keyData,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign'],
  );

  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    cryptoKey,
    new TextEncoder().encode(signingInput),
  );

  const sigB64 = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

  const jwt = `${signingInput}.${sigB64}`;

  // Exchange JWT for access token
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });

  if (!tokenRes.ok) {
    const err = await tokenRes.text();
    throw new Error(`Token exchange failed: ${err}`);
  }

  const tokenData = await tokenRes.json();
  return tokenData.access_token;
}
