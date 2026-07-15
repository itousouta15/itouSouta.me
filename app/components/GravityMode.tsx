"use client";

import { useEffect, useRef, useState } from "react";

/* ---------------------------------------------------------------------------
   Google Gravity 彩蛋（致敬 elgoog.hk/gravity）
   在搜尋框輸入 114514 後，頁面上的元素會受重力掉落、撞地板堆疊，還能用滑鼠
   拖曳／甩動。這裡自帶一顆輕量 2D 物理引擎（重力 + AABB 方塊碰撞 + 拖曳丟擲），
   不依賴任何外部函式庫。收到 window 的 "gravity:activate" 事件才啟動；
   離開時直接 location.reload() 還原頁面，最單純可靠。
   --------------------------------------------------------------------------- */

// 「原子元素」：走訪到這些就整塊當一顆剛體掉落、不再往下拆。連結／按鈕整塊掉，
// 避免拆散也避免點擊導航；圖片／SVG 不能拆；tile、role-chip 這種小元件也整塊掉。
const ATOMIC_SELECTOR = "a, button, input, img, svg, canvas, video, .tile, .role-chip, .badge, .dc-act";
// 走訪時要略過的東西（腳本、載入畫面、還原按鈕本身）
const SKIP_SELECTOR = "script, style, link, noscript, .site-loader, #gravity-exit, .cmdk-overlay";

const GRAVITY = 0.7; // 每幀增加的向下速度
const RESTITUTION = 0.3; // 碰撞後的彈性（0 = 不彈，1 = 完全彈回）
const FRICTION = 0.82; // 落地後的水平摩擦
const MAX_BODIES = 320;

interface Body {
  el: HTMLElement;
  x: number;
  y: number;
  w: number;
  h: number;
  vx: number;
  vy: number;
  dragging: boolean;
}

