# itouSouta.me

[English](README.md) · 繁體中文

![itouSouta.me 網站截圖](public/assets/projects/itousouta15.webp)

這是 [itousouta.me](https://itousouta.me) 的原始碼，也是 itouSouta／伊藤蒼太／郭家睿的個人網站。專案、文章、喜歡的東西，還有一些互動小細節，都放在這裡。

## 網站裡有什麼

- `/`：個人檔案、Discord 狀態、訪客留印牆與 GitHub 貢獻圖。
- `/about`：關於我的更多介紹。
- `/writing`：Markdown 文章，以及整合 Threads、GitHub、Discord 內容的碎碎念分頁。
- `/likes`、`/likes/music`：小說、漫畫、動畫、VTuber 與可搜尋的 Spotify 常聽歌曲。
- `/projects`：可搜尋的專案列表、各專案的故事與截圖。
- `/links`、`/experience`：友鏈、社群與經歷時間軸。
- `/api`：公開的訂閱來源、搜尋索引、狀態徽章與其他端點。

網站也支援深淺色主題、Cmd/Ctrl+K 站內搜尋、部分頁面的留言板，以及離線備援頁面。文章訂閱網址是 `/writing/feed.xml`，碎碎念則是 `/feed.xml`。

## 網站怎麼運作

本站使用 **Next.js 14 App Router、React、TypeScript 與純 CSS**。手動整理的內容主要放在 [`app/data/`](app/data/) 和 [`content/blog/`](content/blog/)；需要即時資料的地方，再由伺服器路由與小型前端元件補上：

- **Vercel KV** 儲存由 Discord 同步的碎碎念、按讚數、訪客留印與留言。留言回覆可透過 **Resend** 寄通知信，也可以選擇用 GitHub 登入。
- **Spotify** 提供常聽歌曲與目前播放曲目；播放器可退回 **Lanyard** 資料，Discord 上線狀態也由 Lanyard 提供。
- **Threads 與 GitHub** 提供碎碎念動態及專案資訊；GitHub 貢獻圖則在捲動到附近時才載入。
- [`public/sw.js`](public/sw.js) 提供基本的離線頁面，僅在正式環境註冊。

本機建置不需要外部服務憑證；未設定時，相關功能會顯示備援內容、錯誤狀態，或不顯示資料。

## 本機啟動

需要 **Node.js 20 以上**及 npm：

```bash
npm ci
npm run dev
```

打開 <http://localhost:3000>。不設定憑證也可以啟動、建置網站；若要使用即時功能，請依需求在不納入版本控制的 `.env.local` 設定：

- `KV_REST_API_URL`、`KV_REST_API_TOKEN`：Vercel KV，供碎碎念、按讚、留印牆與留言板使用。
- `THREADS_ACCESS_TOKEN`：碎碎念中的 Threads 貼文。
- `GITHUB_TOKEN`：專案資訊及動態的 GitHub API 授權請求。
- `SPOTIFY_CLIENT_ID`、`SPOTIFY_CLIENT_SECRET`、`SPOTIFY_REFRESH_TOKEN`：常聽歌曲與目前播放曲目。
- `GITHUB_OAUTH_CLIENT_ID`、`GITHUB_OAUTH_CLIENT_SECRET`、`GUESTBOOK_GH_SECRET`：留言板的選用 GitHub 登入。
- `RESEND_API_KEY`、`RESEND_FROM`：留言回覆通知信。
- `REVALIDATE_SECRET`：驗證 `/api/revalidate` 請求。

要取得 Spotify refresh token，先設定 client ID 與 secret，並在 Spotify App 登記 `http://127.0.0.1:8888/callback`，再執行 `node --env-file=.env.local scripts/spotify-refresh-token.mjs`。腳本會要求 `user-top-read` 與 `user-read-currently-playing` 權限。

### 檢查指令

```bash
npm run typecheck
npm run lint
npm run test:features
npm run test:blog
npm run format:check
npm run build
```

`npm run start` 可以啟動正式建置。CI 使用 Node 20 執行上述檢查。

## 專案目錄

- [`app/`](app/)：頁面、API、元件、資料與共用函式。
- [`content/blog/`](content/blog/)：Markdown 文章及相關內容。
- [`public/assets/`](public/assets/)：品牌圖片、封面與其他網站素材。
- [`docs/`](docs/)：實作細節與文章撰寫說明。

想看更多細節，可參考[架構說明](docs/architecture.md)、[文章撰寫與遷移](docs/blog-migration.md)、[VTuber 開台狀態](docs/vtuber-live.md)及[彩蛋](docs/easter-eggs.md)。

## 授權

採用 Apache-2.0，詳見 [LICENSE](LICENSE)。
隨站提供的 LINE Seed TW 字型採用 [SIL OFL 1.1](public/assets/fonts/LINE-Seed-TW-OFL.txt) 授權。
