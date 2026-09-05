/* 全站背景噪點（film grain）：固定蓋在畫面上的一層極淡顆粒，純 CSS + inline
   SVG feTurbulence，樣式全在 globals.css 的 .noise-overlay（見該處註解）。
   aria-hidden：純裝飾層，不進無障礙樹。 */
export default function NoiseOverlay() {
  return <div className="noise-overlay" aria-hidden="true" />;
}
