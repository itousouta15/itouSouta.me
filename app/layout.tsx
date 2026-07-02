import type { Metadata } from "next";
import { ReactLenis } from "lenis/react";
import "lenis/dist/lenis.css";
import "./globals.css";
import ThemeProvider from "./components/ThemeProvider";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PageTransition from "./components/PageTransition";
import BackToTopButton from "./components/BackToTopButton";

const SITE_URL = "https://itousouta15.tw";
const SITE_TITLE = "itouSouta15.tw";
const SITE_DESCRIPTION =
  "itouSouta / 郭家睿 / 伊藤蒼太的官方網站。臺中市立大里高中學生、SCAICT 第五屆會長，喜歡 VOCALOID 創作、插畫與寫程式。這裡收錄自我介紹、經歷、專案作品與喜歡的事物。";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_TITLE}`,
  },
  description: SITE_DESCRIPTION,
  keywords: ["itouSouta", "itousouta15", "郭家睿", "伊藤蒼太", "VOCALOID", "SCAICT", "大里高中", "個人網站"],
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
    images: [{ url: "/assets/banner.webp", width: 1200, height: 630, alt: SITE_TITLE }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/assets/banner.webp"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hant">
      <head>
        {/* Apply the saved theme before first paint to avoid a dark→light flash. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark')t='dark';document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
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
        <link rel="preload" as="style" href="https://font.emtech.cc/css/ChenYuLuoYan" />
        <link rel="preload" as="style" href="https://font.emtech.cc/css/LXGWHeartSerif" />
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
          <link rel="stylesheet" href="https://font.emtech.cc/css/ChenYuLuoYan" />
          <link rel="stylesheet" href="https://font.emtech.cc/css/LXGWHeartSerif" />
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
              image: `${SITE_URL}/assets/avatar.webp`,
              sameAs: ["https://blog.itousouta15.tw"],
              affiliation: { "@type": "Organization", name: "臺中市立大里高中" },
              description: SITE_DESCRIPTION,
            }),
          }}
        />
        <ThemeProvider>
          <Header />
          <main className="main">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
          <BackToTopButton />
          <ReactLenis root options={{ wheelMultiplier: 0.8, lerp: 0.1 }} />
        </ThemeProvider>
      </body>
    </html>
  );
}
