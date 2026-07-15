"use client";

import { useEffect, useRef, useState } from "react";

const NAMES = ["itouSouta", "伊藤蒼太", "郭家睿"];
// 對應 CSS itNameRoll 動畫的 8s 週期，用來推算滑鼠移入當下輪播停在哪個名字。
const CYCLE_MS = 8000;
// 對齊 itNameRoll 關鍵影格切換點（22/30、52/60、88/100 的中點）的週期百分比。
const SWITCH_AT = [26, 56, 94];

const GLYPHS = "!<>-_\\/[]{}—=+*^?#$%&@";
const FRAME_MS = 35;
// 字元要等 frame 數超過自己 index 這麼多才會定案，越後面的字越晚鎖定，
// 呈現由左到右依序解碼出來的效果。
const LOCK_AFTER = 8;

function randomGlyph() {
  return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
}

function currentName(mountedAt: number) {
  const pct = (((Date.now() - mountedAt) % CYCLE_MS) / CYCLE_MS) * 100;
  const idx = pct < SWITCH_AT[0] ? 0 : pct < SWITCH_AT[1] ? 1 : pct < SWITCH_AT[2] ? 2 : 0;
  return NAMES[idx];
}

// 滑鼠移上去時暫停原本的輪播，改成從亂碼逐字解碼回當下正顯示的那個名字。
export default function NameRotator() {
  const [decoding, setDecoding] = useState(false);
  const [decoded, setDecoded] = useState(NAMES[0]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mountedAt = useRef(Date.now());

  const stopDecode = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const startDecode = () => {
    stopDecode();
    setDecoding(true);
    const target = currentName(mountedAt.current);
    let frame = 0;
    timerRef.current = setInterval(() => {
      let settled = 0;
      let output = "";
      for (let i = 0; i < target.length; i++) {
        if (frame - i > LOCK_AFTER) {
          output += target[i];
          settled++;
        } else {
          output += randomGlyph();
        }
      }
      setDecoded(output);
      frame++;
      if (settled === target.length) stopDecode();
    }, FRAME_MS);
  };

  useEffect(() => stopDecode, []);

  return (
    <span
      className={`name-rotator${decoding ? " is-decoding" : ""}`}
      aria-label="itouSouta, 伊藤蒼太, 郭家睿"
      onMouseEnter={startDecode}
      onMouseLeave={() => {
        stopDecode();
        setDecoding(false);
      }}
    >
      <span className="name-rotator-track">
        <b>itouSouta</b>
        <b>伊藤蒼太</b>
        <b>郭家睿</b>
        <b>itouSouta</b>
      </span>
      <span className="name-rotator-decode" aria-hidden="true">
        {decoded}
      </span>
    </span>
  );
}
