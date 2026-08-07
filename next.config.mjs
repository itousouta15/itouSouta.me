/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    // next dev 的 webpack 用 eval sourcemap，CSP 沒放 unsafe-eval 會讓所有
    // chunk 執行失敗（頁面卡在 SiteLoader）；production 的 bundle 不用 eval，
    // 所以這個逃生門只在 dev 開。
    const scriptSrc = [
      "'self'",
      "'unsafe-inline'",
      ...(process.env.NODE_ENV === "development" ? ["'unsafe-eval'"] : []),
      "https://busuanzi.ibruce.info",
      "https://va.vercel-scripts.com",
    ].join(" ");

    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              `script-src ${scriptSrc}`,
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://font.emtech.cc",
              "font-src 'self' data: https://fonts.gstatic.com https://font.emtech.cc",
              // 站上圖片幾乎全走 wsrv.nl 代理；少數直接放行的網域（收藏封面、
              // Threads 媒體、Waline 頭像）逐一列出。技術 icon（TileIcon）與
              // footer 社群 icon 用 CSS background/mask-image 載圖，同樣受 img-src 管
              "img-src 'self' data: blob: https://wsrv.nl https://*.wsrv.nl https://cdn.jsdelivr.net https://cdn.simpleicons.org https://acg.gamer.com.tw https://api.lanyard.rest https://avatars.githubusercontent.com https://bci.kinokuniya.com https://blog-lemontea.pages.dev https://blog.chummydns.com https://cdn.discordapp.com https://cdn.rafled.com https://*.cdninstagram.com https://*.fbcdn.net https://encrypted-tbn0.gstatic.com https://github.com https://gravatar.com https://*.gravatar.com https://home.gamer.com.tw https://i.scdn.co https://im1.book.com.tw https://image.joox.com https://media.discordapp.net https://raw.githubusercontent.com https://s.eslite.com https://smallr-portfolio.vercel.app https://tw.linovelib.com https://upload.wikimedia.org https://wall.bahamut.com.tw https://wall.gamer.com.tw https://www.bilimanga.net https://www.books.com.tw https://www.youtube.com https://yt3.googleusercontent.com https://*.threads.net",
              "connect-src 'self' https://api.lanyard.rest https://va.vercel-scripts.com",
              // Phase 6 的 service worker 註冊
              "worker-src 'self'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'self'",
              "upgrade-insecure-requests",
            ].join("; "),
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
