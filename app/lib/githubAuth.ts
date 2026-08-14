import crypto from "crypto";

/* 留言板的「用 GitHub 登入」是一次性的：callback 拿到 profile 後不建立 session，
   而是把 profile 簽成一個短效 token 經由 redirect query 帶回表單，送出留言時
   夾帶這個 token。伺服器驗簽章＋過期時間，client 端沒辦法憑空偽造成任何帳號。 */

const SECRET = process.env.GUESTBOOK_GH_SECRET ?? "";
const TTL_MS = 10 * 60 * 1000;

export interface GithubIdentity {
  login: string;
  avatarUrl: string;
  profileUrl: string;
  /** 回覆通知用的 email（登入時抓 GitHub 主信箱；沒授權 scope 就沒有）。 */
  email?: string | null;
}

function sign(payload: string): string {
  return crypto
    .createHmac("sha256", SECRET)
    .update(payload)
    .digest("base64url");
}

export function signGithubIdentity(identity: GithubIdentity): string {
  const payload = Buffer.from(
    JSON.stringify({ ...identity, exp: Date.now() + TTL_MS })
  ).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function verifyGithubIdentity(token: string): GithubIdentity | null {
  if (!SECRET) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig || sig !== sign(payload)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (typeof data.exp !== "number" || data.exp < Date.now()) return null;
    if (typeof data.login !== "string" || typeof data.avatarUrl !== "string")
      return null;
    return {
      login: data.login,
      avatarUrl: data.avatarUrl,
      profileUrl:
        typeof data.profileUrl === "string"
          ? data.profileUrl
          : `https://github.com/${data.login}`,
      email: typeof data.email === "string" ? data.email : null,
    };
  } catch {
    return null;
  }
}
