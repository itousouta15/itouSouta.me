"use client";

import { useRef } from "react";
import { useTheme } from "./ThemeProvider";
import { useScrollLinkedHorizontalReveal } from "../hooks/useScrollLinkedHorizontalReveal";
import DecorativeImage from "./DecorativeImage";

export default function GithubContributionCard() {
  const { theme } = useTheme();
  const cardRef = useRef<HTMLDivElement>(null);
  useScrollLinkedHorizontalReveal(cardRef);

  return (
    <div ref={cardRef} className="card card-github">
      <DecorativeImage
        className="card-github-img"
        src={`/assets/social/github-user-contribution-${theme}.svg`}
        title="GitHub contribution graph"
      />
    </div>
  );
}
