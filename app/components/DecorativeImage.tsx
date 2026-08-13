import type { CSSProperties } from "react";

type DecorativeImageProps = {
  className?: string;
  src: string;
  title?: string;
  style?: CSSProperties;
  loading?: "lazy" | "eager";
  fetchPriority?: "high" | "low";
};

/* 原本用 span + background-image 的裝飾圖，改成真 <img>：background-image 不在
   初始文件的可預載清單裡（Lighthouse 量到首頁 LCP 是 bento 大圖時無法加
   fetchpriority），換成 <img> 後 LCP 資源就能被瀏覽器提前發現。alt 空字串 +
   aria-hidden 保持純裝飾性，不進無障礙樹。 */
export default function DecorativeImage({
  className,
  src,
  title,
  style,
  loading = "lazy",
  fetchPriority,
}: DecorativeImageProps) {
  return (
    <img
      aria-hidden="true"
      className={className}
      title={title}
      src={src}
      alt=""
      loading={loading}
      fetchPriority={fetchPriority}
      decoding="async"
      style={style}
    />
  );
}
