import type { Metadata } from "next";
import PageHead from "../components/PageHead";
import { LIKES } from "../data";

export const metadata: Metadata = { title: "喜歡的東西 | itouSouta.tw" };

export default function LikesPage() {
  return (
    <section className="fade-in" style={{ paddingBottom: 8 }}>
      <PageHead kicker="LIKES" title="喜歡的東西" />
      <div className="likes-grid">
        {LIKES.map(l => (
          <div className="like-card" key={l.title}>
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
    </section>
  );
}
