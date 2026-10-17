import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { visit } from "unist-util-visit";
import { toString } from "mdast-util-to-string";
import GithubSlugger from "github-slugger";
import type { Root } from "mdast";
import type { PostHeading } from "./postTypes";

/** The index and rendered heading IDs use the exact same AST and slug rules. */
export function articleHeadings(tree: Root): PostHeading[] {
  const slugger = new GithubSlugger();
  const headings: PostHeading[] = [];
  visit(tree, "heading", (node) => {
    const text = toString(node);
    const id = slugger.slug(text);
    headings.push({ id, text, depth: node.depth });
  });
  const offset = Math.max(
    0,
    2 - Math.min(...headings.map((heading) => heading.depth))
  );
  return headings.map((heading) => ({
    ...heading,
    depth: Math.min(6, heading.depth + offset),
  }));
}

export function remarkArticleHeadings() {
  return (tree: Root) => {
    const headings = articleHeadings(tree);
    let index = 0;
    visit(tree, "heading", (node) => {
      const heading = headings[index++];
      node.depth = heading.depth as 1 | 2 | 3 | 4 | 5 | 6;
      node.data = {
        ...node.data,
        hProperties: { ...node.data?.hProperties, id: heading.id },
      };
    });
  };
}

export function inspectMarkdown(content: string) {
  const tree = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .parse(content);
  const paragraphs: string[] = [];
  const text: string[] = [];
  const code: string[] = [];
  visit(tree, (node) => {
    if (node.type === "paragraph") paragraphs.push(toString(node));
    if (node.type === "text" || node.type === "inlineCode")
      text.push(node.value);
    if (node.type === "code") code.push(node.value);
  });
  const plainText = text.join(" ").replace(/\s+/g, " ").trim();
  const chinese = (
    plainText.match(
      /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/gu
    ) ?? []
  ).length;
  const words =
    plainText
      .replace(/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/gu, " ")
      .match(/[\p{L}\p{N}]+/gu)?.length ?? 0;
  return {
    headings: articleHeadings(tree),
    plainText,
    searchText: [plainText, ...code].join("\n"),
    description: (paragraphs.find((value) => value.trim()) ?? plainText)
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 170),
    wordCount: chinese + words,
    readingMinutes: Math.max(1, Math.ceil(chinese / 350 + words / 220)),
  };
}
