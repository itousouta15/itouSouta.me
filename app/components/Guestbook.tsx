"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import GithubGlyph from "./GithubGlyph";

/* 留言板：KV 自建（/api/guestbook）。原本連部落格共用的 waline 伺服器——那台
   鎖了部落格網域（errno 1001），只能讀不能寫，加上 waline client 在 Next/React
   下自身 fetch 會被內部 watcher abort，所以整個換掉。版面沿用 waline 的骨架：
   標題 → 三欄身分輸入 → 編輯區 → 底部工具列 → 留言數／排序 → 留言列表。 */

interface Entry {
  id: string;
  nick: string;
  text: string;
  timestamp: string;
  avatar?: string | null;
  link?: string | null;
  source?: "manual" | "github";
}

interface GithubProfile {
  login: string;
  avatarUrl: string;
  exp: number;
}

const TEXT_MAX = 500;

function fmtDate(ts: string) {
  return new Date(ts).toLocaleDateString("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

const GH_ERROR_MSG: Record<string, string> = {
  not_configured: "GitHub 登入還沒設定好",
  state: "GitHub 登入逾時，請再試一次",
  token: "GitHub 授權失敗，請再試一次",
  profile: "讀取 GitHub 個人資料失敗",
  network: "連線 GitHub 失敗，請再試一次",
};

/* token 是 base64url(payload).簽章，payload 本身沒加密——這裡只是解出來顯示
   用（頭像、帳號名），真正的信任驗證在後端用簽章重算一次，前端解不出來也偽造不了。 */
function decodeGithubToken(token: string): GithubProfile | null {
  try {
    const [payload] = token.split(".");
    const json = JSON.parse(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
    );
    if (typeof json.login !== "string" || typeof json.avatarUrl !== "string")
      return null;
    if (typeof json.exp !== "number" || json.exp < Date.now()) return null;
    return { login: json.login, avatarUrl: json.avatarUrl, exp: json.exp };
  } catch {
    return null;
  }
}

export default function Guestbook({ path }: { path: string }) {
  const router = useRouter();
  const [entries, setEntries] = useState<Entry[] | null>(null);
  const [nick, setNick] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [hp, setHp] = useState("");
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sort, setSort] = useState<"new" | "old">("new");
  const [githubToken, setGithubToken] = useState<string | null>(null);
  const [githubProfile, setGithubProfile] = useState<GithubProfile | null>(
    null
  );

  const load = useCallback(() => {
    fetch(`/api/guestbook?path=${encodeURIComponent(path)}`)
      .then((r) => (r.ok ? r.json() : { entries: null }))
      .then((j) => {
        if (Array.isArray(j.entries)) setEntries(j.entries);
      })
      .catch(() => {});
  }, [path]);

  useEffect(() => {
    load();
  }, [load]);

  // 從 GitHub OAuth callback redirect 回來的 ?gh_token=/?gh_error= 讀一次就清掉，
  // 不留在網址列上
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("gh_token");
    const ghError = params.get("gh_error");
    if (!token && !ghError) return;

    if (token) {
      const profile = decodeGithubToken(token);
      if (profile) {
        setGithubToken(token);
        setGithubProfile(profile);
      } else {
        setError("GitHub 登入逾時，請再試一次");
      }
    }
    if (ghError) setError(GH_ERROR_MSG[ghError] ?? "GitHub 登入失敗");

    params.delete("gh_token");
    params.delete("gh_error");
    const query = params.toString();
    router.replace(query ? `${path}?${query}` : path, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // KV 是 lpush，撈回來本來就是最新在前，「最早」只要反著看同一份陣列
  const sorted = useMemo(() => {
    if (!entries) return null;
    return sort === "new" ? entries : [...entries].reverse();
  }, [entries, sort]);

  const signInWithGithub = () => {
    window.location.href = `/api/auth/github?path=${encodeURIComponent(path)}`;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          githubToken
            ? { text, hp, path, githubToken }
            : { nick, text, email, website, hp, path }
        ),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(j.error ?? "送出失敗");
        return;
      }
      setText("");
      load();
    } catch {
      setError("送出失敗");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="guestbook">
      <h2 className="guestbook-title">說些什麼吧！</h2>

      <form className="guestbook-panel" onSubmit={onSubmit}>
        {githubProfile ? (
          <div className="guestbook-signed-in">
            <img src={githubProfile.avatarUrl} alt="" />
            <span>
              以 <strong>{githubProfile.login}</strong> 的身分留言
            </span>
            <button
              type="button"
              className="guestbook-signout"
              onClick={() => {
                setGithubToken(null);
                setGithubProfile(null);
              }}
            >
              取消
            </button>
          </div>
        ) : (
          <div className="guestbook-fields">
            <div className="guestbook-field">
              <label htmlFor="gb-nick">暱稱</label>
              <input
                id="gb-nick"
                value={nick}
                onChange={(e) => setNick(e.target.value)}
                maxLength={20}
                required
              />
            </div>
            <div className="guestbook-field">
              <label htmlFor="gb-mail">郵箱(可選)</label>
              <input
                id="gb-mail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength={254}
              />
            </div>
            <div className="guestbook-field">
              <label htmlFor="gb-link">網址(可選)</label>
              <input
                id="gb-link"
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                maxLength={300}
              />
            </div>
          </div>
        )}

        <textarea
          className="guestbook-editor"
          placeholder="歡迎留言"
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={TEXT_MAX}
          required
        />

        {/* honeypot：真人看不見，機器人填了就假裝成功 */}
        <input
          className="guestbook-hp"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          value={hp}
          onChange={(e) => setHp(e.target.value)}
        />

        <div className="guestbook-actions">
          <span className="guestbook-counter">
            {text.length}/{TEXT_MAX} 字
          </span>
          {!githubProfile && (
            <button
              type="button"
              className="guestbook-btn"
              onClick={signInWithGithub}
            >
              <GithubGlyph />
              登入
            </button>
          )}
          <button
            type="submit"
            className="guestbook-btn guestbook-btn--primary"
            disabled={sending}
          >
            {sending ? "送出中…" : "送出"}
          </button>
        </div>
        {error && <p className="guestbook-error">{error}</p>}
      </form>

      <div className="guestbook-meta-head">
        <div className="guestbook-total">{entries?.length ?? 0} 留言</div>
        <div className="guestbook-sort">
          <button
            type="button"
            className={sort === "new" ? "is-active" : ""}
            onClick={() => setSort("new")}
          >
            最新
          </button>
          <button
            type="button"
            className={sort === "old" ? "is-active" : ""}
            onClick={() => setSort("old")}
          >
            最早
          </button>
        </div>
      </div>

      {sorted && sorted.length > 0 ? (
        <ul className="guestbook-list">
          {sorted.map((en) => (
            <li key={en.id} className="guestbook-item">
              <div className="guestbook-avatar" aria-hidden="true">
                {en.avatar ? (
                  <img src={en.avatar} alt="" loading="lazy" />
                ) : (
                  <span>{en.nick.slice(0, 1).toUpperCase()}</span>
                )}
              </div>
              <div className="guestbook-body">
                <div className="guestbook-item-head">
                  {en.link ? (
                    <a
                      className="guestbook-nick"
                      href={en.link}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                    >
                      {en.nick}
                    </a>
                  ) : (
                    <span className="guestbook-nick">{en.nick}</span>
                  )}
                  {en.source === "github" && (
                    <GithubGlyph className="guestbook-gh-badge" />
                  )}
                  <span className="guestbook-date">
                    {fmtDate(en.timestamp)}
                  </span>
                </div>
                <p className="guestbook-text">{en.text}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : sorted ? (
        <p className="guestbook-empty">來發留言吧~</p>
      ) : null}
    </div>
  );
}
