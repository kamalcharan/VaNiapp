export interface Track {
  id: string;
  title: string;
  artist: string;
  emoji: string;
  /** Remote URL or local asset URI. Replace with your own licensed tracks. */
  uri: string;
}

/**
 * Ambient / lo-fi tracks for focus mode.
 *
 * Tracks sourced from lofi-resources (github.com/ItzAshOffcl/lofi-resources).
 * Served via raw.githubusercontent.com (audio/mpeg, ~1.8 MB each).
 * Mix of chill, jazzy, and sleepy moods.
 */
const RAW_BASE =
  'https://raw.githubusercontent.com/ItzAshOffcl/lofi-resources/main/tracks';

export const TRACKS: Track[] = [
  {
    id: 'track-1',
    title: 'Calm Focus',
    artist: 'Lofi Chill',
    emoji: '\uD83C\uDF19',
    uri: `${RAW_BASE}/chill/chill_1.mp3`,
  },
  {
    id: 'track-2',
    title: 'Midnight Study',
    artist: 'Lofi Chill',
    emoji: '\uD83C\uDF03',
    uri: `${RAW_BASE}/chill/chill_5.mp3`,
  },
  {
    id: 'track-3',
    title: 'Rain on Paper',
    artist: 'Lofi Jazzy',
    emoji: '\uD83C\uDF27\uFE0F',
    uri: `${RAW_BASE}/jazzy/jazzy_3.mp3`,
  },
  {
    id: 'track-4',
    title: 'Soft Waves',
    artist: 'Lofi Jazzy',
    emoji: '\uD83C\uDF0A',
    uri: `${RAW_BASE}/jazzy/jazzy_8.mp3`,
  },
  {
    id: 'track-5',
    title: 'Library Hum',
    artist: 'Lofi Sleepy',
    emoji: '\uD83D\uDCDA',
    uri: `${RAW_BASE}/sleepy/sleepy_2.mp3`,
  },
  {
    id: 'track-6',
    title: 'Deep Breath',
    artist: 'Lofi Sleepy',
    emoji: '\uD83C\uDF3F',
    uri: `${RAW_BASE}/sleepy/sleepy_10.mp3`,
  },
];
