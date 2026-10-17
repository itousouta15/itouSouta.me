"use client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cardBgThumb } from "../../lib/imageThumb";

export default function LegacyCommentBody({ text }: { text: string }) {
  return (
    <div className="guestbook-history-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        skipHtml
        components={{
          a: ({ href, children }) => (
            <a
              href={href}
              target={href?.startsWith("#") ? undefined : "_blank"}
              rel="noopener noreferrer nofollow"
            >
              {children}
            </a>
          ),
          img: ({ src, alt = "" }) =>
            typeof src === "string" ? (
              <img src={cardBgThumb(src)} alt={alt} loading="lazy" />
            ) : null,
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
}
