export interface ProjectScreenshot {
  src: string;
  alt: string;
  caption?: string;
}

export interface Project {
  slug: string;
  category: "development" | "design";
  kicker: string;
  color: "blue" | "purple";
  title: string;
  desc: string;
  tags: string[];
  icon: string;
  href?: string;
  cover: string;
  /** Additional gallery images, shown after the cover. */
  screenshots?: ProjectScreenshot[];
  siteUrl?: string;
  figmaUrl?: string;
  /** Full project story in Markdown. Use headings to organize sections. */
  content?: string;
  demoUrl?: string;
}

export const PROJECTS: Project[] = [
  {
    slug: "yetanotherbusapp",
    category: "development",
    kicker: "APP",
    color: "blue",
    title: "YetAnotherBusApp",
    desc: "現代化跨平台公車動態查詢 App",
    content: `## 為什麼做

等公車最討厭的，就是不知道車到底來了沒。出門前想確認還要等多久，到了站牌又想知道車現在開到哪裡，轉乘時還得重新找下一條路線。這些都是很日常的需求，也應該能很快查到。

我們想做一個**開源、高自訂性、介面乾淨，而且能跨平台使用**的公車查詢工具。把路線、站牌和即時動態整理在同一個地方，讓查車這件事更直覺，也讓每天搭公車的人能依照自己的習慣使用。

## 專案介紹

**YetAnotherBusApp（YABus）** 是以 Flutter 與 Dart 開發的跨平台公車動態查詢 App，使用 **TDX 運輸資料流通服務**的交通資料，提供路線搜尋、站牌查詢、公車位置與預估到站時間等資訊。

除了 Android、iOS，也支援 Windows、macOS、Linux 與 Web。臨時需要查車時，可以直接開啟 [Web 版](https://busapp.avianjay.sbs/)使用。

## 可以拿來做什麼

- **搜尋路線與站名**：在同一個搜尋框查找公車路線或站牌，不用先切換模式；支援中英文站名，以及「台／臺」等常見寫法。
- **查看即時動態**：確認預估到站時間、車輛目前位置與發車狀態，出門前和候車時都能快速查看。
- **收藏常用路線**：把平常通勤、上學會搭的公車加入收藏，從個人化首頁快速進入。
- **用地圖理解路線**：透過路線視覺化與公車位置，掌握車輛和站牌之間的關係；地圖也支援旋轉與回到正北方向。
- **直接用站名找車**：不必先授予定位權限，也能輸入目的地附近的站名，找到符合的站牌與路線方向。

## 介面與使用體驗

介面採用 **Material Design 3**，支援深色模式與響應式排版，讓手機、桌面與瀏覽器上的操作都能配合各自的螢幕尺寸。

我們希望首頁能優先呈現常用資訊，搜尋結果能清楚區分方向與站牌，查到路線後也能順著進入對應的動態畫面。從打開 App、找到車，到確認什麼時候出門，盡量讓每一步都容易理解。

## 查詢資料與連線處理

站名搜尋會優先使用裝置上已有的離線資料；Web 版或還沒下載資料庫的裝置，也能直接透過線上搜尋查站。跨地區的線上查詢會合併請求，部分地區取得資料失敗時，仍會留下其他可用結果，並提供重試入口。

## 技術與開源

專案以 **Flutter／Dart** 維護跨平台介面，並開放原始碼，讓功能討論、問題回報與程式修改都能在社群中持續進行。歡迎透過 GitHub 提出使用上的問題、功能建議，或一起參與開發。`,
    tags: ["Flutter", "Dart"],
    icon: "flutter",
    href: "https://github.com/AvianJay/yetanotherbusapp",
    cover: "/assets/projects/YABus_1.webp",
    siteUrl: "https://busapp.avianjay.sbs/",
    screenshots: [
      {
        src: "/assets/projects/YABus_2.webp",
        alt: "公車動態，即時追蹤",
      },
      {
        src: "/assets/projects/YABus_3.webp",
        alt: "各種風格，高度自訂",
      },
      {
        src: "/assets/projects/YABus_4.webp",
        alt: "不止公車，多重選擇",
      },
      {
        src: "/assets/projects/YABus_5.webp",
        alt: "全部公車，一次擁有",
      },
    ],
  },
  {
    slug: "scaict-uwu",
    category: "development",
    kicker: "BOT",
    color: "blue",
    title: "SCAICT-uwu",
    desc: "中電喵：中電會 Discord Bot",
    content: `## 專案介紹

**中電喵 SCAICT-uwu** 是住在中電會 Discord 社群裡的互動機器人，由社群成員共同開發與維護。它把每日活動、小遊戲與點數商店串在一起，讓成員能透過指令和專用頻道參與社群。

## 社群裡可以怎麼玩

- **每日充電**：在指定頻道使用 /charge 領取電力點數，作為後續互動與兌換的基礎。
- **頻道互動**：透過猜顏色、數數等活動，讓成員在聊天之外也能一起參與。
- **點數與商店**：使用累積的電力點數兌換貼紙、隨身碟等商品；實體兌換依社群活動安排。
- **遊戲入口**：搭配票券參與拉霸等互動，將機器人的指令延伸到網頁服務。

## 技術與服務整合

機器人以 **Python** 開發，另有 **Flask** 網頁應用負責中電商店，並使用 **MySQL** 儲存資料。Discord 頻道、機器人與商店各自負責不同的互動入口，共同組成中電會的點數與活動系統。

這是一個持續由社群協作的專案，功能設計也和實際活動一起演進。想體驗可以從 [中電會 Discord](https://dc.scaict.org)開始。`,
    tags: ["Python", "flask", "SCAICT"],
    icon: "scaict",
    href: "https://github.com/SCAICT/SCAICT-uwu",
    cover:
      "https://raw.githubusercontent.com/SCAICT/doc/main/static/img/charge-demo.gif",
    siteUrl: "https://dc.scaict.org",
  },
  {
    slug: "dlhit-website",
    category: "development",
    kicker: "WEB",
    color: "blue",
    title: "DLHIT-Website",
    desc: "大里高中資訊校隊官網",
    content: `## 專案介紹

**DLHIT-Website** 是大里高中資訊校隊的官方網站，整理校隊介紹、成員與對外聯絡入口，讓想認識校隊的人有一個固定的資訊起點。

首頁以校隊主視覺、學習方向與里程紀錄介紹團隊；內容圍繞程式設計、演算法練習、競賽與成員之間的共同學習。

## 頁面與內容

- **認識校隊**：透過關於頁與首頁摘要介紹團隊的方向。
- **成員介紹**：以獨立頁面呈現成員，名單由 JSON 資料檔維護。
- **聯絡入口**：將對外聯絡資訊集中在網站，方便有興趣的人進一步交流。
- **成果展示**：已建立專用頁面，目前仍是籌備中的預留版型，之後可接續整理競賽成果與作品。

## 介面與實作

目前原始碼使用 **Next.js 16、React 19、TypeScript 與 Tailwind CSS 4**，以 App Router 拆分頁面。畫面採用卡片、半透明面板與深淺主題，並依手機和桌面調整排版。

網站框架、主題切換與內容頁面分開維護，讓更新成員與文字時，不必重新處理整套視覺樣式。`,
    tags: ["Next.js", "TypeScript"],
    icon: "dlhit",
    href: "https://github.com/itousouta15/DLHIT-website",
    cover: "/assets/projects/DLHIT.webp",
    siteUrl: "https://dlhit.itousouta.me",
  },
  {
    slug: "scaict-github-io",
    category: "development",
    kicker: "WEB",
    color: "blue",
    title: "SCAICT.github.io",
    desc: "中電會官方網站",
    content: `## 專案介紹

**中電會官方網站**由中電會第三屆成員共同建立，是社群對外的介紹與資訊入口。專案使用 **HTML、CSS 與 JavaScript** 手工製作，可直接部署為靜態網站。

## 內容與前端分開維護

網站資料放在獨立的 [website-data](https://github.com/SCAICT/website-data) 儲存庫，前端則負責版面與互動。這樣可以讓公告與網站內容的更新，和視覺、程式的修改分開處理，也方便不同成員一起維護。

儲存庫配置了內容更新與前端部署相關流程，持續把社群整理的資料呈現在公開網站上。

## 實作重點

這個專案以原生網頁技術完成整體視覺與互動，沒有依賴前端框架。從頁面結構、樣式到內容載入，都能直接在原始碼中追蹤，適合多人接手維護，也保留了靜態部署的簡單性。`,
    tags: ["HTML", "CSS", "JavaScript", "SCAICT"],
    icon: "scaict",
    href: "https://github.com/SCAICT/SCAICT.github.io",
    cover: "/assets/projects/SCAICT.webp",
    siteUrl: "https://scaict.github.io",
  },
  {
    slug: "west-link-tree",
    category: "development",
    kicker: "WEB",
    color: "blue",
    title: "興大二村 | 宿舍服務快速入口",
    desc: "興大二村宿舍服務快速入口",
    content: `## 專案介紹

**興大二村快速入口**將住宿生常用的網路與住宿服務集中在同一頁。首頁用「我要做什麼」組織資訊，讓使用者可以從眼前的需求出發，找到對應的服務，不必先記住各系統的名稱。

## 常用服務

- **找說明文件**：進入站內 Wiki，查閱宿舍網路、住宿與常見問題。
- **設定宿舍網路**：前往設備綁定入口，處理首次入住的網路設定。
- **查看網路流量**：連至宿舍網路使用量排行，確認使用狀況。
- **回報問題**：依棟別找到網路問題回報與處理說明。
- **查住宿資訊與公約**：前往住輔組的正式資訊與規則頁面。

## 網站架構

網站以 **Astro** 建置，文件區使用 **Starlight**。首頁各區的標題、說明、連結與順序集中在 JSON 資料檔；文件則以 Markdown／MDX 維護，讓入口頁與較完整的操作說明各自有合適的位置。

動態效果使用 **GSAP**，並依減少動態效果偏好調整呈現。網頁以漸進增強方式設計，保留內容與連結作為服務的核心。`,
    tags: ["Astro", "TypeScript"],
    icon: "astro",
    href: "https://gitlab.com/nchu-sdsc/west-link-tree",
    cover: "/assets/projects/NCHU.webp",
    siteUrl: "https://west.nchusdsc.org/",
  },
  {
    slug: "itousouta.me",
    category: "development",
    kicker: "PORTFOLIO",
    color: "blue",
    title: "itousouta.me",
    desc: "就是這裡 www",
    content: `## 專案介紹

**就是你現在正在看的網站。** 這裡把我的專案、文章、活動經歷、收藏與朋友連結放在一起，也留了一些即時狀態與互動，讓個人網站能隨著日常持續更新。

## 內容與即時資料

- **個人狀態**：透過 Lanyard 顯示 Discord 狀態，正在播放的音樂優先直接向 Spotify 取得。
- **文章與碎碎念**：整合部落格索引、Discord 貼文、Threads 與 GitHub 動態。
- **喜歡的東西**：整理小說、漫畫、動畫、VTuber 與 Spotify 常聽歌曲，保留自己的評分和心得。
- **專案詳頁**：用 Markdown 編排介紹，搭配多圖片展示、搜尋與獨立分享網址。
- **GitHub 貢獻圖**：以真實資料繪製可操作的日曆，並讓蛇依貢獻格子動態尋路。

## 訪客也能參與

首頁有可以留下印象詞的文字雲，各頁底部則有支援串接回覆的留言板。留言可選擇用 GitHub 登入，若留下 Email，也能收到回覆通知。文章另有按讚功能，網站也保留了快捷搜尋與一些可探索的小彩蛋。

## 技術與維護

網站使用 **Next.js App Router、React、TypeScript 與原生 CSS**，資料來源包括 Vercel KV、GitHub、Spotify 與 Lanyard，回覆通知信由 Resend 處理。

手動整理的資料與外部服務分層處理，缺少憑證或來源暫時失效時，各區塊會回退或顯示可理解的狀態。深淺主題、鍵盤操作、手機版與減少動態效果，則是整個網站共用的互動基礎。`,
    tags: ["Next.js", "TypeScript", "itou 系列"],
    icon: "nextjs",
    href: "https://github.com/itousouta15/itousouta.me",
    cover: "/assets/projects/itousouta15.webp",
    siteUrl: "https://itousouta.me",
  },
  {
    slug: "thjcc-website",
    category: "design",
    kicker: "WEB",
    color: "blue",
    title: "THJCC 官方網站",
    desc: "THJCC 第四屆臺灣高中職聯合資安競賽 官方網站",
    content: `## 專案介紹

**THJCC 官方網站**是臺灣高中職聯合資安競賽的常駐資訊入口，目前以第四屆主視覺呈現賽事理念、籌備團隊、支持單位與合作方式。網站由我負責設計、開發，以及後續維護更新。

## 網站內容

- **關於 THJCC**：介紹競賽宗旨與學生自主籌辦的方向。
- **籌備團隊**：依組別整理成員、職務與兼任身分，點開頭像可查看自我介紹和社群連結。
- **合作單位**：呈現主辦、協辦與合作夥伴，提供介紹彈窗與官方網站入口。
- **贊助合作**：說明資源用途、經費／物資／技術等支持方式，以及來信洽談流程。

首頁提供各區摘要，完整內容則放在關於、團隊、合作夥伴與贊助四個子頁，方便訪客直接分享特定資訊。

## 設計與互動

從 Figma 桌面設計稿延伸出平板與手機版，保留深色背景、金屬標誌與不對稱卡片等視覺元素。主視覺標誌會隨捲動縮小並移動到介紹區，成員頭像上的帽子也藏了可拖曳、可用鍵盤操作的彩蛋。

成員與單位彈窗支援 Esc、焦點循環和關閉後的焦點恢復；手機與減少動態效果模式則配合調整捲動與動畫。

## 技術與內容維護

網站以 **Next.js App Router、React、TypeScript 與原生 CSS** 建置，內容集中在型別化資料檔，啟動時不依賴資料庫或外部 API。成員、合作單位與贊助資訊可以分開更新，降低每次活動調整時的維護負擔。`,
    tags: ["Next.js", "TypeScript", "React"],
    icon: "nextjs",
    href: "https://github.com/official-scint/thjcc.org",
    cover: "/assets/projects/THJCC.webp",
    siteUrl: "https://thjcc.org",
    figmaUrl:
      "https://www.figma.com/design/ZJd84NrEnUC8BhiN993LxM/THJCC?m=auto&t=cObEf2MICEqGHaFC-6",
  },
  {
    slug: "sitcon-2027-cfp",
    category: "design",
    kicker: "DESIGN",
    color: "purple",
    title: "SITCON 2027 CFP",
    desc: "SITCON 2027 CFP ",
    content: `## 專案介紹

SITCON 2027 CFP 網站的設計稿。可以透過右側的 Figma 連結查看。`,
    tags: ["Figma"],
    icon: "figma",
    cover: "/assets/projects/sitcon-2027-cfp.webp",
    figmaUrl:
      "https://www.figma.com/design/7lEKLdxdjNuLHJ3VILkuD4/SITCON-2027-CFP-%E7%B6%B2%E7%AB%99?m=auto&t=cObEf2MICEqGHaFC-6",
  },
  {
    slug: "itoubloga",
    category: "development",
    kicker: "BLOG",
    color: "blue",
    title: "itouBLoGa",
    desc: "一個基於 Hexo 的部落格",
    content: `## 專案介紹

**itouBLoGa** 是我的個人部落格，用來整理學習、程式與生活中的紀錄。網站基於 **Hexo**，搭配自行調整的 **Reimu** 主題，文章以 Markdown 維護，再產生可部署的靜態頁面。

## 閱讀與內容功能

- 透過搜尋、分類、標籤與文章彙整頁找到內容。
- 支援深色與淺色模式，並調整文章字型、程式碼字型及主題色。
- 文章可使用 **Mermaid 圖表、MathJax 數學公式與程式碼高亮**，方便記錄技術內容。
- 提供 **Waline 留言**與 **Atom Feed**，讓讀者留言或用閱讀器追蹤更新。

## 多語系與發布

網站配置繁體中文、英文與日文的多語系頁面與文章輸出。站點設定、主題設定及文章來源各自分開，新增文章與修改外觀不必混在同一處處理。

建置時一併產生 Feed、sitemap 等資訊，文章和頁面最後輸出為靜態檔案，部署在 [blog.itousouta.me](https://blog.itousouta.me)。`,
    tags: ["Hexo", "Node.js", "itou 系列"],
    icon: "hexo",
    href: "https://github.com/itousouta15/itouBLoGa",
    cover:
      "https://github.com/itousouta15/itouBLoGa/raw/source/source/images/mainweb.webp",
    siteUrl: "https://blog.itousouta.me",
  },
  {
    slug: "itouslides",
    category: "development",
    kicker: "TOOL",
    color: "blue",
    title: "itouSlides",
    desc: "用 Astro + slidev 構建的公開簡報展示頁",
    content: `## 專案介紹

**itouSlides** 是用 **Astro 與 Slidev** 建置的公開簡報集合站，把分散的簡報整理成可以瀏覽、分類與分享的網站。

簡報本身和網站前台分開維護：Slidev 處理每份簡報的內容與展示，Astro 則提供集合首頁、版面與導覽。

## 展示與整理

- 首頁列出簡報資料，提供集中瀏覽的入口。
- 以分類篩選找到相關主題，不必逐份翻找。
- 支援深色模式，讓簡報列表與網站外觀保持一致。
- 新增簡報時，將內容放入簡報目錄，並更新對應資料即可接入展示流程。

## 建置方式

建置腳本會先處理 Slidev 簡報並產生資料，再由 Astro 輸出正式網站。產物可部署到靜態主機，儲存庫也提供 Cloudflare Workers／Static Assets 的設定。

這樣可以讓簡報的增補、網站的視覺調整與部署各自有明確的入口，也方便持續累積新的分享內容。`,
    tags: ["Astro", "TypeScript", "itou 系列"],
    icon: "astro",
    href: "https://github.com/itousouta15/itouSlides",
    siteUrl: "https://slides.itousouta.me/",
    cover: "/assets/projects/itouSlides.webp",
  },
  {
    slug: "itouoj",
    category: "development",
    kicker: "TOOL",
    color: "blue",
    title: "itouOJ",
    desc: "我的Online Judge",
    content: `## 專案介紹

**itouOJ** 是一套可以自行架設的 Online Judge，將**程式實作、程式識讀、CTF 練習、比賽與課程**放在共用的帳號系統下。使用者可以練題、寫程式、查閱提交與題解，出題者則能整理題庫、安排課程和舉辦比賽。

網站採用 **Next.js 16、React 19 與 TypeScript**，以 **SQLite／Prisma** 儲存題庫、帳號和提交資料；程式碼的編譯與執行則交給自建的 Linux 沙箱。可以直接到 [線上網站](https://oj.itousouta.me)使用，也能依照 GitHub 文件部署自己的站台。

## 練習與解題

- **程式實作**：支援 C、C++、Python、JavaScript 與喵++，提供 Markdown／數學式題敘、範例測資、子題配分、提交紀錄及排行榜。
- **線上編輯器**：使用 CodeMirror 6，可在題目頁編寫程式、測試範例並提交。桌機能拖曳調整題目與程式欄寬；手機則有獨立的編輯介面與鍵盤符號列。
- **帳號草稿同步**：每一題、每一種語言都有自己的草稿，網站與 Android App 可以同步；離線時先保存在裝置上，遇到不同版本時會讓使用者選擇保留哪一份。
- **互動式 Terminal**：桌機可逐行輸入、即時查看輸出，支援 C、C++、Python 與 JavaScript，也能送出 EOF 或停止執行。
- **程式識讀**：以選擇題練習閱讀程式，提供即時對答案、詳解、題組進度與複習紀錄，和一般程式提交分開處理。
- **CTF 練習**：提供題目分類、附件、Flag 提交、解題紀錄與計分板；部分 Web 題還有可直接操作的小型練習網站。

## 比賽、課程與管理

比賽支援 **ICPC／IOI 計分、封榜與揭榜、參賽代碼、語言限制及 PDF 題本**。課程則能把題目整理成學習進度，方便持續練習與追蹤解題情況。

網站也有討論、題解、公告、站內訊息與個人檔案。管理後台可以審核題目提案，並管理題目、CTF、比賽、課程和使用者，讓出題、辦活動和日常維護都能在站內處理。

## 自建評測與沙箱

正式提交會先進入判題佇列，由 worker 領取，再交給 **sandbox-runner** 執行。沙箱使用 **Linux namespace、cgroup v2 與 seccomp** 隔離執行環境、限制資源及系統呼叫；互動式 Terminal 則由獨立的互動服務維持輸入輸出連線。

喵++ 透過 **C++ 核心的 WebAssembly 版本**整合進 Node 沙箱，沿用既有的執行流程。現在已停止接受新的 Java 提交，過去的提交紀錄仍可查閱。

評測也支援由其他主機上的 worker 透過租約領取工作，搭配心跳、逾期回收與冪等結果寫入，處理 worker 中斷或重試的情況。

## 行動裝置與離線比賽

**Android App** 使用 Capacitor 載入網站，提供手機編輯器、分頁操作與原生通知，並與網站共用帳號和草稿。

另外有獨立的 **Windows 收件程式**，讓選手在斷網比賽中撰寫程式、保存草稿與提交，恢復連線後再補傳。Android App 與 Windows 收件程式可從 [GitHub Releases](https://github.com/itousouta15/itouOJ/releases)取得。

## 遇到的困難

判題系統需要處理的，不只有答案對不對。使用者提交的程式可能卡住、耗盡記憶體，或嘗試存取不該接觸的資源；編譯、正式判題、範例測試與互動式執行，也各有不同的資源需求和生命週期。

因此除了沙箱隔離，還要處理工作排程、逾時、重試與結果寫入，讓服務中斷時能繼續處理提交。加入識讀和 CTF 後，也得把不同題型的紀錄、分數與排行榜口徑分清楚。這些看不太到的部分，是讓整套系統能持續使用的重要工作。`,
    tags: ["Next.js", "TypeScript", "itou 系列"],
    icon: "nextjs",
    href: "https://github.com/itousouta15/itouOJ",
    cover: "/assets/projects/itouOJ.webp",
    screenshots: [
      {
        src: "/assets/projects/OJ.webp",
        alt: "itouOJ 收件程式的題目選擇與程式碼提交畫面",
        caption: "收件程式：選擇題目、撰寫程式並提交評測。",
      },
    ],
    siteUrl: "https://oj.itousouta.me",
  },
  {
    slug: "itousandbox",
    category: "development",
    kicker: "TOOL",
    color: "blue",
    title: "itouSandBox",
    desc: "從零實作的 Linux 判題沙箱",
    content: `## 專案介紹

**itouSandBox／sandbox-runner** 是為 itouOJ 開發的 Linux 判題沙箱，核心以 **C** 實作，負責在受限制的環境中編譯、執行使用者提交的程式。正式站的 C、C++、Python 與 JavaScript 提交及測試執行都由它處理，取代原先依賴的 Piston 評測服務。

## 三層隔離與限制

- **Linux namespace**：隔離程序可見的檔案系統、程序與其他系統資源。
- **cgroup v2**：限制記憶體與程序數，逾時或停止時可清理整個工作群組。
- **seccomp-bpf**：依語言使用不同的系統呼叫白名單，控制執行時能做的操作。

隔離、降權、移除 capabilities 和套用白名單都有固定的初始化順序。C／C++ 的編譯也在獨立沙箱裡進行，執行每筆測資時再建立新的 jail。

## 判題服務與互動執行

HTTP 服務沿用 Piston 執行介面的主要欄位，方便 OJ 接入。C／C++ 支援以 compiled handle 重用編譯結果，讓同一份原始碼的多筆測資不必反覆編譯；標準輸入、輸出與錯誤輸出則以多工方式處理，避免管線互相等待。

桌機 Terminal 由另一個互動服務呼叫同一個 jail，保留持續運作的程式，支援逐行輸入、EOF、停止與斷線清理。Java 已停止接受新提交，歷史紀錄仍保留在 OJ。

## 驗證與實作取捨

白名單會依實際程式與系統呼叫追蹤調整，並用歷史提交重放、隔離檢查、資源限制與互動服務測試驗證。Python 的大量輸入、Node.js 的執行緒需求，都和單純的 Hello World 有很大差異。

例如 Node.js 需要允許執行緒相關呼叫，因此不能只靠 seccomp 限制程序建立，還要由 cgroup 的程序數上限一起約束。這個專案的重點，就是把不同語言的需求放進同一套可理解、可測試的執行邊界。`,
    tags: ["C", "Python", "itou 系列"],
    icon: "nextjs",
    href: "https://github.com/itousouta15/itouSandBox",
    cover: "/assets/projects/OJ.webp",
  },
  {
    slug: "meow-plus-plus",
    category: "development",
    kicker: "LANGUAGE",
    color: "blue",
    title: "喵++（Meow-plus-plus）",
    desc: "支援中文語法的程式語言，附 WebAssembly 遊樂場與單步除錯器",
    content: `## 專案介紹

**喵++**（原名 itouLang）是一個使用中文關鍵字、採 C++ 風格結構的小型程式語言。可以撰寫、執行、編譯與單步除錯，從詞法分析、語法分析、名稱解析，到型別檢查和執行核心，都以 **C++17** 實作。

它保留型別前置宣告、函式、迴圈與串流輸入輸出等熟悉的寫法，但並不是完整的 C++，目前沒有類別、指標或 C++ 標準函式庫。

## 語言可以做什麼

- 中文識別字與關鍵字，也能混用部分英文寫法。
- 條件、迴圈、遞迴、高階函式與可修改捕獲變數的**閉包**。
- 漸進式型別檢查，並在執行時檢查參數、回傳值等型別契約。
- 以「喵in／喵out」進行串流輸入輸出，分別保留標準輸出與標準錯誤。

~~~text
整數 主程式() {
  喵out << "你好，喵++！" << 喵endl;
  回傳 0;
}
~~~

## 同一份核心，兩種使用方式

命令列可使用原生 CLI，選擇語法樹直譯器或位元組碼虛擬機，也能只做型別檢查、查看編譯後的指令。

瀏覽器遊樂場則透過 **WebAssembly 與 Worker** 執行同一份核心。可以輸入測資、查看中文型別報告、在行號設定中斷點，並用**單步**操作檢查呼叫堆疊、區域變數、捕獲變數與運算元堆疊。

## 實作與驗證

語言同時維護前端分析、兩種執行引擎和除錯狀態，因此測試不只檢查結果，也包含語意、錯誤診斷、型別契約、生成程式、CLI 與桌面／手機瀏覽器的行為。遊樂場停止執行時會終止 Worker，下一次再建立新的 WebAssembly instance。`,
    tags: ["C++", "WebAssembly", "JavaScript", "itou 系列"],
    icon: "cpp",
    href: "https://github.com/itousouta15/Meow-plus-plus",
    cover: "/assets/projects/Meow-plus-plus.svg",
  },
  {
    slug: "itoukv",
    category: "development",
    kicker: "DATABASE",
    color: "blue",
    title: "itouKV",
    desc: "從零實作的 C++20 持久化鍵值儲存引擎",
    content: `## 專案介紹

**itouKV** 是從零實作的 **C++20 持久化 key-value 儲存引擎**，提供可嵌入程式的函式庫與獨立 CLI，沒有外部 C++ 套件依賴。除了讀寫文字，也能保存包含 NUL、非 UTF-8 等任意位元組的 key 和 value。

## 從寫入到恢復

修改資料時，會先將操作寫進 **WAL** 並完成持久化 flush，再更新記憶體狀態、回傳成功。重新開啟資料庫時，會檢查紀錄的長度、序號與 checksum，恢復已保存的狀態。

**WriteBatch** 可以把多次新增、修改與刪除包成同一次提交：共用一筆 WAL、序號與 flush，恢復時整批存在或整批不存在，讀取也不會看到只發布一部分的結果。

## 查詢與資料整理

- **MemTable** 保存較新的值與刪除標記。
- **不可變 SSTable** 將整理過的資料留在磁碟，透過 Bloom filter 和稀疏索引減少查找工作。
- **範圍掃描**合併記憶體與磁碟的有序資料，讓新版本覆蓋舊版本。
- **手動 compaction** 產生新的 SSTable 與 WAL，再以原子 manifest 切換資料世代，最後清除舊檔案。

同一個 Store 可供多執行緒呼叫；資料夾則以作業系統的排他鎖限制同時開啟，程序結束後會釋放鎖。

## 驗證與目前範圍

測試包含與參考模型比對、二進位資料、批次可見性、檔案截斷與損毀，以及直接終止 CLI 後的恢復。另有獨立的格式驗證與故障點測試，確認 WAL 和 compaction 各階段的行為。

目前使用單層 SSTable 與手動 compaction，操作以同一把 mutex 序列化；尚未實作 MVCC、多層 LSM、背景 compaction 或 read-modify-write transaction。這讓儲存流程與持久化契約維持在能完整理解、逐步驗證的範圍。`,
    tags: ["C++", "Database", "itou 系列"],
    icon: "cpp",
    href: "https://github.com/itousouta15/itouKV",
    cover: "/assets/projects/itouKV.svg",
  },
  {
    slug: "itoumd",
    category: "development",
    kicker: "APP",
    color: "blue",
    title: "itouMD",
    desc: "一款用於行動裝置的現代化 Markdown 檢視器",
    content: `## 專案介紹

**itouMD** 是以 **Flutter／Dart** 開發的 Markdown 閱讀與編輯 App，整合 **HackMD** 和 GitHub，讓手機也能接著閱讀、修改和同步文件。首頁、雲端與設定各自分頁，進入文件後則使用全螢幕的閱讀／編輯介面。

## 閱讀與編輯

- 支援 **GitHub Flavored Markdown、LaTeX、HackMD 容器、目錄與 GitHub 風格提示區塊**。
- 程式碼區塊提供語法高亮、行號與複製按鈕；圖片可放大與雙指縮放。
- 可新建文件、貼上文字、開啟本機檔案，或從 GitHub、Gist、HackMD 網址取得內容。
- 編輯器有格式工具列、同步捲動的行號與清單延續，完成編輯後會回到對應的閱讀位置。
- 支援另存檔案、閱讀字體與字級調整、自訂字型，以及分別設定深淺主題的顏色。

## 雲端同步與衝突處理

HackMD 可瀏覽個人和團隊筆記，快取清單與內容供離線閱讀。寫回前會比對版本，透過**三方合併**整理遠端修改，再讓使用者逐項處理衝突；同步後也提供短時間內的復原入口。

GitHub 使用 **OAuth Device Flow** 登入，可直接開啟儲存庫 README，並將編輯結果寫回檔案。寫入前以檔案 SHA 偵測版本變更，遇到衝突時同樣先進入合併流程。

## AI 助理與協作實驗

AI 助理提供潤飾、翻譯、摘要等快捷指令與多輪串流對話，會帶入文件和選取範圍，套用前先呈現差異預覽。可使用內建額度，也能設定自己的 OpenAI 相容端點。

另有 **Yjs／CodeMirror 本機協作原型**：瀏覽器端使用即時 CRDT 協作，Flutter 端保留離線草稿，透過版本檢查與三方合併手動同步。這項原型有獨立的協作房間，沒有連接 HackMD 或 GitHub。

## 遇到的困難

手機上的 Markdown 不只有把文字轉成畫面：還要處理長文件的捲動、公式與容器語法、編輯位置對應，以及雲端版本變動。專案把 Markdown 轉換、差異計算、來源擷取與同步服務分開，合併演算法使用自製的 Myers diff 與三方合併，並以單元測試驗證。

Android 提供正式簽章 APK 與 App 內更新；iOS／iPadOS 目前提供需自行重新簽章的預覽產物。`,
    tags: ["Flutter", "Dart", "itou 系列"],
    icon: "flutter",
    href: "https://github.com/itousouta15/itouMD",
    siteUrl: "https://md.itousouta.me",
    cover: "/assets/projects/itouMD.webp",
    screenshots: [
      {
        src: "/assets/projects/itouMD_1.webp",
        alt: "宣傳官網畫面截圖",
      },
      {
        src: "/assets/projects/itouMD_2.webp",
        alt: "渲染功能展示",
      },
      {
        src: "/assets/projects/itouMD_3.webp",
        alt: "編輯功能展示",
      },
      {
        src: "/assets/projects/itouMD_4.webp",
        alt: "雲端功能展示",
      },
      {
        src: "/assets/projects/itouMD_5.webp",
        alt: "自訂功能展示",
      },
    ],
  },
  {
    slug: "itouqr",
    category: "development",
    kicker: "TOOL",
    color: "blue",
    title: "itouQR",
    desc: "一款 QR Code 生成器，支援多種格式與自訂樣式",
    content: `## 專案介紹

**itouQR** 是一個以 **HTML、CSS 與 JavaScript** 製作的 QR Code 產生器。編碼、預覽與匯出都在瀏覽器裡完成，輸入的文字或網址不需要傳到伺服器處理。

## 外觀與匯出

- 輸入內容後即時預覽，可切換方形、圓角、圓點與菱形模組。
- 調整容錯等級、匯出尺寸與留白邊界。
- 使用站內 **HSV 調色器**設定前景、背景與透明度，也能直接輸入色碼。
- 半透明或全透明背景會以棋盤格預覽，方便放進其他設計。
- 下載 **PNG／SVG**，或把圖片複製到剪貼簿。

## 渲染與操作設計

QR 編碼採用 qrcode-generator，圖形繪製與幾何計算則自行實作。Canvas 預覽和 SVG 匯出共用同一份計算，讓形狀、顏色與留白保持一致；定位圖標也有獨立處理，維持可辨識的結構。

調色器保留色相、飽和度、明度與透明度的狀態，拖到純黑、純白或透明時也不會遺失原本的色相。介面另提供對比提醒，幫助檢查樣式設定。

## 不同螢幕上的使用方式

桌機版將輸入與選項放在左邊，右邊的預覽跟隨捲動；手機則依「輸入、預覽、選項」排列，輸入後就能看到結果。深淺主題偏好會保存在裝置上，整個專案也能直接以靜態檔案開啟或部署。`,
    tags: ["HTML", "CSS", "JavaScript", "itou 系列"],
    icon: "html",
    href: "https://github.com/itousouta15/itouQR",
    siteUrl: "https://qr.itousouta.me",
    cover: "/assets/projects/itouQR.webp",
  },
  {
    slug: "verify.scaict.org",
    category: "development",
    kicker: "WEB",
    color: "blue",
    title: "SCAICT 證書查驗系統",
    desc: "一個用於驗證 SCAICT 所核發證書真偽的網頁系統",
    content: `## 專案介紹

**SCAICT 證書查驗系統**依中電會的證書編號規範建立，讓收件者或查驗者能透過證書編號、查驗連結與 QR Code，確認證書的類別、發證日期及目前狀態。

## 查驗與電子檔

查驗頁會標示**有效、已作廢或已補發**等狀態，持有人以遮罩姓名呈現。有提供電子檔的有效證書，另有密碼下載區塊，持有人可輸入核發時取得的專屬密碼，下載自己的 PDF。

## 靜態網站與資料處理

目前使用 **Astro**，在建置時讀取 Google 試算表登記簿，為各筆資料產生靜態頁面，再部署到 GitHub Pages。姓名遮罩與不公開欄位的移除在取得資料時就完成，完整姓名不會寫入網站產物。

查驗網址使用由證書編號與私有金鑰產生的不透明代碼；首頁則透過編號的雜湊索引找到對應頁面。網站也處理舊查驗連結，讓已印製的證書仍能銜接新的網址形式。

## PDF 如何交付

建置端從私有 Google Drive 取得 PDF，使用每張證書的密碼加密，網站只發布密文。持有人輸入密碼後，透過瀏覽器的 **Web Crypto、PBKDF2 與 AES-GCM** 在本機解密，密碼不會傳送到網站伺服器。

資料更新透過推送、手動執行或排程重新建置，讓登記簿中的核發、作廢與補發狀態反映到公開查驗頁。`,
    tags: ["Astro", "TypeScript", "SCAICT"],
    icon: "scaict",
    href: "https://github.com/SCAICT/cert-verify",
    cover: "/assets/projects/SCAICTLG.webp",
    siteUrl: "https://verify.scaict.org",
  },
  {
    slug: "115-summer-camp",
    category: "development",
    kicker: "WEB",
    color: "blue",
    title: "115-summer-camp",
    desc: "SCAICT 2026 暑訓官網",
    content: `## 專案介紹

**SCAICT 115 暑訓官網**是中電會 2026 暑期活動的介紹與資訊入口。網站以 **Vite／React** 建置，把課程、講師、日程、團隊與報名資訊整理成可以先快速瀏覽、再深入查看的活動網站。

## 活動資訊怎麼呈現

- **課程與講師**：介紹從 Go 語法、Telegram API 到團隊黑客松的四天課程安排。
- **日程與報名**：集中展示時程、費用方案、住宿與注意事項，再連往 KKTIX 報名。
- **團隊與社團**：提供工作人員、合作社團與支持單位的介紹。
- **活動成果**：以照片、歷屆成果和參與者回饋，補充活動的實際樣貌。

## 首頁與詳細頁的銜接

首頁使用長頁面分區導覽，課程、團隊、社團與照片另有詳細頁。詳細頁採延遲載入，返回首頁時會回到對應區段，讓訪客繼續原本的瀏覽位置。

視覺以深色底、暖色重點與大幅照片呈現，桌機和手機則分別安排資訊密度；例如報名方案在桌面用表格比較，手機改為卡片。

## 建置與部署

儲存庫提供 Docker、GitLab CI 與平台服務設定，配合部署平台分配的連接埠啟動前端。網站內容與頁面元件分開整理，方便活動資訊變更後持續更新。`,
    tags: ["Vite", "React", "SCAICT"],
    icon: "scaict",
    href: "https://github.com/SCAICT/115-summer-camp",
    cover: "/assets/projects/SCAICTsc.webp",
    siteUrl: "https://sc.scaict.org",
  },
  {
    slug: "wintercamp2026",
    category: "development",
    kicker: "WEB",
    color: "blue",
    title: "WinterCamp2026",
    desc: "SCIST x SCAICT 2026 寒訓官網",
    content: `## 專案介紹

**SCIST × SCAICT 2026 聯合寒訓官網**是由 kaiyasi、Maxhu787 與我共同製作的活動網站，整理課程、日程、報名費用、工作人員與歷屆活動照片，讓參與者能從同一個入口認識寒訓。

## 活動資訊與導覽

首頁呈現活動主視覺、介紹、課程、日程、團隊與合作社團；課程、相簿、費用、完整團隊與錄取名單則有各自的詳細頁面。

團隊資料支援分組和職務排序，合作社團以連續輪播呈現，也處理滑鼠與觸控的暫停互動。頁面會配合手機尺寸調整內容和導覽方式。

## 資料與版面分開

工作人員、合作社團、時程、相簿與常見問題集中在 JSON 檔案，讓內容維護不必直接修改整份頁面。首頁只展示部分摘要，詳細資料再由對應頁面呈現。

## 技術與圖片處理

專案使用 **Next.js 16、React 19、Tailwind CSS、Framer Motion 與 Lenis**，分別負責頁面、樣式與動態互動。

相簿另有建置時的圖片處理流程，將來源照片產生為不同尺寸的 WebP／AVIF，讓前端可以依螢幕大小載入，也能配合靜態輸出的部署方式。`,
    tags: ["Next.js", "React", "SCAICT"],
    icon: "scaict",
    href: "https://github.com/scist-tw/WinterCamp2026",
    cover: "/assets/projects/SCIST.webp",
    siteUrl: "https://scist.camp",
  },
  {
    slug: "itoucards",
    category: "development",
    kicker: "SHOWCASE",
    color: "blue",
    title: "itouCards",
    desc: "一個用純 HTML / CSS / JavaScript 製作的名片展示頁",
    content: `## 專案介紹

**itouCards** 是把實體名片的正反面放到網頁上展示的小作品，使用 **HTML、CSS 與原生 JavaScript** 製作，支援在個人名片和 SCAICT 名片之間切換。

## 名片互動

- **點擊翻面**：查看正面與背面的內容，也可使用 Enter 或空白鍵操作。
- **視角與反光**：游標移動時，名片會隨位置傾斜，表面光澤也跟著改變。
- **閒置旋轉**：沒有操作時切換到旋轉展示，游標回到畫面再轉為傾斜互動。
- **縮放**：桌機可使用滾輪，觸控裝置可用雙指調整大小。
- **鍵盤操作**：方向鍵可調整角度，頁籤也支援左右鍵切換。

## 實作細節

名片的尺寸比例會依圖片取得，不必為每一組素材寫死版型。前後面先載入完成再呈現，載入失敗時顯示狀態；切換名片也會重設翻面與傾斜，避免沿用上一張的互動位置。

CSS 負責 3D 變形和視覺樣式，JavaScript 管理載入、動畫狀態與操作回饋。整個網站不需要建置工具，能直接用瀏覽器開啟或部署到靜態主機。`,
    tags: ["HTML", "CSS", "JavaScript", "itou 系列"],
    icon: "html",
    href: "https://github.com/itousouta15/itouCards",
    cover: "https://github.com/itousouta15/itouCards/raw/main/web.webp",
    siteUrl: "https://cards.itousouta.me",
  },
  {
    slug: "tesiis",
    category: "development",
    kicker: "TOOL",
    color: "blue",
    title: "TESIIS 臺灣避難收容處所地圖",
    desc: "提供災害發生時的避難設施資訊整合查詢",
    content: `## 專案介紹

**TESIIS** 是查詢全臺避難收容處所的地圖工具，源自 2025 臺北程式設計節城市通微服務大黑客松團隊 30 的作品，目前由我與 twcat0503 持續維護。

專案已整理成可獨立部署的 **Flutter Web＋Dart Shelf API**，不依賴臺北通 SDK、登入狀態或 Google Maps API Key。除了查附近設施，也加入收藏、離線資料與家庭避難準備功能。

## 找到附近的收容處所

- 依名稱、地址、縣市／鄉鎮與分類搜尋，並查看最近設施。
- 依地圖視野與縮放層級分群載入標記，減少一次載入的資料量。
- 不使用 GPS 時，也能長按、右鍵或指定地點，替其他地方的家人查詢。
- 詳情提供地址、電話、座標來源與品質資訊，可複製資料或開啟外部地圖導航。
- 底圖使用國土測繪中心 WMTS，可切換電子、地形與正射影像。

## 事前準備與離線使用

可以收藏設施、建立分組與私人備註，比較候選地點，或以連結和 QR Code 分享單一設施。家庭計畫則可整理主要／備用集合點、緊急聯絡資訊與準備清單，產生可離線保存、列印的避難卡。

使用者可下載完整行政區的資料包，在裝置上繼續搜尋、篩選、分群與計算距離；Web 版也有離線啟動資源的建置流程。介面提供精簡清單、大字模式及深淺主題，方便依使用情境調整。

## 區域災害資訊

警報功能接入 **NCDR 官方 Atom／CAP 公告**，可依縣市／鄉鎮查詢、保存關注區域，查看公告更新、解除與到期狀態，再回到地圖尋找該區設施。

若部署端設定 TDX 憑證，設施詳情還能補充附近公車、台鐵與高鐵站點；這是可選的附加資訊，沒有設定時仍可使用主要地圖查詢。

## 資料品質與服務架構

主要點位來自**內政部消防署避難收容處所資料**。後端負責正規化、座標檢查與執行期快取，上游失效或回傳數量異常時，退回版本庫中已驗證的全國快照。座標來源與精度會一併呈現，讓使用者理解地圖標記所代表的資料。

網站以 Docker Compose 整合前端、API 與 Nginx，CI 涵蓋 Dart／Flutter 檢查、測試、Web 建置及瀏覽器端對端驗證，另有定期的資料與服務健康檢查。`,
    tags: ["Flutter", "Dart"],
    icon: "flutter",
    href: "https://github.com/TESIIS/TESIIS",
    cover: "/assets/projects/tcf.webp",
    siteUrl: "https://tesiis.itousouta.me",
    screenshots: [
      {
        src: "/assets/projects/TESIIS.webp",
        alt: "TESIIS 首頁畫面截圖",
      },
    ],
  },
];
