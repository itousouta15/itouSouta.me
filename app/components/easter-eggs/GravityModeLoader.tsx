"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const GravityMode = dynamic(() => import("./GravityMode"), { ssr: false });

/* GravityMode 是一顆 11KB 的手刻 2D 物理引擎，卻只服務指令面板裡的 114514 彩蛋。
   直接掛在 layout 等於每條路由都背著它，所以這裡只留一個監聽器，等事件真的來了
   才把 chunk 抓下來。

   注意：GravityMode 自己也監聽 gravity:activate，但等 chunk 載入完掛載時事件早就
   過去了，接不到——所以要用 autoStart 把「已經觸發過」這件事傳進去，不然彩蛋會
   靜默失效。 */
export default function GravityModeLoader() {
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    const onActivate = () => setArmed(true);
    window.addEventListener("gravity:activate", onActivate);
    return () => window.removeEventListener("gravity:activate", onActivate);
  }, []);

  if (!armed) return null;
  return <GravityMode autoStart />;
}
