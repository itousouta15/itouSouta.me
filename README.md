# itouSouta.me

English | [繁體中文](README.zh.md)

![itouSouta.me screenshot](public/assets/projects/itousouta15.webp)

Personal website of itouSouta, live at [itousouta.me](https://itousouta.me).

This is a highly customized portfolio site built around profile, projects, thoughts, favorite media, music, friend links, and a few playful interactions. The goal is not to be a generic template, but a small personal web space with live data and a strong visual identity.

## Features

- Profile-style home page with Discord presence, theme-aware visuals, and project navigation.
- Thoughts feed that merges Discord-sourced posts, Threads posts, and GitHub events.
- Likes pages for novels, manga, anime, VTubers, and Last.fm-powered music data.
- Project gallery with filters, modal details, and GitHub repository metadata.
- Friend links, experience timeline, RSS feed, sitemap, and robots routes.
- Dark/light theme support with reduced-motion-aware animations.
- Search and quick navigation through Cmd/Ctrl+K.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 App Router |
| Language | TypeScript |
| Styling | Plain CSS with custom properties |
| Data | Vercel KV, Threads API, GitHub API, Last.fm API |
| Real-time | Lanyard API |
| Deployment | Vercel |

No UI library, no CSS-in-JS, and no component framework.

## Architecture

Most content lives in [app/data.ts](app/data.ts). The app keeps the public pages mostly static, then layers live data where it matters:

- `/thoughts` combines KV entries, Threads posts, and GitHub activity.
- `/likes/music` reads Last.fm top albums when credentials are available.
- `/api/vtuber-live` checks VTuber live status and caches results for short intervals.
- Project cards use GitHub API data when available and gracefully fall back otherwise.
- Local images are grouped under `public/assets/brand`, `public/assets/projects`, `public/assets/likes`, and `public/assets/social`.

Deeper notes live in [docs/architecture.md](docs/architecture.md).

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

| Variable | Purpose |
|---|---|
| `REVALIDATE_SECRET` | Shared secret for the revalidation endpoint used by itouBot |
| `KV_REST_API_URL`, `KV_REST_API_TOKEN`, `KV_REST_API_READ_ONLY_TOKEN`, `KV_URL`, `REDIS_URL` | Vercel KV connection |
| `THREADS_ACCESS_TOKEN` | Fetching synced Threads posts |
| `GITHUB_TOKEN` | Fetching GitHub repository metadata and activity |
| `LASTFM_API_KEY`, `LASTFM_USER` | Fetching Last.fm top albums |

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
