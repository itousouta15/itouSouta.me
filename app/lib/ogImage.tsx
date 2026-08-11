/* 這個檔案的版面之後，**十個 opengraph-image.tsx 開頭那行日期也要一起改**。

   踩過一次：底圖跟頭像都做好、也部署上去了，線上 /opengraph-image 抓下來確實是
   新圖，但 Discord 貼連結出來還是舊的純色卡。原因是 HTML 裡的網址長這樣

       <meta property="og:image" content="https://itousouta.me/opengraph-image?9c45…">

   那串 ?9c45… 是 Next 的快取破壞參數，而它是對「**那個 opengraph-image.tsx 檔案
   自己的原始碼**」算的 contenthash——不含它 import 進來的東西
   （見 next/dist/build/webpack/loaders/next-metadata-image-loader.js 的
   `interpolateName(this, "[contenthash]", { context, content })`，content 就是該
   檔案的原始碼）。所以只動這裡的話，十個路由檔的雜湊一個都不會變，網址原封不動；
   偏偏 OG 圖的回應標頭是 `immutable, max-age=31536000`，各平台與 CDN 就理所當然
   地永遠不再重抓。

   結論：版面改動不會自己傳播到網址上，得手動讓那十個檔案的位元組變一下。 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { loadNotoSerifTC } from "./ogFont";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/* 刻意不設 runtime：這些路由都能靜態預產，所以 opengraph-image 是在 next build
   期間生成、以靜態檔部署的——沒有 function，Vercel 的 bundle 上限根本不適用，
   1.38MB 的 resvg.wasm 也不必塞進去。設 runtime = "edge" 反而會製造出那個問題。
   附帶好處：這裡跑在 Node，可以直接 readFileSync 讀 public/ 下的圖，edge 不行。 */

// satori 只吃 CSS 的一個子集：沒有 CSS 變數、沒有 backdrop-filter、沒有 zoom，
// 所以直接寫死 globals.css 的深色色票（PNG 沒有主題之分）
const BG = "#1b1e23";
const PANEL = "#24262b";
const TX = "#e8ebf2";
const MUTE = "#6a7280";
const BLUE = "#b0bdf7";

/* 蓋板的漸層需要半透明的停止點，而 satori 的 gradient parser 只穩吃
   hex / rgb() / rgba()，八碼 hex 不保險。所以 BG 的三個分量另外留一份給漸層。
   這是全檔唯一的色票重複——改 BG 記得兩邊一起改，不然漸層會偏色。 */
const BG_RGB = "27, 30, 35"; // === BG

/* 底圖與頭像用 data URI 塞進 satori。三件事值得先講清楚：

   1. **檔名是 .webp，但 MIME 寫 image/png——這是對的，不是筆誤。** brand/ 底下
      那幾張其實是不折不扣的 PNG（開頭就是 89 50 4E 47），只是副檔名寫錯了。
      satori 判斷格式看的是 magic bytes 不是副檔名，而它支援的清單是
      [png, apng, jpeg, gif, svg]——真的是 WebP 反而會丟 Unsupported image type。
      所以宣告成 image/png 才是誠實的。想換圖的話請先確認新檔案真的是 PNG/JPEG。

   2. **不能用 "/assets/brand/banner.webp" 這種相對路徑。** satori 在沒有 window
      的環境會直接丟 "Image source must be an absolute URL"，只吃 data URI、
      絕對網址或 buffer。而 build 當下站台還沒起來，也沒有 http 可以抓自己。

   3. **讀不到就回 null、不 throw。** 這段在 next build 期間執行，throw 會直接讓
      部署失敗——為了一張分享圖不值得，跟 ogFont.ts 是同一套哲學。 */
const brandCache = new Map<string, string | null>();

