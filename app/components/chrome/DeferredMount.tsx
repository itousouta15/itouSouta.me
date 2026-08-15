"use client";

import { useEffect, useState } from "react";
import type { ComponentType } from "react";

/* 把「非關鍵」的全站元件（回到頂部、彩蛋監聽器等）延到瀏覽器 idle 才載 chunk
   並掛載：初始 bundle 變小、hydration 少一塊工作（mobile 模擬的 TBT 有一大半
   是 hydration 貢獻的）。純裝飾／娛樂性質，晚 1-2 秒掛載沒有 UX 影響。

   loader 表刻意寫死在 client 端：動態 import 函式不能從 Server Component 當
   prop 傳進 Client Component（build 會直接報錯）。 */
const loaders = {
  backToTop: () => import("./BackToTopButton"),
  konami: () => import("../easter-eggs/KonamiEasterEgg"),
  confetti: () => import("../easter-eggs/ConfettiBurst"),
} as const;

export default function DeferredMount({
  name,
}: {
  name: keyof typeof loaders;
}) {
  const [Comp, setComp] = useState<ComponentType | null>(null);

  useEffect(() => {
    let cancelled = false;
    const id = window.requestIdleCallback(
      () => {
        loaders[name]().then((mod) => {
          if (!cancelled) setComp(() => mod.default);
        });
      },
      { timeout: 4000 }
    );
    return () => {
      cancelled = true;
      window.cancelIdleCallback(id);
    };
  }, [name]);

  if (!Comp) return null;
  return <Comp />;
}
