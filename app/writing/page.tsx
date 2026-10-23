import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import PageHead from "../components/PageHead";
import ThoughtsList from "../components/thoughts/ThoughtsList";
import WritingHub from "../components/writing/WritingHub";
import { THOUGHTS } from "../data";
import { getPostSummaries } from "../lib/posts";
import { getMergedThoughts } from "../lib/mergedThoughts";
import { getReactionCounts } from "../lib/kv";
import { pageMetadata } from "../lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "文章與碎碎念",
  description:
    "itouSouta 的技術文章、CTF 題解與生活紀錄，還有來自 Threads、GitHub 與 Discord 的日常碎碎念。",
  path: "/writing",
});
export const revalidate = 3600;

async function Thoughts() {
  const [items, counts] = await Promise.all([
    getMergedThoughts().catch(() => []),
    getReactionCounts().catch(() => null),
  ]);
  return (
    <>
      <p className="writing-thoughts-description">Threads · GitHub · Discord</p>
      <ThoughtsList items={items} reactionCounts={counts} fallback={THOUGHTS} />
    </>
  );
}

export default function WritingPage() {
  const posts = getPostSummaries();
  return (
    <section>
      <PageHead
        kicker="WRITING"
        title="文章與碎碎念"
        desc="寫下學到的，也留住生活裡的片段。"
      />
      <Suspense
        fallback={
          <div className="writing-post-list">
            {posts.map((post) => (
              <Link
                className="writing-post-card writing-post-card--plain"
                href={post.path}
                key={post.slug}
              >
                <div className="writing-post-card-body">
                  <div className="writing-post-meta">
                    <time dateTime={post.dateISO}>{post.date}</time>
                    {post.pinned && <span>置頂</span>}
                    <span>{post.wordCount.toLocaleString("zh-TW")} 字</span>
                    <span>{post.readingMinutes} 分鐘</span>
                  </div>
                  <h2>{post.title}</h2>
                  <p>{post.description}</p>
                </div>
              </Link>
            ))}
          </div>
        }
      >
        <WritingHub posts={posts}>
          <Suspense fallback={<p role="status">載入碎碎念中…</p>}>
            <Thoughts />
          </Suspense>
        </WritingHub>
      </Suspense>
    </section>
  );
}
