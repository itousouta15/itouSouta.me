# itouSite tamplate

[English](README.md) · 繁體中文

可複製的 Next.js 14 個人網站，包含首頁、關於、經歷、作品、收藏、文章、友鏈及深淺主題。預設使用通用示例資料；不需要外部服務的憑證即可啟動。

## 快速開始

需要 Node.js 20 以上和 npm：

```bash
npm ci
npm run dev
```

開啟 <http://localhost:3000>。依照以下順序替換示例內容：

1. `app/template/config.ts`：站名、網址、作者、簡介、社群、圖片路徑與功能開關。正式部署前務必改掉 `https://example.com`，網址不要加尾端斜線。
2. `app/template/theme.css`：深淺色的主題色與背景。
3. `app/data/`：作品、收藏、經歷、友鏈、首頁標籤與跑馬燈。各檔案已有一筆示例；增加／刪除資料即可更新列表與詳情頁。
4. `content/blog/*.md`：文章。一個檔案對應一個網址；`welcome.md` 可直接改寫或刪除。圖片放在 `public/assets/`。
5. `public/assets/template/`：示例頭像與封面；替換時一併調整 `config.ts` 的路徑。網站的 logo、分享圖片與結構化資料會跟著更新。

## 可選功能

在 `app/template/config.ts` 的 `features` 將需要的功能設為 `true`，並視功能填入公開識別碼（GitHub 使用者名稱／Discord 使用者 ID）。**Token 與私密金鑰只填在 `.env.local` 或部署平台的環境變數，不要放在設定檔。**

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
npm run build
```

本站原本的個人內容保存在 `main` 分支；此分支是可替換資料的模板。授權為 [Apache-2.0](LICENSE)，字型的授權說明見 [`public/assets/fonts/`](public/assets/fonts/)。
