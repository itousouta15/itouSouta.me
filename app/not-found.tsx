import type { Metadata } from "next";
import Link from "next/link";
import NotFoundCode from "./components/NotFoundCode";

const description = "這個頁面不知道飛去哪裡了 (´；ω；`)";

export const metadata: Metadata = {
  title: "404",
  description,
};

export default function NotFound() {
  return (
    <section className="notfound">
      <NotFoundCode />
      <p className="notfound-msg">{description}</p>
      <p className="notfound-sub">你要找的頁面不存在，或是已經搬家了</p>
      <div className="notfound-actions">
        <Link className="btn-primary" href="/" style={{ textDecoration: "none" }}>
          回首頁 <span className="btn-arrow dark">→</span>
        </Link>
      </div>
    </section>
  );
}
