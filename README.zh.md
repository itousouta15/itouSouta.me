# itouSite — itousouta.me 網站模板

[English](README.md) · 繁體中文

這是 [itousouta.me](https://itousouta.me) 的網站模板，使用 Next.js 14 製作。包含首頁、關於、經歷、作品、收藏、Markdown 文章、友鏈和深淺色主題。`template` 分支放的是可替換的示例資料；原站內容則保留在 `main` 分支。

## 快速開始

需要 **Node.js 20 以上**和 npm。先複製 `template` 分支（或使用你從這個分支建立的副本）：

```bash
git clone --branch template --single-branch https://github.com/itousouta15/itouSouta.me.git my-site
cd my-site
npm ci
npm run dev
```

開啟 <http://localhost:3000> 就能看到示例網站，不需要先申請 API 金鑰。接著依序換成自己的內容：

1. [`app/template/config.ts`](app/template/config.ts)：修改站名、網址、作者、簡介、社群連結、圖片路徑與功能開關。正式部署前務必把 `https://example.com` 改成自己的網址，結尾不要加斜線。這份設定會送到瀏覽器，別把密鑰放在這裡。
2. [`app/data/`](app/data/)：修改作品、收藏、經歷、友鏈、首頁標籤與備用碎碎念。增減資料就能更新列表；作品的 `slug` 會成為 `/projects/<slug>` 的網址，收藏分類的 key 則會成為 `/likes/<category>` 的網址，請使用適合放進網址的名稱。
3. [`content/blog/welcome.md`](content/blog/welcome.md)：直接改寫範例文章，或在 [`content/blog/`](content/blog/) 新增 `.md` 檔。檔名會成為 `/writing/` 下的文章網址；文章開頭需要的資料可參考 `welcome.md`。圖片放在 [`public/assets/`](public/assets/)；示例頭像和封面在 [`public/assets/template/`](public/assets/template/)，換圖時也要檢查設定檔中的路徑。
4. [`app/template/theme.css`](app/template/theme.css)：調整深淺色的主題色與背景。改完後執行 `npm run build` 檢查；`npm run start` 可以在本機預覽正式建置。

## 可選功能

功能預設全部關閉。在 [`app/template/config.ts`](app/template/config.ts) 的 `features` 將需要的功能設為 `true`，並視功能填入公開識別碼（GitHub 使用者名稱／Discord 使用者 ID）。**Token 與私密金鑰只填在不納入版本控制的 `.env.local` 或部署平台的環境變數，不要放在設定檔。**

| 功能                            | 開關                                                    | 必要設定                                                              |
| ------------------------------- | ------------------------------------------------------- | --------------------------------------------------------------------- |
| GitHub 專案資訊、活動、貢獻圖   | `github`                                                | `githubUsername`；`GITHUB_TOKEN` 選填                                 |
| Discord 狀態                    | `discord`                                               | `discordUserId`                                                       |
| Spotify 音樂                    | `spotify`                                               | `SPOTIFY_CLIENT_ID`、`SPOTIFY_CLIENT_SECRET`、`SPOTIFY_REFRESH_TOKEN` |
| Threads 動態                    | `threads`                                               | `THREADS_ACCESS_TOKEN`                                                |
| KV 動態、留言板、訪客留印、按讚 | `liveThoughts`、`guestbook`、`impressions`、`reactions` | `KV_REST_API_URL`、`KV_REST_API_TOKEN`                                |
| VTuber 開台                     | `vtuberLive`                                            | 在 `app/data/likes.ts` 設定頻道連結                                   |
| 網站訪客計數                    | `visitorCounter`                                        | 無；使用外部計數服務                                                  |
| 公開端點目錄                    | `publicApi`                                             | 無                                                                    |

OAuth 登入留言板另需 `GITHUB_OAUTH_CLIENT_ID`、`GITHUB_OAUTH_CLIENT_SECRET`、`GUESTBOOK_GH_SECRET`；郵件通知另需 `RESEND_API_KEY` 與 `RESEND_FROM`。缺少必要憑證的功能不會顯示，對應 API 會回傳 404。更改設定或憑證後請重新建置並部署。

使用 GitHub OAuth 時，請把 `https://你的網域/api/auth/github/callback` 設為 callback URL。若要取得 Spotify refresh token，先設定 client ID 與 secret，並在 Spotify App 登記 `http://127.0.0.1:8888/callback`，再執行 `node --env-file=.env.local scripts/spotify-refresh-token.mjs`；腳本會要求 `user-top-read` 和 `user-read-currently-playing` 權限。

## 部署

部署到支援 Next.js 伺服器路由的平台，例如 Vercel。先在 `app/template/config.ts` 設定自己的網域，並在平台上加入已啟用功能所需的環境變數，再部署 `template` 分支或自己的副本。只有靜態檔案的主機無法執行這裡的 API 功能。

## 專案結構

- `app/template/`：站點設定、功能可用性與主題樣式。
- `app/data/`：各頁面的靜態資料。
- `app/components/`：依功能分類的共用 UI 元件。
- `app/lib/`：伺服器服務、內容解析與路由邏輯。
- `content/blog/`：Markdown 文章。
- `public/assets/`：圖片、字型和圖示。

詳細設計與擴充方式見 [架構說明](docs/architecture.md)。

## 檢查

```bash
npm run typecheck
npm run lint
npm run test:features
npm run test:blog
npm run format:check
npm run build
```

本站原本的個人內容保存在 `main` 分支；此分支是可替換資料的模板。授權為 [Apache-2.0](LICENSE)，字型的授權說明見 [`public/assets/fonts/`](public/assets/fonts/)。
