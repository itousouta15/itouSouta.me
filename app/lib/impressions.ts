export const IMPRESSION_MAX_LENGTH = 20;
export const IMPRESSION_COOLDOWN_SECONDS = 30;
export const IMPRESSION_DUPLICATE_SECONDS = 86400;

export interface VisitorImpression {
  tag: string;
  count: number;
}

/* 全形、前後空白與連續空白統一，避免同一個印象分成好幾筆。 */
export function normalizeImpression(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const tag = value.normalize("NFKC").trim().replace(/\s+/gu, " ");
  if (
    !tag ||
    tag.length > IMPRESSION_MAX_LENGTH ||
    /[\u0000-\u001f\u007f]/u.test(tag)
  )
    return null;
  return tag;
}
