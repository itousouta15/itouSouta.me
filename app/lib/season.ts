export const SEASON_NAMES = {
  halloween: "萬聖節",
  christmas: "聖誕節",
  newyear: "新年",
} as const;

export function seasonFor(d: Date): keyof typeof SEASON_NAMES | "" {
  const m = d.getMonth() + 1;
  const day = d.getDate();
  if ((m === 10 && day >= 15) || (m === 11 && day <= 5)) return "halloween";
  if (m === 12) return "christmas";
  if (m === 1 && day <= 10) return "newyear";
  return "";
}
