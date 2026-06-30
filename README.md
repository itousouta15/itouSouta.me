# itousouta15.tw
![示意圖](public\assets\itousouta15.webp)
Personal website of itouSouta (郭家睿 / 伊藤蒼太), live at [itousouta15.tw](https://itousouta15.tw).

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router, static export) |
| Language | TypeScript |
| Styling | Plain CSS (single global stylesheet, CSS custom properties) |
| Real-time | [Lanyard API](https://github.com/Phineas/lanyard) — Discord presence |
| Deployment | GitHub Pages via GitHub Actions |

No UI library, no CSS-in-JS, no component framework.

---

## Pages

| Route | Description |
|---|---|
| `/` | Home — profile card, hero, tech tiles, bento nav grid, GitHub contribution graph |
| `/about` | About — bio, stats, social links |
| `/likes` | Likes — searchable, tag-filtered grid of novels, manga, and anime; music section |
| `/likes/[category]` | Category detail — full list with carousel and filter |
| `/likes/music` | Music — horizontally scrollable artist cards with song lists |
| `/projects` | Projects — card grid of personal projects |
| `/links` | Friends — link cards for friends and communities |
| `/experience` | Journey — timeline of experience and activities |

---

## Features

**Theme**
Dark and light modes. The selected theme is persisted to `localStorage` and applied via a blocking inline script before first paint, preventing a flash of unstyled content.

**Typography**
Multiple typefaces are loaded from Google Fonts and external CDNs:

- `ChenYuLuoYan` — header logo
- `LXGWHeartSerif` — quote display text
- `Shippori Mincho` / `Noto Serif TC` — headings and serif content
- `JetBrains Mono` — monospace labels, kickers, code-like elements
- `Noto Sans TC` — body text

The logo is hidden until `ChenYuLuoYan` is active (detected via `document.fonts.load`) to prevent a FOUT caused by the fallback font rendering at a significantly larger apparent size.

**Likes and music**
All content is statically defined in `app/data.ts`. The likes pages support client-side full-text search and multi-tag filtering without any server dependency. Horizontal carousels use custom hooks for mouse-wheel and scroll-linked panning.

**Lanyard integration**
Discord presence (online status, activity, Spotify playback) is fetched live from the Lanyard WebSocket API and displayed in the profile card. The component gracefully handles disconnection.

**GitHub contribution graph**
The graph SVG is pre-generated and committed as a static asset in both dark and light variants. On mobile, the card scrolls horizontally; the scroll position is linked to the card's progress through the viewport via `useScrollLinkedHorizontalReveal`, so the graph pans left to right as the user scrolls down the page.

**Animations**
- CSS keyframe marquee for the footer strip and tech tile rows
- Name rotator cycling through display names in the hero
- Page transitions via `PageTransition`
- Card hover effects (disabled on touch devices via `@media (hover: none)`)
- All animations respect `prefers-reduced-motion`

**Accessibility and UX**
- Touch devices: hover transforms are reset; `:active` states provide tap feedback instead
- Back-to-top button with smooth scroll, visible after 400 px scrolled
- Mobile nav: Escape key closes the overlay; `tabIndex` is managed on hidden controls
- Horizontal scroll containers show a right-edge fade to indicate additional content

---

## Project structure

```
app/
  components/
    Header.tsx                       Sticky nav with mobile overlay
    Footer.tsx                       Footer with sitemap, projects, social links
    TileIcon.tsx                     Theme-aware technology icon tile (client component)
    tileIconMeta.ts                  Icon metadata (src, dark bg, light bg) — server-safe
    LanyardCards.tsx                 Discord presence components
    GithubContributionCard.tsx
    LikeCard.tsx
    LikeCategorySection.tsx
    LikeFilterGrid.tsx
    MusicArtistCard.tsx
    MusicSection.tsx
    PageTransition.tsx
    BackToTopButton.tsx
    ThemeProvider.tsx
  hooks/
    useHorizontalWheelScroll.ts          Mouse-wheel horizontal pan
    useScrollLinkedHorizontalReveal.ts   Scroll-position-linked horizontal pan
  about/page.tsx
  experience/page.tsx
  likes/page.tsx
  likes/[category]/page.tsx
  likes/music/page.tsx
  links/page.tsx
  projects/page.tsx
  page.tsx            Home
  layout.tsx          Root layout — fonts, theme script, header, footer
  globals.css         All styles (~2 400 lines)
  data.ts             All content — roles, likes, projects, music, links
public/
  assets/             Images and GitHub contribution SVGs
  icon/               Custom SVG icons
```

---

## Development

Node 20 or later is required.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # Static export to /out
npm run lint
```

---

## Deployment

Pushes to `main` trigger the GitHub Actions workflow at `.github/workflows/nextjs.yml`, which runs `next build` and deploys the `out/` directory to GitHub Pages. The custom domain is set via the `CNAME` file.

---

## Content

All page content lives in `app/data.ts`. To add or update a like, project, music artist, or friend link, edit the relevant exported array and push. No configuration changes are needed.

Technology icons are defined in `app/components/tileIconMeta.ts`. Each entry has a label, a Devicons CDN URL, a dark-mode background colour, and a light-mode background colour.
