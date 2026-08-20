const HOST_LABELS: Record<string, string> = {
  "github.com": "GitHub",
  "gitlab.com": "GitLab",
};

/** 專案詳情頁的原始碼按鈕文字：依 href 網域顯示 GitHub / GitLab，其他網域退回「原始碼」。 */
export function sourceHostLabel(href: string): string {
  try {
    const host = new URL(href).hostname.replace(/^www\./, "");
    return HOST_LABELS[host] ?? "原始碼";
  } catch {
    return "原始碼";
  }
}
