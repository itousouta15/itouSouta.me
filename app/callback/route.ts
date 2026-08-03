// Spotify OAuth 回調：接收授權 code，換成 refresh token 後顯示在頁面上（一次性）。
// 流程：
//   1. 在 Spotify Dashboard 的 Redirect URIs 加入 https://itousouta.me/callback
//   2. 確定 Vercel 環境變數有 SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET
//   3. 跑 node --env-file=.env.local scripts/spotify-refresh-token.mjs 拿到授權網址
//   4. 瀏覽器同意授權後會被導回這頁，把顯示的 SPOTIFY_REFRESH_TOKEN 存進 Vercel / .env.local
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function page(title: string, body: string): NextResponse {
  const html = `<!doctype html>
<html lang="zh-Hant">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Spotify 授權 | itousouta.me</title>
    <style>
      body{margin:0;min-height:100vh;display:grid;place-items:center;background:#0f1115;color:#e8e6e3;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace}
      main{max-width:720px;padding:2rem}
      h1{font-size:1.1rem}
      a{color:#6ea8ff}
      code{display:block;padding:1rem;background:#1a1d24;border:1px solid #2a2f3a;border-radius:8px;overflow-wrap:anywhere;user-select:all}
    </style>
  </head>
  <body><main>${title}${body}</main></body>
</html>`;
  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (error || !code) {
    return page(
      "<h1>Spotify 授權失敗</h1>",
      `<p>${error ?? "沒有收到授權 code"}。請回終端機重新開始流程。</p>`,
    );
  }
  if (!clientId || !clientSecret) {
    return page(
      "<h1>伺服器設定不完整</h1>",
      "<p>部署環境缺少 SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET，無法完成換 token。</p>",
    );
  }

  try {
    const res = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${clientId}:${clientSecret}`,
        ).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: `${url.origin}/callback`,
      }),
    });
    const json = await res.json();
    if (!res.ok || !json.refresh_token) {
      return page(
        "<h1>換 token 失敗</h1>",
        `<p>${JSON.stringify(json)}</p>`,
      );
    }
    return page(
      "<h1>成功！</h1>",
      `<p>把下面這行複製起來，貼到 Vercel 的環境變數（以及本機 .env.local）：</p>
       <code>SPOTIFY_REFRESH_TOKEN=${json.refresh_token}</code>
       <p>此 token 只有 user-top-read 權限，但請盡快保存並別外流。</p>`,
    );
  } catch (e) {
    return page("<h1>換 token 失敗</h1>", `<p>${String(e)}</p>`);
  }
}
