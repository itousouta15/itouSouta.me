"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function WritingBackLink() {
  const current = useSearchParams();
  const params = new URLSearchParams();
  for (const key of ["q", "tag", "month"])
    if (current.get(key)) params.set(key, current.get(key)!);
  return (
    <Link
      className="back-link"
      aria-label="返回文章列表"
      title="返回文章列表"
      style={{ textDecoration: "none" }}
      href={"/writing" + (params.size ? `?${params}` : "")}
    >
      <span className="back-btn">←</span>
      <span className="back-label">返回文章列表</span>
    </Link>
  );
}
