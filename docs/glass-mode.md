# Glass Mode

Glass mode makes the site's background translucent so it cooperates with [Zen Browser](https://zen-browser.app)'s window-transparency feature (Windows Mica/Acrylic, or the Linux/macOS equivalent). When that's enabled, Zen makes the whole tab content area transparent so the desktop shows through — an opaque site background would otherwise block it completely.

## Detection

Entry points: `app/layout.tsx` (blocking inline script), `app/components/ThemeProvider.tsx`, `app/components/Header.tsx`

There is no reliable way to detect Zen Browser specifically from a webpage. Zen is a Firefox fork that deliberately keeps `navigator.userAgent` identical to real Firefox's — changing it breaks too many sites that sniff for "Firefox" (confirmed in [zen-browser/desktop#5612](https://github.com/zen-browser/desktop/discussions/5612)). The site treats any Firefox-family user agent (`/firefox\//i`, excluding SeaMonkey) as the closest available proxy, and defaults glass mode on there, off everywhere else.

The droplet-icon button in the header lets the user override the default — it's only rendered on Firefox-family browsers (`glassCapable` in `ThemeProvider`'s context), since the toggle is meaningless anywhere else. The choice persists to `localStorage` under the `glass` key. The blocking script in `layout.tsx` reads the UA check and that stored override before first paint, so there's no flash between states.

Glass mode forces dark theme whenever it's actually on — the translucent tokens are only tuned for dark. The sun/moon theme button is hidden while glass is on and reappears (with a pop-in animation) once the user turns glass off.

## What changes

All of this lives in the "Glass mode" block near the top of `app/globals.css`, gated behind `:root[data-glass="on"]`:

- `--bg` (the token behind `.root`/`<html>`, and what shows in the empty space between cards, through `.header`, and through `.footer`) becomes fully transparent — not just low-alpha — so the desktop shows through cleanly.
- `--panel`, `--panel2`, `--panel2-a`, and `--inset` (actual card/modal/chip surfaces, including the hover tech-icon panel on the homepage) stay translucent but fairly opaque, so text and icons on them stay legible. Ambient background transparency and content-surface legibility are tuned independently on purpose.
- A shared `--glass-blur: blur(26px) saturate(170%)` is applied via `backdrop-filter` to a curated list of "top-level" card/modal/overlay/button classes, so those surfaces read as frosted glass rather than plain low-opacity color.
- `.header` and `.footer` additionally get `background: transparent; border-color: transparent;` so they blend into the rest of the page instead of standing out as a distinct bar.

## Gotchas

- `backdrop-filter` creates a new containing block for `position: fixed` descendants. Adding it to a class that contains (or is an ancestor of) a fixed-position element can silently break that element's positioning — see the comment in `Header.tsx` about why the mobile nav overlay is a sibling of `.header`, not nested inside it. Grep `globals.css` for `position: fixed` before adding new classes to the shared blur list, and check none of them are descendants of a class that just gained `backdrop-filter`.
- `--bg` going fully transparent broke `.exp-dot`'s halo (`box-shadow: 0 0 0 4px var(--bg)`, a "cutout ring" trick on the `/experience` timeline) — fixed with a glass-mode override that drops the shadow entirely. Any other use of `var(--bg)` as an opaque mask/eraser needs the same kind of check.

## Seeing the full effect

The CSS alone only produces a subtly translucent look in a normal browser — there's no real texture behind it to blur. The "desktop visible through the page" effect needs the user to also enable Zen's own transparency, on their machine:

1. In `about:config`, set `browser.tabs.allow_transparent_browser`, `widget.transparent-windows`, and `widget.windows.mica` to `true`.
2. In Windows Settings → Personalization → Colors, turn off "Show accent color on title bars and window borders."
3. Fully restart the browser.
4. Optionally install [MicaForEveryone](https://github.com/MicaForEveryone/MicaForEveryone) (add a process rule for `zen`, enable Blur Behind, Backdrop Type Acrylic) for an actual blurred backdrop instead of flat see-through.

That's all browser/OS-level configuration on the user's own machine — this repo has no control over it.
