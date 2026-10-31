import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { notFound, permanentRedirect } from "next/navigation";
import { blogImage, getAllPosts, getPostBySlug } from "../../lib/posts";
import { pageMetadata, SITE_URL } from "../../lib/seo";
import BlogMarkdown from "../../components/writing/BlogMarkdown";
import WritingBackLink from "../../components/writing/WritingBackLink";
import GuestbookSection from "../../components/guestbook/GuestbookSection";
import BlogPreviewImage from "../../components/writing/BlogPreviewImage";
import ArticleToc from "../../components/writing/ArticleToc";

export function generateStaticParams() {
  return getAllPosts(true).map((post) => ({ slug: post.slug }));
}
export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();
  const metadata = pageMetadata({
    title: post.title,
    description: post.description,
    path: post.path,
  });
  return {
    ...metadata,
    ...(post.unlisted ? { robots: { index: false, follow: false } } : {}),
    alternates: {
      canonical: post.path,
      ...(!post.unlisted && {
        languages: {
          "zh-TW": post.path,
          ...Object.fromEntries(
            Object.entries(post.translations).map(([locale, url]) => [
              locale,
              url,
            ])
          ),
        },
        types: { "application/rss+xml": "/writing/feed.xml" },
      }),
    },
    openGraph: {
      ...metadata.openGraph,
      type: "article",
      ...(post.timestamp <= Date.now() ? { publishedTime: post.dateISO } : {}),
      authors: [SITE_URL],
      tags: post.tags,
      images: post.cover ? [{ url: post.cover, alt: post.title }] : undefined,
    },
    twitter: {
      ...metadata.twitter,
      images: post.cover ? [post.cover] : undefined,
    },
  };
}

export default function PostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();
  if (post.slug !== params.slug) permanentRedirect(post.path);
  const cover = blogImage(post.originalCover);
  const posts = getAllPosts();
  const index = posts.findIndex((item) => item.slug === post.slug);
  const previous = index >= 0 ? posts[index - 1] : undefined;
  const next = index >= 0 ? posts[index + 1] : undefined;
  const article = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    url: SITE_URL + post.path,
    mainEntityOfPage: SITE_URL + post.path,
    inLanguage: "zh-Hant",
    author: { "@type": "Person", name: "itouSouta / 伊藤蒼太", url: SITE_URL },
    ...(post.timestamp <= Date.now() ? { datePublished: post.dateISO } : {}),
    ...(post.updated ? { dateModified: post.updated } : {}),
    image: post.cover ? SITE_URL + post.cover : undefined,
    wordCount: post.wordCount,
  };
  return (
    <article className="blog-article" lang="zh-Hant">
      {!post.unlisted && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(article).replace(/</g, "\\u003c"),
          }}
        />
      )}
      <Suspense
        fallback={
          <Link
            className="back-link"
            aria-label="返回文章列表"
            title="返回文章列表"
            style={{ textDecoration: "none" }}
            href="/writing"
          >
            <span className="back-btn">←</span>
            <span className="back-label">返回文章列表</span>
          </Link>
        }
      >
        <WritingBackLink />
      </Suspense>
      <header className="blog-article-header">
        <div className="page-kicker">ITOUBLOGA</div>
        <h1>{post.title}</h1>
        <p>{post.description}</p>
        {post.cover && (
          <div className="blog-article-cover-frame">
            <BlogPreviewImage
              className="blog-article-cover"
              src={post.cover}
              alt=""
              width={cover?.width ?? 960}
              height={cover?.height ?? 540}
              loading="eager"
              srcSet={
                cover?.variants
                  .map((variant) => `${variant.src} ${variant.width}w`)
                  .join(", ") || undefined
              }
              sizes="(max-width: 760px) calc(100vw - 40px), 1200px"
            />
          </div>
        )}
      </header>
      <div className="blog-article-layout">
        <aside
          className="blog-article-sidebar"
          aria-label="文章資訊與目錄"
          data-lenis-prevent
        >
          <dl className="blog-article-meta">
            <div>
              <dt>發布時間</dt>
              <dd>
                <time dateTime={post.dateISO}>{post.date}</time>
                {post.pinned && <span className="blog-pinned">置頂</span>}
              </dd>
            </div>
            <div>
              <dt>閱讀</dt>
              <dd>
                {post.wordCount.toLocaleString("zh-TW")} 字 ·{" "}
                {post.readingMinutes} 分鐘
              </dd>
            </div>
            <div>
              <dt>分類與標籤</dt>
              <dd className="writing-card-tags">
                {post.categories.map((item) => (
                  <span key={item}>{item}</span>
                ))}
                {post.tags.map((item) => (
                  <Link
                    href={`/writing?tag=${encodeURIComponent(item)}`}
                    key={item}
                  >
                    #{item}
                  </Link>
                ))}
              </dd>
            </div>
          </dl>
          {Object.keys(post.translations).length > 0 && (
            <nav className="blog-translations" aria-label="其他語言版本">
              <span>其他語言</span>
              {Object.entries(post.translations).map(([locale, url]) => (
                <a href={url} hrefLang={locale} key={locale}>
                  {locale === "en" ? "English" : "日本語"} ↗
                </a>
              ))}
            </nav>
          )}
          <ArticleToc headings={post.headings} />
        </aside>
        <div className="blog-article-content">
          <BlogMarkdown
            content={post.content}
            deferredHighlight={post.deferredHighlight}
          />
          <nav className="blog-adjacent" aria-label="上一篇與下一篇">
            {previous ? (
              <Link href={previous.path}>
                <small>上一篇</small>
                <strong>← {previous.title}</strong>
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link href={next.path}>
                <small>下一篇</small>
                <strong>{next.title} →</strong>
              </Link>
            )}
          </nav>
        </div>
      </div>
      <GuestbookSection pagePath={post.path} />
    </article>
  );
}
