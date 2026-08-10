import { NextRequest, NextResponse } from "next/server";
import { signGithubIdentity } from "../../../../lib/githubAuth";
import { normalizePath } from "../../../../lib/path";

export async function GET(req: NextRequest) {
  const returnPath =
    normalizePath(req.cookies.get("gh_oauth_return")?.value ?? null) ?? "/";
  const expectedState = req.cookies.get("gh_oauth_state")?.value;
  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");

  const fail = (reason: string) => {
    const res = NextResponse.redirect(
      new URL(`${returnPath}?gh_error=${reason}`, req.url)
    );
    res.cookies.delete("gh_oauth_state");
    res.cookies.delete("gh_oauth_return");
    return res;
  };

  if (!code || !state || !expectedState || state !== expectedState)
    return fail("state");

  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GITHUB_OAUTH_CLIENT_SECRET;
  if (!clientId || !clientSecret) return fail("not_configured");

  try {
    const tokenRes = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          code,
          redirect_uri: new URL(
            "/api/auth/github/callback",
            req.url
          ).toString(),
        }),
      }
    );
    const tokenJson = (await tokenRes.json().catch(() => ({}))) as {
      access_token?: string;
    };
    if (!tokenJson.access_token) return fail("token");

    const userRes = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokenJson.access_token}`,
        "User-Agent": "itouSouta.me-guestbook",
        Accept: "application/vnd.github+json",
      },
    });
    if (!userRes.ok) return fail("profile");
    const user = (await userRes.json()) as {
      login?: string;
      avatar_url?: string;
      html_url?: string;
    };
    if (!user.login || !user.avatar_url) return fail("profile");

    const token = signGithubIdentity({
      login: user.login,
      avatarUrl: user.avatar_url,
      profileUrl: user.html_url ?? `https://github.com/${user.login}`,
    });

    const res = NextResponse.redirect(
      new URL(`${returnPath}?gh_token=${encodeURIComponent(token)}`, req.url)
    );
    res.cookies.delete("gh_oauth_state");
    res.cookies.delete("gh_oauth_return");
    return res;
  } catch {
    return fail("network");
  }
}
