import crypto from "crypto";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Returns a Gravatar URL for a plausible-looking email, or null otherwise —
 *  the raw address itself is never stored, only its hash goes into the KV entry. */
export function gravatarUrl(email: string): string | null {
  const trimmed = email.trim().toLowerCase();
  if (!EMAIL_RE.test(trimmed) || trimmed.length > 254) return null;
  const hash = crypto.createHash("md5").update(trimmed).digest("hex");
  return `https://www.gravatar.com/avatar/${hash}?s=80&d=mp`;
}
