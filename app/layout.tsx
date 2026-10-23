import type { Metadata } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import "./template/theme.css";
import "katex/dist/katex.min.css";
import "./components/writing/writing.css";
import ThemeProvider from "./components/ThemeProvider";
import Header from "./components/chrome/Header";
import Footer from "./components/chrome/Footer";
import PageTransition from "./components/chrome/PageTransition";
import DeferredMount from "./components/chrome/DeferredMount";
import SiteLoader from "./components/chrome/SiteLoader";
import CommandPalette from "./components/command-palette/CommandPalette";
import GravityModeLoader from "./components/easter-eggs/GravityModeLoader";
import SmoothScroll from "./components/chrome/SmoothScroll";
import { NowPlayingProvider } from "./components/status/LanyardCards";
import NowPlayingBar from "./components/status/NowPlayingBar";
import NoiseOverlay from "./components/chrome/NoiseOverlay";
import ServiceWorkerRegistration from "./components/chrome/ServiceWorkerRegistration";
import GuestbookSection from "./components/guestbook/GuestbookSection";
import ChapterNavigation from "./components/chrome/ChapterNavigation";
import { SITE_URL, SITE_TITLE, SITE_DESCRIPTION, SHARE_IMAGE } from "./lib/seo";
import { features, site } from "./template/config";
import { available } from "./template/availability";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_TITLE}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [site.author.name, ...site.author.aliases, "個人網站"],
  authors: [{ name: site.author.name, url: SITE_URL }],
  creator: site.author.name,
  /* 這裡刻意不寫 alternates.canonical。metadata 最外層欄位會往下繼承，root 若
     釘一個 canonical: "/"，任何忘記自己設的新頁面都會宣告「我的正規網址是首頁」
     ——Google 看到就把那頁從索引裡丟掉。canonical 一律由各頁自己用
     pageMetadata() 產生，忘了寫最多是沒有 canonical，不會指錯人。 */
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: site.openGraphLocale,
    url: SITE_URL,
    siteName: SITE_TITLE,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [SHARE_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [SHARE_IMAGE],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang={site.locale} suppressHydrationWarning>
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
        {/* Reveal the splash once the document is parsed. The loader only
            covers FOUC and the theme is already applied above, so there is no
            reason to wait for React hydration: the slide runs in parallel with
            hydration (Lighthouse 量到的 LCP render delay 有 ~2s 都卡在這裡）。
            時序分成三段，還原「遮罩先滑走、header 才掉下來」的進場節奏：
              1. 雙 rAF   → site-loading（等首幀畫完才上毛玻璃 blur，避開黑閃）
              2. DCL+300  → site-revealing（遮罩開始上滑，450ms）
              3. DCL+750  → site-revealed（header 進場、捲動解鎖）
            DOM 解析完後多停 300ms，讓遮罩不會閃一下就消失。 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){
  function add(c){try{document.body.classList.add(c);}catch(e){}}
  function has(c){try{return document.body.classList.contains(c);}catch(e){return false;}}
  requestAnimationFrame(function(){requestAnimationFrame(function(){add('site-loading');});});
  function schedule(){
    if(document.readyState!=='loading'){setTimeout(function(){add('site-revealing');setTimeout(function(){add('site-revealed');},450);},300);}
    else document.addEventListener('DOMContentLoaded',function(){setTimeout(function(){add('site-revealing');setTimeout(function(){add('site-revealed');},450);},300);});
  }
  schedule();
  setTimeout(function(){if(!has('site-revealing'))add('site-revealing');if(!has('site-revealed'))add('site-revealed');},2000);
})();`,
          }}
        />
        <link
          rel="alternate"
          type="application/rss+xml"
          title={`${SITE_TITLE} 動態`}
          href="/feed.xml"
        />
        <link
          rel="alternate"
          type="application/rss+xml"
          title={`${SITE_TITLE} 文章`}
          href="/writing/feed.xml"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* These stylesheets are large (Google Fonts CJK weights + a homepage-only
            webfont service) and were render-blocking ~3.8s of first paint.
            They're fetched eagerly but applied via JS once the browser is idle
            so initial paint isn't gated on them; existing font-stacks already
            fall back to system fonts. ChenYuLuoYan 已自架子集（見 globals.css
            的 @font-face），不再走 emfont。 */}
        <link
          rel="preload"
          as="style"
          href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=JetBrains+Mono:wght@400;500;700&family=Noto+Sans+TC:wght@300;400;500;700;900&family=Noto+Serif+TC:wght@400;700&family=Shippori+Mincho:wght@500;600;700&display=swap"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){
  var hrefs=["https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=JetBrains+Mono:wght@400;500;700&family=Noto+Sans+TC:wght@300;400;500;700;900&family=Noto+Serif+TC:wght@400;700&family=Shippori+Mincho:wght@500;600;700&display=swap"];
  var homeFont="https://font.emtech.cc/css/LXGWHeartSerif";
  if(location.pathname==="/"){
    var connect=document.createElement('link');connect.rel='preconnect';connect.href='https://font.emtech.cc';document.head.appendChild(connect);
    var preload=document.createElement('link');preload.rel='preload';preload.as='style';preload.href=homeFont;preload.setAttribute('data-home-quote-font','');document.head.appendChild(preload);
    hrefs.push(homeFont);
  }
  function apply(){hrefs.forEach(function(href){var l=document.createElement('link');l.rel='stylesheet';l.href=href;if(href===homeFont)l.setAttribute('data-home-quote-font','');document.head.appendChild(l);});}
  if('requestIdleCallback' in window) requestIdleCallback(apply); else setTimeout(apply,0);
})();`,
          }}
        />
        <noscript>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=JetBrains+Mono:wght@400;500;700&family=Noto+Sans+TC:wght@300;400;500;700;900&family=Noto+Serif+TC:wght@400;700&family=Shippori+Mincho:wght@500;600;700&display=swap"
          />
          <link
            rel="stylesheet"
            href="https://font.emtech.cc/css/LXGWHeartSerif"
          />
        </noscript>
      </head>
      <body>
        {/* Describe the site and its author using one configurable identity. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "@id": `${SITE_URL}/#website`,
                  url: SITE_URL,
                  name: SITE_TITLE,
                  alternateName: site.author.aliases,
                  inLanguage: site.locale,
                  description: SITE_DESCRIPTION,
                  publisher: { "@id": `${SITE_URL}/#person` },
                },
                {
                  "@type": "Person",
                  "@id": `${SITE_URL}/#person`,
                  name: site.author.name,
                  alternateName: site.author.aliases,
                  url: SITE_URL,
                  image: `${SITE_URL}${site.avatar}`,
                  description: SITE_DESCRIPTION,
                  sameAs: site.socials.map(({ href }) => href),
                },
              ],
            }),
          }}
        />
        <ThemeProvider>
          <NowPlayingProvider enabled={available.spotify || available.discord}>
            <a className="skip-link" href="#main">
              跳到主要內容
            </a>
            <SiteLoader />
            <Header />
            <main className="main" id="main" tabIndex={-1}>
              <PageTransition>{children}</PageTransition>
              {/* 留言板：每一頁的內容底下都有，滾到頁底才載入 Waline */}
              {available.guestbook && <GuestbookSection />}
              <ChapterNavigation />
            </main>
            <Footer />
            <DeferredMount name="backToTop" />
            <CommandPalette />
            <GravityModeLoader />
            <SmoothScroll />
            <NoiseOverlay />
            <DeferredMount name="konami" />
            <DeferredMount name="confetti" />
            {(available.spotify || available.discord) && <NowPlayingBar />}
            <ServiceWorkerRegistration />
          </NowPlayingProvider>
        </ThemeProvider>
        {features.visitorCounter && (
          <Script
            src="https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js"
            strategy="lazyOnload"
          />
        )}
        <Analytics />
      </body>
    </html>
  );
}
