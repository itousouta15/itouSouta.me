# Template architecture

The Next.js App Router provides page and API boundaries. Customize public, serializable settings in `app/template/config.ts`; it is imported by both server and client components, so **never put credentials there**. `app/template/availability.ts` combines switches with server environment variables; server-rendered pages and API routes use it to keep disabled integrations hidden and return 404 before contacting upstreams.

Content lives in `app/data/` (typed entries split by domain) and `content/blog/*.md` (articles). When adding a project, its `slug` becomes `/projects/[slug]`; like categories likewise produce `/likes/[category]`. Keep identifiers URL-friendly. Sample images live in `public/assets/template/`; artwork can be replaced without changing component code.

`app/template/theme.css` owns dark/light design tokens. `app/globals.css` contains common layout, animations and feature sections; article-only styles live in `app/components/writing/writing.css`. UI components live in feature folders (`home/`, `projects/`, `likes/`, `writing/`, `guestbook/` and `chrome/`). The site title, metadata, feeds, manifest, sitemap and JSON-LD consume the same config, rather than duplicating author information.

The default configuration turns off optional network calls, KV writes, social polling, OAuth and notifications. Toggle features individually and supply credentials via the host's environment variables. `publicApi` only controls the API index page; search/RSS and content endpoints may remain available to the site itself. Validate both a no-credentials build and any integrations you enable using the commands in the README.
