# Architecture

This document collects implementation notes that are useful when maintaining the site, without making the main README feel like a technical report.

## App Shape

itouSouta.me is a Next.js 14 App Router project. Public routes live under `app/`, shared UI lives under `app/components/` (grouped into feature subfolders — `likes/`, `projects/`, `experience/`, `guestbook/`, `chrome/`, etc. — with genuinely cross-feature components like `ThemeProvider.tsx`, `PageHead.tsx`, and `TileIcon.tsx` staying at the top level), data-fetching helpers live under `app/lib/`, and most hand-authored content lives in `app/data/` (split by domain, re-exported from `app/data/index.ts`).

The project intentionally avoids UI libraries and CSS-in-JS. Most visual behavior is implemented through plain CSS in `app/globals.css`, small client components, and focused hooks.

### Development Output Isolation

The main development server uses `.next-dev`; production builds use `.next`. Additional development servers must set `NEXT_DEV_DIST_DIR` to a separate directory such as `.next-dev-check`, even when they run on a different port. Two `next dev` processes sharing one output directory can remove each other's page chunks while keeping incompatible manifests in memory, resulting in `ChunkLoadError` / 404 responses for `/_next/static/chunks/app/page.js`.

For an auxiliary PowerShell session, set `$env:NEXT_DEV_DIST_DIR = ".next-dev-check"` before running `npm run dev -- --port 3187`. Keep the main server's environment unchanged. Prefer the existing development server for browser checks when possible.

## Route Overview

