"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import GithubGlyph from "./GithubGlyph";

/* 留言板：KV 自建（/api/guestbook）。原本連部落格共用的 waline 伺服器——那台
   鎖了部落格網域（errno 1001），只能讀不能寫，加上 waline client 在 Next/React
   下自身 fetch 會被內部 watcher abort，所以整個換掉。版面沿用 waline 的骨架：
   標題 → 三欄身分輸入 → 編輯區 → 底部工具列 → 留言數／排序 → 留言列表。

   回覆：每則留言／回覆都有「回覆」按鈕，點開在該則底下插入小表單；資料存同
   一頁的 replies hash，回覆可再被回覆（巢狀樓中樓）。有留郵箱的，被回覆時
   由後端寄 Resend 通知。 */

interface Reply {
  id: string;
  nick: string;
  text: string;
  timestamp: string;
  parentId: string;
  replyToNick: string;
  avatar?: string | null;
  link?: string | null;
  source?: "manual" | "github";
}

interface Entry {
  id: string;
  nick: string;
  text: string;
  timestamp: string;
  avatar?: string | null;
  link?: string | null;
  source?: "manual" | "github";
  replies?: Reply[];
}

interface GithubProfile {
  login: string;
  avatarUrl: string;
  exp: number;
  email?: string | null;
}

interface ReplyTarget {
  commentId: string;
  parentId: string;
  replyToNick: string;
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
    return {
      login: json.login,
      avatarUrl: json.avatarUrl,
      exp: json.exp,
      email: typeof json.email === "string" ? json.email : null,
    };
  } catch {
    return null;
  }
}

