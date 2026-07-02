"use client";

import { RefObject, useEffect } from "react";

// 把垂直滾輪轉成水平捲動，帶一點平滑但以跟手為優先。
//
// LERP 的意思是「60fps 下每影格吃掉剩餘差距的比例」，有依實際影格間隔做
// 時間正規化，60/120/144Hz 螢幕上衰減曲線一致。0.5 = 首影格就走完一半、
// 三四個影格（~60ms）內幾乎到位 —— 體感即時，只留極短的緩衝尾巴消除
// 硬跳感。（0.1~0.3 的殘餘距離拖得夠久，會被感知成輸入延遲。）
// delta 不做上限截斷 —— 之前把單齒夾在 ±160 會讓快速滾動被限速。
const LERP = 0.5;
const WHEEL_MULTIPLIER = 1; // 橫向距離感不用跟 Lenis 的 0.8 一致，1:1 比較直觀
const FRAME_MS = 1000 / 60;

export function useHorizontalWheelScroll(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // CSS scroll-snap 會跟平滑捲動的小步位移打架：每一步都遠低於 proximity
    // 門檻，瀏覽器會立刻把位置吸回最近的 snap 點。滾輪一碰到這個元素就
    // 永久關掉 snap；純觸控滑動（不發 wheel 事件）維持原生 snap 行為。
    const originalSnap = el.style.scrollSnapType;

    // current 用自己的浮點數追蹤，不每影格從 el.scrollLeft 讀回：scrollLeft
    // 賦值會被四捨五入成整數 px，小數步伐可能讀回原值，造成永不收斂的震盪。
    let current = el.scrollLeft;
    let target = current;
    let raf: number | null = null;
    let lastTime = 0;

    const maxScroll = () => el.scrollWidth - el.clientWidth;

    const step = (now: number) => {
      const dt = lastTime === 0 ? FRAME_MS : Math.min(now - lastTime, 100);
      lastTime = now;

      // 時間正規化的 lerp：dt 恰為一影格(60fps)時 alpha 就是 LERP 本身。
      const alpha = 1 - Math.pow(1 - LERP, dt / FRAME_MS);
      current += (target - current) * alpha;

      if (Math.abs(target - current) < 0.5) {
        current = target;
        el.scrollLeft = current;
        raf = null;
        lastTime = 0;
        return;
      }
      el.scrollLeft = current;
      raf = requestAnimationFrame(step);
    };

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) {
        // 真正的水平手勢（觸控板橫掃等）交給瀏覽器原生捲動，但一樣要關
        // snap，不然每一小步都被吸回原點、要到手勢結束才動得了。
        el.style.scrollSnapType = "none";
        return;
      }

      // 卡片內部若有自己的垂直捲動區（例如歌單），在它還捲得動時讓它原生
      // 處理，外層不搶。只有 overflow-y 真的是 auto/scroll 的才算 ——
      // overflow:hidden 也可能因次像素進位出現 scrollHeight > clientHeight。
      let node = e.target as HTMLElement | null;
      while (node && node !== el) {
        const overflowY = getComputedStyle(node).overflowY;
        const isScrollable = overflowY === "auto" || overflowY === "scroll";
        if (isScrollable && node.scrollHeight > node.clientHeight) {
          const canScrollDown = e.deltaY > 0 && node.scrollTop + node.clientHeight < node.scrollHeight - 1;
          const canScrollUp = e.deltaY < 0 && node.scrollTop > 0;
          if (canScrollDown || canScrollUp) return;
          break;
        }
        node = node.parentElement;
      }

      e.preventDefault();
      el.style.scrollSnapType = "none";
      // 防禦性覆蓋：若元素被（重新）設了 scroll-behavior: smooth，每影格的
      // scrollLeft 賦值會被瀏覽器轉成自己的緩動動畫疊在這裡的緩動上，
      // 造成嚴重延遲。程式驅動期間強制即時賦值。
      el.style.scrollBehavior = "auto";

      // 動畫沒在跑時，位置可能被外力（觸控拖動、程式捲動）改過，current
      // 和 target 都從真實位置重新同步，避免從舊位置大跳。
      if (raf == null) {
        current = el.scrollLeft;
        target = current;
      }

      target = Math.max(0, Math.min(maxScroll(), target + e.deltaY * WHEEL_MULTIPLIER));
      if (raf == null) raf = requestAnimationFrame(step);
    };

    // 只處理 wheel。真正的觸控螢幕滑動手勢不會發出 wheel 事件（那是滑鼠／
    // 觸控板專屬），所以這個 hook 對觸控完全不插手，交給瀏覽器原生處理——
    // 水平拖曳這排卡片、垂直手勢照樣鏈給頁面捲動，兩者都不需要自訂 JS。
    // 手機版之前滑不動是 lenis.css 幫 data-lenis-prevent-wheel 元素自動加了
    // overscroll-behavior: contain 擋住了垂直鏈接，跟這裡的邏輯無關，修法見
    // globals.css 的 .likes-track[data-lenis-prevent-wheel] 規則。
    el.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      el.style.scrollSnapType = originalSnap;
      el.style.scrollBehavior = "";
      el.removeEventListener("wheel", onWheel);
      if (raf != null) cancelAnimationFrame(raf);
    };
  }, [ref]);
}
