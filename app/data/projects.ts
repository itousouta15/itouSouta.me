export interface Project {
  slug: string;
  kicker: string;
  color: "blue" | "purple";
  title: string;
  desc: string;
  tags: string[];
  icon: string;
  href: string;
  cover: string;
  siteUrl?: string;
  longDesc?: string;
  why?: string;
  difficulties?: string;
  demoUrl?: string;
  releaseTimeline?: boolean;
}

export const PROJECTS: Project[] = [
  {
    slug: "yetanotherbusapp",
    kicker: "APP",
    color: "blue",
    title: "YetAnotherBusApp",
    desc: "現代化跨平台公車動態查詢 App",
    why: "等公車最討厭的就是不知道車到底來了沒....我們想要做的是一個開源、高自訂性、介面乾淨、跨平台的查詢工具",
    longDesc:
      "用 Flutter 打造的公車動態查詢 App，支援 Android / iOS 跨平台，提供路線、站牌與到站動態查詢，介面以現代化為目標重新設計",
    tags: ["Flutter", "Dart"],
    releaseTimeline: true,
    icon: "flutter",
    href: "https://github.com/AvianJay/yetanotherbusapp",
    cover: "/assets/projects/YABus.webp",
    siteUrl: "https://busapp.avianjay.sbs/",
  },
  {
    slug: "scaict-uwu",
    kicker: "BOT",
    color: "blue",
    title: "SCAICT-uwu",
    desc: "中電喵：中電會 Discord Bot",
    longDesc:
      "用 Python + flask 打造的中電會 Discord Bot「中電喵」，負責會務自動化：把 GitHub issues 同步到 Notion、串接會內各項服務的入口，是 dc.scaict.org 社群日常運作的基礎設施。",
    tags: ["Python", "flask", "SCAICT"],
    icon: "scaict",
    href: "https://github.com/SCAICT/SCAICT-uwu",
    cover:
      "https://raw.githubusercontent.com/SCAICT/doc/main/static/img/charge-demo.gif",
    siteUrl: "https://dc.scaict.org",
  },
  {
    slug: "dlhit-website",
    kicker: "WEB",
    color: "blue",
    title: "DLHIT-Website",
    desc: "大里高中資訊校隊官網",
    longDesc:
      "大里高中資訊校隊官方網站，以 Next.js 13（App Router）+ Tailwind CSS + TypeScript 打造，內建 lint / build 品質檢查流程，內容由校隊成員共同維護。",
    tags: ["Next.js", "TypeScript"],
    icon: "dlhit",
    href: "https://github.com/itousouta15/DLHIT-website",
    cover: "/assets/projects/DLHIT.webp",
    siteUrl: "https://dlhit.itousouta.me",
  },
  {
    slug: "scaict-github-io",
    kicker: "WEB",
    color: "blue",
    title: "SCAICT.github.io",
    desc: "中電會官方網站",
    longDesc:
      "中電會官方網站，由第三屆成員共同建立。純 HTML / CSS / JavaScript 手刻、零框架、可直接靜態部署；資料與前端分離（內容放獨立的 website-data repo），靠 CI 自動部屬，改資料不用碰程式。",
    tags: ["HTML", "CSS", "JavaScript", "SCAICT"],
    icon: "scaict",
    href: "https://github.com/SCAICT/SCAICT.github.io",
    cover: "/assets/projects/SCAICT.webp",
    siteUrl: "https://scaict.github.io",
  },
  {
    slug: "https://west.nchusdsc.org/",
    kicker: "WEB",
    color: "blue",
    title: "興大二村 | 宿舍服務快速入口",
    desc: "興大二村宿舍服務快速入口",
    longDesc:
      "興大二村宿舍服務快速入口網站，提供宿舍公告、報修、借用、繳費等服務的快速連結，方便學生使用。",
    tags: ["Astro", "TypeScript"],
    icon: "astro",
    href: "https://gitlab.com/nchu-sdsc/west-link-tree",
    cover: "/assets/projects/NCHU.webp",
    siteUrl: "https://west.nchusdsc.org/",
  },
  {
    slug: "itousouta.me",
    kicker: "PORTFOLIO",
    color: "blue",
    title: "itousouta.me",
    desc: "就是這裡 www",
    longDesc:
      "高度客製化的個人網站：首頁有 Discord 即時狀態與主題切換，串了專案、碎碎念、收藏清單、音樂、友鏈與一堆小彩蛋。雜談來自 Threads / Discord / GitHub 同步，音樂來自 Spotify",
    tags: ["Next.js", "TypeScript", "itou 系列"],
    icon: "nextjs",
    href: "https://github.com/itousouta15/itousouta.me",
    cover: "/assets/projects/itousouta15.webp",
    siteUrl: "https://itousouta.me",
  },
  {
    slug: "itoubloga",
    kicker: "BLOG",
    color: "blue",
    title: "itouBLoGa",
    desc: "一個基於 Hexo 的部落格",
    longDesc:
      "基於 Hexo 的部落格，使用自訂的 Reimu 主題，內容以 zh-TW / en / ja 三語寫作，feed 也配合 i18n 輸出，部署在 blog.itousouta.me。",
    tags: ["Hexo", "Node.js", "itou 系列"],
    icon: "hexo",
    href: "https://github.com/itousouta15/itouBLoGa",
    cover:
      "https://github.com/itousouta15/itouBLoGa/raw/source/source/images/mainweb.webp",
    siteUrl: "https://blog.itousouta.me",
  },
  {
    slug: "itoubloldga",
    kicker: "ARCHIVE",
    color: "blue",
    title: "itouBLoldGa",
    desc: "一個基於 Hexo 及 anzhiyu 主題的舊部落格",
    why: "最早是從 itousouta15.github.io 起家的部落格，記錄了剛開始寫東西那陣子的自己；現在內容都已搬到 itouBLoGa",
    longDesc:
      "早期的 Hexo 部落格，使用 AnZhiYu 主題，架在 GitHub Pages（itousouta15.github.io）上，是 itou 系列最早的作品之一，現已封存。",
    tags: ["Hexo", "Node.js", "itou 系列"],
    icon: "hexo",
    href: "https://github.com/itousouta15/itouBLoldGa",
    cover: "/assets/projects/Newweb.webp",
  },
  {
    slug: "itouslides",
    kicker: "TOOL",
    color: "blue",
    title: "itouSlides",
    desc: "用 Astro + slidev 構建的公開簡報展示頁",
    why: "簡報做完常常躺在雲端硬碟裡生灰。想做一個能直接丟連結給別人看、還能把內容跟網站分開維護的簡報展示站。",
    longDesc:
      "用 Astro + Slidev 建構的公開簡報集合站：簡報內容與網站前台分離，好維護；首頁自動列出所有簡報，支援分類篩選與深色模式，可輸出靜態網站部署到 Cloudflare Pages。",
    tags: ["Astro", "TypeScript", "itou 系列"],
    icon: "astro",
    href: "https://github.com/itousouta15/itouSlides",
    cover: "/assets/projects/Slides.webp",
  },
  {
    slug: "itouOJ",
    kicker: "TOOL",
    color: "blue",
    title: "itouOJ",
    desc: "我的Online Judge",
    longDesc:
      "前後端用 Next.js 一體開發的線上判題系統（oj.itousouta.me）。評測引擎依語言分兩條路：C / C++ / Python / JavaScript 走自架的 sandbox-runner（Linux namespaces + cgroup v2 + seccomp-bpf 從零刻的沙箱），Java 暫時繼續走 Piston。",
    difficulties:
      "判題系統最難的不是題目與前端，是「安全地把不可信的使用者程式碼關起來跑」。原本用的 Piston 沙箱只管 CPU / 記憶體 / 時間與檔案系統範圍，使用者程式碼還是能呼叫子程序——所以決定自己刻一套 sandbox-runner，把 namespace 隔離、cgroup v2 資源限制跟 seccomp-bpf syscall 白名單全部自己掌控。",
    tags: ["Next.js", "TypeScript", "itou 系列"],
    icon: "nextjs",
    href: "https://github.com/itousouta15/itouOJ",
    cover: "/assets/projects/OJ.webp",
    siteUrl: "https://oj.itousouta.me",
  },
  {
    slug: "itouSandBox",
    kicker: "TOOL",
    color: "blue",
    title: "itouSandBox",
    desc: "從零實作的 Linux 判題沙箱",
    why: "Piston 的沙箱只管 CPU / 記憶體 / 時間跟檔案系統範圍，不管使用者程式碼能不能呼叫子程序——import subprocess 或 os.system 在容器裡就能跑任意指令。與其靠運氣，不如從零刻一顆自己看得懂每一行的沙箱。",
    longDesc:
      "從零實作的 Linux 判題沙箱：namespace 隔離 + cgroup v2 資源限制 + seccomp-bpf syscall 白名單，目前跑在 oj.itousouta.me 正式站上，取代原本的 Piston——C / C++ / Python / JavaScript 判題都走這裡，Java 還沒支援、暫時續用 Piston。",
    difficulties:
      "三件事要同時成立：namespace 把程序關進隔離環境、cgroup v2 掐住 CPU / 記憶體上限、seccomp-bpf 只放行白名單內的 syscall。最磨人的是語言差異——每種語言 runtime 需要的 syscall 集合不同，白名單開太鬆會被利用、開太緊連正常編譯都會失敗。",
    tags: ["C", "Python", "itou 系列"],
    icon: "nextjs",
    href: "https://github.com/itousouta15/itouSandBox",
    cover: "/assets/projects/OJ.webp",
  },
  {
    slug: "itouOJ 收件程式",
    kicker: "TOOL",
    color: "blue",
    title: "itouOJ 收件程式",
    desc: "itouOJ 的收件程式，負責在離線測試環境接收使用者提交的程式碼並送到評測引擎",
    why: "判題系統的評測引擎通常跑在隔離的環境裡，無法直接接收使用者提交的程式碼。收件程式負責把使用者提交的程式碼從網路傳到評測引擎所在的隔離環境，確保評測流程順暢。",
    longDesc:
      "itouOJ 的收件程式，負責在離線測試環境接收使用者提交的程式碼並送到評測引擎。此程式是判題系統的重要組成部分，確保使用者的程式碼能在安全的環境中被評估。",
    releaseTimeline: true,
    tags: ["C#", "TypeScript", "itou 系列"],
    icon: "C#",
    href: "https://github.com/itousouta15/itouOJ",
    cover: "/assets/projects/itouOJ.webp",
  },
  {
    slug: "itouMD",
    kicker: "APP",
    color: "blue",
    title: "itouMD",
    desc: "一款用於行動裝置的現代化 Markdown 檢視器",
    longDesc:
      "用 Flutter 打造的行動裝置 Markdown 檢視器與編輯器，深度整合 HackMD，含完整的 CI 與 Release 發布流程，是 itou 系列裡少數有正式版本號演進的專案。",
    difficulties:
      "行動裝置上要同時顧好渲染效能與編輯體驗：Markdown 的即時渲染、長文件捲動的順暢度、跟 HackMD 的內容整合，每一塊都要在手機硬體上重新驗證。",
    releaseTimeline: true,
    tags: ["Flutter", "Dart", "itou 系列"],
    icon: "flutter",
    href: "https://github.com/itousouta15/itouMD",
    cover: "/assets/projects/itouMD.webp",
  },
  {
    slug: "itouQR",
    kicker: "TOOL",
    color: "blue",
    title: "itouQR",
    desc: "一款 QR Code 生成器，支援多種格式與自訂樣式",
    why: "想要一個「內容不離開瀏覽器」的 QR Code 產生器：所有運算都在前端完成，不會把要編碼的內容傳給任何伺服器，隱私自己顧。",
    longDesc:
      "用純 HTML / CSS / JavaScript 製作的 QR Code 產生器（qr.itousouta.me）：產生邏輯完全跑在瀏覽器裡，支援多種格式與自訂樣式、主題切換與匯出，核心編碼器採用 kazuhikoarase 的 qrcode-generator。",
    tags: ["HTML", "CSS", "JavaScript", "itou 系列"],
    icon: "html",
    href: "https://github.com/itousouta15/itouQR",
    siteUrl: "https://qr.itousouta.me",
    cover: "/assets/projects/itouQR.webp",
  },
  {
    slug: "verify.scaict.org",
    kicker: "WEB",
    color: "blue",
    title: "SCAICT 證書查驗系統",
    desc: "一個用於驗證 SCAICT 所核發證書真偽的網頁系統",
    why: "為使 SCIACT 所核發之各類證書、證明具備唯一性、可追溯性與可查驗性，特別開發一套證書查驗系統，讓使用者能夠透過網頁輸入證書編號或掃描 QR Code 來驗證證書的真偽。",
    tags: ["Vite", "React", "SCAICT"],
    icon: "scaict",
    href: "https://github.com/SCAICT/cert-verify",
    cover: "/assets/projects/SCAICTLG.webp",
    siteUrl: "https://verify.scaict.org",
  },
  {
    slug: "115-summer-camp",
    kicker: "WEB",
    color: "blue",
    title: "115-summer-camp",
    desc: "SCAICT 2026 暑訓官網",
    why: "暑訓是 SCAICT 每年的大事，報名資訊、課程表、場地資訊都需要一個能直接丟給大家的入口。",
    longDesc:
      "SCAICT 115 年暑訓的官方活動網站，用 Vite + React 打造的 landing page，部署在 sc.scaict.org，repo 內含 GitLab CI / 部署設定。",
    tags: ["Vite", "React", "SCAICT"],
    icon: "scaict",
    href: "https://github.com/SCAICT/115-summer-camp",
    cover: "/assets/projects/SCAICTsc.webp",
    siteUrl: "https://sc.scaict.org",
  },
  {
    slug: "wintercamp2026",
    kicker: "WEB",
    color: "blue",
    title: "WinterCamp2026",
    desc: "SCIST x SCAICT 2026 寒訓官網",
    longDesc:
      "SCIST x SCAICT 2026 聯合寒訓官方網站，Next.js + React 打造",
    tags: ["Next.js", "React", "SCAICT"],
    icon: "scaict",
    href: "https://github.com/scist-tw/WinterCamp2026",
    cover: "/assets/projects/SCIST.webp",
    siteUrl: "https://scist.camp",
  },
  {
    slug: "itoucards",
    kicker: "SHOWCASE",
    color: "blue",
    title: "itouCards",
    desc: "一個用純 HTML / CSS / JavaScript 製作的名片展示頁",
    longDesc:
      "用純 HTML / CSS / JavaScript 製作的名片展示頁（cards.itousouta.me）：零依賴、可直接靜態部署，是 itou 系列工具裡最輕的一隻。",
    tags: ["HTML", "CSS", "JavaScript", "itou 系列"],
    icon: "html",
    href: "https://github.com/itousouta15/itouCards",
    cover: "https://github.com/itousouta15/itouCards/raw/main/web.webp",
    siteUrl: "https://cards.itousouta.me",
  },
  {
    slug: "tesiis",
    kicker: "TOOL",
    color: "blue",
    title: "TESIIS 臺灣避難收容處所地圖",
    desc: "提供災害發生時的避難設施資訊整合查詢",
    why: "臺北程式設計節城市通服務大黑客松 2025 的參賽作品（團隊編號 30）——災害發生時避難設施資訊分散在各處，想把它們整合成一站式查詢。經持續維護後現為可獨立部署的 Flutter Web，不依賴臺北通 SDK、登入狀態或 Google Maps API Key",
    longDesc:
      "TESIIS 臺灣避難收容處所地圖：整合各縣市政府公開的避難收容處所資料，提供災害發生時的避難設施資訊整合查詢，並支援地圖視覺化與路線規劃。",
    tags: ["Flutter", "Dart"],
    icon: "flutter",
    href: "https://github.com/TESIIS/TESIIS",
    cover: "/assets/projects/tcf.webp",
    siteUrl: "https://tesiis.itousouta.me",
  },
];
