import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata, SITE_DESCRIPTION } from "./lib/seo";
import { ROLES, TILE_COLS } from "./data";
import TileIcon from "./components/TileIcon";
import { TILE_ICON_META } from "./components/tileIconMeta";
import GithubGlyph from "./components/GithubGlyph";
import GithubContributionCard from "./components/home/GithubContributionCard";
import {
  LanyardProvider,
  ProfileStatus,
  ProfileStatusDot,
} from "./components/status/LanyardCards";
import HeroFace from "./components/home/HeroFace";
import HomeQuoteFont from "./components/home/HomeQuoteFont";
import BadgeShape from "./components/home/BadgeShape";
import NameRotator from "./components/home/NameRotator";
import DecorativeImage from "./components/DecorativeImage";
import ViewportAnimations from "./components/home/ViewportAnimations";
import VisitorImpressionsCard from "./components/home/VisitorImpressionsCard";
import { site } from "./template/config";
import { available } from "./template/availability";

/* The homepage title is absolute so the layout does not append the brand again. */
export const metadata: Metadata = pageMetadata({
  title: `${site.author.name} 的個人網站`,
  description: SITE_DESCRIPTION,
  path: "/",
  absolute: true,
});

export default function HomePage() {
  return (
    <LanyardProvider>
      <HomeQuoteFont />
      <HomeContent />
    </LanyardProvider>
  );
}

