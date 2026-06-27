import Link from "next/link";
import { ROLES, TILE_COLS } from "./data";
import TileIcon, { TILE_ICON_META } from "./components/TileIcon";
import GithubGlyph from "./components/GithubGlyph";

export default function HomePage() {
  const tileIcons = TILE_COLS.flat();
  const tileRows = {
    upper: tileIcons.filter((_, i) => i % 2 === 0),
    lower: tileIcons.filter((_, i) => i % 2 === 1),
  };

  return (
    <section className="home-grid fade-in">
      {/* Profile card */}
      <aside className="profile">
        <div className="profile-card">
          <div className="profile-banner">
            <img src="/assets/banner.png" alt="banner" />
          </div>
          <div className="profile-body">
            <div className="avatar-row">
              <div className="avatar-wrap">
                <img className="avatar" src="/assets/avatar.png" alt="avatar" />
                <span className="status-dot" />
              </div>
              <div className="badges">
                <span style={{ width: 12, height: 12, borderRadius: "50%", background: "var(--blue)" }} />
                <span style={{ width: 0, height: 0, borderLeft: "6px solid transparent", borderRight: "6px solid transparent", borderTop: "9px solid var(--purple)" }} />
                <span style={{ width: 11, height: 11, borderRadius: 3, background: "var(--dim)" }} />
                <span style={{ width: 11, height: 11, background: "var(--blue)", transform: "rotate(45deg)", borderRadius: 2 }} />
              </div>
            </div>
            <div className="name-row">
              <span className="name">郭家睿</span>
              <span className="alias">伊藤蒼太</span>
            </div>
            <div className="handle">itou.souta15 · 人間になりたい</div>
            <div className="divider" />
            <div className="label">關於我</div>
            <div className="field">好想睡覺 Zzzz</div>
            <div className="label mt16">身分組</div>
            <div className="roles">
              <div className="role-row">
                {ROLES.filter(r => r.color === "blue").map(r => (
                  <span className="role-chip" key={r.label}>
                    <span className={`role-dot ${r.color}`} />
                    {r.label}
                  </span>
                ))}
              </div>
              <div className="role-row">
                {ROLES.filter(r => r.color === "purple").map(r => (
                  <span className="role-chip" key={r.label}>
                    <span className={`role-dot ${r.color}`} />
                    {r.label}
                  </span>
                ))}
              </div>
            </div>
            <div className="label mt16">成為成員時間</div>
            <div className="field">2009/01/15</div>
          </div>
        </div>
      </aside>

      {/* Right column */}
      <div className="right-col">
        {/* Hero card */}
        <div className="card hero">
          <div className="hero-main">
            <div className="hero-greet">ciallo (∠·ω )⌒★</div>
                        <div className="hero-title">
              I&apos;m{" "}
              <span className="name-rotator" aria-label="itouSouta, 伊藤蒼太, 郭家睿">
                <span className="name-rotator-track">
                  <b>itouSouta</b>
                  <b>伊藤蒼太</b>
                  <b>郭家睿</b>
                  <b>itouSouta</b>
                </span>
              </span>
            </div>
            <div className="hero-sub">一個喜歡 VOCALOID 和畫插畫的怪人</div>
            <div className="hero-actions">
              <Link className="btn-primary" href="/about" style={{ textDecoration: "none" }}>
                關於我 <span className="btn-arrow dark">→</span>
              </Link>
              <a className="btn-ghost" href="https://blog.itousouta15.tw" target="_blank" rel="noopener nofollow noreferrer" style={{ textDecoration: "none" }}>
                BLOG <span className="btn-arrow inset">→</span>
              </a>
            </div>
          </div>
          <div className="hero-side">
            <div className="hero-face">= ᗜ ω ᗜ.=</div>
          </div>
        </div>

        {/* Quote + tiles strip */}
        <div className="card quote-card">
          <div className="quote-main">
            <div className="quote-text">
              情熱を失っては、
              <br />
              何もできない。
            </div>
          </div>
          <div className="tiles-strip">
            {Object.entries(tileRows).map(([row, icons]) => (
              <div className={`tiles-row tiles-row-${row}`} key={row}>
                {[0, 1].map(g => (
                  <div className="tiles-row-group" key={g} aria-hidden={g === 1 ? true : undefined}>
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
            {tileIcons.map(icon => (
              <div className="quote-tech-item" key={icon}>
                <span className="quote-tech-icon">
                  <TileIcon kind={icon} />
                </span>
                <span className="quote-tech-name">{TILE_ICON_META[icon]?.label ?? icon}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom nav cards */}
        <div className="bottom-row">
          <Link className="card-likes" href="/likes" style={{ textDecoration: "none", color: "inherit" }}>
            <img className="card-likes-img" src="/assets/art-miku.png" alt="" />
            <div className="card-likes-overlay" />
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

          <div className="right-stack">
            <Link className="card-projects" href="/projects" style={{ textDecoration: "none", color: "inherit" }}>
              <GithubGlyph className="card-projects-glyph" fill="var(--tx)" />
              <div className="card-body-sm">
                <div className="card-kicker">PROJECTS</div>
                <div className="card-title-md">
                  一些
                  <br />
                  專案們
                </div>
              </div>
              <span className="card-arrow-sm">↗</span>
            </Link>
            <Link className="card-blog" href="/blog" style={{ textDecoration: "none", color: "inherit" }}>
              <div>
                <div className="card-kicker">BLOG</div>
                <div className="card-blog-title">碎碎念</div>
              </div>
              <span style={{ fontSize: 18, color: "var(--dim)" }}>↗</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
