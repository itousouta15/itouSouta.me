import { Resend } from "resend";

/* 回覆通知信（Resend）。只有留言者填了 email 才會走到這裡；沒有設定
   RESEND_API_KEY 時靜默跳過——留言板本身不應該因為寄信服務壞掉而不能用。

   注意：Vercel 環境變數是原樣讀取（不會像 dotenv 那樣剝引號），有人在
   dashboard 貼成 `"itousouta.me <no-reply@itousouta.me>"` 就會整包含引號
   送給 Resend 吃 422——所以這裡一律 trim + 剝掉前後引號自保。

   信件視覺沿用網站的深色主題（globals.css 的 theme tokens）：
   bg #1b1e23 / panel #24262b / inset #181b20 / 字 #e8ebf2 / 強調色 --blue
   #b0bdf7。email client 不支援外掛字型與 <style>，所以全部 inline style，
   字型只給堆疊（收件端有裝就吃，沒有就走系統字），圖片用絕對 URL。 */

const RESEND_API_KEY = (process.env.RESEND_API_KEY ?? "")
  .trim()
  .replace(/^"+|"+$/g, "");
const FROM = (process.env.RESEND_FROM ?? "").trim().replace(/^"+|"+$/g, "");
let _client: Resend | null = null;

function client(): Resend | null {
  if (!RESEND_API_KEY) return null;
  if (!_client) _client = new Resend(RESEND_API_KEY);
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

/* 與 globals.css theme tokens 同步的顏色（深色主題） */
const C = {
  bg: "#1b1e23",
  panel: "#24262b",
  inset: "#181b20",
  bd: "#33363c",
  tx: "#e8ebf2",
  dim: "#9aa1ad",
  mute: "#6a7280",
  blue: "#b0bdf7",
} as const;

const SERIF = "'Shippori Mincho','Noto Serif TC',Georgia,serif";
const SANS = "'Noto Sans TC',system-ui,-apple-system,'Segoe UI',sans-serif";
const MONO = "'JetBrains Mono',Consolas,monospace";

function buildReplyEmail({
  replyNick,
  replyText,
  parentText,
  pagePath,
  anchorId,
}: Omit<ReplyNotification, "to">): { subject: string; html: string } {
  const url = `${SITE_URL}${pagePath}#gb-${anchorId}`;
  const preview = `${replyNick} 回覆了你的留言：${replyText.slice(0, 40)}`;

  const html = [
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:',
    C.bg,
    ';padding:24px 12px"><tr><td align="center">',
    '<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="width:560px;max-width:100%;background:',
    C.panel,
    ";border:1px solid ",
    C.bd,
    '">',
    // 收件匣預覽用的 preheader（display:none 不會顯示在信件內文）
    '<tr><td style="display:none;max-height:0;overflow:hidden;mso-hide:all">',
    escapeHtml(preview),
    "</td></tr>",
    // 站徽 banner（768px 原圖；email 顯示 560px，有餘裕不會糊）
    '<tr><td><img src="',
    `${SITE_URL}/assets/brand/banner.webp`,
    '" alt="itousouta.me" width="560" style="display:block;width:100%;height:auto;border:0"></td></tr>',
    // 主體
    '<tr><td style="padding:28px 28px 20px">',
    '<h1 style="margin:0 0 14px;font-family:',
    SERIF,
    ";font-size:22px;font-weight:700;color:",
    C.tx,
    '">你的留言有新的回覆</h1>',
    '<p style="margin:0 0 16px;font-family:',
    SANS,
    ";font-size:14px;line-height:1.7;color:",
    C.dim,
    '">嗨，有人在留言板回覆了你的留言：</p>',
    // 回覆內容卡片（inset 底 + 左側強調色）
    '<div style="background:',
    C.inset,
    ";border-left:3px solid ",
    C.blue,
    ';padding:12px 16px;margin:0 0 16px">',
    '<p style="margin:0 0 6px;font-family:',
    SANS,
    ";font-size:13px;font-weight:700;color:",
    C.blue,
    '">',
    escapeHtml(replyNick),
    " 回覆：</p>",
    '<p style="margin:0;font-family:',
    SANS,
    ";font-size:14px;line-height:1.75;color:",
    C.tx,
    ";white-space:pre-wrap;overflow-wrap:anywhere\">",
    escapeHtml(replyText),
    "</p></div>",
    // 原留言摘錄
    '<p style="margin:0 0 4px;font-family:',
    SANS,
    ";font-size:12px;color:",
    C.mute,
    '">你原本的留言：</p>',
    '<blockquote style="margin:0 0 24px;padding:8px 16px;border-left:3px solid ',
    C.bd,
    ";font-family:",
    SANS,
    ";font-size:13px;line-height:1.7;color:",
    C.dim,
    ';white-space:pre-wrap">',
    escapeHtml(parentText),
    "</blockquote>",
    // CTA（網站主按鈕：強調色底 + 深色字）
    '<a href="',
    url,
    '" style="display:inline-block;background:',
    C.blue,
    ";color:",
    C.bg,
    ";font-family:",
    SANS,
    ';font-size:14px;font-weight:700;padding:10px 24px;text-decoration:none">前往查看回覆</a>',
    "</td></tr>",
    // footer
    '<tr><td style="padding:18px 28px 24px;border-top:1px solid ',
    C.bd,
    '"><table role="presentation" cellpadding="0" cellspacing="0"><tr>',
    '<td><img src="',
    `${SITE_URL}/assets/brand/avatar.webp`,
    '" alt="" width="28" height="28" style="display:block;width:28px;height:28px;border-radius:50%"></td>',
    '<td style="padding-left:10px;vertical-align:middle">',
    '<a href="',
    SITE_URL,
    '" style="font-family:',
    SANS,
    ";font-size:12px;color:",
    C.dim,
    ';text-decoration:none">itousouta.me</a>',
    '<p style="margin:2px 0 0;font-family:',
    MONO,
    ";font-size:11px;color:",
    C.mute,
    '">回覆通知 · 不想收到可以忽略這封信</p>',
    "</td></tr></table></td></tr>",
    "</table></td></tr></table>",
  ].join("");

  return { subject: "你的留言在 itousouta.me 有新的回覆", html };
}

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
  if (!resend || !FROM) {
    console.warn("[guestbook] reply notification skipped: Resend 未設定");
    return;
  }
  if (to.length === 0) {
    console.warn("[guestbook] reply notification skipped: 沒有收件人");
    return;
  }

  const { subject, html } = buildReplyEmail({
    replyNick,
    replyText,
    parentText,
    pagePath,
    anchorId,
  });

  try {
    await resend.emails.send({
      from: FROM,
      to,
      subject,
      html,
    });
    console.log(`[guestbook] reply notification sent to ${to.join(", ")}`);
  } catch (err) {
    console.error("resend reply notification failed", err);
  }
}
