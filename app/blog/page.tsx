import type { Metadata } from "next";
import PageHead from "../components/PageHead";

export const metadata: Metadata = { title: "BLOG | itouSouta.tw" };

export default function BlogPage() {
  return (
    <section className="fade-in" style={{ paddingBottom: 8 }}>
      <PageHead kicker="BLOG" title="碎碎念" />
      <div className="blog-empty">
        <div className="blog-empty-title">施工中・Coming soon</div>
        <div className="blog-empty-sub">好想睡覺 Zzzz… 文章之後會放在這裡</div>
      </div>
      <div className="blog-list">
        <div className="blog-skeleton" style={{ opacity: 0.55 }}>
          <div className="thumb" />
          <div className="lines">
            <div className="bar" style={{ width: "55%" }} />
            <div className="bar sm" style={{ width: "80%" }} />
          </div>
        </div>
        <div className="blog-skeleton" style={{ opacity: 0.4 }}>
          <div className="thumb" />
          <div className="lines">
            <div className="bar" style={{ width: "45%" }} />
            <div className="bar sm" style={{ width: "70%" }} />
          </div>
        </div>
      </div>
    </section>
  );
}
