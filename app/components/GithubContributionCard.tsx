"use client";

import { useRef } from "react";
import { useTheme } from "./ThemeProvider";
import { useScrollLinkedHorizontalReveal } from "../hooks/useScrollLinkedHorizontalReveal";

export default function GithubContributionCard() {
  const { theme } = useTheme();
  const cardRef = useRef<HTMLDivElement>(null);
  useScrollLinkedHorizontalReveal(cardRef);

  return (
    <div ref={cardRef} className="card card-github">
      <img
        className="card-github-img"
        src={`/assets/github-user-contribution-${theme}.svg`}
        alt="GitHub contribution graph"
        width={880}
        height={192}
      />
    </div>
  );
}
