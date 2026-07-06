// 站上不少圖片（友鏈頭像、收藏封面、音樂頭像/封面、專案截圖）散落在一堆自己
// 不能控制的外部網域，沒辦法用 next/image 的 remotePatterns 一一 allowlist、也沒
// 辦法要求對方吐小圖，所以透過 wsrv.nl 圖片代理統一轉成顯示所需的小尺寸再讓瀏覽器
// 下載。本地 /assets 圖片不需要代理，原樣回傳。
// 這些網域 wsrv 抓不到圖，只能跳過、直接用原圖網址：
// tw.linovelib.com 的 Cloudflare 會擋代理伺服器的請求（403）；
// bilimanga.net 被 wsrv 自己的政策整個網域封鎖（400 "blocked by policy"）。
const PROXY_BLOCKED_HOSTS = ["tw.linovelib.com", "www.bilimanga.net"];

function wsrvThumb(src: string, width: number, height: number) {
  if (!/^https?:\/\//.test(src)) return src;
  // wsrv 轉 webp 預設只留第一幀，動態 gif 會被代理弄成靜態圖，直接跳過保留原檔。
  if (/\.gif($|\?)/i.test(src)) return src;
  if (PROXY_BLOCKED_HOSTS.some(host => src.includes(`://${host}/`))) return src;
  const params = new URLSearchParams({
    url: src,
    w: String(width),
    h: String(height),
    fit: "cover",
    a: "attention",
    output: "webp",
  });
  return `https://wsrv.nl/?${params}`;
}

// 友鏈頭像，卡片顯示 48px，抓 2x 給高解析度螢幕用
export function avatarThumb(src: string) {
  return wsrvThumb(src, 96, 96);
}

// 收藏卡片封面，最大顯示尺寸約 170x255
export function likeThumb(src: string) {
  return wsrvThumb(src, 340, 510);
}

// 圓形收藏卡片（VTuber 頭像等）：來源多是方形圖，若沿用 340x510 直式裁切
// 會先被 wsrv 切掉左右再由 CSS 裁圓，頭像就缺角了，所以改抓方形縮圖。
export function likeCircleThumb(src: string) {
  return wsrvThumb(src, 340, 340);
}

// 音樂榜單的歌手頭像，顯示 52px
export function artistAvatarThumb(src: string) {
  return wsrvThumb(src, 104, 104);
}

// 音樂榜單的歌曲縮圖，顯示 44px
export function songThumb(src: string) {
  return wsrvThumb(src, 88, 88);
}

// 專案卡片封面，顯示寬度隨卡片流動、高度固定 150px
export function projectCoverThumb(src: string) {
  return wsrvThumb(src, 640, 300);
}

// 卡片滿版背景圖（如 about 頁興趣卡片）：會被 CSS transform 放大鋪滿卡片，
// 沿用小尺寸縮圖會被拉伸到模糊，所以抓比顯示尺寸大上不少的來源。
export function cardBgThumb(src: string) {
  return wsrvThumb(src, 960, 720);
}
