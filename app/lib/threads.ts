export interface ThreadsPost {
  id: string;
  text?: string;
  timestamp: string;
  media_type: string;
  permalink?: string;
  media_url?: string;
}

const DISPLAY_TYPES = new Set(["TEXT_POST", "IMAGE", "CAROUSEL_ALBUM", "VIDEO"]);

export async function fetchThreadsPosts(): Promise<ThreadsPost[]> {
  const token = process.env.THREADS_ACCESS_TOKEN;
  if (!token) return [];

  const res = await fetch(
    `https://graph.threads.net/v1.0/me/threads?fields=id,text,timestamp,media_type,permalink,media_url&limit=30&access_token=${token}`,
    { next: { revalidate: 3600 } }
  );

  if (!res.ok) return [];

  const json = await res.json();
  return (json.data ?? []).filter(
    (p: ThreadsPost) => DISPLAY_TYPES.has(p.media_type) && (p.text || p.media_url)
  );
}
