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
import { available } from "../template/availability";
import { features, site } from "../template/config";

export const metadata: Metadata = pageMetadata({
  title: "文章與碎碎念",
  description: `${site.author.name} 的文章與生活紀錄。`,
  path: "/writing",
});
export const revalidate = 3600;

async function Thoughts() {
  const [items, counts] = await Promise.all([
    getMergedThoughts().catch(() => []),
    available.reactions ? getReactionCounts().catch(() => null) : null,
  ]);
  return (
    <>
      <p className="writing-thoughts-description">
        {features.liveThoughts || features.threads || features.github
          ? "近期動態"
          : "記錄生活中的片刻"}
      </p>
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
                prefetch={post.prefetch}
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
