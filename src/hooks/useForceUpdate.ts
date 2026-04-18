import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { supabase } from '../lib/supabase';

export interface UpdateInfo {
  latestVersion: string;
  releaseNotes: string | null;
  downloadUrl: string | null;
  isSkippable: boolean;
}

/**
 * iOS: queries `med_app_versions` and returns an UpdateInfo for the modal.
 * Android fallback: same, used when Play Store is not available (sideloaded APK).
 */
async function checkDbForUpdate(): Promise<UpdateInfo | null> {
  if (!supabase) return null;

  const currentVersion = Constants.expoConfig?.version ?? '0.0.0';

  const { data, error } = await supabase
    .from('med_app_versions')
    .select(
      'version, release_notes, download_url, android_download_url, android_download_tinyurl, ios_download_url, ios_download_tinyurl, is_skippable'
    )
    .eq('status', 'active')
    .limit(1)
    .single();

  if (error || !data) return null;
  if (data.version === currentVersion) return null;

  const isIOS = Platform.OS === 'ios';
  const downloadUrl = isIOS
    ? (data.ios_download_tinyurl || data.ios_download_url || data.download_url)
    : (data.android_download_tinyurl || data.android_download_url || data.download_url);

  return {
    latestVersion: data.version,
    releaseNotes: data.release_notes,
    downloadUrl,
    isSkippable: data.is_skippable ?? false,
  };
}

/**
 * Checks for app updates.
 *
 * Android: uses Google Play In-App Updates API (IMMEDIATE mode — mandatory).
 *   Falls back to DB-based modal if the Play Store API is unavailable
 *   (e.g., sideloaded APK or pre-production testing).
 *
 * iOS: queries `med_app_versions` and shows an update modal with the
 *   App Store URL stored in the DB.
 *
 * Returns `null` while loading or when the app is already up to date.
 * On Android with Play Store, returns `null` because the native UI takes over.
 */
export function useForceUpdate(): UpdateInfo | null {
  const [update, setUpdate] = useState<UpdateInfo | null>(null);

  useEffect(() => {
    (async () => {
      // Skip all update checks on debug / dev-client / Expo Go builds.
      // The DB version is almost always newer than the running dev version,
      // which would pop the force-update modal and block testing.
      // Play Store's startUpdate() also crashes on debug-signed APKs with
      // "failed to download remote update" from native code.
      if (__DEV__) return;

      if (Platform.OS === 'android') {
        try {
          // Lazy-require so Expo Go (which lacks this native module) can
          // still bundle. Only production/dev-client builds reach this path.
          const {
            default: SpInAppUpdates,
            IAUUpdateKind,
          } = require('sp-react-native-in-app-updates');

          const inAppUpdates = new SpInAppUpdates(false);
          const result = await inAppUpdates.checkNeedsUpdate();
          if (result.shouldUpdate) {
            // Native Play Store overlay handles the update — no in-app modal needed
            await inAppUpdates.startUpdate({ updateType: IAUUpdateKind.IMMEDIATE });
          }
          // If shouldUpdate is false, Play Store says app is current — nothing to do
        } catch {
          // Play Store not reachable (sideloaded / dev build) — fall back to DB check
          const info = await checkDbForUpdate();
          if (info) setUpdate(info);
        }
      } else {
        // iOS: DB check + App Store URL modal
        const info = await checkDbForUpdate();
        if (info) setUpdate(info);
      }
    })();
  }, []);

  return update;
}
