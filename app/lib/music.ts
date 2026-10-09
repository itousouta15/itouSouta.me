import { getTopTracks, type TopTrack } from "./spotify";
import { getSpotifyPlayStats, type MusicRecording } from "./spotifyHistory";

export interface MusicTrack extends TopTrack {
  rank: number;
  recordedPlays: number | null;
}

export interface MusicSnapshot {
  tracks: MusicTrack[];
  recording: MusicRecording;
}

export async function getMusicSnapshot(
  options?: Parameters<typeof getTopTracks>[0]
): Promise<MusicSnapshot> {
  // 頁面只讀統計，同步由排程入口負責，避免 ISR／建置期間執行寫入。
  const topTracks = await getTopTracks(options);
  const tracks = topTracks ?? [];
  const { counts, recording } = await getSpotifyPlayStats(
    tracks.map((track) => track.id)
  );
  if (
    !process.env.SPOTIFY_CLIENT_ID ||
    !process.env.SPOTIFY_CLIENT_SECRET ||
    !process.env.SPOTIFY_REFRESH_TOKEN
  )
    recording.status = "not-configured";
  return {
    tracks: tracks.map((track, index) => {
      const count = counts?.[track.id] ?? 0;
      return {
        ...track,
        rank: index + 1,
        recordedPlays:
          counts &&
          recording.startedAt &&
          Number.isSafeInteger(count) &&
          count >= 0
            ? count
            : null,
      };
    }),
    recording,
  };
}
