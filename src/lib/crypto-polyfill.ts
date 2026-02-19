/**
 * Polyfill globalThis.crypto for React Native.
 *
 * Supabase needs:
 *   - crypto.getRandomValues()  — for generating PKCE verifiers
 *   - crypto.subtle.digest()    — for SHA-256 code challenges
 *
 * Import this file BEFORE @supabase/supabase-js.
 */
import { digest, CryptoDigestAlgorithm, getRandomValues } from 'expo-crypto';

const algorithmMap: Record<string, CryptoDigestAlgorithm> = {
  'SHA-256': CryptoDigestAlgorithm.SHA256,
  'SHA-384': CryptoDigestAlgorithm.SHA384,
  'SHA-512': CryptoDigestAlgorithm.SHA512,
};

if (typeof globalThis.crypto === 'undefined') {
  (globalThis as any).crypto = {};
}

if (!globalThis.crypto.getRandomValues) {
  globalThis.crypto.getRandomValues = getRandomValues as typeof globalThis.crypto.getRandomValues;
}

if (!globalThis.crypto.subtle) {
  (globalThis.crypto as any).subtle = {
    digest: async (
      algorithm: AlgorithmIdentifier,
      data: BufferSource,
    ): Promise<ArrayBuffer> => {
      const algoName =
        typeof algorithm === 'string' ? algorithm : algorithm.name;
      const mapped = algorithmMap[algoName];
      if (!mapped) {
        throw new Error(`Unsupported digest algorithm: ${algoName}`);
      }
      return digest(mapped, data);
    },
  };
}
