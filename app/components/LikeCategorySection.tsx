"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { LikeCategory, Like } from "../data";
import { useHorizontalWheelScroll } from "../hooks/useHorizontalWheelScroll";
import { useVtuberLiveStatus } from "../hooks/useVtuberLiveStatus";
import { sortLikesByRating } from "../lib/sortLikes";
import LikeCard from "./LikeCard";
import LikeModalShell from "./LikeModalShell";

const INITIAL_COUNT = 14;
const BATCH_SIZE = 14;

export default function LikeCategorySection({ cat }: { cat: LikeCategory }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  useHorizontalWheelScroll(trackRef);
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const [selectedLike, setSelectedLike] = useState<Like | null>(null);

  useEffect(() => {
    setVisibleCount(INITIAL_COUNT);
  }, [cat.key]);

  // circle 版（目前只有 vtuber）才需要開台偵測；hub 頁一進來就先熱這個 API 的快取，
  // 這裡直接複用同一份 60s 快取，不會額外多打
  const liveMap = useVtuberLiveStatus(cat.layout === "circle");
  // liveMap 是非同步拿到的，一開始會先照 rating 排序顯示，資料回來後才補上開台優先——
  // 依賴 liveMap 是必要的，不然開台狀態變動不會觸發重新排序
  const sortedItems = useMemo(
    () => sortLikesByRating(cat.items, "desc", l => !!(l.href && liveMap[l.href]?.live)),
    [cat.items, liveMap]
  );

  // 開台名單是哪幾個人變動時才需要處理（不是每次 liveMap 物件參照變動就處理——
  // 60s 輪詢就算沒人上下線也會換一次參照），用排序後的內容當簽章去重
  const liveSignature = useMemo(
    () =>
      Object.keys(liveMap)
        .filter(href => liveMap[href]?.live)
        .sort()
        .join(","),
    [liveMap]
  );

  useEffect(() => {
    // 直播中的卡片被搬到最前面時，把捲動位置歸零，不然使用者要是已經捲到別的
    // 地方，排到最前面的卡片反而在目前視野外，等於白排——見 useHorizontalWheelScroll
    // 的補充說明。空字串（還沒人開台/首次尚未拿到資料）不用特別捲動。
    if (liveSignature && trackRef.current) {
      trackRef.current.scrollLeft = 0;
    }
  }, [liveSignature]);

  useEffect(() => {
    const track = trackRef.current;
    const sentinel = sentinelRef.current;
    if (!track || !sentinel) return;

    // Observed against the horizontally-scrolling track itself (not the
    // viewport): the default root only tracks vertical page scroll, so it
    // never fires while the user scrolls sideways within this row.
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0]?.isIntersecting) {
          setVisibleCount(c => Math.min(c + BATCH_SIZE, sortedItems.length));
        }
      },
      { root: track, rootMargin: "0px 600px 0px 0px" }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [sortedItems.length]);

  const preview = sortedItems.slice(0, visibleCount);
  const useModal = cat.layout !== "circle";

  return (
    <div className="like-category">
      <div className="like-cat-head">
        <div className="like-cat-head-text">
          <span className="like-cat-en">{cat.en}</span>
          <h2 className="like-cat-title">{cat.label}</h2>
        </div>
        <Link className="like-expand-btn" href={`/likes/${cat.key}`}>
          查看更多 →
        </Link>
      </div>
      <div className="likes-track" ref={trackRef} data-lenis-prevent-wheel>
        {preview.map(l => (
          <LikeCard
            l={l}
            carousel
            layout={cat.layout}
            key={`${cat.key}-${l.href ?? l.title}`}
            onClick={useModal ? () => setSelectedLike(l) : undefined}
            live={l.href ? liveMap[l.href] : undefined}
          />
        ))}
        {visibleCount < sortedItems.length && <div ref={sentinelRef} className="likes-track-sentinel" aria-hidden />}
      </div>
      {useModal && selectedLike && <LikeModalShell like={selectedLike} onClose={() => setSelectedLike(null)} />}
    </div>
  );
}
