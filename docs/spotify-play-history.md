# Spotify 播放紀錄

音樂卡片中的「已記錄 X 次」是網站從 Spotify 最近播放紀錄累積的個人次數。Spotify 的常聽排行不提供精確次數，因此排行和播放紀錄分開處理：歌單及封面來自 `/me/top/tracks`，次數來自 `/me/player/recently-played`。

## 啟用

1. 確認既有的 `SPOTIFY_CLIENT_ID`、`SPOTIFY_CLIENT_SECRET` 及 Vercel KV 設定可用。
2. 重新執行授權工具，取得包含 `user-read-recently-played` 的 refresh token：

   ```sh
   node --env-file=.env.local scripts/spotify-refresh-token.mjs
   ```

3. 將新的 `SPOTIFY_REFRESH_TOKEN` 更新到 `.env.local` 和 Vercel 環境變數，重新部署。原本的常聽排行和目前播放權限也會一併保留。
4. 在 Vercel 新增 `SPOTIFY_SYNC_SECRET`，並將相同的值設定成 GitHub repository 的 Actions secret `SPOTIFY_SYNC_SECRET`。
5. 部署後可在 Actions 手動執行 **Sync Spotify play history**。工作流程預設每 15 分鐘同步一次，避免需要有人開著網站才持續收集。

`GET /api/spotify/sync` 只接受 `Authorization: Bearer <SPOTIFY_SYNC_SECRET>`。它不接受外部上傳的歌曲或次數；所有紀錄均由後端向已授權的 Spotify 帳號讀取。

## 統計範圍

- 每次取得 API 可提供的最近 50 筆紀錄，第一次同步也從這批紀錄開始。無法用這支 API 還原更早的完整歷史資料。
- 相同歌曲 ID 和播放時間只計算一次；同一首歌在不同時間重播會分別累加。重新整理、重複執行排程及並行請求都不會增加重複次數。
- 已收集的去重紀錄與次數持續儲存在 KV，不因最近播放窗口變化而歸零。
- 若兩次同步間超出 API 的可取得窗口，或排程停用、延遲、授權失效，可能漏掉未取得的播放紀錄。因此卡片使用「已記錄」，而非聲稱是 Spotify 的完整累計次數。
- 網站不從播放進度、停留時間或訪客點擊推算次數；Spotify 回傳的每一筆播放紀錄才是統計依據。

## 儲存與快取

| KV key                            | 用途                             |
| --------------------------------- | -------------------------------- |
| `spotify:play-history:counts`     | 歌曲 ID → 已記錄次數的 hash      |
| `spotify:play-history:seen`       | 歌曲 ID + ISO 播放時間的去重 set |
| `spotify:play-history:meta`       | 紀錄起點、最後同步時間及同步狀態 |
| `spotify:play-history:sync-lease` | 跨實例共用的五分鐘同步節流       |

Redis Lua script 將整批去重與累加原子化。歌曲卡片只讀取自己需要的 ID 計數，不下載完整播放紀錄。排程同步成功後會重新驗證 `/likes` 和 `/likes/music`；歌曲排行本身仍維持每小時快取。

未授權最近播放紀錄時，網站保留 Spotify 常聽卡片，顯示「等待同步」及授權尚未啟用的說明。暫時無法同步時仍可顯示已保存的次數，不會把未知資料當成零次。