function loadBrandPng(file: string): string | null {
  const cached = brandCache.get(file);
  if (cached !== undefined) return cached;

  let src: string | null = null;
  try {
    const buf = readFileSync(join(process.cwd(), "public/assets/brand", file));
    src = `data:image/png;base64,${buf.toString("base64")}`;
  } catch {
    /* 這裡跟 ogFont.ts 不一樣，多印一行 warn：字型抓不到是網路飄，本來就會偶爾
       發生；這兩張是 repo 裡的檔案，讀不到就是真的出事了。靜靜地少一層圖，會讓
       十三張卡片全部悄悄變醜而沒人發現。 */
    console.warn(`[ogImage] 讀不到 ${file}，這張分享圖會少掉那一層`);
  }

  // satori 每次 render 都會清掉自己的圖片快取，跨圖重用只能靠這裡。
  // 一次 build 會呼叫 renderOg 十三次，這個 Map 讓每張圖只讀檔＋base64 一次。
  brandCache.set(file, src);
  return src;
}

export async function renderOg({
  kicker,
  title,
  desc,
}: {
  kicker: string;
  title: string;
  desc?: string;
}) {
  const font = await loadNotoSerifTC(`${title}${desc ?? ""}`);
  /* 圖層刻意放在 font 守衛之外：banner 跟頭像不需要任何字符，字型抓失敗那種
     只剩 kicker 的退化版面反而最需要靠圖像撐住識別度。 */
  const banner = loadBrandPng("banner.webp");
  const avatar = loadBrandPng("avatar.webp");

  return new ImageResponse(
    /* 三層堆疊，靠 DOM 順序決定誰蓋誰——satori 沒有 z-index，畫的順序固定是
       「自己的背景 → 子元素依序」，所以底圖、蓋板、內容層照這個順序排就對了。

       padding 掛在內容層而不是根元素。理由**不是**「padding 會把絕對定位的子元素
       往內推」——不會，CSS 裡 abs 子元素的 containing block 是 padding box，原點
       在 border 內緣，padding 不參與；yoga 也只多加 leading border。真正的理由是
       yoga 解 abs 子元素的**百分比**尺寸時，是拿父層的 content box（扣掉 padding）
       當基準，這點跟 CSS 不合。根元素保持無 padding，就不用去繞這個坑，底下那兩層
       也才敢直接寫 size.width / size.height。 */
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        background: BG,
      }}
    >
      {/* 底圖與蓋板刻意拆成兩個獨立的條件式，不用 <>…</> 包起來：satori 完全
          沒有 Fragment 的處理（原始碼裡連 react.fragment 都搜不到），包了會被
          當成未知元素。 */}
      {/* banner 是 768x432，鋪滿 1200x630 要放大約 1.56 倍。cover 在 satori 會
          轉成 SVG 的 preserveAspectRatio="xMidYMid slice"，但 objectPosition 不
          生效（實作只吐 xMidYMid），所以裁切一律置中——網站上那個
          object-position: center 33% 在這裡複製不了。 */}
      {banner && (
        <img
          src={banner}
          alt=""
          width={size.width}
          height={size.height}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: size.width,
            height: size.height,
            objectFit: "cover",
            opacity: 0.28,
          }}
        />
      )}
      {/* 由左到右淡出的深色蓋板：左 40%（x = 480）完全純色，75% 之後完全不遮，
          讓右側頭像區看得到 banner 紋理。

          停止點跟可讀性的關係我實際量過產出的 PNG（文字色 MUTE #6a7280）：
            x ≤ 480  背景仍是純 #1b1e23，對比 3.45（改動前的基準值）
            x = 640  對比 3.25   ← 最長的副標收在 x≈672，落在這附近
            x = 720  對比 3.08
            x = 880  對比 2.81   ← 這裡才會低於大字級 AA 的 3.0
          副標是 30px，算大字級、門檻 3.0，所以現況通過。但文字欄右緣是 x=872，
          等於只剩 200px 的餘裕——**如果哪天描述長到逼近文字欄尾端，就會掉到 3.0
          以下**。真的變長就把這裡的 40% 往右推（推到 72% 可覆蓋整個文字欄）。

          蓋板顏色跟 BG 完全一樣，alpha 1→0 中間才不會偏色；千萬別寫成 transparent，
          那是 rgba(0,0,0,0)，會一路往黑色插值。最後那個 100% 的重複停止點是刻意
          寫的，不去賭「最後一個 stop 會自己延伸到底」這種隱含行為。
          想讓底圖更搶眼就加上面的 0.28，想讓文字區更乾淨就把 40% 往右推。 */}
      {banner && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: size.width,
            height: size.height,
            backgroundImage: `linear-gradient(90deg, rgba(${BG_RGB}, 1) 0%, rgba(${BG_RGB}, 1) 40%, rgba(${BG_RGB}, 0) 75%, rgba(${BG_RGB}, 0) 100%)`,
          }}
        />
      )}

      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          fontFamily: font ? "Noto Serif TC" : "sans-serif",
        }}
      >
        {/* 上半列用 flex: 1 吃掉頁尾以上的全部高度（486 − 頁尾 36 = 450px），
            頭像才有東西可以置中。實測產出的 PNG：頭像落在 y 195–394、中心 294.5，
            比整張卡的幾何中心 315 高 20px——**它是對著「頁尾以上的內容區」置中，
            不是對著整張卡**，頁尾本來就是獨立的一條帶狀。20px 不到高度的 3.3%，
            看起來就是置中。
            文字欄另外用 alignSelf: flex-start 釘回頂端，維持原本靠上的排版不變。 */}
        <div
          style={{ display: "flex", flex: 1, alignItems: "center", gap: 48 }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              // 讓文字欄該縮就縮，而不是把頭像擠出畫面外
              minWidth: 0,
              alignSelf: "flex-start",
            }}
          >
            <div
              style={{
                fontSize: 26,
                letterSpacing: "0.22em",
                color: BLUE,
                fontFamily: "sans-serif",
              }}
            >
              {kicker}
            </div>
            {/* 字型抓失敗時中文會變豆腐，寧可只留 kicker 與網域 */}
            {font && (
              <div
                style={{
                  fontSize: 76,
                  lineHeight: 1.3,
                  color: TX,
                  marginTop: 28,
                  // satori 沒有多行截斷，長標題自己斷行即可
                  display: "flex",
                }}
              >
                {title}
              </div>
            )}
            {font && desc && (
              <div
                style={{
                  fontSize: 30,
                  lineHeight: 1.6,
                  color: MUTE,
                  marginTop: 24,
                  display: "flex",
                }}
              >
                {desc}
              </div>
            )}
          </div>

          {/* 外框用 padding ring（外層 div 上底色）而不是 border，免得去賭 satori
              的 box-sizing 預設值。順帶一個好處：內圈 176px 幾乎等於頭像原生的
              173px，等於不用上採樣，不會糊。站上的 .avatar 是 98px 配 7px 邊框，
              這裡等比放大成 200px 配 12px 環。 */}
          {avatar && (
            <div
              style={{
                display: "flex",
                width: 200,
                height: 200,
                borderRadius: 100,
                background: PANEL,
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <img
                src={avatar}
                alt=""
                width={176}
                height={176}
                style={{
                  width: 176,
                  height: 176,
                  borderRadius: 88,
                  objectFit: "cover",
                }}
              />
            </div>
          )}
        </div>

        {/* 實測：右邊那根 200px 橫槓落在 x 920–1119，跟頭像**完全同一欄**（頭像
            也是 920–1119）。這是頭像寬度剛好等於橫槓寬度換來的，動任何一邊之前
            先想一下會不會把這個對齊弄掉。
            另外提醒：這根橫槓現在壓在 banner 上，量到的周圍背景是 rgb(38,43,50)，
            比它自己的 #24262b 還亮——在純色底上它本來是「比背景亮一點」的細線，
            現在變成暗一點點，等於看不見了。要救就把 background 換成半透明白，
            例如 rgba(232,235,242,0.14)，純色區跟 banner 上都讀得到。 */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 64, height: 6, background: BLUE }} />
          <div
            style={{
              fontSize: 30,
              color: TX,
              fontFamily: "sans-serif",
            }}
          >
            itousouta.me
          </div>
          <div style={{ flex: 1 }} />
          <div style={{ width: 200, height: 6, background: PANEL }} />
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: font
        ? [{ name: "Noto Serif TC", data: font, style: "normal", weight: 700 }]
        : [],
    }
  );
}
