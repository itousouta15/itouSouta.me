"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { chapterBackLink, nextChapter } from "../../lib/navigation";

function Arrow({ right = false }: { right?: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={right ? "M5 12h14" : "M19 12H5"} />
      <path d={right ? "m12 5 7 7-7 7" : "m12 19-7-7 7-7"} />
    </svg>
  );
}

export default function ChapterNavigation() {
  const pathname = usePathname();
  if (pathname === "/") return null;
  const next = nextChapter(pathname);
  const back = chapterBackLink(pathname);
  return (
    <nav className="chapter-navigation" aria-label="章節導覽">
      <div className="chapter-links">
        <Link className="chapter-link" href={back.href}>
          <Arrow />
          <span>
            <small>{back.caption}</small>
            <strong>{back.label}</strong>
          </span>
        </Link>
        {next && (
          <Link className="chapter-link chapter-next" href={next.href}>
            <span>
              <small>下一章</small>
              <strong>{next.label}</strong>
            </span>
            <Arrow right />
          </Link>
        )}
      </div>
    </nav>
  );
}
