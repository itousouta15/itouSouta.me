"use client";

import { useEffect, useRef, useState } from "react";
import {
  CONTRIBUTION_USER,
  readContributionDays,
  type ContributionDay,
} from "../../lib/contributions";
import ContributionCalendar from "./ContributionCalendar";

let cached: { days: ContributionDay[]; expires: number } | null = null;

export default function GithubContributionCard() {
  const cardRef = useRef<HTMLElement>(null);
  const [nearby, setNearby] = useState(false);
  const [running, setRunning] = useState(false);
  const [days, setDays] = useState<ContributionDay[] | null>(null);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    let intersecting = false;
    const sync = () =>
      setRunning(intersecting && document.visibilityState === "visible");
    const observer = new IntersectionObserver(([entry]) => {
      intersecting = entry.isIntersecting;
      sync();
    });
    const loader = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNearby(true);
          loader.disconnect();
        }
      },
      { rootMargin: "250px" }
    );
    observer.observe(card);
    loader.observe(card);
    document.addEventListener("visibilitychange", sync);
    return () => {
      observer.disconnect();
      loader.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  useEffect(() => {
    if (!nearby) return;
    if (cached && cached.expires > Date.now()) {
      setDays(cached.days);
      return;
    }
    const controller = new AbortController();
    let current = true;
    const timeout = window.setTimeout(() => controller.abort(), 15000);
    setError(false);
    fetch("/api/github-contributions", { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Unavailable");
        return response.json();
      })
      .then((value) => {
        const result = readContributionDays(value);
        if (current) {
          cached = { days: result, expires: Date.now() + 3600000 };
          setDays(result);
        }
      })
      .catch(() => {
        if (current) setError(true);
      })
      .finally(() => window.clearTimeout(timeout));
    return () => {
      current = false;
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [nearby, attempt]);

  return (
    <section
      ref={cardRef}
      className="card card-github"
      data-running={running}
      aria-label="GitHub 貢獻"
      aria-busy={!days && !error}
    >
      <a
        className="github-calendar-heading"
        href={`https://github.com/${CONTRIBUTION_USER}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        GitHub · {CONTRIBUTION_USER}
        <span aria-hidden="true">↗</span>
      </a>
      {days ? (
        <ContributionCalendar days={days} />
      ) : (
        <div className="github-calendar-state" role="status">
          {error ? (
            <>
              暫時無法取得 GitHub 貢獻資料
              <button
                type="button"
                className="btn-ghost"
                onClick={() => {
                  setError(false);
                  setAttempt((n) => n + 1);
                }}
              >
                重新載入 ↻
              </button>
            </>
          ) : (
            "載入 GitHub 貢獻資料中…"
          )}
        </div>
      )}
    </section>
  );
}
