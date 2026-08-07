import type { Metadata } from "next";
import PageHead from "../components/PageHead";
import { THOUGHTS } from "../data";
import { getBlogPosts } from "../lib/blogFeed";
import { getMergedThoughts } from "../lib/mergedThoughts";

const description = "itouSouta 寫過的文章與雜談 φ(*￣0￣)";

export const metadata: Metadata = {
  title: "文章與雜談",
  description,
  alternates: { canonical: "/writing" },
  openGraph: {
    title: "文章與雜談 | itousouta.me",
    description,
    url: "/writing",
  },
  twitter: { title: "文章與雜談 | itousouta.me", description },
};

export const revalidate = 3600;

/* 文章（blog.itousouta.me 的站內索引）與雜談（Threads / GitHub / Discord / KV
   同步牆）合成一頁。文章卡片沿用 .thought-item：有 hover 位移、已在 glass 名單。
   兩區共用 PageHead 底下的 .card-kicker + .divider 分節。 */
export default async function WritingPage() {
  const [posts, items] = await Promise.all([
    getBlogPosts(),
    getMergedThoughts(),
  ]);
  const useRemote = items.length > 0;

  return (
    <section>
      <PageHead
        kicker="WRITING"
        title="文章與雜談"
        desc="itouBLoGa · Threads · GitHub · Discord"
      />

      <div className="card-kicker">BLOG</div>
      <div className="divider" />
      {posts.length > 0 ? (
        <div className="blog-list">
          {posts.map((post) => (
            <a
              className="thought-item"
              key={post.id}
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "block", color: "inherit" }}
            >
              <div className="thought-meta">
                <span className="thought-date">{post.date}</span>
                {post.category && (
                  <span className="thought-tag">{post.category}</span>
                )}
              </div>
              <p className="thought-text">{post.title}</p>
              {post.excerpt && <p className="blog-excerpt">{post.excerpt}</p>}
            </a>
          ))}
        </div>
      ) : (
        <div className="blog-empty">
          <div className="blog-empty-title">暫時拿不到文章</div>
          <div className="blog-empty-sub">
            直接去 blog.itousouta.me 看看吧 (´･ω･`)
          </div>
        </div>
      )}

      <div className="card-kicker" style={{ marginTop: 28 }}>
        THOUGHTS
      </div>
      <div className="divider" />
      <div className="thoughts-list">
        {useRemote
          ? items.map((item) => (
              <div className="thought-item" key={item.id}>
                <div className="thought-meta">
                  <span className="thought-date">{item.date}</span>
                  {item.kind === "threads" && item.permalink && (
                    <a
                      className="thought-tag"
                      href={item.permalink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Threads ↗
                    </a>
                  )}
                  {item.kind === "discord" && (
                    <span className="thought-tag">Discord</span>
                  )}
                  {item.kind === "github" && (
                    <a
                      className="thought-tag"
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      GitHub ↗
                    </a>
                  )}
                </div>
                {item.text && <p className="thought-text">{item.text}</p>}
                {item.kind === "threads" && item.media_url && (
                  <img
                    className="thought-img"
                    src={item.media_url}
                    alt=""
                    loading="lazy"
                  />
                )}
              </div>
            ))
          : [...THOUGHTS].reverse().map((t, i) => (
              <div className="thought-item" key={i}>
                <div className="thought-meta">
                  <span className="thought-date">{t.date}</span>
                  {t.tag && <span className="thought-tag">{t.tag}</span>}
                </div>
                <p className="thought-text">{t.text}</p>
              </div>
            ))}
      </div>
    </section>
  );
}