export default function GravityMode() {
  const [active, setActive] = useState(false);
  const bodiesRef = useRef<Body[]>([]);
  const exitRef = useRef<HTMLButtonElement>(null);
  const rafRef = useRef<number | null>(null);
  const dragRef = useRef<{
    body: Body;
    offX: number;
    offY: number;
    lastX: number;
    lastY: number;
    vx: number;
    vy: number;
  } | null>(null);

  useEffect(() => {
    const onActivate = () => setActive(a => a || true);
    window.addEventListener("gravity:activate", onActivate);
    return () => window.removeEventListener("gravity:activate", onActivate);
  }, []);

  // 「還原」按鈕稍微閃避滑鼠：游標靠近就往反方向輕輕滑開，但幅度小、仍抓得到。
  useEffect(() => {
    if (!active) return;
    const RADIUS = 110; // 進入這個範圍才開始閃
    const MAX = 64; // 最多滑開的距離
    const onMove = (e: MouseEvent) => {
      const b = exitRef.current;
      if (!b) return;
      const r = b.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      let dx = cx - e.clientX;
      let dy = cy - e.clientY;
      const dist = Math.hypot(dx, dy) || 1;
      if (dist < RADIUS) {
        const push = (RADIUS - dist) / RADIUS; // 越近推越多（0~1）
        const ox = (dx / dist) * push * MAX;
        const oy = (dy / dist) * push * MAX;
        b.style.transform = `translate(calc(-50% + ${ox}px), ${oy}px)`;
      } else {
        b.style.transform = "translate(-50%, 0)";
      }
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [active]);

  useEffect(() => {
    if (!active) return;

    // 停掉頁面滾動，並在 rAF 內收集元素，確保搜尋面板已 unmount、版面已定。
    document.body.style.overflow = "hidden";

    // 元素是否「自己就會畫出內容」：有直接文字節點（例如標題的 "I'm"、role-chip
    // 的文字），或本身就是會渲染的葉節點。這種要整塊當剛體，不再往子層拆。
    const hasDirectText = (el: HTMLElement) => {
      for (const n of Array.from(el.childNodes)) {
        if (n.nodeType === Node.TEXT_NODE && (n.textContent ?? "").trim().length > 0) return true;
      }
      return false;
    };

    const isVisible = (el: HTMLElement, r: DOMRect) => {
      if (r.width < 4 || r.height < 4) return false;
      const cs = getComputedStyle(el);
      return cs.display !== "none" && cs.visibility !== "hidden" && parseFloat(cs.opacity || "1") > 0.05;
    };

    const setup = () => {
      const bodies: Body[] = [];

      // 從頁面往下走訪：碰到原子元素／含文字的元素就整塊掉；否則遞迴子層，
      // 讓幾乎每個看得到的東西都被涵蓋，不會有東西留在原地不動。
      const walk = (el: HTMLElement) => {
        if (bodies.length >= MAX_BODIES) return;
        if (el.matches(SKIP_SELECTOR) || el.closest(SKIP_SELECTOR)) return;

        const children = Array.from(el.children).filter((c): c is HTMLElement => c instanceof HTMLElement);
        const atomic = el.matches(ATOMIC_SELECTOR) || hasDirectText(el) || children.length === 0;

        if (!atomic) {
          for (const c of children) walk(c);
          return;
        }

        const r = el.getBoundingClientRect();
        if (!isVisible(el, r)) return;
        bodies.push({
          el,
          x: r.left,
          y: r.top,
          w: r.width,
          h: r.height,
          vx: (Math.random() - 0.5) * 6,
          vy: (Math.random() - 0.5) * 4,
          dragging: false,
        });
      };

      for (const c of Array.from(document.body.children)) {
        if (c instanceof HTMLElement) walk(c);
      }

      // 把剩下的容器（沒被拆成剛體的卡片、header/footer 等）背景清掉，避免留下空盒子
      document
        .querySelectorAll<HTMLElement>(".card, .profile-card, .header, .footer, .tiles-strip")
        .forEach(c => {
          c.style.background = "transparent";
          c.style.border = "none";
          c.style.boxShadow = "none";
          c.style.backdropFilter = "none";
        });

      // 把每個剛體切成固定定位、以 transform 控制位置
      for (const b of bodies) {
        const s = b.el.style;
        s.position = "fixed";
        s.left = "0";
        s.top = "0";
        s.margin = "0";
        s.width = `${b.w}px`;
        s.height = `${b.h}px`;
        s.zIndex = "9000";
        s.transition = "none";
        s.willChange = "transform";
        s.boxSizing = "border-box";
        s.cursor = "grab";
        s.transform = `translate(${b.x}px, ${b.y}px)`;
        b.el.addEventListener("pointerdown", onPointerDown);
      }

      bodiesRef.current = bodies;
      rafRef.current = requestAnimationFrame(step);
    };

    // 擋掉掉落中的連結／按鈕的點擊，免得點一下 falling 元素就導航離開
    const blockClick = (e: MouseEvent) => {
      const t = e.target as Node | null;
      if (t && bodiesRef.current.some(b => b.el === t || b.el.contains(t))) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    document.addEventListener("click", blockClick, true);

    const onPointerDown = (e: PointerEvent) => {
      const target = (e.currentTarget as HTMLElement) ?? null;
      const body = bodiesRef.current.find(b => b.el === target);
      if (!body) return;
      e.preventDefault();
      body.dragging = true;
      body.el.style.cursor = "grabbing";
      dragRef.current = {
        body,
        offX: e.clientX - body.x,
        offY: e.clientY - body.y,
        lastX: e.clientX,
        lastY: e.clientY,
        vx: 0,
        vy: 0,
      };
      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", onPointerUp);
    };

    const onPointerMove = (e: PointerEvent) => {
      const d = dragRef.current;
      if (!d) return;
      d.body.x = e.clientX - d.offX;
      d.body.y = e.clientY - d.offY;
      d.vx = e.clientX - d.lastX;
      d.vy = e.clientY - d.lastY;
      d.lastX = e.clientX;
      d.lastY = e.clientY;
    };

    const onPointerUp = () => {
      const d = dragRef.current;
      if (d) {
        d.body.dragging = false;
        d.body.el.style.cursor = "grab";
        // 甩出去：把拖曳時累積的位移當初速度（略放大）
        d.body.vx = d.vx * 1.4;
        d.body.vy = d.vy * 1.4;
      }
      dragRef.current = null;
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };

    const step = () => {
      const bodies = bodiesRef.current;
      const W = window.innerWidth;
      const H = window.innerHeight;

      for (const b of bodies) {
        if (b.dragging) continue;
        b.vy += GRAVITY;
        b.x += b.vx;
        b.y += b.vy;

        // 地板
        if (b.y + b.h > H) {
          b.y = H - b.h;
          if (b.vy > 0) b.vy = -b.vy * RESTITUTION;
          b.vx *= FRICTION;
          if (Math.abs(b.vy) < 0.6) b.vy = 0;
        }
        // 天花板
        if (b.y < 0) {
          b.y = 0;
          if (b.vy < 0) b.vy = -b.vy * RESTITUTION;
        }
        // 左右牆
        if (b.x < 0) {
          b.x = 0;
          if (b.vx < 0) b.vx = -b.vx * RESTITUTION;
        }
        if (b.x + b.w > W) {
          b.x = W - b.w;
          if (b.vx > 0) b.vx = -b.vx * RESTITUTION;
        }
      }

      // 方塊間 AABB 碰撞：沿穿透較淺的軸分開，讓元素能互相堆疊
      for (let iter = 0; iter < 3; iter++) {
        for (let i = 0; i < bodies.length; i++) {
          for (let j = i + 1; j < bodies.length; j++) {
            resolve(bodies[i], bodies[j]);
          }
        }
      }

      for (const b of bodies) {
        b.el.style.transform = `translate(${b.x}px, ${b.y}px)`;
      }

      rafRef.current = requestAnimationFrame(step);
    };

    const resolve = (a: Body, b: Body) => {
      const ox = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
      const oy = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
      if (ox <= 0 || oy <= 0) return;

      // 被拖曳的方塊視為無限重（不被推動），另一方吃全部位移
      const aFixed = a.dragging;
      const bFixed = b.dragging;
      if (aFixed && bFixed) return;
      const aShare = aFixed ? 0 : bFixed ? 1 : 0.5;
      const bShare = 1 - aShare;

      if (ox < oy) {
        const dir = a.x < b.x ? -1 : 1;
        a.x += dir * ox * aShare;
        b.x -= dir * ox * bShare;
        const avg = (a.vx + b.vx) / 2;
        if (!aFixed) a.vx = avg * 0.5;
        if (!bFixed) b.vx = avg * 0.5;
      } else {
        const dir = a.y < b.y ? -1 : 1;
        a.y += dir * oy * aShare;
        b.y -= dir * oy * bShare;
        const avg = (a.vy + b.vy) / 2;
        if (!aFixed) a.vy = avg * 0.3;
        if (!bFixed) b.vy = avg * 0.3;
      }
    };

    const startId = requestAnimationFrame(setup);

    return () => {
      cancelAnimationFrame(startId);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      document.removeEventListener("click", blockClick, true);
      for (const b of bodiesRef.current) b.el.removeEventListener("pointerdown", onPointerDown);
    };
  }, [active]);

  if (!active) return null;

  return (
    <button
      ref={exitRef}
      id="gravity-exit"
      type="button"
      onClick={() => window.location.reload()}
      aria-label="還原頁面"
    >
      <span className="gravity-exit-base">↻ 還原</span>
      <span className="gravity-exit-fill" aria-hidden="true">
        ↻ 還原
      </span>
    </button>
  );
}
