# itouSite tamplate

[繁體中文](README.zh.md) · English

A Next.js 14 personal-site starter with a homepage, about page, timeline, projects, likes, Markdown articles, links, and dark/light themes. Sample data works without credentials.

## Start

Requires Node.js 20+ and npm:

```bash
npm ci
npm run dev
```

Visit <http://localhost:3000>. Customize `app/template/config.ts` (identity, canonical URL, social links, image paths and optional features), `app/template/theme.css` (colors), `app/data/` (page content), `content/blog/` (Markdown posts), and `public/assets/template/` (sample artwork). Change the default `https://example.com` before deployment.

## Optional integrations

All are off by default. Enable their flags in `app/template/config.ts` and provide the matching environment variables in `.env.local` or your host (never put secrets in client-side config):

| Feature                                               | Settings                                                                                  |
| ----------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| GitHub activity, contributions, project stars         | `features.github`, `githubUsername`; optional `GITHUB_TOKEN`                              |
| Discord presence                                      | `features.discord`, `discordUserId`                                                       |
| Spotify music                                         | `features.spotify`, `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, `SPOTIFY_REFRESH_TOKEN` |
| Threads activity                                      | `features.threads`, `THREADS_ACCESS_TOKEN`                                                |
| KV activity, guestbook, impressions, reactions        | Corresponding flags and `KV_REST_API_URL`, `KV_REST_API_TOKEN`                            |
| VTuber live status, visitor counter, public API index | Corresponding flags                                                                       |

Guestbook GitHub OAuth additionally requires `GITHUB_OAUTH_CLIENT_ID`, `GITHUB_OAUTH_CLIENT_SECRET`, `GUESTBOOK_GH_SECRET`; notification email requires `RESEND_API_KEY` and `RESEND_FROM`. Unconfigured features are hidden; their APIs return 404. Rebuild after changing feature flags or environment variables.

The code is organized into `app/template/` (settings/theme), `app/data/` (sample content), `app/components/` (feature UI), `app/lib/` (services/helpers), and `content/blog/` (posts). See [architecture notes](docs/architecture.md).

```bash
npm run typecheck
npm run lint
npm run test:features
npm run test:blog
npm run build
```

The original personal website stays on `main`. Licensed under [Apache-2.0](LICENSE); bundled fonts have their own licenses in `public/assets/fonts/`.