function ItemAvatar({
  nick,
  avatar,
}: {
  nick: string;
  avatar?: string | null;
}) {
  return (
    <div className="guestbook-avatar" aria-hidden="true">
      {avatar ? (
        <img src={avatar} alt="" loading="lazy" />
      ) : (
        <span>{nick.slice(0, 1).toUpperCase()}</span>
      )}
    </div>
  );
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
  const [replyTarget, setReplyTarget] = useState<ReplyTarget | null>(null);
  const [replyForm, setReplyForm] = useState({
    nick: "",
    email: "",
    text: "",
    hp: "",
  });
  const [sendingReply, setSendingReply] = useState(false);

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

  const openReply = (
    commentId: string,
    parentId: string,
    replyToNick: string
  ) => {
    setReplyTarget({ commentId, parentId, replyToNick });
    setReplyForm((f) => ({ ...f, nick: f.nick || nick, text: "", hp: "" }));
    setError(null);
  };

  const cancelReply = () => {
    setReplyTarget(null);
    setReplyForm({ nick: "", email: "", text: "", hp: "" });
    setError(null);
  };

  const submitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyTarget || sendingReply) return;
    setSendingReply(true);
    setError(null);
    try {
      const { nick: rNick, email: rEmail, text: rText, hp: rHp } = replyForm;
      const res = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          githubToken
            ? {
                text: rText,
                hp: rHp,
                path,
                githubToken,
                commentId: replyTarget.commentId,
                parentId: replyTarget.parentId,
              }
            : {
                nick: rNick,
                email: rEmail,
                text: rText,
                hp: rHp,
                path,
                commentId: replyTarget.commentId,
                parentId: replyTarget.parentId,
              }
        ),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(j.error ?? "送出失敗");
        return;
      }
      setReplyTarget(null);
      setReplyForm({ nick: "", email: "", text: "", hp: "" });
      load();
    } catch {
      setError("送出失敗");
    } finally {
      setSendingReply(false);
    }
  };

  /* ---- 回覆表單：插在被回覆的那一則底下 ---- */
  const renderReplyForm = () => {
    if (!replyTarget) return null;
    return (
      <form className="guestbook-reply-form" onSubmit={submitReply}>
        <p className="guestbook-reply-form-title">
          回覆 <strong>@{replyTarget.replyToNick}</strong>
        </p>
        {!githubProfile && (
          <div className="guestbook-fields">
            <div className="guestbook-field">
              <label htmlFor="gb-r-nick">暱稱</label>
              <input
                id="gb-r-nick"
                value={replyForm.nick}
                onChange={(e) =>
                  setReplyForm((f) => ({ ...f, nick: e.target.value }))
                }
                maxLength={20}
                required
              />
            </div>
            <div className="guestbook-field">
              <label htmlFor="gb-r-mail" title="有新的回覆時會寄信通知你">
                郵箱(可選)
              </label>
              <input
                id="gb-r-mail"
                type="email"
                value={replyForm.email}
                onChange={(e) =>
                  setReplyForm((f) => ({ ...f, email: e.target.value }))
                }
                maxLength={254}
              />
            </div>
          </div>
        )}
        <textarea
          className="guestbook-editor"
          placeholder={`回覆 @${replyTarget.replyToNick}…`}
          value={replyForm.text}
          onChange={(e) =>
            setReplyForm((f) => ({ ...f, text: e.target.value }))
          }
          maxLength={TEXT_MAX}
          required
        />
        {/* honeypot：真人看不見，機器人填了就假裝成功 */}
        <input
          className="guestbook-hp"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          value={replyForm.hp}
          onChange={(e) => setReplyForm((f) => ({ ...f, hp: e.target.value }))}
        />
        <div className="guestbook-actions">
          <span className="guestbook-counter">
            {replyForm.text.length}/{TEXT_MAX} 字
          </span>
          <button type="button" className="guestbook-btn" onClick={cancelReply}>
            取消
          </button>
          <button
            type="submit"
            className="guestbook-btn guestbook-btn--primary"
            disabled={sendingReply}
          >
            {sendingReply ? "送出中…" : "送出回覆"}
          </button>
        </div>
        {error && <p className="guestbook-error">{error}</p>}
      </form>
    );
  };

  /* ---- 回覆列表：parentId 指到誰就掛在誰底下，可無限樓中樓 ----
     縮排由 CSS 處理（巢狀超過 4 層後不再加深），這裡只負責遞迴。 */
  const renderReply = (
    reply: Reply,
    rootReplies: Reply[],
    commentId: string
  ): React.ReactNode => {
    const children = rootReplies.filter((r) => r.parentId === reply.id);
    return (
      <div
        key={reply.id}
        id={`gb-${reply.id}`}
        className="guestbook-reply-item"
      >
        <div className="guestbook-reply-body">
          <ItemAvatar nick={reply.nick} avatar={reply.avatar} />
          <div className="guestbook-body">
            <div className="guestbook-item-head">
              {reply.link ? (
                <a
                  className="guestbook-nick"
                  href={reply.link}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                >
                  {reply.nick}
                </a>
              ) : (
                <span className="guestbook-nick">{reply.nick}</span>
              )}
              {reply.source === "github" && (
                <GithubGlyph className="guestbook-gh-badge" />
              )}
              <span className="guestbook-date">{fmtDate(reply.timestamp)}</span>
              <button
                type="button"
                className="guestbook-reply-btn"
                onClick={() => openReply(commentId, reply.id, reply.nick)}
              >
                回覆
              </button>
            </div>
            <p className="guestbook-text">
              <span className="guestbook-reply-to">
                回覆 @{reply.replyToNick}
              </span>{" "}
              {reply.text}
            </p>
            {replyTarget?.parentId === reply.id && renderReplyForm()}
            {children.length > 0 && (
              <div className="guestbook-replies">
                {children.map((child) =>
                  renderReply(child, rootReplies, commentId)
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderComment = (en: Entry): React.ReactNode => {
    const rootReplies = en.replies ?? [];
    const ids = new Set([en.id, ...rootReplies.map((r) => r.id)]);
    const direct = rootReplies.filter(
      (r) => r.parentId === en.id || !ids.has(r.parentId)
    );
    return (
      <li key={en.id} id={`gb-${en.id}`} className="guestbook-item">
        <ItemAvatar nick={en.nick} avatar={en.avatar} />
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
            <span className="guestbook-date">{fmtDate(en.timestamp)}</span>
            {rootReplies.length > 0 && (
              <span className="guestbook-reply-count">
                {rootReplies.length} 回覆
              </span>
            )}
            <button
              type="button"
              className="guestbook-reply-btn"
              onClick={() => openReply(en.id, en.id, en.nick)}
            >
              回覆
            </button>
          </div>
          <p className="guestbook-text">{en.text}</p>
          {replyTarget?.parentId === en.id && renderReplyForm()}
          {direct.length > 0 && (
            <div className="guestbook-replies">
              {direct.map((reply) => renderReply(reply, rootReplies, en.id))}
            </div>
          )}
        </div>
      </li>
    );
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
              {githubProfile.email && (
                <em className="guestbook-signed-in-note">
                  （有回覆會通知你的 GitHub 郵箱）
                </em>
              )}
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
              <label htmlFor="gb-mail" title="有新的回覆時會寄信通知你">
                郵箱(可選)
              </label>
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
        {error && !replyTarget && <p className="guestbook-error">{error}</p>}
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
        <ul className="guestbook-list">{sorted.map(renderComment)}</ul>
      ) : sorted ? (
        <p className="guestbook-empty">來發留言吧~</p>
      ) : null}
    </div>
  );
}
