/* 全站背景噪點（film grain）：固定蓋在畫面上的一層極淡透明顆粒，深淺主題
   各用一張 SVG 紋理，樣式全在 globals.css 的 .noise-overlay（見該處註解）。
   aria-hidden：純裝飾層，不進無障礙樹。 */
export default function NoiseOverlay() {
  return <div className="noise-overlay" aria-hidden="true" />;
}
