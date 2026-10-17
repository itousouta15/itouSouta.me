"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  src: string;
  alt: string;
  className?: string;
  title?: string;
  width?: number;
  height?: number;
  srcSet?: string;
  sizes?: string;
  loading?: "eager" | "lazy";
}

/** Progressive enhancement: plain images remain visible without JavaScript.
 * Reveal once, only after both loading and entering the viewport. */
export default function BlogPreviewImage({
  className = "",
  loading = "lazy",
  ...props
}: Props) {
  const image = useRef<HTMLImageElement>(null);
  const [enhanced, setEnhanced] = useState(false);
  const [loaded, setLoaded] = useState("");
  const [seen, setSeen] = useState("");
  useEffect(() => {
    const element = image.current;
    if (!element) return;
    setEnhanced(true);
    if (element.complete && element.naturalWidth > 0) setLoaded(props.src);
    if (!("IntersectionObserver" in window)) {
      setSeen(props.src);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(props.src);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -16px 0px" }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [props.src]);
  return (
    <img
      {...props}
      alt={props.alt}
      ref={image}
      className={`blog-preview-image ${className}`}
      loading={loading}
      decoding="async"
      data-enhanced={enhanced}
      data-ready={loaded === props.src && seen === props.src}
      onLoad={() => setLoaded(props.src)}
      onError={() => {
        setLoaded(props.src);
        setSeen(props.src);
      }}
    />
  );
}
