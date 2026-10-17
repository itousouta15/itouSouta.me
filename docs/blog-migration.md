# Native blog / itouBLoGa migration

## Content and authoring

The ten Chinese posts from `itousouta15/itouBLoGa` now live in `content/blog/*.md`.
This directory is the source of truth for new writing; builds and page requests
do not fetch the old Atom feed or GitHub. English and Japanese versions remain
at the old site and are linked from each article's language navigation.

Create a new `.md` file with an ASCII filename (the filename is the canonical slug):

```md
---
title: 文章標題
date: "2026-10-17T20:00:00+08:00"
categories:
  - 技術分享
tags:
  - Next.js
cover: /assets/blog/my-cover.webp
description: 選填的摘要；省略時會從正文產生。
draft: false
pinned: false
---

## 第一個段落

使用一般 Markdown 撰寫。
```

`draft: true` excludes a post from lists, static params, and detail pages. New
posts automatically get a table of contents, search indexing, metadata, an RSS
entry, and the per-article guestbook. The optional `updated` field uses the same
ISO date format. Quote dates and include the `+08:00` offset to preserve Taipei
time. A filename is a stable identifier: rename only with a corresponding redirect.

The migrated year-6767 post keeps its original date; pinning is an independent
optional frontmatter setting.
It is excluded from the current-publication RSS/latest-post badge and is not
used as a sitemap's future `lastModified`.

## Markdown and images

Articles use GFM, KaTeX math and server-side Shiki syntax highlighting. Heading
IDs and the table of contents come from the same AST; headings are shifted as
needed so the article title is the sole h1. Code-copy buttons preserve source
text. Unrecognized/raw HTML is not executed.

During import, Hexo excerpt markers were removed, legacy language labels were
normalized, and the Reimu friend widget became an ordinary linked avatar and
credit. C++ template text is kept as inline code. Image URL rewriting is limited
to Markdown links; executable code and payload URLs are left intact.

`public/assets/blog/originals/` contains the 130 referenced local originals;
`public/assets/blog/images/` contains responsive WebP derivatives.
`content/blog/images.json` records their dimensions and variants. The importer
verifies Git blob checksums before generating derivatives. New images may be
added directly under `public/assets/blog/`; images not in the imported manifest
still work, without generated `srcset` derivatives.

Outer list thumbnails fill an edge-to-edge 18:9 frame, with a subtle load/viewport
reveal and hover feedback. Article covers keep their full available width and
are center-cropped to a maximum height of 360px on desktop and 240px on mobile.
Body images use the original files and natural dimensions, shrinking only to
fit the content column; they have no reveal/hover animation or forced crop.
Click body images to inspect the original in a native modal. Reduced-motion
preferences disable decorative motion.

## Historical comments

`content/blog/legacy-comments.json` is a snapshot of public, approved Waline
comments. It preserves the original author, date, content, IDs and reply links;
private email/IP/browser/location fields are not imported. Initial provenance,
source revision, and counts are in `content/blog/migration.json`.

The guestbook API merges this local history with new KV comments. Replies to a
historical comment are stored under its stable `waline-...` root ID in KV, so
the existing conversation continues without writing to the old service. If KV
is temporarily unavailable, historical comments remain readable and the form
switches to read-only. Historical authors do not acquire a GitHub-verified badge.

Before the old site's Chinese routes are switched, refresh any intervening
approved comments:

```sh
npm run blog:sync-history
```

This only reads the public Waline API and updates the local snapshot. It sends
no notification emails and makes no remote KV writes. Review and deploy the
updated snapshot along with the site. Historical moderation can also be applied
to this JSON directly; do not publish a raw administrator export with private data.

## URLs, RSS and old-domain cutover

Canonical Chinese pages use `/writing/<urlname>`; the original `urlname` and
case are preserved. Local article search keeps query/tag/month filters
in the URL. `/writing?view=thoughts` displays the existing unified thoughts feed.
Article RSS is `/writing/feed.xml`; the existing `/feed.xml` still serves thoughts.

Month filtering uses a clickable year/month timeline (horizontal month rows on mobile). All
filters compose and remain in the URL. The article table of contents highlights
the section currently being read and keeps its active link visible. Heading
positions are cached; passive, animation-frame-throttled scroll events use a
binary search, while ResizeObserver/font/transition events refresh measurements
after streamed content, images, fonts, or layout changes.

`content/blog/redirects.json` records the **actual published** legacy paths.
Use this map rather than calculating paths from dates: several old paths differ
by one day from their frontmatter dates. `next.config.mjs` permanently redirects
these known paths on the main site and can handle the old host if routed here.

The old blog is served by GitHub Pages behind its domain proxy. Its live DNS and
proxy rules are external to this repository. At deployment, configure exact
301/308 redirects for the ten Chinese source URLs in this map to:

```text
https://itousouta.me/writing/<slug>
```

Keep `/en/...`, `/ja/...`, old static assets, and the old multilingual Atom feed
on the old hosting during this first phase. Do not redirect the entire old host
to the main site. No production DNS/proxy changes are performed by the importer.

The original one-time importer is `scripts/import-blog.mjs`. It refuses to run
over an existing migration and is not part of the build; do not use it to update
articles after authoring has moved into this repository.

## Verification

```sh
npm run test:features
npm run test:blog
npm run typecheck
npm run lint
npm run build
```

Blog tests cover metadata, timezone/legacy-path differences, slug validation,
heading IDs, responsive image existence, code-preserving normalization, history
merging, replies to historical parents, and the Chinese-only redirect map.