function HomeContent() {
  const tileIcons = TILE_COLS.flat();
  const tileRows = {
    upper: tileIcons.filter((_, i) => i % 2 === 0),
    lower: tileIcons.filter((_, i) => i % 2 === 1),
  };

  return (
    <section className="home-grid">
      {/* Profile card */}
      <aside className="profile">
        <div className="profile-card">
          <div className="profile-banner">
            <img
              src={site.banner}
              sizes="400px"
              width={400}
              height={150}
              alt=""
              fetchPriority="high"
              decoding="async"
            />
          </div>
          <div className="profile-body">
            <div className="avatar-row">
              <div className="avatar-wrap">
                <img
                  className="avatar"
                  src={site.avatar}
                  alt={site.author.name}
                />
                {available.discord && <ProfileStatusDot />}
              </div>
              <div className="badges">
                <BadgeShape kind="circle" color="var(--blue)" />
                <BadgeShape kind="triangle" color="var(--purple)" />
                <BadgeShape kind="square" color="var(--dim)" />
                <BadgeShape kind="diamond" color="var(--blue)" />
              </div>
            </div>
            <div className="name-row">
              <span className="name">{site.author.name}</span>
              <span className="sr-only"> · </span>
              <span className="alias">{site.author.aliases[0]}</span>
            </div>
            <div className="handle">{site.author.handle}</div>
            {available.discord && <ProfileStatus />}
            <div className="divider" />
            <div className="label">關於我</div>
            <div className="field">{site.author.introduction}</div>
            <div className="label mt16">身分組</div>
            <div className="roles">
              <div className="role-row">
                {ROLES.filter((r) => r.color === "blue").map((r) => (
                  <span className="role-chip" key={r.label}>
                    <span className={`role-dot ${r.color}`} />
                    {r.label}
                  </span>
                ))}
              </div>
              <div className="role-row">
                {ROLES.filter((r) => r.color === "purple").map((r) => (
                  <span className="role-chip" key={r.label}>
                    <span className={`role-dot ${r.color}`} />
                    {r.label}
                  </span>
                ))}
              </div>
            </div>
            <div className="label mt16">成為成員時間</div>
            <div className="field">{site.author.joined}</div>
          </div>
        </div>
      </aside>

      {/* Right column */}
      <div className="right-col">
        {/* Hero card */}
        <ViewportAnimations className="card hero">
          <div className="hero-main">
            <div className="hero-greet">{site.greeting}</div>
            <h1 className="hero-title">
              I&apos;m <NameRotator />
            </h1>
            <div className="hero-sub">{site.author.introduction}</div>
            <div className="hero-actions">
              <Link
                className="btn-primary"
                href="/about"
                style={{ textDecoration: "none" }}
              >
                關於我 <span className="btn-arrow dark">→</span>
              </Link>
              <Link
                className="btn-ghost"
                href="/writing"
                style={{ textDecoration: "none" }}
              >
                BLOG <span className="btn-arrow inset">→</span>
              </Link>
            </div>
          </div>
          <div className="hero-side">
            <HeroFace />
          </div>
        </ViewportAnimations>

        {/* Quote + tiles strip */}
        <ViewportAnimations className="card quote-card">
          <div className="quote-main">
            <div className="quote-text">{site.quote}</div>
          </div>
          <div className="tiles-strip">
            {Object.entries(tileRows).map(([row, icons]) => (
              <div className={`tiles-row tiles-row-${row}`} key={row}>
                {[0, 1].map((g) => (
                  <div
                    className="tiles-row-group"
                    key={g}
                    aria-hidden={g === 1 ? true : undefined}
                  >
                    {icons.map((icon, i) => (
                      <div key={`${row}-${i}`} className="tile">
                        <TileIcon kind={icon} />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="quote-tech-panel" aria-label="technology icons">
            {tileIcons.map((icon) => (
              <div className="quote-tech-item" key={icon}>
                <span className="quote-tech-icon">
                  {/* 尺寸走 prop：TileIcon 把寬高寫成 inline style，用 CSS 蓋
                      得加 !important（手機版那條就是，見 globals.css） */}
                  <TileIcon kind={icon} size={18} />
                </span>
                <span className="quote-tech-name">
                  {TILE_ICON_META[icon]?.label ?? icon}
                </span>
              </div>
            ))}
          </div>
        </ViewportAnimations>

        {/* Visitor impressions */}
        {available.impressions && <VisitorImpressionsCard />}

        {/* Bento: nav cards */}
        <div className="bento">
          <Link
            className="bento-thoughts nav-card"
            href="/writing?view=thoughts"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div>
              <div className="card-kicker">WRITING</div>
              <div className="nav-card-title">碎碎念</div>
            </div>
            <span className="nav-card-ghost" aria-hidden>
              念
            </span>
            <span className="nav-card-arrow">↗</span>
          </Link>

          <Link
            className="bento-likes card-likes"
            href="/likes"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <DecorativeImage
              className="card-likes-img"
              src={site.banner}
              loading="eager"
              fetchPriority="high"
            />
            <div className="card-body">
              <div className="card-kicker">LIKES</div>
              <div className="card-title-lg">
                喜歡
                <br />
                的東西
              </div>
            </div>
            <span className="card-arrow-lg">↗</span>
          </Link>

          <Link
            className="bento-friends nav-card"
            href="/links"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div>
              <div className="card-kicker">LINKS</div>
              <div className="nav-card-title">友鏈</div>
            </div>
            <span className="nav-card-ghost" aria-hidden>
              友
            </span>
            <span className="nav-card-arrow">↗</span>
          </Link>

          <Link
            className="bento-experience nav-card"
            href="/experience"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div>
              <div className="card-kicker">JOURNEY</div>
              <div className="nav-card-title">經歷</div>
            </div>
            <span className="nav-card-ghost" aria-hidden>
              歷
            </span>
            <span className="nav-card-arrow">↗</span>
          </Link>

          <Link
            className="bento-projects card-projects"
            href="/projects"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <GithubGlyph className="card-projects-glyph" fill="var(--tx)" />
            <div className="card-body-sm">
              <div className="card-kicker">PROJECTS</div>
              <div className="card-title-md">一些專案們</div>
            </div>
            <span className="card-arrow-sm">↗</span>
          </Link>
        </div>

        {/* GitHub contribution graph */}
        {available.github && <GithubContributionCard />}
      </div>
    </section>
  );
}
