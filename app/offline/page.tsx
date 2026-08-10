import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "離線",
  robots: { index: false, follow: false },
};

export default function OfflinePage() {
  return (
    <section className="offline-page">
      <div className="card-kicker">OFFLINE</div>
      <h1 className="offline-title">你現在是離線狀態</h1>
      <p className="offline-sub">連上網路後重新整理就能繼續逛了 (´･ω･`)</p>
      <a
        className="btn-primary"
        href="/"
        style={{
          textDecoration: "none",
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        重新整理 <span className="btn-arrow dark">→</span>
      </a>
    </section>
  );
}
