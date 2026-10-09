import type { MusicRecording } from "../../lib/spotifyHistory";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("zh-TW", {
    timeZone: "Asia/Taipei",
  });
}

export default function MusicRecordingNote({
  recording,
}: {
  recording: MusicRecording;
}) {
  let message: string;
  if (recording.status === "not-configured")
    message = "尚未設定 Spotify 資料來源。";
  else if (recording.status === "needs-authorization")
    message = "播放次數尚未啟用，需要 Spotify 的最近播放紀錄授權。";
  else if (recording.status !== "ready" || !recording.startedAt)
    message = recording.startedAt
      ? "播放紀錄暫時無法同步，目前顯示已保存的次數。"
      : "播放次數尚未同步。";
  else
    message = `自 ${formatDate(recording.startedAt)} 開始收集的播放紀錄，僅計算網站取得的紀錄，不含完整歷史次數。`;

  return <p className="music-recording-note">{message}</p>;
}
