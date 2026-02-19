/**
 * Polyfill globalThis.crypto.subtle.digest using expo-crypto.
 *
 * Supabase's PKCE flow requires crypto.subtle.digest('SHA-256', ...)
 * which isn't available in React Native. expo-crypto provides a
 * native digest() function that accepts ArrayBuffer, so we wire
 * it into the standard WebCrypto interface.
 *
 * Import this file BEFORE @supabase/supabase-js.
 */
import { digest, CryptoDigestAlgorithm } from 'expo-crypto';

const algorithmMap: Record<string, CryptoDigestAlgorithm> = {
  'SHA-256': CryptoDigestAlgorithm.SHA256,
  'SHA-384': CryptoDigestAlgorithm.SHA384,
  'SHA-512': CryptoDigestAlgorithm.SHA512,
};

if (typeof globalThis.crypto === 'undefined') {
  (globalThis as any).crypto = {};
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
