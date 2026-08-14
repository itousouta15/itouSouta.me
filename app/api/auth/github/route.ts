import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { normalizePath } from "../../../lib/path";

/* 留言板「用 GitHub 登入」的起點：轉去 GitHub 授權頁，state 存 httpOnly cookie
   給 callback 核對（CSRF），回跳路徑也存一份 cookie，callback 才知道要送回哪一頁。 */

export async function GET(req: NextRequest) {
  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;
  const returnPath = normalizePath(req.nextUrl.searchParams.get("path")) ?? "/";

  if (!clientId) {
    return NextResponse.redirect(
      new URL(`${returnPath}?gh_error=not_configured`, req.url)
    );
  }

  const state = crypto.randomBytes(16).toString("hex");
  const redirectUri = new URL("/api/auth/github/callback", req.url).toString();
  const authorizeUrl = new URL("https://github.com/login/oauth/authorize");
  authorizeUrl.searchParams.set("client_id", clientId);
  authorizeUrl.searchParams.set("redirect_uri", redirectUri);
  authorizeUrl.searchParams.set("scope", "read:user user:email");
  authorizeUrl.searchParams.set("state", state);

  const res = NextResponse.redirect(authorizeUrl);
  const cookieOpts = {
    httpOnly: true,
    maxAge: 600,
    sameSite: "lax" as const,
    path: "/",
  };
  res.cookies.set("gh_oauth_state", state, cookieOpts);
  res.cookies.set("gh_oauth_return", returnPath, cookieOpts);
  return res;
}
