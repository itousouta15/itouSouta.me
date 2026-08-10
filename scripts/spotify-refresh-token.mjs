// 產生 Spotify 授權網址，取得 refresh token（一次性）。
//
// 整個流程都在本機完成：這支 script 會起一個 localhost:8888 的小伺服器接授權結果，
// 換到的 refresh token 直接印在終端機。用法:
//   1. 到 https://developer.spotify.com/dashboard 建立 App，記下 Client ID / Client Secret
//   2. 在 App 的 Edit Settings → Redirect URIs 加入 http://localhost:8888/callback 並儲存
//   3. 把 SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET 填進 .env.local
//   4. 跑 `node --env-file=.env.local scripts/spotify-refresh-token.mjs`
//   5. 瀏覽器同意授權後，把終端機印出的 SPOTIFY_REFRESH_TOKEN 貼回 .env.local
//      （部署端貼到 Vercel 環境變數）
//   6. 整個流程只需要跑一次；refresh token 不會過期，之後都由伺服器端自動換新 access token
//
// 備註：正式站上曾經有一個 /callback 路由做同樣的事，但那是一次性工具卻長期留在
// production，已移除。要換別的回調位址就設 SPOTIFY_REDIRECT_URI（非 localhost 時
// 這支 script 只會印出授權網址，收 code 得自己來）。
//
// SCOPE 含 user-read-currently-playing，是給「目前正在聽」功能用的（見
// app/lib/spotify.ts 的 getCurrentlyPlaying）。舊的 refresh token 若是在加這個
// scope 之前產生的，得重新跑一次這支 script 換新 token，否則會被 Spotify 拒絕。

import http from "node:http";

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error(
    "請先把 SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET 填進 .env.local"
  );
  process.exit(1);
}

const REDIRECT_URI =
  process.env.SPOTIFY_REDIRECT_URI ?? "http://localhost:8888/callback";
const SCOPE = "user-top-read user-read-currently-playing";

const authUrl =
  "https://accounts.spotify.com/authorize?" +
  new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: "code",
    redirect_uri: REDIRECT_URI,
    scope: SCOPE,
    show_dialog: "true",
  });

// 只有本機回調才起伺服器收 code；指到別的位址就只印授權網址，code 自己接
if (new URL(REDIRECT_URI).hostname !== "localhost") {
  console.log(`請在瀏覽器打開這個網址並同意授權：\n\n${authUrl}\n`);
  console.log(
    `同意後會被導到 ${REDIRECT_URI}，該位址得自己接住 ?code= 並換成 refresh token。`
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
          `${CLIENT_ID}:${CLIENT_SECRET}`
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
