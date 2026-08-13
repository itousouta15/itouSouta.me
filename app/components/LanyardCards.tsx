"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { DISCORD_USER_ID } from "../siteConfig";
import { discordArtThumb } from "../lib/imageThumb";
import CrossfadeImage from "./CrossfadeImage";

/* ---------------------------------------------------------------------------
   Minimal Lanyard typings (only the fields we use)
   --------------------------------------------------------------------------- */
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
  const [state, setState] = useState<State>(
    DISCORD_USER_ID ? { kind: "loading" } : { kind: "unconfigured" }
  );

  useEffect(() => {
    if (!DISCORD_USER_ID) return;
    let alive = true;

    const load = async () => {
      // Provider 在 root layout，所有頁面都會常駐輪詢——背景分頁不做事
      if (document.visibilityState !== "visible") return;
      try {
        const res = await fetch(
          `https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`,
          { cache: "no-store" }
        );
        const json = await res.json();
        if (!alive) return;
        if (json?.success && json.data)
          setState({ kind: "ready", data: json.data as LanyardData });
        else setState({ kind: "error" });
      } catch {
        if (alive) setState({ kind: "error" });
      }
    };

    load();
    const id = setInterval(load, POLL_MS);
    // 分頁切回前景時立刻補一筆，不用等下一次 interval
    const onVisible = () => {
      if (document.visibilityState === "visible") load();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      alive = false;
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  return state;
}

/* Share one poll between the avatar dot and the activity card. */
const LanyardContext = createContext<State | null>(null);

export function LanyardProvider({ children }: { children: ReactNode }) {
  const state = useLanyard();
  return (
    <LanyardContext.Provider value={state}>{children}</LanyardContext.Provider>
  );
}

export function useLanyardState(): State {
  return (
    useContext(LanyardContext) ??
    (DISCORD_USER_ID ? { kind: "loading" } : { kind: "unconfigured" })
  );
}

/* ---------------------------------------------------------------------------
   Now Playing：走 /api/now-playing，伺服器端直接打 Spotify Web API 拿目前播放
   中的曲目，跟上面的 Lanyard 輪詢分開。Discord 的 Spotify 活動是靠 Discord 用
   戶端轉發的，手機上沒開 app 就抓不到——這裡直接問 Spotify 帳號本身，不受這個
   限制。ProfileStatus 跟 NowPlayingBar 共用同一份輪詢，避免兩邊各打一次。
   --------------------------------------------------------------------------- */
export interface NowPlayingTrack {
  song: string;
  artist: string;
  album: string;
  albumArt: string;
  href: string | null;
  isPlaying: boolean;
  progressMs: number;
  durationMs: number;
  fetchedAt: number;
}

type NowPlayingState =
  | { kind: "loading" }
  | { kind: "error" }
  | { kind: "idle" }
  | { kind: "playing"; track: NowPlayingTrack };

function useNowPlayingPoll(): NowPlayingState {
  const [state, setState] = useState<NowPlayingState>({ kind: "loading" });

  useEffect(() => {
    let alive = true;

    const load = async () => {
      if (document.visibilityState !== "visible") return;
      try {
        const res = await fetch("/api/now-playing", { cache: "no-store" });
        const json = await res.json();
        if (!alive) return;
        if (!json) {
          setState({ kind: "idle" });
          return;
        }
        setState({
          kind: "playing",
          track: {
            song: json.song,
            artist: json.artist,
            album: json.album,
            albumArt: json.album_art_url,
            href: json.href ?? null,
            isPlaying: !!json.is_playing,
            progressMs: json.progress_ms ?? 0,
            durationMs: json.duration_ms ?? 0,
            fetchedAt: Date.now(),
          },
        });
      } catch {
        if (alive) setState({ kind: "error" });
      }
    };

    load();
    const id = setInterval(load, POLL_MS);
    const onVisible = () => {
      if (document.visibilityState === "visible") load();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      alive = false;
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  return state;
}

const NowPlayingContext = createContext<NowPlayingState | null>(null);

export function NowPlayingProvider({ children }: { children: ReactNode }) {
  const state = useNowPlayingPoll();
  return (
    <NowPlayingContext.Provider value={state}>
      {children}
    </NowPlayingContext.Provider>
  );
}

export function useNowPlayingState(): NowPlayingState {
  return useContext(NowPlayingContext) ?? { kind: "loading" };
}

const STATUS_META: Record<
  LanyardData["discord_status"],
  { label: string; cls: string }
> = {
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
  if (asset.startsWith("mp:"))
    return `https://media.discordapp.net/${asset.slice(3)}`;
  if (/^https?:/.test(asset)) return asset;
  if (act.application_id)
    return `https://cdn.discordapp.com/app-assets/${act.application_id}/${asset}.webp`;
  return null;
}

/* ---------------------------------------------------------------------------
   Live status dot rendered on the profile avatar (mirrors Discord presence).
   --------------------------------------------------------------------------- */
export function ProfileStatusDot() {
  const state = useLanyardState();
  const cls =
    state.kind === "ready"
      ? STATUS_META[state.data.discord_status].cls
      : "offline";
  const label =
    state.kind === "ready"
      ? STATUS_META[state.data.discord_status].label
      : placeholderText(state, "離線");
  return (
    <span
      className={`status-dot ${cls}`}
      title={label}
      role="img"
      aria-label={label}
    />
  );
}

/* ---------------------------------------------------------------------------
   Discord-style activity cards in the profile sidebar. Renders the Spotify
   "now playing" (from the Spotify Web API poll) alongside every non-custom
   Lanyard activity (game / streaming / watching / …), so several can show at
   once. The online state itself lives on the avatar dot above.
   --------------------------------------------------------------------------- */
export function ProfileStatus() {
  const state = useLanyardState();
  const npState = useNowPlayingState();
  const [now, setNow] = useState(() => Date.now());
  const [expanded, setExpanded] = useState(false);

  const ready = state.kind === "ready" ? state.data : null;
  const spotify = npState.kind === "playing" ? npState.track : null;

  // All non-custom-status activities (game / streaming / watching / …). The
  // Spotify activity is skipped: it is already covered by the dedicated card
  // below, which polls Spotify directly instead of via the Discord client.
  const activities = (ready?.activities ?? []).filter(
    (a) => a.type !== 4 && a.name !== "Spotify"
  );

  useEffect(() => {
    if (!spotify?.isPlaying) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
    // 只跟著曲目本身走，不跟著整個 track 物件參照：每次輪詢回來的新物件參照都
    // 重建一次計時器的話，進度條就會每次輪詢就抖一下
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spotify?.isPlaying, spotify?.song, spotify?.artist]);

  let progress = 0;
  if (spotify && spotify.durationMs > 0) {
    const elapsedSinceFetch = spotify.isPlaying ? now - spotify.fetchedAt : 0;
    progress = Math.min(
      1,
      Math.max(0, (spotify.progressMs + elapsedSinceFetch) / spotify.durationMs)
    );
  }

  // Rich activity layout: when `details` exists it is the main line and the
  // app name moves into the kicker; otherwise the name is the main line.
  function activityCard(activity: LanyardActivity) {
    const actImg = activityImage(activity);
    const verb = ACT_VERB[activity.type] ?? "狀態";
    return (
      <div className="dc-act" key={activity.name}>
        {actImg && (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="dc-act-art" src={discordArtThumb(actImg)} alt="" />
        )}
        <div className="dc-act-meta">
          <div className="dc-act-kicker">
            {activity.details ? `${verb} · ${activity.name}` : verb}
          </div>
          <div
            className="dc-act-title"
            title={activity.details || activity.name}
          >
            {activity.details || activity.name}
          </div>
          {activity.state && (
            <div className="dc-act-sub" title={activity.state}>
              {activity.state}
            </div>
          )}
        </div>
      </div>
    );
  }

  const spotifyCard = spotify ? (
    <div className="dc-act dc-act-spotify" key="spotify">
      <CrossfadeImage
        className="dc-act-art"
        src={discordArtThumb(spotify.albumArt)}
        alt={spotify.album}
      />
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
        {spotify.durationMs > 0 && (
          <div className="spotify-bar">
            <span style={{ width: `${progress * 100}%` }} />
          </div>
        )}
      </div>
    </div>
  ) : null;

  const cards = [spotifyCard, ...activities.map(activityCard)].filter(
    (c) => c !== null
  );
  const hasMore = cards.length > 1;
  const toggle = () => setExpanded((e) => !e);

  // 不加 aria-label：axe 的 label-content-name-mismatch 規則是「剝掉標點後，
  //   accessible name 必須是可見文字的子字串」——任何「檢視所有活動」之類的
  //   prefix 都會讓 name 不再是 visible text 的子字串而被打槍。讓 name 直接
  //   由內容文字構成（aria-hidden 的折疊區不會進 accname），反而一定通過，
  //   且 role="button" + aria-expanded 已足夠表達「可切換」。
  return (
    <div className="dc-status">
      {cards.length > 0 ? (
        hasMore ? (
          <div
            className={expanded ? "dc-act-list" : "dc-act-stack"}
            role="button"
            tabIndex={0}
            aria-expanded={expanded}
            onClick={toggle}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggle();
              }
            }}
          >
            {cards[0]}
            <div
              className={`dc-act-more${expanded ? " dc-act-more-open" : ""}`}
              aria-hidden={!expanded}
            >
              <div className="dc-act-more-inner">{cards.slice(1)}</div>
            </div>
          </div>
        ) : (
          cards
        )
      ) : (
        <div className="dc-act dc-act-idle">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="dc-act-art" src="/assets/brand/cat.webp" alt="" />
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
    <svg
      className="status-glyph spotify"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 0a12 12 0 1 0 0 24 12 12 0 0 0 0-24Zm5.5 17.3a.75.75 0 0 1-1 .25c-2.8-1.7-6.3-2.1-10.4-1.15a.75.75 0 1 1-.33-1.46c4.5-1 8.4-.55 11.5 1.36.35.22.46.69.23 1Zm1.47-3.27a.94.94 0 0 1-1.29.31c-3.2-1.97-8.08-2.54-11.86-1.39a.94.94 0 1 1-.55-1.8c4.32-1.31 9.7-.68 13.38 1.59.44.27.58.85.32 1.29Zm.13-3.4C15.8 8.36 9.5 8.13 5.9 9.22a1.12 1.12 0 1 1-.65-2.15c4.13-1.25 11.1-1 15.48 1.6a1.12 1.12 0 1 1-1.15 1.92Z" />
    </svg>
  );
}
