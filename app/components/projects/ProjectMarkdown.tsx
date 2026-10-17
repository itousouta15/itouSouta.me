import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/** Render the project story on the server; the Markdown parser stays out of
 * the gallery/search client bundles. The page already owns the only h1. */
export default function ProjectMarkdown({ content }: { content: string }) {
  return (
    <div className="project-markdown">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        skipHtml
        components={{
          h1: ({ children }) => <h2>{children}</h2>,
          a: ({ href, title, children }) => {
            const external = /^https?:\/\//i.test(href ?? "");
            return (
              <a
                href={href}
                title={title}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
              >
                {children}
              </a>
            );
          },
          table: ({ children }) => (
            <div
              className="project-markdown-table"
              tabIndex={0}
              role="region"
              aria-label="專案內容表格"
            >
              <table>{children}</table>
            </div>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
