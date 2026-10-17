"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { projectSearchPath } from "../../lib/projectRoutes";

export default function ProjectBackLink() {
  const searchParams = useSearchParams();
  return (
    <Link
      href={projectSearchPath(searchParams.get("q") ?? "")}
      className="project-back-link"
    >
      ← 返回專案列表
    </Link>
  );
}
