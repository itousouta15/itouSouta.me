import { MarkdownAsync, defaultUrlTransform } from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypePrettyCode from "rehype-pretty-code";
import { toString } from "hast-util-to-string";
import { visit } from "unist-util-visit";
import type { Root as HastRoot } from "hast";
import { remarkArticleHeadings } from "../../lib/blogMarkdown";
import { blogImage, blogImagePreview } from "../../lib/posts";
import CodeBlock from "./CodeBlock";
import BlogImage from "./BlogImage";

declare module "hast" {
  interface ElementData {
    /** Source text before syntax highlighting adds empty-line placeholders. */
    blogRawCode?: string;
  }
}

const externalImage = (src: string, width?: number) =>
  /^https?:\/\//.test(src)
    ? `https://wsrv.nl/?${new URLSearchParams({ url: src, output: "webp", ...(width ? { w: String(width) } : {}) })}`
    : src;

export default async function BlogMarkdown({ content }: { content: string }) {
  const originalCode: string[] = [];
  const captureSource = () => (tree: HastRoot) => {
    visit(tree, "element", (node) => {
      if (node.tagName === "pre") originalCode.push(toString(node));
    });
  };
  const restoreSource = () => (tree: HastRoot) => {
    let index = 0;
    visit(tree, "element", (node) => {
      if (node.tagName === "pre")
        node.data = { ...node.data, blogRawCode: originalCode[index++] };
    });
  };
  return (
    <div className="blog-prose">
      <MarkdownAsync
        remarkPlugins={[remarkGfm, remarkMath, remarkArticleHeadings]}
        rehypePlugins={[
          [rehypeKatex, { strict: false, throwOnError: false }],
          captureSource,
          [
            rehypePrettyCode,
            {
              theme: { dark: "github-dark", light: "github-light" },
              keepBackground: false,
              defaultLang: { block: "text", inline: "text" },
            },
          ],
          restoreSource,
        ]}
        skipHtml
        components={{
          a: ({ href, title, children, node }) => {
            const child =
              node?.children.length === 1 ? node.children[0] : undefined;
            // Linked images remain links rather than nesting a lightbox button
            // inside an anchor (the imported Reimu friend card uses this form).
            if (
              child?.type === "element" &&
              child.tagName === "img" &&
              typeof child.properties.src === "string"
            ) {
              const src = defaultUrlTransform(child.properties.src);
              return (
                <a
                  className={`blog-linked-image${child.properties.title === "avatar" ? " blog-linked-avatar" : ""}`}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={blogImage(src) ? src : externalImage(src)}
                    alt={String(child.properties.alt ?? "")}
                    loading="lazy"
                  />
                </a>
              );
            }
            return (
              <a
                href={href}
                title={title}
                target={/^https?:\/\//.test(href ?? "") ? "_blank" : undefined}
                rel={
                  /^https?:\/\//.test(href ?? "")
                    ? "noopener noreferrer"
                    : undefined
                }
              >
                {children}
              </a>
            );
          },
          img: ({ src, alt = "", title }) => {
            if (typeof src !== "string") return null;
            const info = blogImage(src);
            return (
              <BlogImage
                src={info ? src : externalImage(src)}
                original={src}
                fullSrc={info ? undefined : externalImage(src)}
                alt={alt}
                title={title}
                width={info?.width}
                height={info?.height}
              />
            );
          },
          pre: ({ children, node, ...props }) => (
            <CodeBlock
              code={
                typeof node?.data?.blogRawCode === "string"
                  ? node.data.blogRawCode
                  : node
                    ? toString(node)
                    : ""
              }
            >
              <pre {...props} tabIndex={0}>
                {children}
              </pre>
            </CodeBlock>
          ),
          table: ({ children }) => (
            <div
              className="blog-table-scroll"
              tabIndex={0}
              role="region"
              aria-label="文章表格"
            >
              <table>{children}</table>
            </div>
          ),
        }}
      >
        {content}
      </MarkdownAsync>
    </div>
  );
}
