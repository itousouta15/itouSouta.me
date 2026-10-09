# Architecture

This document collects implementation notes that are useful when maintaining the site, without making the main README feel like a technical report.

## App Shape

itouSouta.me is a Next.js 14 App Router project. Public routes live under `app/`, shared UI lives under `app/components/` (grouped into feature subfolders — `likes/`, `projects/`, `experience/`, `guestbook/`, `chrome/`, etc. — with genuinely cross-feature components like `ThemeProvider.tsx`, `PageHead.tsx`, and `TileIcon.tsx` staying at the top level), data-fetching helpers live under `app/lib/`, and most hand-authored content lives in `app/data/` (split by domain, re-exported from `app/data/index.ts`).

The project intentionally avoids UI libraries and CSS-in-JS. Most visual behavior is implemented through plain CSS in `app/globals.css`, small client components, and focused hooks.

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
| `/projects`         | Filterable project gallery                                                                                                                                  |
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
| `public/assets/social`   | Generated social/GitHub contribution assets                      |

The home page keeps `banner.webp` as the primary `<img>` candidate for search previews. Other decorative home images are rendered as CSS backgrounds where practical, so search engines are less likely to select them as page thumbnails.

## Image Proxy

Many covers and avatars come from external domains. Instead of maintaining a large `next/image` allowlist, `app/lib/imageThumb.ts` routes remote `http(s)` images through wsrv.nl resize URLs sized for each use case.

Local `/assets/...` files, animated `.gif`s, and domains in `PROXY_BLOCKED_HOSTS` bypass the proxy and use the original URL.

## GitHub Contribution Graph

The contribution SVGs are static files generated by `.github/workflows/snake.yml` using `Platane/snk`.

The workflow writes:

- `public/assets/social/github-user-contribution-dark.svg`
- `public/assets/social/github-user-contribution-light.svg`

`GithubContributionCard` selects the matching SVG for the current theme. On small screens, the graph can scroll horizontally and is moved by `useScrollLinkedHorizontalReveal` as the card enters the viewport.

## Spotify Play History

`MusicCard` is shared by the `/likes` music carousel and the searchable `/likes/music` grid. Spotify top-track rankings remain separate from recorded play counts. `getMusicSnapshot` combines the playlist with counts from KV, preserving `null` for unavailable statistics.

`spotifyHistory.ts` fetches the latest 50 official history entries and atomically records each `(track ID, played_at)` once. A five-minute KV lease throttles collection across instances. The authenticated `/api/spotify/sync` endpoint is called every 15 minutes by `.github/workflows/spotify-history.yml`, so collection doesn't depend on visitors. Successful syncs revalidate both music surfaces.

Counts are explicitly labeled as recorded history, not lifetime totals. Setup requires reauthorizing `user-read-recently-played` and configuring `SPOTIFY_SYNC_SECRET`; see [Spotify play history](spotify-play-history.md).

## Visitor Impressions

The home page places `VisitorImpressionsCard` below the quote card. Visitors submit a word or phrase of up to 20 characters through the form; cloud words are display-only. Hovering or focusing a word enlarges it and reveals its count. The feature was inspired by [nnic52136-hash/.github.io](https://github.com/nnic52136-hash/.github.io); this implementation uses plain DOM text rather than a charting library.

- `GET /api/impressions` reads the shared wall; `POST /api/impressions` adds one impression and returns the canonical tag and updated count.
- The Redis hash is `visitor-impressions:counts`, with `tag:`-prefixed fields. A Lua script atomically checks a 30-second cooldown and 24-hour per-word duplicate record before incrementing, so concurrent submissions cannot bypass detection. Visitor and word keys are SHA-256 hashed. It uses the same KV credentials as the guestbook.
- Input is normalized with Unicode NFKC, trimmed, and whitespace-collapsed before validation. The existing five-attempts-per-IP-per-minute limiter also bounds repeated rejected submissions.
- The browser reads the wall once it approaches the viewport. A seeded random spiral places up to 60 words without overlapping their rotated bounding boxes; font measurements only run on data, font readiness, or container resize. No scroll listeners, continuous animations, or additional dependencies are needed.
- GET responses are uncached. Successful writes update the word from the server's count; failed writes preserve the draft and show an error. An unavailable KV connection displays a retry state rather than fake local-only impressions.

## Animations and UX

Animations are mostly CSS keyframes and small client-side effects:

- Theme-aware page transition wrapper.
- Card hover states disabled or softened on touch devices.
- Horizontal wheel scrolling for carousel-like sections.
- Scroll-linked reveal for wide content.
- Reduced-motion support through CSS media queries.

Live-first sorting reorders the grid directly — cards snap to their new position, there is no reorder animation.
