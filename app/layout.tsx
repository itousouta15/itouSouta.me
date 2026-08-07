import type { Metadata } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import "lenis/dist/lenis.css";
import "./globals.css";
import ThemeProvider from "./components/ThemeProvider";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PageTransition from "./components/PageTransition";
import BackToTopButton from "./components/BackToTopButton";
import SiteLoader from "./components/SiteLoader";
import CommandPalette from "./components/CommandPalette";
import GravityModeLoader from "./components/GravityModeLoader";
import SmoothScroll from "./components/SmoothScroll";
import { LanyardProvider } from "./components/LanyardCards";
import NowPlayingBar from "./components/NowPlayingBar";
import SeasonTint from "./components/SeasonTint";
import KonamiEasterEgg from "./components/KonamiEasterEgg";
import ConfettiBurst from "./components/ConfettiBurst";
import ServiceWorkerRegistration from "./components/ServiceWorkerRegistration";
import GuestbookSection from "./components/GuestbookSection";

const SITE_URL = "https://itousouta.me";
const SITE_TITLE = "itouSouta.me";
const SITE_DESCRIPTION = "itouSouta / 郭家睿 / 伊藤蒼太的個人網站 ε(*´･∀･｀)зﾞ";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_TITLE}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "itouSouta",
    "itousouta15",
    "郭家睿",
    "伊藤蒼太",
    "VOCALOID",
    "SCAICT",
    "大里高中",
    "個人網站",
  ],
  authors: [{ name: "郭家睿 / 伊藤蒼太", url: SITE_URL }],
  creator: "郭家睿 / 伊藤蒼太",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "zh_TW",
    url: SITE_URL,
    siteName: SITE_TITLE,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/assets/brand/banner.webp",
        width: 1200,
        height: 630,
        alt: SITE_TITLE,
      },
    ],
  },
  /* 刻意不設 twitter.images：每條路由的 opengraph-image 檔案慣例只會產生
     og:image，不會產生 twitter:image。這裡如果留著一張固定圖，X 上就永遠是那張
     banner，per-route 分享圖等於白做。缺 twitter:image 時 X 會自己 fallback 到
     og:image，正是我們要的。 */
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-Hant" suppressHydrationWarning>
      <head>
        {/* Apply the saved theme before first paint to avoid a dark→light flash. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{
  var t=localStorage.getItem('theme');
  if(t!=='light'&&t!=='dark')t='dark';
  document.documentElement.setAttribute('data-theme',t);
}catch(e){}})();`,
          }}
        />
        <link
          rel="alternate"
          type="application/rss+xml"
          title={`${SITE_TITLE} 雜談`}
          href="/feed.xml"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://font.emtech.cc" />
        {/* These stylesheets are large (Google Fonts CJK weights + two custom webfont
            services) and were render-blocking ~3.8s of first paint. They're fetched
            eagerly but applied via JS once the browser is idle so initial paint isn't
            gated on them; existing font-stacks already fall back to system fonts. */}
        <link
          rel="preload"
          as="style"
          href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600;700&family=JetBrains+Mono:wght@400;500&family=Noto+Sans+TC:wght@300;400;500;700;900&family=Noto+Serif+TC:wght@400;600;700;900&family=Shippori+Mincho:wght@500;600;700;800&display=swap"
        />
        <link
          rel="preload"
          as="style"
          href="https://font.emtech.cc/css/ChenYuLuoYan"
        />
        <link
          rel="preload"
          as="style"
          href="https://font.emtech.cc/css/LXGWHeartSerif"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){
  var hrefs=["https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600;700&family=JetBrains+Mono:wght@400;500&family=Noto+Sans+TC:wght@300;400;500;700;900&family=Noto+Serif+TC:wght@400;600;700;900&family=Shippori+Mincho:wght@500;600;700;800&display=swap","https://font.emtech.cc/css/ChenYuLuoYan","https://font.emtech.cc/css/LXGWHeartSerif"];
  function apply(){hrefs.forEach(function(href){var l=document.createElement('link');l.rel='stylesheet';l.href=href;document.head.appendChild(l);});}
  if('requestIdleCallback' in window) requestIdleCallback(apply); else setTimeout(apply,0);
})();`,
          }}
        />
        <noscript>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600;700&family=JetBrains+Mono:wght@400;500&family=Noto+Sans+TC:wght@300;400;500;700;900&family=Noto+Serif+TC:wght@400;600;700;900&family=Shippori+Mincho:wght@500;600;700;800&display=swap"
          />
          <link
            rel="stylesheet"
            href="https://font.emtech.cc/css/ChenYuLuoYan"
          />
          <link
            rel="stylesheet"
            href="https://font.emtech.cc/css/LXGWHeartSerif"
          />
        </noscript>
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "郭家睿",
              alternateName: ["伊藤蒼太", "itouSouta", "itouSouta15"],
              url: SITE_URL,
              image: `${SITE_URL}/assets/brand/banner.webp`,
              sameAs: ["https://blog.itousouta.me"],
              affiliation: {
                "@type": "Organization",
                name: "臺中市立大里高中",
              },
              description: SITE_DESCRIPTION,
            }),
          }}
        />
        <ThemeProvider>
          <LanyardProvider>
            <a className="skip-link" href="#main">
              跳到主要內容
            </a>
            <SiteLoader />
            <Header />
            <main className="main" id="main" tabIndex={-1}>
              <PageTransition>{children}</PageTransition>
              {/* 留言板：每一頁的內容底下都有，滾到頁底才載入 Waline */}
              <GuestbookSection />
            </main>
            <Footer />
            <BackToTopButton />
            <CommandPalette />
            <GravityModeLoader />
            <SmoothScroll />
            <SeasonTint />
            <KonamiEasterEgg />
            <ConfettiBurst />
            <NowPlayingBar />
            <ServiceWorkerRegistration />
          </LanyardProvider>
        </ThemeProvider>
        <Script
          src="https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js"
          strategy="afterInteractive"
        />
        <Analytics />
      </body>
    </html>
  );
}
