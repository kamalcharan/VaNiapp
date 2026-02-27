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
 * Checks whether the running app version is behind the active version
 * in `med_app_versions`. Returns platform-appropriate download URL.
 *
 * Returns `null` while loading or when the app is up to date.
 */
export function useForceUpdate(): UpdateInfo | null {
  const [update, setUpdate] = useState<UpdateInfo | null>(null);

  useEffect(() => {
    if (!supabase) return;

    const currentVersion = Constants.expoConfig?.version ?? '0.0.0';

    (async () => {
      const { data, error } = await supabase
        .from('med_app_versions')
        .select('version, release_notes, download_url, android_download_url, android_download_tinyurl, ios_download_url, ios_download_tinyurl, is_skippable')
        .eq('status', 'active')
        .limit(1)
        .single();

      if (error || !data) return;

      // Already on latest — nothing to show
      if (data.version === currentVersion) return;

      // Pick the best URL for this platform
      const isIOS = Platform.OS === 'ios';
      const downloadUrl = isIOS
        ? (data.ios_download_tinyurl || data.ios_download_url || data.download_url)
        : (data.android_download_tinyurl || data.android_download_url || data.download_url);

      setUpdate({
        latestVersion: data.version,
        releaseNotes: data.release_notes,
        downloadUrl,
        isSkippable: data.is_skippable ?? false,
      });
    })();
  }, []);

  return update;
}
