"use client";

import { useTheme } from "./ThemeProvider";

export default function GithubContributionCard() {
  const { theme } = useTheme();

  return (
    <div className="card card-github">
      <img
        className="card-github-img"
        src={`/assets/github-user-contribution-${theme}.svg`}
        alt="GitHub contribution graph"
      />
    </div>
  );
}
