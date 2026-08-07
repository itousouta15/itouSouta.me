"use client";

import { useCallback, useEffect, useState } from "react";

/* 留言板：KV 自建（/api/guestbook）。原本連部落格共用的 waline 伺服器——那台
   鎖了部落格網域（errno 1001），只能讀不能寫，加上 waline client 在 Next/React
   下自身 fetch 會被內部 watcher abort，所以整個換掉。 */

interface Entry {
  id: string;
  nick: string;
  text: string;
  timestamp: string;
}

function fmtDate(ts: string) {
  return new Date(ts).toLocaleDateString("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export default function Guestbook() {
  const [entries, setEntries] = useState<Entry[] | null>(null);
  const [nick, setNick] = useState("");
  const [text, setText] = useState("");
  const [website, setWebsite] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    fetch("/api/guestbook")
      .then((r) => (r.ok ? r.json() : { entries: null }))
      .then((j) => {
        if (Array.isArray(j.entries)) setEntries(j.entries);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nick, text, website }),
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
      {entries && entries.length > 0 ? (
        <ul className="guestbook-list">
          {entries.map((en) => (
            <li key={en.id} className="guestbook-item">
              <div className="guestbook-item-head">
                <span className="guestbook-nick">{en.nick}</span>
                <span className="guestbook-date">{fmtDate(en.timestamp)}</span>
              </div>
              <p className="guestbook-text">{en.text}</p>
            </li>
          ))}
        </ul>
      ) : entries ? (
        <p className="guestbook-empty">來發留言吧~</p>
      ) : null}

      <form className="guestbook-form" onSubmit={onSubmit}>
        <input
          className="field"
          placeholder="暱稱"
          value={nick}
          onChange={(e) => setNick(e.target.value)}
          maxLength={20}
          required
        />
        {/* honeypot：真人看不見，機器人填了就假裝成功 */}
        <input
          className="guestbook-hp"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
        <textarea
          className="field guestbook-textarea"
          placeholder="留言"
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={500}
          rows={3}
          required
        />
        <button
          type="submit"
          className="btn-primary guestbook-submit"
          disabled={sending}
        >
          送出 <span className="btn-arrow dark">→</span>
        </button>
        {error && <p className="guestbook-error">{error}</p>}
      </form>
    </div>
  );
}
