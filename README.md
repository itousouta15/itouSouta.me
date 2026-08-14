# itouSouta.me

English | [繁體中文](README.zh.md)

![itouSouta.me screenshot](public/assets/projects/itousouta15.webp)

Personal website of itouSouta, live at [itousouta.me](https://itousouta.me).

This is a highly customized portfolio site built around profile, projects, thoughts, favorite media, music, friend links, and a few playful interactions. The goal is not to be a generic template, but a small personal web space with live data and a strong visual identity.

## Features

- Profile-style home page with Discord presence, theme-aware visuals, and project navigation.
- Thoughts feed that merges Discord-sourced posts, Threads posts, and GitHub events.
- Likes pages for novels, manga, anime, VTubers, and Spotify-powered music data.
- Project gallery with filters, modal details, and GitHub repository metadata.
- Friend links, experience timeline, RSS feed, sitemap, and robots routes.
- Dark/light theme support with reduced-motion-aware animations.
- Search and quick navigation through Cmd/Ctrl+K.
- Per-route Open Graph images rendered at build time, with the brand banner and avatar composited in.

## Tech Stack

| Layer      | Technology                                      |
| ---------- | ----------------------------------------------- |
| Framework  | Next.js 14 App Router                           |
| Language   | TypeScript                                      |
| Styling    | Plain CSS with custom properties                |
| Data       | Vercel KV, Threads API, GitHub API, Spotify API |
| Real-time  | Lanyard API                                     |
| Deployment | Vercel                                          |

No UI library, no CSS-in-JS, and no component framework.

## Architecture

Most content lives in [app/data.ts](app/data.ts). The app keeps the public pages mostly static, then layers live data where it matters:

- `/writing` combines the blog index and KV entries, Threads posts, and GitHub activity.
- `/likes/music` reads Spotify top tracks when credentials are available.
- The "now playing" indicator (`/api/now-playing`, profile card, floating bar) calls the Spotify API directly instead of relying on Discord's relayed presence, so it works on mobile even when the Discord app isn't open; it falls back to Lanyard only when Spotify credentials aren't configured.
- `/api/vtuber-live` checks VTuber live status and caches results for short intervals.
- Project cards use GitHub API data when available and gracefully fall back otherwise.
- Local images are grouped under `public/assets/brand`, `public/assets/projects`, `public/assets/likes`, and `public/assets/social`.

Deeper notes live in [docs/architecture.md](docs/architecture.md).

## SEO and Share Images

Page metadata is produced by `pageMetadata({ title, description, path })` in [app/lib/seo.ts](app/lib/seo.ts). This is centralized on purpose: in Next.js only top-level metadata fields merge from layout to page — nested objects like `openGraph` and `twitter` are **replaced wholesale**. Declaring them per page silently drops the root layout's `og:site_name`, `og:locale`, and downgrades `twitter:card` from `summary_large_image` to `summary`. For the same reason the root layout deliberately sets no `alternates.canonical`: it would be inherited, and any page that forgot to override it would declare the home page as its canonical URL.

Open Graph images are rendered by `renderOg()` in [app/lib/ogImage.tsx](app/lib/ogImage.tsx) — 1200×630, with `banner.webp` as a translucent background under a left-to-right scrim and the avatar on the right. These routes intentionally export no `runtime`, so they are prerendered to static PNGs during `next build` (no serverless function, and `resvg.wasm` never enters a bundle).

Two traps worth knowing before you touch this:

- **After changing the layout in `ogImage.tsx`, bump the date comment at the top of all ten `opengraph-image.tsx` files.** The `?hash` on the `og:image` URL is a content hash of _that route file's own source_, not of its imports or of the rendered PNG. Change only the shared renderer and the URL stays identical — and since the response is served `immutable, max-age=31536000`, Discord and X will keep showing the old card forever.
- The files in `public/assets/brand/` are **PNGs despite the `.webp` extension**. satori sniffs magic bytes and supports `[png, apng, jpeg, gif, svg]` only; an actual WebP throws `Unsupported image type`.

CJK text uses a per-image Google Fonts subset (see [app/lib/ogFont.ts](app/lib/ogFont.ts)); if the fetch fails it degrades to a Latin-only card rather than failing the build.

## Development

Node 20 or later is required.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm run start
npm run lint
```

### Environment Variables

Required or optional depending on which live surfaces you want enabled:

| Variable                                                                                     | Purpose                                                                                                                                                                               |
| -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `REVALIDATE_SECRET`                                                                          | Shared secret for the revalidation endpoint used by itouBot                                                                                                                           |
| `KV_REST_API_URL`, `KV_REST_API_TOKEN`, `KV_REST_API_READ_ONLY_TOKEN`, `KV_URL`, `REDIS_URL` | Vercel KV connection                                                                                                                                                                  |
| `THREADS_ACCESS_TOKEN`                                                                       | Fetching synced Threads posts                                                                                                                                                         |
| `GITHUB_TOKEN`                                                                               | Fetching GitHub repository metadata and activity                                                                                                                                      |
| `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, `SPOTIFY_REFRESH_TOKEN`                        | Fetching Spotify top tracks and the currently-playing track (see `scripts/spotify-refresh-token.mjs`; scope includes `user-read-currently-playing`, older tokens need re-authorizing) |
| `GITHUB_OAUTH_CLIENT_ID`, `GITHUB_OAUTH_CLIENT_SECRET`, `GUESTBOOK_GH_SECRET`                | "Sign in with GitHub" on the guestbook (OAuth App callback: `/api/auth/github/callback`; the secret signs the short-lived identity token)                                             |
| `RESEND_API_KEY`, `RESEND_FROM`                                                              | Reply-notification emails for the guestbook (Resend; verify the sending domain in the Resend dashboard, e.g. `RESEND_FROM="itousouta.me <no-reply@itousouta.me>"`)                  |

Missing optional credentials are handled gracefully; affected sections fall back or disappear instead of breaking the site.

## Docs

- [Architecture](docs/architecture.md)
- [VTuber Live Status](docs/vtuber-live.md)
- [Easter Eggs](docs/easter-eggs.md)

## Deployment

The site is deployed on Vercel. Pushes to `main` trigger production deployment.

The GitHub contribution SVGs are generated daily by [.github/workflows/snake.yml](.github/workflows/snake.yml) and written to `public/assets/social/`.

## License

This project is licensed under the Apache License 2.0. See [LICENSE](LICENSE) for details.
