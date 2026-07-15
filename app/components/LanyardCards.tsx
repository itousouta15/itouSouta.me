"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { DISCORD_USER_ID } from "../data";
import { discordArtThumb } from "../lib/imageThumb";

/* ---------------------------------------------------------------------------
   Minimal Lanyard typings (only the fields we use)
   --------------------------------------------------------------------------- */
interface LanyardSpotify {
  song: string;
  artist: string;
  album: string;
  album_art_url: string;
  track_id?: string;
  timestamps?: { start: number; end: number };
}
interface LanyardActivity {
  type: number;
  name: string;
  state?: string;
  details?: string;
  application_id?: string;
  assets?: { large_image?: string; small_image?: string };
}
interface LanyardUser {
  id: string;
  username: string;
  global_name?: string | null;
  avatar: string | null;
}
interface LanyardData {
  discord_status: "online" | "idle" | "dnd" | "offline";
  listening_to_spotify: boolean;
  spotify: LanyardSpotify | null;
  discord_user: LanyardUser;
  activities: LanyardActivity[];
}

type State =
  | { kind: "unconfigured" }
  | { kind: "loading" }
  | { kind: "error" }
  | { kind: "ready"; data: LanyardData };

const POLL_MS = 15000;

/** Polls the Lanyard REST API for the configured Discord user. */
function useLanyard(): State {
  const [state, setState] = useState<State>(DISCORD_USER_ID ? { kind: "loading" } : { kind: "unconfigured" });

  useEffect(() => {
    if (!DISCORD_USER_ID) return;
    let alive = true;

    const load = async () => {
      try {
        const res = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`, { cache: "no-store" });
        const json = await res.json();
        if (!alive) return;
        if (json?.success && json.data) setState({ kind: "ready", data: json.data as LanyardData });
        else setState({ kind: "error" });
      } catch {
        if (alive) setState({ kind: "error" });
      }
    };

    load();
    const id = setInterval(load, POLL_MS);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  return state;
}

/* Share one poll between the avatar dot and the activity card. */
const LanyardContext = createContext<State | null>(null);

export function LanyardProvider({ children }: { children: ReactNode }) {
  const state = useLanyard();
  return <LanyardContext.Provider value={state}>{children}</LanyardContext.Provider>;
}

function useLanyardState(): State {
  return useContext(LanyardContext) ?? (DISCORD_USER_ID ? { kind: "loading" } : { kind: "unconfigured" });
}

const STATUS_META: Record<LanyardData["discord_status"], { label: string; cls: string }> = {
  online: { label: "上線中", cls: "online" },
  idle: { label: "閒置", cls: "idle" },
  dnd: { label: "請勿打擾", cls: "dnd" },
  offline: { label: "離線", cls: "offline" },
};

function placeholderText(state: State, readyFallback: string): string {
  if (state.kind === "unconfigured") return "尚未連結 Lanyard";
  if (state.kind === "loading") return "讀取中…";
  if (state.kind === "error") return "暫時無法取得狀態";
  return readyFallback;
}

// Discord activity types → verb. (0 玩 / 1 直播 / 2 聽 / 3 看 / 5 參加)
const ACT_VERB: Record<number, string> = {
  0: "正在玩",
  1: "正在直播",
  2: "正在聽",
  3: "正在看",
  5: "正在參加",
};

/** Resolves a Discord activity asset reference to an <img> URL. */
function activityImage(act: LanyardActivity): string | null {
  const asset = act.assets?.large_image;
  if (!asset) return null;
  if (asset.startsWith("mp:")) return `https://media.discordapp.net/${asset.slice(3)}`;
  if (/^https?:/.test(asset)) return asset;
  if (act.application_id) return `https://cdn.discordapp.com/app-assets/${act.application_id}/${asset}.webp`;
  return null;
}

/* ---------------------------------------------------------------------------
   Live status dot rendered on the profile avatar (mirrors Discord presence).
   --------------------------------------------------------------------------- */
export function ProfileStatusDot() {
  const state = useLanyardState();
  const [open, setOpen] = useState(false);
  const cls = state.kind === "ready" ? STATUS_META[state.data.discord_status].cls : "offline";
  const label = state.kind === "ready" ? STATUS_META[state.data.discord_status].label : placeholderText(state, "離線");
  return (
    <span
      className={`status-dot ${cls}`}
      role="button"
      tabIndex={0}
      title={label}
      aria-label={label}
      onClick={() => setOpen(o => !o)}
      onBlur={() => setOpen(false)}
    >
      {open && <span className="status-bubble">{label}</span>}
    </span>
  );
}

/* ---------------------------------------------------------------------------
   Discord-style activity card in the profile sidebar. Lanyard's Discord
   presence already carries the Spotify "now playing", so this renders the
   current activity (Spotify / game / watching / …). The online state itself
   lives on the avatar dot above.
   --------------------------------------------------------------------------- */
export function ProfileStatus() {
  const state = useLanyardState();
  const [now, setNow] = useState(() => Date.now());

  const ready = state.kind === "ready" ? state.data : null;
  const spotify = ready && ready.listening_to_spotify ? ready.spotify : null;

  // First non-custom-status activity (game / streaming / watching / …).
  const activity = !spotify ? ready?.activities.find(a => a.type !== 4) : undefined;

  useEffect(() => {
    if (!spotify?.timestamps) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [spotify?.timestamps?.start, spotify?.timestamps?.end]);

  let progress = 0;
  if (spotify?.timestamps) {
    const { start, end } = spotify.timestamps;
    progress = Math.min(1, Math.max(0, (now - start) / (end - start)));
  }

  // Rich activity layout: when `details` exists it is the main line and the
  // app name moves into the kicker; otherwise the name is the main line.
  let actImg: string | null = null;
  let actKicker = "";
  let actTitle = "";
  let actSub: string | undefined;
  if (activity) {
    actImg = activityImage(activity);
    const verb = ACT_VERB[activity.type] ?? "狀態";
    actTitle = activity.details || activity.name;
    actKicker = activity.details ? `${verb} · ${activity.name}` : verb;
    actSub = activity.state || undefined;
  }

  return (
    <div className="dc-status">
      {spotify ? (
        <div className="dc-act dc-act-spotify">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="dc-act-art" src={discordArtThumb(spotify.album_art_url)} alt={spotify.album} />
          <div className="dc-act-meta">
            <div className="dc-act-kicker">
              <SpotifyGlyph />
              正在聽 Spotify
            </div>
            <div className="dc-act-title" title={spotify.song}>
              {spotify.song}
            </div>
            <div className="dc-act-sub" title={spotify.artist}>
              {spotify.artist}
            </div>
            {spotify.timestamps && (
              <div className="spotify-bar">
                <span style={{ width: `${progress * 100}%` }} />
              </div>
            )}
          </div>
        </div>
      ) : activity ? (
        <div className="dc-act">
          {actImg && (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="dc-act-art" src={discordArtThumb(actImg)} alt="" />
          )}
          <div className="dc-act-meta">
            <div className="dc-act-kicker">{actKicker}</div>
            <div className="dc-act-title" title={actTitle}>
              {actTitle}
            </div>
            {actSub && (
              <div className="dc-act-sub" title={actSub}>
                {actSub}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="dc-act dc-act-idle">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="dc-act-art" src="/assets/cat.webp" alt="" />
          <div className="dc-act-meta">
            <div className="dc-act-title">這個人不知道跑哪去了。</div>
            <div className="dc-act-sub">大概是在睡覺吧Zzzz</div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------------------
   Inline glyphs
   --------------------------------------------------------------------------- */
function SpotifyGlyph() {
  return (
    <svg className="status-glyph spotify" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 0a12 12 0 1 0 0 24 12 12 0 0 0 0-24Zm5.5 17.3a.75.75 0 0 1-1 .25c-2.8-1.7-6.3-2.1-10.4-1.15a.75.75 0 1 1-.33-1.46c4.5-1 8.4-.55 11.5 1.36.35.22.46.69.23 1Zm1.47-3.27a.94.94 0 0 1-1.29.31c-3.2-1.97-8.08-2.54-11.86-1.39a.94.94 0 1 1-.55-1.8c4.32-1.31 9.7-.68 13.38 1.59.44.27.58.85.32 1.29Zm.13-3.4C15.8 8.36 9.5 8.13 5.9 9.22a1.12 1.12 0 1 1-.65-2.15c4.13-1.25 11.1-1 15.48 1.6a1.12 1.12 0 1 1-1.15 1.92Z" />
    </svg>
  );
}
