import { ImageResponse } from "next/og";
import { loadNotoSerifTC } from "./ogFont";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/* 刻意不設 runtime：這些路由都能靜態預產，所以 opengraph-image 是在 next build
   期間生成、以靜態檔部署的——沒有 function，Vercel 的 bundle 上限根本不適用，
   1.38MB 的 resvg.wasm 也不必塞進去。設 runtime = "edge" 反而會製造出那個問題。 */

// satori 只吃 CSS 的一個子集：沒有 CSS 變數、沒有 backdrop-filter、沒有 zoom，
// 所以直接寫死 globals.css 的深色色票（PNG 沒有主題之分）
const BG = "#1b1e23";
const PANEL = "#24262b";
const TX = "#e8ebf2";
const MUTE = "#6a7280";
const BLUE = "#b0bdf7";

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

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: BG,
        padding: "72px 80px",
        fontFamily: font ? "Noto Serif TC" : "sans-serif",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
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
    </div>,
    {
      ...size,
      fonts: font
        ? [{ name: "Noto Serif TC", data: font, style: "normal", weight: 700 }]
        : [],
    }
  );
}
