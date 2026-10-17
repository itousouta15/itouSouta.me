import {
  CONTRIBUTION_USER,
  readContributionDays,
} from "../../lib/contributions";

// Cache successful upstream fetches, but never cache an error response.
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const response = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${CONTRIBUTION_USER}?y=last`,
      { next: { revalidate: 3600 }, signal: AbortSignal.timeout(10000) }
    );
    if (!response.ok) throw new Error("Contribution service unavailable");
    const contributions = readContributionDays(await response.json());
    return Response.json(
      { contributions },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=3600",
        },
      }
    );
  } catch {
    return Response.json(
      { error: "暫時無法取得 GitHub 貢獻資料" },
      {
        status: 502,
        headers: { "Cache-Control": "no-store" },
      }
    );
  }
}
