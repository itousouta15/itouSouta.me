import crypto from "crypto";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** 是否為可用的 email 格式（回覆通知只寄給格式合法的地址）。 */
export function isValidEmail(email: string): boolean {
  const trimmed = email.trim().toLowerCase();
  return EMAIL_RE.test(trimmed) && trimmed.length <= 254;
}

/** Returns a Gravatar URL for a plausible-looking email, or null otherwise —
 *  the raw address itself is never stored, only its hash goes into the KV entry. */
export function gravatarUrl(email: string): string | null {
  const trimmed = email.trim().toLowerCase();
  if (!isValidEmail(trimmed)) return null;
  const hash = crypto.createHash("md5").update(trimmed).digest("hex");
  return `https://www.gravatar.com/avatar/${hash}?s=80&d=mp`;
}
