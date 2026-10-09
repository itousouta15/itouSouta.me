import { createClient } from "@vercel/kv";
import { getRecentlyPlayedTracks } from "./spotify";

const COUNTS_KEY = "spotify:play-history:counts";
const SEEN_KEY = "spotify:play-history:seen";
const META_KEY = "spotify:play-history:meta";
const LEASE_KEY = "spotify:play-history:sync-lease";

// 計數和 Redis 寫入不能進 Next.js fetch 快取。
function historyStore() {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) throw new Error("Missing KV configuration");
  return createClient({ url, token, cache: "no-store" });
}

export type RecordingStatus =
  "ready" | "needs-authorization" | "not-configured" | "unavailable";

export interface MusicRecording {
  status: RecordingStatus;
  startedAt: string | null;
  lastSyncedAt: string | null;
}

export interface HistorySyncResult {
  status: "synced" | "throttled" | Exclude<RecordingStatus, "ready">;
  added: number;
}

/* 整批去重與累加由 Redis 原子執行。歌曲 ID + played_at 區分真正的重播；
   重複同步、頁面重新整理、同時到來的請求都不會把同一筆播放算兩次。
   seen 保留，不會因為某段時間沒有聽歌、舊紀錄再次出現而重新計數。 */
const RECORD_PLAYS = `
local added = 0
for i = 3, #ARGV, 2 do
  if redis.call('SISMEMBER', KEYS[2], ARGV[i + 1]) == 0 then
    redis.call('HINCRBY', KEYS[1], ARGV[i], 1)
    redis.call('SADD', KEYS[2], ARGV[i + 1])
    added = added + 1
  end
end
redis.call('HSETNX', KEYS[3], 'startedAt', ARGV[2])
redis.call('HSET', KEYS[3], 'lastSyncedAt', ARGV[1], 'status', 'ready')
return added
`;

export async function syncSpotifyPlayHistory(): Promise<HistorySyncResult> {
  if (
    !process.env.SPOTIFY_CLIENT_ID ||
    !process.env.SPOTIFY_CLIENT_SECRET ||
    !process.env.SPOTIFY_REFRESH_TOKEN
  ) {
    return { status: "not-configured", added: 0 };
  }
  try {
    const kv = historyStore();
    // 跨 serverless 實例共用的五分鐘節流；失敗也稍後才重試，避免重複打 Spotify。
    const lease = await kv.set(LEASE_KEY, "1", { nx: true, ex: 300 });
    if (!lease) return { status: "throttled", added: 0 };
    const result = await getRecentlyPlayedTracks();
    if (!result.plays) {
      const status =
        result.reason === "history-http-403"
          ? "needs-authorization"
          : "unavailable";
      await kv.hset(META_KEY, { status });
      return { status, added: 0 };
    }
    const now = new Date().toISOString();
    const earliest = result.plays.reduce(
      (min, play) => (play.playedAt < min ? play.playedAt : min),
      now
    );
    const args = [now, earliest];
    for (const play of result.plays)
      args.push(play.trackId, `${play.trackId}:${play.playedAt}`);
    const added = await kv.eval<string[], number>(
      RECORD_PLAYS,
      [COUNTS_KEY, SEEN_KEY, META_KEY],
      args
    );
    return { status: "synced", added };
  } catch {
    return { status: "unavailable", added: 0 };
  }
}

export async function getSpotifyPlayStats(ids: string[]): Promise<{
  counts: Record<string, number | null> | null;
  recording: MusicRecording;
}> {
  const unavailable: MusicRecording = {
    status: "unavailable",
    startedAt: null,
    lastSyncedAt: null,
  };
  try {
    const kv = historyStore();
    const [counts, meta] = await Promise.all([
      ids.length
        ? kv.hmget<Record<string, number | null>>(COUNTS_KEY, ...ids)
        : Promise.resolve({}),
      kv.hgetall<{
        status?: RecordingStatus;
        startedAt?: string;
        lastSyncedAt?: string;
      }>(META_KEY),
    ]);
    const validDate = (value: unknown) =>
      typeof value === "string" && Number.isFinite(Date.parse(value))
        ? value
        : null;
    return {
      counts: counts ?? {},
      recording: {
        status: meta?.status ?? "unavailable",
        startedAt: validDate(meta?.startedAt),
        lastSyncedAt: validDate(meta?.lastSyncedAt),
      },
    };
  } catch {
    return { counts: null, recording: unavailable };
  }
}