| Route               | Purpose                                                                                                                                                     |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/`                 | Home profile, hero, navigation cards, GitHub contribution graph                                                                                             |
| `/about`            | Bio, stats, interests, and music preview                                                                                                                    |
| `/writing`          | Articles (blog.itousouta.me index) + unified thoughts feed from Discord/KV, Threads, and GitHub events                                                      |
| (every page)        | KV-backed guestbook section at the bottom of every page (`/api/guestbook`); threaded replies, with Resend reply notifications when the author left an email |
| `/likes`            | Hub for liked novels, manga, anime, VTubers, and music                                                                                                      |
| `/likes/[category]` | Category-specific likes grid                                                                                                                                |
| `/likes/music`      | Spotify top tracks                                                                                                                                          |
| `/projects`         | Searchable project gallery; query persisted in `?q=`                                                                                                        |
| `/projects/[slug]`  | Standalone project story, cover, technologies, and source/demo links                                                                                        |
| `/links`            | Friend/community links                                                                                                                                      |
| `/experience`       | Timeline of activities                                                                                                                                      |
| `/feed.xml`         | RSS feed                                                                                                                                                    |

## Content

Most static content is declared in `app/data/`, including roles, liked items, projects, friend links, and fallback thoughts.

The live content layers are:

- Vercel KV for Discord-sourced thoughts.
- Threads API for synced posts.
- GitHub API for repository information and activity.
- Spotify API for top tracks and the currently-playing track (OAuth refresh-token flow). Currently-playing is fetched directly rather than through Discord/Lanyard so it still works when the Discord client isn't running (e.g. mobile).
- Lanyard API for Discord presence (online status and non-Spotify activities); also a fallback source for now-playing when Spotify credentials aren't configured.

Call sites treat missing credentials or failed upstream requests as expected states. The UI should degrade rather than hard fail.

## Assets

Local assets are grouped by purpose:

| Folder                   | Purpose                                                          |
| ------------------------ | ---------------------------------------------------------------- |
| `public/assets/brand`    | Site identity assets such as banner, avatar, fallback status art |
| `public/assets/projects` | Project cover images                                             |
| `public/assets/likes`    | Likes, music, and friend-link imagery                            |

The home page keeps `banner.webp` as the primary `<img>` candidate for search previews. Other decorative home images are rendered as CSS backgrounds where practical, so search engines are less likely to select them as page thumbnails.

## Image Proxy

Many covers and avatars come from external domains. Instead of maintaining a large `next/image` allowlist, `app/lib/imageThumb.ts` routes remote `http(s)` images through wsrv.nl resize URLs sized for each use case.

Local `/assets/...` files, animated `.gif`s, and domains in `PROXY_BLOCKED_HOSTS` bypass the proxy and use the original URL.

## GitHub Contribution Graph

`GithubContributionCard` lazily fetches `/api/github-contributions` near the viewport. The endpoint validates daily data from `github-contributions-api.jogruber.de` for `itousouta15`, caches successful upstream requests for one hour, and returns uncached errors for retry. No token is required. The browser also caches successful results in memory for an hour.

`ContributionCalendar` renders theme-aware SVG cells with date/count labels, pointer and touch selection, and roving keyboard focus (arrows, Home, End). `contributionSnake.ts` uses breadth-first search to visit the nearest remaining contribution while avoiding the snake's body. The snake clears cells and fills a count-weighted progress bar, then returns for another loop. It pauses offscreen and in hidden tabs; reduced-motion mode shows the static calendar. Empty calendars have no snake. Mobile users can scroll the calendar horizontally.

## Project Navigation

`/projects` searches titles, descriptions, story content, and technology names. Search terms are stored in `?q=` using Next.js's native History API integration. Cards link to `/projects/[slug]?q=...`, and detail pages offer a return link that restores the search. The canonical URL excludes the query.

`projectRoutes.ts` resolves legacy slugs, including the old URL-shaped slug. `/projects?project=...` permanently redirects to the corresponding detail page. Detail pages have static params, individual metadata, and sitemap entries; release timelines and their API requests have been removed.

Project stories use one optional Markdown `content` field in `app/data/projects.ts`, replacing `why`, `longDesc`, and `difficulties`. Section headings are authored in the content rather than hardcoded by the UI. `ProjectMarkdown` renders on the server using `react-markdown` + `remark-gfm`, supporting headings, emphasis, lists/task lists, links, images, blockquotes, fenced code, and tables. Tables and code scroll inside the story column on narrow screens. Empty content falls back to the short description; the gallery and technology sidebar remain separate. Search includes the full Markdown content.

```ts
content: `## 專案介紹

用 **Flutter** 打造的 Markdown 檢視器，整合 [HackMD](https://hackmd.io/)。

## 遇到的困難

- 即時渲染效能
- 長文件的捲動體驗`,
```

`ProjectGallery` displays the cover followed by optional `screenshots` in a Steam-style large preview and horizontal thumbnail strip. Click a thumbnail, use Left/Right or Home/End, or swipe the main image on touch devices. The active thumbnail scrolls into view without moving the page. Clicking the preview opens a native modal image viewer with keyboard navigation and Escape to close; focus returns to the trigger. Single-image projects omit the strip and navigation arrows. There is no autoplay.

Image changes use a directional 360ms crossfade with a slight slide/zoom, keeping the previous image visible until the incoming image loads. The same transition works in the enlarged viewer; reduced-motion mode switches without animation. Circular translucent SVG-arrow controls support hover, pressed, and keyboard-focus states.

Add extra images to a project in `app/data/projects.ts` (the cover is included automatically; duplicate and blank image paths are ignored):

```ts
screenshots: [
  {
    src: "/assets/projects/example-detail.webp",
    alt: "專案的功能畫面",
    caption: "選填的圖片說明。",
  },
],
```

`ChapterNavigation` appears after the guestbook on all pages except home. Header and chapter links share the route order in `navigation.ts`; nested project/likes routes inherit their parent chapter. The final chapter and pages outside that sequence show only the home link.

## Spotify Music

`MusicCard` is shared by the `/likes` music carousel and the searchable `/likes/music` grid. `getMusicSnapshot` reads Spotify's top tracks and preserves their order as ranking positions. Cards show album art, title, artist, rank, and a Spotify link. Searching filters the list without renumbering the tracks.

Music uses `user-top-read` for the ranking and `user-read-currently-playing` for the existing now-playing indicator. The site does not accumulate playback history or request the recently-played endpoint; there is no KV dependency or scheduled synchronization for the music cards.

## Visitor Impressions

The home page places `VisitorImpressionsCard` below the quote card. Visitors submit a word or phrase of up to 20 characters through the form; cloud words are display-only. Hovering or focusing a word enlarges it and reveals its count. The feature was inspired by [nnic52136-hash/.github.io](https://github.com/nnic52136-hash/.github.io); this implementation uses plain DOM text rather than a charting library.

- `GET /api/impressions` reads the shared wall; `POST /api/impressions` adds one impression and returns the canonical tag and updated count.
- The Redis hash is `visitor-impressions:counts`, with `tag:`-prefixed fields. A Lua script atomically checks a 30-second cooldown and 24-hour per-word duplicate record before incrementing, so concurrent submissions cannot bypass detection. Visitor and word keys are SHA-256 hashed. It uses the same KV credentials as the guestbook.
- Input is normalized with Unicode NFKC, trimmed, and whitespace-collapsed before validation. The existing five-attempts-per-IP-per-minute limiter also bounds repeated rejected submissions.
- The browser reads the wall once it approaches the viewport. A shared-center, seeded spiral packs up to 60 words into a 180px-high cloud. Rotated-rectangle collision checks use a 3px gap rather than reserving empty axis-aligned corners, and crowded words can shrink to fit. Font measurements only run on data, font readiness, or container resize. No scroll listeners, continuous animations, or additional dependencies are needed.
- GET responses are uncached. Successful writes update the word from the server's count; failed writes preserve the draft and show an error. An unavailable KV connection displays a retry state rather than fake local-only impressions.

## Animations and UX

Animations are mostly CSS keyframes and small client-side effects:

- Theme-aware page transition wrapper.
- Card hover states disabled or softened on touch devices.
- Horizontal wheel scrolling for carousel-like sections.
- Scroll-linked reveal for wide content.
- Reduced-motion support through CSS media queries.

Live-first sorting reorders the grid directly — cards snap to their new position, there is no reorder animation.
