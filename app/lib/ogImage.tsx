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
    /* 三層堆疊。padding 一定要留在內容層、不能掛回根元素——絕對定位的子元素是
       對著 padding box 排的，根元素一旦有 padding，top:0/left:0 的滿版底圖就會
       被那 72/80px 內縮，鋪不滿整張。 */
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
      {/* 由左到右淡出的深色蓋板：左 40% 完全純色，文字整片壓在那上面才讀得清楚；
          75% 之後完全不遮，讓右側頭像區看得到 banner 的紋理。最後那個 100% 的
          重複停止點是刻意寫的，不去賭「最後一個 stop 會自己延伸到底」這種隱含
          行為。覺得太重或太淡，調上面的 0.28 跟這裡的 40% 就好。 */}
      {banner && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: size.width,
            height: size.height,
            backgroundImage: `linear-gradient(90deg, ${BG} 0%, ${BG} 40%, rgba(27,30,35,0) 75%, rgba(27,30,35,0) 100%)`,
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
        {/* 上半列吃掉頁尾以上的所有高度，頭像才會落在整張卡的垂直中線；文字欄
            另外用 alignSelf: flex-start 釘回頂端，維持原本靠上的排版不變。 */}
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
