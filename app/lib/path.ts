const PATH_RE = /^\/[a-zA-Z0-9\-_/]{0,200}$/;

/** Validates an app-internal pathname (used for per-page guestbook keys and
 *  the GitHub OAuth return redirect), rejecting anything that isn't a plain
 *  same-origin route so it can't be abused as an open-redirect/KV-key vector. */
export function normalizePath(path: string | null): string | null {
  if (!path) return "/";
  return PATH_RE.test(path) ? path : null;
}
