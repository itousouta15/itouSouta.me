export interface Thought {
  date: string;
  text: string;
  tag?: string;
}

export const THOUGHTS: Thought[] = [
  { date: "2026-01-01", text: "在這裡記下生活中的小事。", tag: "日常" },
];
