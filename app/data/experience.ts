export interface ExperienceItem {
  period: string;
  title: string;
  org?: string;
  desc?: string;
  category?: string;
  longDesc?: string;
  href?: string;
  image?: string;
  images?: string[];
}

export const EXPERIENCE: ExperienceItem[] = [
  {
    period: "2022—現在",
    title: "自己的工作或學習經歷",
    org: "職稱或身分",
    desc: "寫下這段時間做過的事。",
    category: "經歷",
  },
  {
    period: "2021",
    title: "值得紀念的里程碑",
    desc: "用一兩句話記錄你的成果。",
    category: "里程碑",
  },
];
