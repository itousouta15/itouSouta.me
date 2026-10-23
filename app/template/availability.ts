import { features, site } from "./config";

/** Server-only readiness. Public flags never contain credentials. */
export const available = {
  github: features.github && Boolean(site.githubUsername),
  discord: features.discord && Boolean(site.discordUserId),
  spotify:
    features.spotify &&
    Boolean(
      process.env.SPOTIFY_CLIENT_ID &&
      process.env.SPOTIFY_CLIENT_SECRET &&
      process.env.SPOTIFY_REFRESH_TOKEN
    ),
  threads: features.threads && Boolean(process.env.THREADS_ACCESS_TOKEN),
  liveThoughts:
    features.liveThoughts &&
    Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN),
  guestbook:
    features.guestbook &&
    Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN),
  impressions:
    features.impressions &&
    Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN),
  reactions:
    features.reactions &&
    Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN),
  vtuberLive: features.vtuberLive,
  publicApi: features.publicApi,
} as const;

export function unavailable(feature: keyof typeof available): Response | null {
  return available[feature]
    ? null
    : Response.json({ error: "Not found" }, { status: 404 });
}
