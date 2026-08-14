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

    // 回覆通知用的 email（scope 有 user:email 才拿得到）。拿不到不擋登入，
    // 只是沒留 email 就收不到通知；抓到 primary+verified 的那個地址才用。
    let email: string | null = null;
    const emailsRes = await fetch("https://api.github.com/user/emails", {
      headers: {
        Authorization: `Bearer ${tokenJson.access_token}`,
        "User-Agent": "itouSouta.me-guestbook",
        Accept: "application/vnd.github+json",
      },
    });
    if (emailsRes.ok) {
      const emails = (await emailsRes.json().catch(() => [])) as {
        email?: string;
        primary?: boolean;
        verified?: boolean;
      }[];
      email =
        emails.find(
          (e) => e.primary && e.verified && typeof e.email === "string"
        )?.email ?? null;
    }

    const token = signGithubIdentity({
      login: user.login,
      avatarUrl: user.avatar_url,
      profileUrl: user.html_url ?? `https://github.com/${user.login}`,
      email,
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
