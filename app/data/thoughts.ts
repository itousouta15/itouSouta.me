export interface Thought {
  date: string;
  text: string;
  tag?: string;
}

export const THOUGHTS: Thought[] = [
  { date: "2026-07-01", text: "好想睡覺 Zzzz", tag: "日常" },
];
