export interface PostHeading {
  id: string;
  text: string;
  depth: number;
}

export interface PostSummary {
  slug: string;
  title: string;
  path: string;
  date: string;
  dateISO: string;
  timestamp: number;
  updated?: string;
  categories: string[];
  tags: string[];
  description: string;
  cover: string;
  coverWidth?: number;
  coverHeight?: number;
  pinned: boolean;
  wordCount: number;
  readingMinutes: number;
  searchText: string;
  prefetch?: boolean;
  translations: Partial<Record<"en" | "ja", string>>;
  legacyPath?: string;
}

export interface BlogPost extends PostSummary {
  content: string;
  headings: PostHeading[];
  originalCover: string;
  deferredHighlight: boolean;
}
