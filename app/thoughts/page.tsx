import { permanentRedirect } from "next/navigation";

/* 碎碎念已合併到 /writing，這條路由只是永久轉址（308）。
   沒有 metadata：redirect 的回應不帶內容，Next 不會渲染本頁的 head。 */
export default function ThoughtsPage() {
  permanentRedirect("/writing");
}
