# itouSouta.me

English | [繁體中文](README.zh.md)

![示意圖](public/assets/projects/itousouta15.webp)
Personal website of itouSouta / 郭家睿 / 伊藤蒼太, live at [itouSouta.me](https://itouSouta.me).

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Plain CSS (single global stylesheet, CSS custom properties) |
| Data | Vercel KV (Redis) — Discord-sourced posts; Threads API — synced posts; GitHub API — repository info; Last.fm API — top albums |
| Real-time | [Lanyard API](https://github.com/Phineas/lanyard) — Discord presence |
| Deployment | Vercel |

No UI library, no CSS-in-JS, no component framework.

## Pages

| Route | Description |
|---|---|
| `/` | Home — profile card, hero, tech tiles, bento nav grid, GitHub contribution graph |
| `/about` | About — bio, stats, motto, and two Last.fm/likes teaser cards (top anime, top album) |
| `/thoughts` | 雜談 — feed merging Discord slash-command posts, synced Threads posts, and GitHub events |
| `/likes` | Likes — searchable, tag-filtered grid of novels, manga, and anime; Last.fm top-albums preview row |
| `/likes/[category]` | Category detail — full list with carousel and filter |
| `/likes/music` | Music — searchable grid of Last.fm top albums (square covers), same modal detail view as other categories |
| `/projects` | Projects — filterable card grid of personal projects with GitHub repository info |
| `/links` | Friends — link cards for friends and communities |
| `/experience` | Journey — timeline of experience and activities |
| `/feed.xml` | RSS feed — unified feed of thoughts, projects, and updates |
| (Cmd/Ctrl+K) | Command Palette — quick navigation and search for pages and projects |

## Features

### Theme
Dark and light modes. The selected theme is persisted to `localStorage` and applied via a blocking inline script before first paint, preventing a flash of unstyled content.

### Typography
Multiple typefaces are loaded from Google Fonts and the [emfont](https://font.emtech.cc) CDN:

- `ChenYuLuoYan` (emfont) — header logo
- `LXGWHeartSerif` (emfont) — quote display text
- `Shippori Mincho` / `Noto Serif TC` (Google Fonts) — headings and serif content
- `Dancing Script` (Google Fonts) — decorative script accents
- `JetBrains Mono` (Google Fonts) — monospace labels, kickers, code-like elements
- `Noto Sans TC` (Google Fonts) — body text

The logo is hidden until `ChenYuLuoYan` is active (detected via `document.fonts.load`) to prevent a FOUT caused by the fallback font rendering at a significantly larger apparent size.

### 雜談 (Thoughts)
A standalone Discord bot ([itouBot](../itouBot)) backs a `/碎碎念` slash command and writes entries to Vercel KV; after each post it pings `app/api/revalidate/route.ts` (guarded by `REVALIDATE_SECRET`) so the page updates immediately. The `/thoughts` page merges these entries with posts pulled from the Threads API (`app/lib/threads.ts`), sorted newest-first by timestamp. If no remote data is available, it falls back to the static `THOUGHTS` array in `app/data.ts`.

### Likes
Novels, manga, anime, and VTuber entries are statically defined in `app/data.ts`. The likes pages support client-side full-text search and multi-tag filtering without any server dependency. Horizontal carousels use custom hooks for mouse-wheel and scroll-linked panning. `LikeCard`/`LikeFilterGrid` support a `layout` prop (`"circle"` for VTuber avatars, `"square"` for album covers) that swaps the thumbnail crop and, for `"circle"`, hides the sub-line and skips the detail modal in favor of linking straight out.

### VTuber live status
`app/api/vtuber-live/route.ts` checks whether each VTuber is currently streaming, using two sources. For VSPO-affiliated members (identified by a `channelId` on the `Like` entry in `app/data.ts`, either explicit or parsed from a `/channel/UC…` `href`), it fetches `vspo-schedule.com`'s own live-schedule page once and extracts the live-stream list embedded in that page's Next.js RSC payload — one request covers every VSPO member's status. VTubers outside that roster fall back to requesting their own YouTube channel's `/live` path and scanning for an embedded `isLive: true` in `ytInitialPlayerResponse`. Neither source needs a YouTube Data API key or quota. Results are cached for 60 seconds (`revalidate = 60`). `useVtuberLiveStatus` polls this endpoint every 60s while a `"circle"`-layout section is mounted, and `VtuberLiveWarmup` fires an unawaited fetch as soon as `/likes` loads so the cache is already warm by the time a user opens the VTuber category. A live channel's `LikeCard` gets a pulsing red outline and a "LIVE" badge, and clicking it links straight to the broadcast instead of the channel page.

### Live-first sorting
`sortLikesByRating` (`app/lib/sortLikes.ts`) takes an optional `isLive` predicate; when given, live items sort ahead of non-live ones, with rating only breaking ties within each group. Both `LikeCategorySection` (the `/likes` hub carousels) and `LikeFilterGrid` (category detail grids) re-sort whenever `useVtuberLiveStatus`'s data updates, so a VTuber who starts streaming jumps to the front. Reordering is animated with a small hand-rolled FLIP (First-Last-Invert-Play) hook, `useFlipReorder` — no animation library — that measures each card's position before and after a reorder and animates the delta via `transform`, so cards visibly slide into place instead of snapping. On the hub carousel, `overflow-anchor: none` stops the browser from silently compensating scroll position against the DOM reorder, and a scroll-position pin keeps the live-sorted front visible — but only until the user manually scrolls the carousel themselves, at which point it stops fighting them.

### Music (Last.fm)
Unlike the rest of the likes content, music is live data: `app/lib/lastfm.ts` calls Last.fm's `user.gettopalbums` (album art is the only Last.fm entity that still returns real cover images — the artist/track endpoints now return one shared placeholder). It backs three surfaces at increasing scope: the about-page mini card (this month, top 4), the `/likes` preview row (overall, top 12), and the full `/likes/music` grid (overall, top 50). Every call site treats a `null` result (missing `LASTFM_API_KEY`/`LASTFM_USER`, or the API failing) as "no data" and degrades gracefully — the about-page card falls back to the static `MUSIC_ARTISTS` avatars in `app/data.ts`, and `/likes` simply omits the preview row.

### Lanyard integration
Discord presence (online status, activity, Spotify playback) is fetched live from the Lanyard WebSocket API and displayed in the profile card. The component gracefully handles disconnection.

### GitHub contribution graph
The graph SVG is pre-generated and committed as a static asset in both dark and light variants, regenerated daily by the `.github/workflows/snake.yml` GitHub Action (`Platane/snk`), which commits directly to `main` if the output changed. On mobile, the card scrolls horizontally; the scroll position is linked to the card's progress through the viewport via `useScrollLinkedHorizontalReveal`, so the graph pans left to right as the user scrolls down the page — the reveal is remapped to a narrower window of that scroll distance (`TRIGGER_RANGE` in the hook) rather than the full enter-to-exit transit, so it doesn't take a full screen-height of scrolling to complete.

### Image thumbnails
Avatars, likes covers, music art, and project screenshots are hotlinked from dozens of external, uncontrolled domains — too many to allowlist individually via `next/image`'s `remotePatterns`. `app/lib/imageThumb.ts` routes any `http(s)` source through the [wsrv.nl](https://wsrv.nl) resize proxy at the size actually needed for display (`avatarThumb`, `likeThumb`, `likeCircleThumb`, `artistAvatarThumb`, `songThumb`, `projectCoverThumb`, `cardBgThumb`), falling back to the original URL for local `/assets` paths, animated `.gif`s (the proxy's webp conversion drops animation), and the handful of domains in `PROXY_BLOCKED_HOSTS` that reject requests from the proxy.

### Hero interactions
The hero's ASCII face (`HeroFace`) subtly follows the cursor (displacement clamped and throttled via `requestAnimationFrame`), winks the near-side eye on click, and switches to a "leaving" expression with a wiggle animation once it scrolls past a threshold near the top of the viewport (`IntersectionObserver` with a negative `rootMargin`). Clicking the profile avatar 5 times in quick succession (`AvatarEasterEgg`) spins it and opens the Discord invite in a new tab; a pending click streak resets after 1.5s of inactivity. The rotating display name (`NameRotator`) cycles through `itouSouta` / `伊藤蒼太` / `郭家睿` on a CSS roll; on hover it pauses and runs a text-decode effect that scrambles the currently shown name from random glyphs and settles it left-to-right (the target is whichever name the roll was on when the cursor arrived, computed from elapsed time against the 8s CSS cycle).

### Animations
- CSS keyframe marquee for the footer strip and tech tile rows
- Name rotator cycling through display names in the hero, with a hover-triggered text-decode effect
- Page transitions via `PageTransition`
- Card hover effects (disabled on touch devices via `@media (hover: none)`)
- All animations respect `prefers-reduced-motion`

### Command Palette
Quick site navigation and search via Cmd/Ctrl+K. Provides instant access to all pages and projects, with fuzzy search support for fast discovery.

### Search-box easter eggs
Two hidden inputs in the command palette (`CommandPaletteInner`):
- Typing `67` and pressing Enter closes the palette, returns to the home page, and gives the whole page a brief `skewY` shear-wobble that decays back to rest — a nod to Google's own "67" search easter egg.
- Typing `114514` and pressing Enter drops the site into a self-contained Google-Gravity mode (`GravityMode`). A hand-rolled 2D physics loop (`requestAnimationFrame`, no library) walks the DOM, turns nearly every visible element into a `position: fixed` rigid body, and applies gravity, floor/wall bouncing, and AABB box stacking so everything falls into a pile at the bottom. Bodies can be grabbed and thrown with the pointer (dragged bodies act as immovable during collision resolution), link clicks are suppressed so pieces don't navigate away, and a floating "還原" button — which playfully dodges the cursor — reloads the page to restore it.

### RSS Feed
Unified RSS feed at `/feed.xml` merges thoughts from Discord (`/碎碎念` slash command), Threads posts, and GitHub repository events, sorted by timestamp.

### Projects and Details
Projects page supports filtering by technology and category. Project cards fetch live repository information from GitHub API (stars, language, description). Clicking a project opens a modal with detailed information and a direct link.

### Likes Details
Likes support detailed view with expanded descriptions and additional metadata beyond the grid card format.

### Accessibility and UX
- Touch devices: hover transforms are reset; `:active` states provide tap feedback instead
- Back-to-top button with smooth scroll, visible after 400 px scrolled
- Mobile nav: Escape key closes the overlay; `tabIndex` is managed on hidden controls
- Horizontal scroll containers show a right-edge fade to indicate additional content

## Project structure

```
app/
  api/
    revalidate/route.ts              Secret-guarded revalidation hook (called by itouBot after each post)
    vtuber-live/route.ts             VSPO members via vspo-schedule.com's schedule feed, others via YouTube /live; 60s revalidate cache
  components/
    Header.tsx                       Sticky nav with mobile overlay
    Footer.tsx                       Footer with sitemap, projects, social links
    CommandPalette.tsx               Command palette trigger and state management
    CommandPaletteInner.tsx          Command palette UI and search logic (client-side)
    TileIcon.tsx                     Theme-aware technology icon tile (client component)
    tileIconMeta.ts                  Icon metadata (src, dark bg, light bg) — server-safe
    LanyardCards.tsx                 Discord presence components
    GithubContributionCard.tsx
    GithubGlyph.tsx                  Inline GitHub mark (SVGProps passthrough)
    HeroFace.tsx                     Interactive ASCII hero face — cursor-follow, wink, leaving wiggle
    NameRotator.tsx                  Hero display-name roll with hover text-decode effect
    AvatarEasterEgg.tsx              5-click avatar easter egg — spins and opens Discord
    GravityMode.tsx                  "114514" search easter egg — DOM-wide gravity physics with drag/throw
    BadgeShape.tsx                   Profile badge that morphs shape (clip-path) on click
    LikeCard.tsx                     Supports default / "circle" (VTuber) / "square" (album) layouts, live badge
    LikeCategorySection.tsx          Category section with lazy-loading observer
    LikeDetailBody.tsx               Expanded like detail view (used in the modal)
    LikeFilterGrid.tsx               Search + tag filter + grid + modal wiring
    LikeModalShell.tsx               Portal-based modal shell for like details
    VtuberLiveWarmup.tsx             Pre-warms /api/vtuber-live cache when /likes loads
    MusicSection.tsx                 Last.fm top-albums preview row (renders LikeCard, layout="square")
    ProjectDetailBody.tsx            Detailed project view with GitHub repository info
    ProjectFilterGrid.tsx            Filterable project grid with modal support
    ProjectModalShell.tsx            Portal-based modal shell for project details
    PageHead.tsx
    PageTransition.tsx
    BackToTopButton.tsx
    ThemeProvider.tsx
    SiteLoader.tsx                   Full-page loader with blur and transition effects
  hooks/
    useHorizontalWheelScroll.ts          Mouse-wheel horizontal pan
    useScrollLinkedHorizontalReveal.ts   Scroll-position-linked horizontal pan
    useVtuberLiveStatus.ts               Polls /api/vtuber-live every 60s while a circle-layout section is mounted
    useFlipReorder.ts                    Hand-rolled FLIP animation for reordering cards (no library)
  lib/
    kv.ts                             Vercel KV read/write for Discord-sourced thoughts
    threads.ts                        Threads API fetch for synced posts
    github.ts                         GitHub API fetch for repository info and events
    lastfm.ts                         Last.fm API fetch for top albums (about/likes/music)
    imageThumb.ts                     wsrv.nl resize-proxy helpers for external images
    sortLikes.ts                      Rating-based sort with optional live-first predicate (rating → personRating, unrated sinks last)
    ratingStars.tsx                   5-star rating renderer (dim track + clipped fill overlay)
    mergedThoughts.ts                 Merge and deduplicate thoughts from multiple sources
  about/page.tsx
  experience/page.tsx
  likes/page.tsx
  likes/[category]/page.tsx
  likes/music/page.tsx
  links/page.tsx
  projects/page.tsx
  thoughts/page.tsx
  feed.xml/route.ts                 RSS feed route (merged thoughts + projects)
  robots.ts           robots.txt route
  sitemap.ts          Sitemap route (includes per-category likes URLs)
  page.tsx            Home
  layout.tsx          Root layout — fonts, theme script, header, footer, command palette
  globals.css         All styles
  data.ts             All content — roles, likes, projects, music fallback, links, fallback thoughts
public/
  assets/             Images and GitHub contribution SVGs
  icon/               Custom SVG icons
scripts/
  cleanup-thoughts.mjs     Remove KV thought entries matching a given text
.github/
  workflows/
    snake.yml              Daily cron regenerating the GitHub contribution SVGs and auto-committing them
```

## Development

Node 20 or later is required.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm run start
npm run lint
```

### Environment variables

Required for the `/thoughts` page (see `.env.local`):

| Variable | Purpose |
|---|---|
| `REVALIDATE_SECRET` | Shared secret for `app/api/revalidate/route.ts` (itouBot uses the same value) |
| `KV_REST_API_URL`, `KV_REST_API_TOKEN`, `KV_REST_API_READ_ONLY_TOKEN`, `KV_URL`, `REDIS_URL` | Vercel KV connection |
| `THREADS_ACCESS_TOKEN` | Fetching synced posts from the Threads API |
| `GITHUB_TOKEN` | GitHub API access for fetching repository information (optional; without it, repository details are unavailable) |
| `LASTFM_API_KEY`, `LASTFM_USER` | Fetching top albums for the about page, `/likes`, and `/likes/music` (optional; see below if unset) |

Spotify's Web API now requires a Premium account to register a new developer app, so the music integration goes through Last.fm instead — a free, instant-approval API key, with Spotify plays scrobbled to it. Without `LASTFM_API_KEY`/`LASTFM_USER` (or if the account has no scrobbles yet), `getTopAlbums()` returns `null` and each call site falls back accordingly: the about-page card shows the static `MUSIC_ARTISTS` avatars, and the `/likes` preview row is simply omitted.


## Deployment

Deployed on Vercel; pushes to `main` trigger a new production deployment. The custom domain is configured in the Vercel project (the `CNAME` file is a legacy artifact from a prior GitHub Pages setup). Discord slash commands are handled by the standalone [itouBot](../itouBot) process, which shares the same Vercel KV store and calls `/api/revalidate` after each post.

A separate scheduled job, `.github/workflows/snake.yml`, runs daily (cron, plus manual `workflow_dispatch`) to regenerate the GitHub contribution SVGs via `Platane/snk` and pushes the update straight to `main` — this also triggers a Vercel redeploy when the graph changed.

## Content

Most page content lives in `app/data.ts`. To add or update a like, project, or friend link, edit the relevant exported array and push. No configuration changes are needed.

雜談 content comes from two live sources instead: Discord (`/碎碎念` slash command → KV) and Threads (synced automatically). The `THOUGHTS` array in `app/data.ts` is only a fallback shown when neither remote source returns data.

Music is likewise live (Last.fm top albums, see [Environment variables](#environment-variables)); the `MUSIC_ARTISTS` array in `app/data.ts` is only a fallback for the about-page card, shown when Last.fm isn't configured or returns nothing. To change which album/background image the about-page mini cards feature, edit the `INTEREST_BG` / `MUSIC_BG` constants near the top of `app/about/page.tsx`.

Technology icons are defined in `app/components/tileIconMeta.ts`. Each entry has a label, a Devicons CDN URL, a dark-mode background colour, and a light-mode background colour.

## License

This project is licensed under the Apache License 2.0. See [LICENSE](LICENSE) for details.
