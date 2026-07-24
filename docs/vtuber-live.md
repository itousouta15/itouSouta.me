# VTuber Live Status

The VTuber live-status feature powers the live badges and live-first sorting in the likes pages.

## Entry Points

- API route: `app/api/vtuber-live/route.ts`
- Client hook: `app/hooks/useVtuberLiveStatus.ts`
- Warmup component: `app/components/VtuberLiveWarmup.tsx`
- Sorting helper: `app/lib/sortLikes.ts`

## Data Flow

1. VTuber entries are defined in `app/data.ts`.
2. The client calls `/api/vtuber-live`.
3. The API checks whether each tracked VTuber is currently streaming.
4. The response is cached briefly.
5. Likes sections use the response to add live badges and sort live channels first.

## Sources

VSPO-affiliated members are checked through `vspo-schedule.com`. The route fetches the schedule page once and extracts the embedded live-stream data, so one request can cover the whole VSPO group.

Other VTubers fall back to their YouTube channel `/live` page. The implementation scans the embedded player data for a live signal.

This avoids needing a YouTube Data API key or quota.

## Caching

The route uses a short revalidation interval so the UI stays reasonably fresh without hammering upstream pages.

`VtuberLiveWarmup` fires an early request when `/likes` loads, which warms the cache before users open the VTuber category.

## UI Behavior

When a channel is live:

- Its card gets a live visual treatment.
- It sorts ahead of non-live entries.
- Clicking can link directly to the live broadcast instead of the channel page.

`sortLikesByRating` accepts an optional live predicate. When provided, live status is the primary sort key and rating breaks ties.

Reordering is animated with a small FLIP helper so cards slide into place instead of snapping.
