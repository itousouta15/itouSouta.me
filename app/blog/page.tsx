import type { Metadata } from "next";
import PageHead from "../components/PageHead";
import { getBlogPosts } from "../lib/blogFeed";

const description = "itouSouta 寫過的文章 φ(*￣0￣)";

export const metadata: Metadata = {
  title: "部落格",
  description,
  alternates: { canonical: "/blog" },
  openGraph: { title: "部落格 | itousouta.me", description, url: "/blog" },
  twitter: { title: "部落格 | itousouta.me", description },
};

export const revalidate = 3600;

/* 文章本體在 blog.itousouta.me（獨立的 Hexo 專案），這頁只是站內索引，點下去
   還是導去部落格。版型沿用 .thought-item 那組卡片：已經有 hover 位移，也已經在
   globals.css 的 glass backdrop-filter 名單裡，玻璃模式不用另外處理。 */
export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <section style={{ paddingBottom: 8 }}>
      <PageHead
        kicker="BLOG"
        title="一些文章"
        desc="itouBLoGa · blog.itousouta.me"
      />
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
    </section>
  );
}
