# itouSouta.me

[English](README.md) | 繁體中文

![示意圖](public/assets/itousouta15.webp)
itouSouta / 郭家睿 / 伊藤蒼太 的個人網站，網址為 [itouSouta.me](https://itouSouta.me)。

## 技術棧

| 層級 | 技術 |
|---|---|
| 框架 | Next.js 14（App Router） |
| 語言 | TypeScript |
| 樣式 | 純 CSS（單一全域樣式表，使用 CSS custom properties） |
| 資料 | Vercel KV（Redis）— 來自 Discord 的貼文；Threads API — 同步貼文；GitHub API — 專案資訊；Last.fm API — 熱門專輯 |
| 即時資料 | [Lanyard API](https://github.com/Phineas/lanyard) — Discord 狀態 |
| 部署 | Vercel |

沒有使用 UI 函式庫、CSS-in-JS，也沒有使用元件框架。

## 頁面

| 路由 | 說明 |
|---|---|
| `/` | 首頁 — 個人檔案卡、Hero 區塊、技術磚牆、bento 導覽格、GitHub 貢獻圖 |
| `/about` | 關於 — 簡介、統計數據、座右銘，以及兩張 Last.fm/Likes 預覽卡（動畫、專輯） |
| `/thoughts` | 雜談 — 整合 Discord 斜線指令貼文、同步的 Threads 貼文與 GitHub 事件的動態牆 |
| `/likes` | Likes — 可搜尋、可依標籤篩選的小說、漫畫、動畫格狀清單；Last.fm 熱門專輯預覽列 |
| `/likes/[category]` | 分類詳情 — 含輪播與篩選功能的完整清單 |
| `/likes/music` | 音樂 — 可搜尋的 Last.fm 熱門專輯格狀清單（方形封面），與其他分類共用同一套模態詳情檢視 |
| `/projects` | 專案 — 可篩選的個人專案卡片，含 GitHub 專案資訊 |
| `/links` | 朋友 — 朋友與社群的連結卡片 |
| `/experience` | 歷程 — 經歷與活動時間軸 |
| `/feed.xml` | RSS Feed — 整合雜談、專案與更新的統一動態 |
| (Cmd/Ctrl+K) | 指令面板 — 快速導覽與搜尋頁面、專案 |

## 功能特色

**主題**
支援深色與淺色模式。所選主題會存於 `localStorage`，並在首次繪製前透過阻塞式的行內腳本套用，避免出現無樣式內容閃爍（FOUC）。

**字型**
多種字型分別載入自 Google Fonts 與 [emfont](https://font.emtech.cc) CDN：

- `ChenYuLuoYan`（emfont）— 頁首 Logo
- `LXGWHeartSerif`（emfont）— 引言顯示文字
- `Shippori Mincho` / `Noto Serif TC`（Google Fonts）— 標題與襯線內容
- `Dancing Script`（Google Fonts）— 裝飾性手寫字
- `JetBrains Mono`（Google Fonts）— 等寬標籤、Kicker 文字、程式碼風格元素
- `Noto Sans TC`（Google Fonts）— 內文文字

Logo 會在偵測到 `ChenYuLuoYan` 字型啟用（透過 `document.fonts.load`）前保持隱藏，以避免備援字型以明顯偏大的視覺尺寸顯示所造成的 FOUT。

**雜談 (Thoughts)**
獨立的 Discord 機器人（[itouBot](../itouBot)）提供 `/碎碎念` 斜線指令，內容直接寫入 Vercel KV；每次發文後會呼叫 `app/api/revalidate/route.ts`（以 `REVALIDATE_SECRET` 保護），讓頁面立即更新。`/thoughts` 頁面會將這些內容與從 Threads API（`app/lib/threads.ts`）取得的貼文合併，依時間戳由新到舊排序。若無遠端資料可用，則回退至 `app/data.ts` 中的靜態 `THOUGHTS` 陣列。

**Likes**
小說、漫畫、動畫與 VTuber 條目皆靜態定義於 `app/data.ts`。Likes 頁面支援不依賴伺服器的客戶端全文搜尋與多標籤篩選。水平輪播使用自訂 Hook 處理滑鼠滾輪與捲動連動的平移。`LikeCard`/`LikeFilterGrid` 支援 `layout` 屬性（`"circle"` 用於 VTuber 頭像、`"square"` 用於專輯封面），會切換縮圖裁切方式，且在 `"circle"` 模式下隱藏副標行並跳過詳情模態，改為直接連結至外部頁面。

**音樂 (Last.fm)**
與其他 Likes 內容不同，音樂為即時資料：`app/lib/lastfm.ts` 呼叫 Last.fm 的 `user.gettopalbums`（專輯封面是 Last.fm 中唯一仍會回傳真實封面圖片的實體 — 藝人／單曲端點現在都回傳同一張佔位圖）。此資料支援三個依範圍遞增的展示位置：關於頁的迷你卡片（本月、前 4 名）、`/likes` 預覽列（總計、前 12 名），以及完整的 `/likes/music` 格狀清單（總計、前 50 名）。每個呼叫點都將 `null` 結果（缺少 `LASTFM_API_KEY`/`LASTFM_USER`，或 API 呼叫失敗）視為「無資料」並優雅降級 — 關於頁卡片會回退至 `app/data.ts` 中靜態的 `MUSIC_ARTISTS` 頭像，`/likes` 則直接省略預覽列。

**Lanyard 整合**
Discord 狀態（上線狀態、活動、Spotify 播放）透過 Lanyard WebSocket API 即時取得並顯示於個人檔案卡中。此元件能妥善處理斷線情況。

**GitHub 貢獻圖**
貢獻圖 SVG 為預先產生並提交的靜態資源，同時包含深色與淺色兩種版本。在行動裝置上，卡片可水平捲動；捲動位置透過 `useScrollLinkedHorizontalReveal` 與卡片在視窗中的捲動進度連動，因此使用者向下捲動頁面時貢獻圖會由左至右平移 — 該效果被重新對應至一段較窄的捲動距離視窗（Hook 中的 `TRIGGER_RANGE`），而非整個進入到離開視窗的過程，因此不需要捲動整個螢幕高度才能完成。

**圖片縮圖**
頭像、Likes 封面、音樂封面與專案截圖皆熱連結自數十個外部、不受控的網域 — 數量太多，無法逐一透過 `next/image` 的 `remotePatterns` 加入允許清單。`app/lib/imageThumb.ts` 會將任何 `http(s)` 來源導向 [wsrv.nl](https://wsrv.nl) 縮圖代理服務，並依實際顯示所需的尺寸縮放（`avatarThumb`、`likeThumb`、`likeCircleThumb`、`artistAvatarThumb`、`songThumb`、`projectCoverThumb`、`cardBgThumb`），對本機 `/assets` 路徑、動態 `.gif`（代理服務的 webp 轉換會使動畫失效）以及 `PROXY_BLOCKED_HOSTS` 中少數會拒絕代理服務請求的網域，則回退使用原始網址。

**動畫效果**
- 頁尾跑馬燈與技術磚牆列使用 CSS 關鍵影格
- Hero 區塊中輪播顯示名稱的名稱輪播器
- 透過 `PageTransition` 實現的頁面轉場
- 卡片懸停效果（觸控裝置上透過 `@media (hover: none)` 停用）
- 所有動畫皆遵循 `prefers-reduced-motion`

**指令面板**
透過 Cmd/Ctrl+K 快速導覽並搜尋網站內容，可即時存取所有頁面與專案，並支援模糊搜尋以加快查找速度。

**RSS Feed**
統一的 RSS Feed 位於 `/feed.xml`，整合來自 Discord（`/碎碎念` 斜線指令）、Threads 貼文與 GitHub 專案事件的雜談內容，並依時間戳排序。

**專案與詳情**
專案頁面支援依技術與分類篩選。專案卡片會從 GitHub API 即時取得專案資訊（星數、語言、描述）。點擊專案會開啟含詳細資訊與直接連結的模態視窗。

**Likes 詳情**
Likes 支援詳情檢視，提供比格狀卡片更完整的說明與額外中繼資料。

**無障礙與使用者體驗**
- 觸控裝置：懸停變換效果會被重置；改用 `:active` 狀態提供點按回饋
- 平滑捲動的回到頂部按鈕，捲動超過 400 px 後顯示
- 行動裝置導覽：按 Escape 鍵可關閉覆蓋層；隱藏控制項的 `tabIndex` 會被適當管理
- 水平捲動容器右側顯示漸層以提示還有更多內容

## 專案結構

```
app/
  api/
    revalidate/route.ts              以密鑰保護的重新驗證掛鉤（itouBot 發文後呼叫）
  components/
    Header.tsx                       含行動裝置覆蓋層的固定導覽列
    Footer.tsx                       含網站地圖、專案、社群連結的頁尾
    CommandPalette.tsx               指令面板觸發器與狀態管理
    CommandPaletteInner.tsx          指令面板 UI 與搜尋邏輯（客戶端）
    TileIcon.tsx                     具主題感知能力的技術圖示磚（客戶端元件）
    tileIconMeta.ts                  圖示中繼資料（來源、深色背景、淺色背景）— 伺服器端安全
    LanyardCards.tsx                 Discord 狀態元件
    GithubContributionCard.tsx
    GithubGlyph.tsx                  行內 GitHub 標誌（透傳 SVGProps）
    LikeCard.tsx                     支援預設 / "circle"（VTuber）/ "square"（專輯）版面
    LikeCategorySection.tsx          含延遲載入觀察器的分類區塊
    LikeDetailBody.tsx               展開的 Like 詳情檢視（用於模態視窗）
    LikeFilterGrid.tsx               搜尋 + 標籤篩選 + 格狀清單 + 模態視窗的整合
    LikeModalShell.tsx               以 Portal 實作的 Like 詳情模態外殼
    MusicSection.tsx                 Last.fm 熱門專輯預覽列（渲染 LikeCard，layout="square"）
    ProjectDetailBody.tsx            含 GitHub 專案資訊的詳細專案檢視
    ProjectFilterGrid.tsx            支援模態視窗的可篩選專案格狀清單
    ProjectModalShell.tsx            以 Portal 實作的專案詳情模態外殼
    PageHead.tsx
    PageTransition.tsx
    BackToTopButton.tsx
    ThemeProvider.tsx
    SiteLoader.tsx                   含模糊與轉場效果的全頁載入畫面
  hooks/
    useHorizontalWheelScroll.ts          滑鼠滾輪水平平移
    useScrollLinkedHorizontalReveal.ts   與捲動位置連動的水平平移
  lib/
    kv.ts                             讀寫 Vercel KV 中來自 Discord 的雜談內容
    threads.ts                        擷取 Threads API 的同步貼文
    github.ts                         擷取 GitHub API 的專案資訊與事件
    lastfm.ts                         擷取 Last.fm API 的熱門專輯（關於頁／Likes／音樂）
    imageThumb.ts                     外部圖片的 wsrv.nl 縮圖代理輔助函式
    sortLikes.ts                      以評分為基準的排序（rating → personRating，未評分項目沉底）
    ratingStars.tsx                   五星評分渲染器（暗色底 + 裁切填色疊層）
    mergedThoughts.ts                 合併並去除多來源雜談內容的重複項
  about/page.tsx
  experience/page.tsx
  likes/page.tsx
  likes/[category]/page.tsx
  likes/music/page.tsx
  links/page.tsx
  projects/page.tsx
  thoughts/page.tsx
  feed.xml/route.ts                 RSS Feed 路由（合併雜談與專案）
  robots.ts           robots.txt 路由
  sitemap.ts          Sitemap 路由（包含各分類 Likes 網址）
  page.tsx            首頁
  layout.tsx          根版面 — 字型、主題腳本、頁首、頁尾、指令面板
  globals.css         所有樣式
  data.ts             所有內容 — 身分角色、Likes、專案、音樂備援資料、連結、備援雜談
public/
  assets/             圖片與 GitHub 貢獻圖 SVG
  icon/               自訂 SVG 圖示
scripts/
  cleanup-thoughts.mjs     移除符合指定文字的 KV 雜談項目
```

## 開發

需要 Node 20 或以上版本。

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm run start
npm run lint
```

### 環境變數

`/thoughts` 頁面所需（詳見 `.env.local`）：

| 變數 | 用途 |
|---|---|
| `REVALIDATE_SECRET` | `app/api/revalidate/route.ts` 的共用密鑰（itouBot 使用同一組值） |
| `KV_REST_API_URL`、`KV_REST_API_TOKEN`、`KV_REST_API_READ_ONLY_TOKEN`、`KV_URL`、`REDIS_URL` | Vercel KV 連線設定 |
| `THREADS_ACCESS_TOKEN` | 擷取 Threads API 的同步貼文 |
| `GITHUB_TOKEN` | 存取 GitHub API 以取得專案資訊（選填；未設定時無法取得專案詳情） |
| `LASTFM_API_KEY`、`LASTFM_USER` | 取得關於頁、`/likes` 與 `/likes/music` 的熱門專輯資料（選填；未設定時請見下方說明） |

由於 Spotify 的 Web API 現在需要 Premium 帳號才能註冊新的開發者應用程式，音樂整合改為透過 Last.fm 進行 — 這是一組免費、即時核發的 API 金鑰，並將 Spotify 的播放記錄 Scrobble 至該帳號。若未設定 `LASTFM_API_KEY`/`LASTFM_USER`（或帳號尚無 Scrobble 紀錄），`getTopAlbums()` 會回傳 `null`，各呼叫點也會相應地降級處理：關於頁卡片顯示靜態的 `MUSIC_ARTISTS` 頭像，`/likes` 預覽列則直接省略。


## 部署

部署於 Vercel；推送至 `main` 分支會觸發新的正式環境部署。自訂網域設定於 Vercel 專案中（`CNAME` 檔案是先前 GitHub Pages 設定所留下的遺留產物）。Discord 斜線指令由獨立的 [itouBot](../itouBot) 常駐程式處理，與網站共用同一組 Vercel KV，並在每次發文後呼叫 `/api/revalidate`。

## 內容

大部分頁面內容位於 `app/data.ts`。若要新增或更新 Like、專案或朋友連結，編輯對應的匯出陣列並推送即可，無需修改任何設定。

雜談內容則改由兩個即時來源提供：Discord（`/碎碎念` 斜線指令 → KV）與 Threads（自動同步）。`app/data.ts` 中的 `THOUGHTS` 陣列僅在兩個遠端來源皆無資料時作為備援顯示。

音樂資料同樣為即時資料（Last.fm 熱門專輯，詳見[環境變數](#環境變數)）；`app/data.ts` 中的 `MUSIC_ARTISTS` 陣列僅在 Last.fm 未設定或無回傳資料時，作為關於頁卡片的備援。若要變更關於頁迷你卡片所使用的專輯／背景圖片，編輯 `app/about/page.tsx` 頂部附近的 `INTEREST_BG` / `MUSIC_BG` 常數。

技術圖示定義於 `app/components/tileIconMeta.ts`。每個項目包含標籤、Devicons CDN 網址、深色模式背景色與淺色模式背景色。
