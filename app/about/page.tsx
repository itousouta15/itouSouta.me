import type { Metadata } from "next";
import Link from "next/link";
import PageHead from "../components/PageHead";
import { LIKE_CATEGORIES, MUSIC_ARTISTS } from "../data";
import { likeThumb, cardBgThumb, artistAvatarThumb } from "../lib/imageThumb";
import { getTopTracks } from "../lib/spotify";
import { pageMetadata } from "../lib/seo";
import { site } from "../template/config";
import { available } from "../template/availability";

// Spotify「最近常聽」每小時重抓一次
export const revalidate = 3600;

const description = `${site.author.name} 的自我介紹。${site.author.introduction}`;

// ===== 卡片背景圖入口：想換背景改這兩行 =====
// 可填外部圖片網址，或把圖片放進 public/assets 後填 "/assets/分類/檔名.webp"
const INTEREST_BG = site.banner;
const MUSIC_BG = site.banner;

const ANIME_PREVIEW = (
  LIKE_CATEGORIES.find((c) => c.key === "anime")?.items ?? []
)
  .slice()
  .sort((a, b) => (b.personRating ?? 0) - (a.personRating ?? 0))
  .slice(0, 6);

const MUSIC_PREVIEW = MUSIC_ARTISTS.filter((a) => a.avatar).slice(0, 4);

export const metadata: Metadata = pageMetadata({
  title: "關於我",
  description,
  path: "/about",
});

export default async function AboutPage() {
  const topAlbums = available.spotify
    ? await getTopTracks({ limit: 4, timeRange: "short_term" })
    : null;
  return (
    <section style={{ paddingBottom: 8 }}>
      <PageHead kicker="ABOUT" title="關於我" />
      <div className="about-grid">
        <div className="about-main">
          <div className="about-lead">我是 {site.author.name}</div>
          {site.author.about.map((paragraph) => (
            <p className="about-p" key={paragraph}>
              {paragraph}
            </p>
          ))}
          <div className="divider" />
          <div className="stat-grid">
            <div className="stat">
              <div className="stat-k">本名</div>
              <div className="stat-v">{site.author.name}</div>
            </div>
            <div className="stat">
              <div className="stat-k">別名</div>
              <div className="stat-v">{site.author.aliases.join(" / ")}</div>
            </div>
            <div className="stat">
              <div className="stat-k">生日</div>
              <div className="stat-v mono">{site.author.birthday}</div>
            </div>
          </div>
        </div>
        <div className="about-side">
          <img
            src={site.banner}
            sizes="400px"
            width={400}
            height={150}
            alt=""
          />
          <div className="about-side-body">
            <div className="label">座右銘</div>
            <div className="about-side-quote">{site.quote}</div>
          </div>
        </div>
        <Link href="/likes/anime" className="mini-card mini-interest">
          <img
            className="mini-interest-bg"
            src={cardBgThumb(INTEREST_BG)}
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
          />
          <div className="mini-kicker">愛好</div>
          <div className="mini-interest-title">追番</div>
          <div className="mini-interest-stack">
            {ANIME_PREVIEW.slice(0, 4).map((item, i) => (
              <img
                key={item.title}
                className="mini-interest-stack-img"
                style={{ "--i": i } as React.CSSProperties}
                src={likeThumb(item.cover!)}
                alt={item.title}
                loading="lazy"
                decoding="async"
              />
            ))}
          </div>
          <span className="mini-arrow">↗</span>
        </Link>
        {available.spotify && (
          <Link href="/likes/music" className="mini-card mini-music">
            <img
              className="mini-interest-bg"
              src={cardBgThumb(MUSIC_BG)}
              alt=""
              aria-hidden="true"
              loading="lazy"
              decoding="async"
            />
            <div className="mini-kicker">
              {topAlbums ? "愛好 · 最近常聽" : "愛好"}
            </div>
            <div className="mini-interest-title">音樂</div>
            <div className="mini-music-avatars">
              {topAlbums
                ? topAlbums.map((t, i) => (
                    <img
                      key={t.href || t.title}
                      className="mini-music-avatar mini-music-avatar--track"
                      style={{ "--i": i } as React.CSSProperties}
                      src={t.cover}
                      alt={t.title}
                      title={`${t.title} — ${t.artist}`}
                      loading="lazy"
                      decoding="async"
                    />
                  ))
                : MUSIC_PREVIEW.map((a, i) => (
                    <img
                      key={a.name}
                      className="mini-music-avatar"
                      style={{ "--i": i } as React.CSSProperties}
                      src={artistAvatarThumb(a.avatar!)}
                      alt={a.name}
                      loading="lazy"
                      decoding="async"
                    />
                  ))}
            </div>
            <span className="mini-arrow">↗</span>
          </Link>
        )}
      </div>
    </section>
  );
}
