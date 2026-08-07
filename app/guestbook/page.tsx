import type { Metadata } from "next";
import dynamic from "next/dynamic";
import PageHead from "../components/PageHead";

const Guestbook = dynamic(() => import("../components/Guestbook"), {
  ssr: false,
});

const description = "在這裡留下一句話 (｡･ω･｡)";

export const metadata: Metadata = {
  title: "留言板",
  description,
  alternates: { canonical: "/guestbook" },
  openGraph: {
    title: "留言板 | itousouta.me",
    description,
    url: "/guestbook",
  },
  twitter: { title: "留言板 | itousouta.me", description },
};

export default function GuestbookPage() {
  return (
    <section style={{ paddingBottom: 8 }}>
      <PageHead
        kicker="GUESTBOOK"
        title="留言板"
        desc="Powered by Waline · 與部落格同一套後端"
      />
      <Guestbook />
    </section>
  );
}
