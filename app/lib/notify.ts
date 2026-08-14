import { Resend } from "resend";

/* 回覆通知信（Resend）。只有留言者填了 email 才會走到這裡；沒有設定
   RESEND_API_KEY 時靜默跳過——留言板本身不應該因為寄信服務壞掉而不能用。 */

const FROM = process.env.RESEND_FROM ?? "";
let _client: Resend | null = null;

function client(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  if (!_client) _client = new Resend(process.env.RESEND_API_KEY);
  return _client;
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

interface ReplyNotification {
  /** 收件人（可多人，呼叫端先做過去重）。 */
  to: string[];
  replyNick: string;
  replyText: string;
  parentText: string;
  pagePath: string;
  /** 回覆的錨點，配合前端每則留言/回覆的 id。 */
  anchorId: string;
}

const SITE_URL = "https://itousouta.me";

/** 寄出「你的留言有新的回覆」通知。寄信失敗只記 log 不回傳錯誤——
 *  回覆本身已經寫進 KV，通知寄不出去不該讓使用者的回覆看起來像失敗。 */
export async function sendReplyNotification({
  to,
  replyNick,
  replyText,
  parentText,
  pagePath,
  anchorId,
}: ReplyNotification): Promise<void> {
  const resend = client();
  if (!resend || !FROM || to.length === 0) return;

  const url = `${SITE_URL}${pagePath}#gb-${anchorId}`;
  const html = [
    '<div style="font-family:system-ui,-apple-system,\'Segoe UI\',sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#24292f;line-height:1.7">',
    "<p>嗨，</p>",
    `<p>你的留言收到了新的回覆：</p>`,
    `<div style="background:#f6f8fa;border-left:4px solid #eab308;padding:12px 16px;margin:16px 0;border-radius:0 8px 8px 0">`,
    `<p style="margin:0 0 8px;font-weight:600">${escapeHtml(replyNick)} 回覆：</p>`,
    `<p style="margin:0;white-space:pre-wrap">${escapeHtml(replyText)}</p>`,
    "</div>",
    "<p>你原本的留言：</p>",
    `<blockquote style="margin:0 0 16px;padding:8px 16px;border-left:3px solid #d0d7de;color:#57606a;white-space:pre-wrap">${escapeHtml(parentText)}</blockquote>`,
    `<p><a href="${url}" style="background:#1f6feb;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none">查看回覆</a></p>`,
    '<p style="color:#8b949e;font-size:12px">如果你不希望再收到回覆通知，可以直接忽略這封信。</p>',
    "</div>",
  ].join("");

  try {
    await resend.emails.send({
      from: FROM,
      to,
      subject: "你的留言在 itousouta.me 有新的回覆",
      html,
    });
  } catch (err) {
    console.error("resend reply notification failed", err);
  }
}
