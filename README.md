# itousouta15.tw

**[itousouta15.tw](https://itousouta15.tw)**

## 功能特色

- **個人主頁** — Bento Grid 排版的導覽卡片，搭配輪播式角色名稱與技術棒棒糖列表
- **Discord 即時狀態** — 透過 [Lanyard API](https://github.com/Phineas/lanyard) 輪詢顯示在線狀態、目前在聽的 Spotify 歌曲或活動
- **收藏 LIKES** — 動畫 / 漫畫 / 小說 / 音樂分類收藏，支援關鍵字搜尋、標籤篩選與滑鼠滾輪橫向捲動
- **GitHub 貢獻圖** — 自動依目前主題（深色 / 淺色）切換圖檔，行動裝置上隨頁面捲動自動橫向展示
- **深色 / 淺色主題** — 透過 `localStorage` 記住偏好，並在首次繪製前由 inline script 套用，避免閃爍
- **回到頂端按鈕** — 捲動超過一定距離後浮現，點擊平滑捲回頂部
- **頁面轉場動畫**、響應式排版、無障礙細節（`aria-label`、`prefers-reduced-motion` 偵測等）

## 技術棧

| | |
|---|---|
| 框架 | [Next.js 14](https://nextjs.org/)（App Router） |
| 語言 | TypeScript（strict mode） |
| UI | React 18 + 純 CSS（無 UI 框架，全站變數化主題色） |
| 即時狀態 | [Lanyard REST API](https://lanyard.rest/) |
| 部署 | GitHub Actions → GitHub Pages（靜態匯出），自訂網域見 [`CNAME`](./CNAME) |

## 專案結構

```
app/
├── page.tsx                 # 首頁（個人卡片 + Bento 導覽 + GitHub 貢獻圖）
├── about/                   # 關於我
├── experience/               # 經歷時間軸
├── likes/                    # 收藏（分類列表 + 篩選頁 + 音樂）
│   ├── page.tsx
│   ├── music/
│   └── [category]/
├── links/                    # 友鏈
├── projects/                  # 專案作品集
├── components/                # 共用元件（Header / Footer / 主題切換 / 卡片等）
├── hooks/                     # 自訂 hooks（滾輪橫向捲動、捲動連動橫向展示）
├── data.ts                    # 站內靜態資料（收藏清單、經歷、友鏈、Discord ID 等）
└── globals.css                # 全站樣式與主題變數

public/assets/                 # 圖片、SVG 等靜態資源
```

## 本機開發

需求：Node.js 18+

```bash
# 安裝依賴
npm install

# 啟動開發伺服器（http://localhost:3000）
npm run dev

# 型別檢查 + 正式建置
npm run build

# 啟動正式伺服器
npm run start

# Lint
npm run lint
```

## 設定 Discord 狀態

[`app/data.ts`](./app/data.ts) 中的 `DISCORD_USER_ID` 設定要顯示狀態的 Discord 使用者 ID（需先加入 [Lanyard 的 Discord 伺服器](https://discord.gg/lanyard)讓 API 能抓到狀態）。留空則顯示「尚未連結 Lanyard」的預留樣式。

## 部署

`main` 分支推送後會由 [`.github/workflows/nextjs.yml`](./.github/workflows/nextjs.yml) 自動建置並部署到 GitHub Pages，自訂網域設定於 [`CNAME`](./CNAME)。
