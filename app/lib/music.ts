import { getTopTracks, type TopTrack } from "./spotify";

export interface MusicTrack extends TopTrack {
  rank: number;
}

export interface MusicSnapshot {
  tracks: MusicTrack[];
}

export async function getMusicSnapshot(
  options?: Parameters<typeof getTopTracks>[0]
): Promise<MusicSnapshot> {
  const topTracks = await getTopTracks(options);
  return {
    tracks: (topTracks ?? []).map((track, index) => ({
      ...track,
      rank: index + 1,
    })),
  };
}
