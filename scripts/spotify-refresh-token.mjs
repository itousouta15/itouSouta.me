// 產生 Spotify 授權網址，取得 refresh token（一次性）。
//
// 預設走正式站回調：授權完會被導到 https://itousouta.me/callback，該頁會顯示
// SPOTIFY_REFRESH_TOKEN 給你複製。用法:
//   1. 到 https://developer.spotify.com/dashboard 建立 App，記下 Client ID / Client Secret
//   2. 在 App 的 Edit Settings → Redirect URIs 加入 https://itousouta.me/callback 並儲存
//      （本機開發的話也可以改用 http://localhost:8888/callback，見下方備註）
//   3. 把 SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET 填進 .env.local
//   4. 跑 `node --env-file=.env.local scripts/spotify-refresh-token.mjs`
//   5. 瀏覽器同意授權後，把 /callback 頁面上印出的 SPOTIFY_REFRESH_TOKEN 貼回
//      .env.local（部署端貼到 Vercel 環境變數）
//   6. 整個流程只需要跑一次；refresh token 不會過期，之後都由伺服器端自動換新 access token
//
// 備註：若想在本機回調，可設定 SPOTIFY_REDIRECT_URI=http://localhost:8888/callback
// （該 URI 也必須加進 Dashboard），此時 script 會自己起一個本機伺服器接授權結果。

import http from "node:http";

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error("請先把 SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET 填進 .env.local");
  process.exit(1);
}

const REDIRECT_URI =
  process.env.SPOTIFY_REDIRECT_URI ?? "https://itousouta.me/callback";
const SCOPE = "user-top-read";

const authUrl =
  "https://accounts.spotify.com/authorize?" +
  new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: "code",
    redirect_uri: REDIRECT_URI,
    scope: SCOPE,
    show_dialog: "true",
  });

// 只有本機回調才需要起伺服器收 code；正式站回調由 /app/callback 路由接手
if (new URL(REDIRECT_URI).hostname !== "localhost") {
  console.log(`請在瀏覽器打開這個網址並同意授權：\n\n${authUrl}\n`);
  console.log(
    `同意後會被導到 ${REDIRECT_URI}，把頁面上顯示的 SPOTIFY_REFRESH_TOKEN 存好即可。`
  );
  process.exit(0);
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, REDIRECT_URI);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");

  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  if (error || !code) {
    res.end(`授權失敗：${error ?? "沒有收到 code"}，關掉這個視窗回到終端機`);
    return;
  }

  try {
    const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${CLIENT_ID}:${CLIENT_SECRET}`,
        ).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: REDIRECT_URI,
      }),
    });
    const json = await tokenRes.json();
    if (!tokenRes.ok || !json.refresh_token) {
      res.end(`換 token 失敗：${JSON.stringify(json)}`);
      return;
    }
    res.end("✓ 成功！可以關掉這個視窗回到終端機了");
    console.log("把下面這行貼到 .env.local：\n");
    console.log(`SPOTIFY_REFRESH_TOKEN=${json.refresh_token}`);
  } catch (e) {
    res.end(`換 token 失敗：${e}`);
  } finally {
    server.close();
  }
});

server.listen(8888, () => {
  console.log(`請在瀏覽器打開這個網址並同意授權：\n\n${authUrl}\n`);
});
