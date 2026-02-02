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
 * These use free SoundHelix samples as placeholders.
 * Replace the URIs with your own licensed lo-fi / ambient tracks before launch.
 */
export const TRACKS: Track[] = [
  {
    id: 'track-1',
    title: 'Calm Focus',
    artist: 'VaNi Beats',
    emoji: '\uD83C\uDF19',
    uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    id: 'track-2',
    title: 'Midnight Study',
    artist: 'VaNi Beats',
    emoji: '\uD83C\uDF03',
    uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
  {
    id: 'track-3',
    title: 'Rain on Paper',
    artist: 'VaNi Beats',
    emoji: '\uD83C\uDF27\uFE0F',
    uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  },
  {
    id: 'track-4',
    title: 'Soft Waves',
    artist: 'VaNi Beats',
    emoji: '\uD83C\uDF0A',
    uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
  },
  {
    id: 'track-5',
    title: 'Library Hum',
    artist: 'VaNi Beats',
    emoji: '\uD83D\uDCDA',
    uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
  },
  {
    id: 'track-6',
    title: 'Deep Breath',
    artist: 'VaNi Beats',
    emoji: '\uD83C\uDF3F',
    uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
  },
];
