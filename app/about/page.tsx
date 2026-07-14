import type { Metadata } from "next";
import Link from "next/link";
import PageHead from "../components/PageHead";
import { LIKE_CATEGORIES, MUSIC_ARTISTS } from "../data";
import { likeThumb, cardBgThumb, artistAvatarThumb } from "../lib/imageThumb";
import { getTopAlbums } from "../lib/lastfm";

// Last.fm「最近常聽」每小時重抓一次
export const revalidate = 3600;

const description = "itouSouta 的自我介紹 (*´з｀*)";

// ===== 卡片背景圖入口：想換背景改這兩行 =====
// 可填外部圖片網址，或把圖片放進 public/assets 後填 "/assets/檔名.webp"
const INTEREST_BG = "/assets/neko.webp";
const MUSIC_BG = "/assets/nacho.webp";

const ANIME_PREVIEW = (LIKE_CATEGORIES.find(c => c.key === "anime")?.items ?? [])
  .slice()
  .sort((a, b) => (b.personRating ?? 0) - (a.personRating ?? 0))
  .slice(0, 6);

const MUSIC_PREVIEW = MUSIC_ARTISTS.filter(a => a.avatar).slice(0, 4);

export const metadata: Metadata = {
  title: "關於我",
  description,
  alternates: { canonical: "/about" },
  openGraph: { title: "關於我 | itousouta.me", description, url: "/about" },
  twitter: { title: "關於我 | itousouta.me", description },
};

export default async function AboutPage() {
  const topAlbums = await getTopAlbums();
  return (
    <section style={{ paddingBottom: 8 }}>
      <PageHead kicker="ABOUT" title="關於我" />
      <div className="about-grid">
        <div className="about-main">
          <div className="about-lead">ciallo～ 我是 itouSouta</div>
          <p className="about-p">
            一個喜歡 VOCALOID 和畫插畫的怪人。 會做點術曲和畫點插畫插畫，偶爾寫點程式/ᐠ｡ꞈ｡ᐟ\
          </p>
          <p className="about-p">
            嗯....我也想把自己說的好像很厲害，但感覺這樣蠻家豪的。反正我就是一個無聊的高中生
          </p>
          <p className="about-p">
            目前是臺中市立大里高中的學生，同時擔任校內資訊校隊隊長，也是第五屆 SCAICT 中電會會長。平常喜歡到處跑，順便認識一堆電到爆的人們
          </p>
          <p className="about-p">
            除了寫程式之外，對資安也稍微有點興趣。座右銘是「情熱を失っては、何もできない」，希望自己能一直保持這份熱情，把想做的事情一件一件做出來
          </p>
          <div className="divider" />
          <div className="stat-grid">
            <div className="stat">
              <div className="stat-k">本名</div>
              <div className="stat-v">郭家睿</div>
            </div>
            <div className="stat">
              <div className="stat-k">別名</div>
              <div className="stat-v">伊藤蒼太</div>
            </div>
            <div className="stat">
              <div className="stat-k">生日</div>
              <div className="stat-v mono">2009/01/15</div>
            </div>
          </div>
        </div>
        <div className="about-side">
          <img src="/assets/banner.webp" alt="" />
          <div className="about-side-body">
            <div className="label">座右銘</div>
            <div className="about-side-quote">情熱を失っては、何もできない。</div>
          </div>
        </div>
        <Link href="/likes/anime" className="mini-card mini-interest">
          <img className="mini-interest-bg" src={cardBgThumb(INTEREST_BG)} alt="" aria-hidden="true" loading="lazy" decoding="async" />
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
        <Link href="/likes/music" className="mini-card mini-music">
          <img className="mini-interest-bg" src={cardBgThumb(MUSIC_BG)} alt="" aria-hidden="true" loading="lazy" decoding="async" />
          <div className="mini-kicker">{topAlbums ? "愛好 · 最近常聽" : "愛好"}</div>
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
      </div>
    </section>
  );
}
