export interface ThreadsPost {
  id: string;
  text?: string;
  timestamp: string;
  media_type: string;
  permalink?: string;
}

export async function fetchThreadsPosts(): Promise<ThreadsPost[]> {
  const token = process.env.THREADS_ACCESS_TOKEN;
  if (!token) { console.log("[Threads] no token"); return []; }

  const res = await fetch(
    `https://graph.threads.net/v1.0/me/threads?fields=id,text,timestamp,media_type,permalink&limit=30&access_token=${token}`,
    { next: { revalidate: 3600 } }
  );

  if (!res.ok) {
    const err = await res.text();
    console.log("[Threads] fetch failed", res.status, err);
    return [];
  }

  const json = await res.json();
  return (json.data ?? []).filter(
    (p: ThreadsPost) => p.media_type === "TEXT_POST" && p.text
  );
}
