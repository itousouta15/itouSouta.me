# Easter Eggs

The site has a few small interactions that are intentionally playful but isolated from the core navigation.

## Avatar Click

Component: `app/components/AvatarEasterEgg.tsx`

Clicking the profile avatar five times in a short window spins it and opens the Discord invite in a new tab.

The click streak resets after a short timeout, so normal profile-card interaction does not accidentally trigger it.

## Hero Face

Component: `app/components/HeroFace.tsx`

The ASCII hero face reacts to pointer movement, can wink on click, and changes expression when it scrolls past the top threshold.

The motion is intentionally lightweight and uses `requestAnimationFrame` throttling.

## Name Decode

Component: `app/components/NameRotator.tsx`

The display name cycles through multiple names. On hover, it pauses and runs a short text-decode animation into the currently visible name.

## Command Palette Inputs

Component: `app/components/CommandPaletteInner.tsx`

The command palette supports normal page/project search, plus hidden inputs:

- `67` triggers a brief page skew/wobble effect.
- `114514` enables Gravity Mode.

## Gravity Mode

Component: `app/components/GravityMode.tsx`

Gravity Mode turns visible page elements into simple 2D bodies. They fall, collide with the viewport, stack against each other, and can be dragged and thrown.

It is implemented with a small hand-rolled physics loop rather than a full physics engine because the feature is intentionally self-contained and decorative.

The floating reset button reloads the page to restore the normal document flow.
