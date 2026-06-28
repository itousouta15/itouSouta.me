import type { Metadata } from "next";
import PageHead from "../components/PageHead";
import { LIKE_CATEGORIES } from "../data";

export const metadata: Metadata = { title: "喜歡的東西 | itouSouta.tw" };

export default function LikesPage() {
  return (
    <section className="fade-in" style={{ paddingBottom: 8 }}>
      <PageHead kicker="LIKES" title="喜歡的東西" />
      {LIKE_CATEGORIES.map(cat => (
        <div className="like-category" key={cat.key}>
          <div className="like-cat-head">
            <span className="like-cat-en">{cat.en}</span>
            <h2 className="like-cat-title">{cat.label}</h2>
          </div>
          <div className="likes-grid">
            {cat.items.map((l, i) => (
              <div className="like-card" key={`${cat.key}-${i}`}>
                <div className="like-thumb">
                  <span>IMAGE</span>
                </div>
                <div className="like-body">
                  <div className="like-title">{l.title}</div>
                  <div className="like-sub">{l.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
