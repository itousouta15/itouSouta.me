# itouSite — itousouta.me template

[繁體中文](README.zh.md) · English

This is the reusable template for [itousouta.me](https://itousouta.me), built with Next.js 14. It includes a homepage, about page, timeline, projects, likes, Markdown articles, links, and dark/light themes. The `template` branch has replaceable sample content; the original site's content lives on `main`.

## Sites built with this template

- [itouSouta.me](https://itousouta.me)
- [github-io-sigma-ten.vercel.app](https://github-io-sigma-ten.vercel.app/)
- [portfolio-chalisa.vercel.app](https://portfolio-chalisa.vercel.app/)

## Get started

Requires **Node.js 20+** and npm. Clone the `template` branch (or use your own copy of it):

```bash
git clone --branch template --single-branch https://github.com/itousouta15/itouSouta.me.git my-site
cd my-site
npm ci
npm run dev
```

Visit <http://localhost:3000>. The sample site runs without API keys; optional integrations are disabled by default.

## Make it yours

1. Edit [`app/template/config.ts`](app/template/config.ts): set your site URL, name, description, author, social links, images, and feature switches. Replace `https://example.com` with your real domain (without a trailing slash) before deploying. Do not put secrets in this file; it is used by browser code too.
2. Edit [`app/data/`](app/data/) for projects, favorites, experience, friend links, homepage labels, and fallback thoughts. A project's `slug` becomes its `/projects/<slug>` URL; a like category's key becomes `/likes/<category>`. Use URL-friendly identifiers.
3. Edit [`content/blog/welcome.md`](content/blog/welcome.md) or add `.md` files under [`content/blog/`](content/blog/). Each filename becomes an article URL under `/writing/`; use the existing post as a frontmatter example. Put your images in [`public/assets/`](public/assets/) and replace the sample avatar/banner in [`public/assets/template/`](public/assets/template/) (update their paths in `config.ts` if needed).
4. Adjust colors and backgrounds in [`app/template/theme.css`](app/template/theme.css). Run `npm run build` to check your changes; `npm run start` serves the production build locally.

## Optional integrations

All are off by default. Enable the relevant flags in `app/template/config.ts`, add public GitHub/Discord IDs there if needed, and put secret credentials in an untracked `.env.local` locally or in your hosting provider's environment settings:

| Feature                                               | Settings                                                                                  |
| ----------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| GitHub activity, contributions, project stars         | `features.github`, `githubUsername`; optional `GITHUB_TOKEN`                              |
| Discord presence                                      | `features.discord`, `discordUserId`                                                       |
| Spotify music                                         | `features.spotify`, `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, `SPOTIFY_REFRESH_TOKEN` |
| Threads activity                                      | `features.threads`, `THREADS_ACCESS_TOKEN`                                                |
| KV activity, guestbook, impressions, reactions        | Corresponding flags and `KV_REST_API_URL`, `KV_REST_API_TOKEN`                            |
| VTuber live status, visitor counter, public API index | Corresponding flags                                                                       |

Guestbook GitHub OAuth additionally requires `GITHUB_OAUTH_CLIENT_ID`, `GITHUB_OAUTH_CLIENT_SECRET`, `GUESTBOOK_GH_SECRET`; notification email requires `RESEND_API_KEY` and `RESEND_FROM`. Unconfigured features are hidden; their APIs return 404. Rebuild after changing feature flags or environment variables.

For GitHub OAuth, set the callback URL to `https://your-domain.example/api/auth/github/callback`. To obtain a Spotify refresh token, configure your client ID and secret, register `http://127.0.0.1:8888/callback` with Spotify, then run `node --env-file=.env.local scripts/spotify-refresh-token.mjs`. The script requests `user-top-read` and `user-read-currently-playing`.

## Deploy

Deploy to a host that supports Next.js server routes, such as Vercel. Set your domain in `app/template/config.ts`, configure any enabled integrations' environment variables on the host, and deploy the `template` branch or your own copy. Static-only hosting cannot run the API features.

## Project structure and checks

The code is organized into `app/template/` (settings/theme), `app/data/` (sample content), `app/components/` (feature UI), `app/lib/` (services/helpers), and `content/blog/` (posts). See [architecture notes](docs/architecture.md).

```bash
npm run typecheck
npm run lint
npm run test:features
npm run test:blog
npm run format:check
npm run build
```

Licensed under [Apache-2.0](LICENSE); bundled fonts have their own licenses in [`public/assets/fonts/`](public/assets/fonts/).
