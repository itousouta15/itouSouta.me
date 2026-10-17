"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { projectSearchPath } from "../../lib/projectRoutes";

export default function ProjectBackLink() {
  const searchParams = useSearchParams();
  return (
    <Link
      href={projectSearchPath(searchParams.get("q") ?? "")}
      className="back-link"
      aria-label="返回上一頁"
      title="返回上一頁"
      style={{ textDecoration: "none" }}
    >
      <span className="back-btn">←</span>
      <span className="back-label">返回上一頁</span>
    </Link>
  );
}
