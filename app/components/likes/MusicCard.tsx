import type { MusicTrack } from "../../lib/music";
import { likeCircleThumb } from "../../lib/imageThumb";

const numbers = new Intl.NumberFormat("zh-TW");

export default function MusicCard({
  track,
  carousel = false,
  priority = false,
}: {
  track: MusicTrack;
  carousel?: boolean;
  priority?: boolean;
}) {
  return (
    <a
      className={`like-card like-card--square music-card${carousel ? " like-card--carousel" : ""}`}
      href={track.href || `https://open.spotify.com/track/${track.id}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="like-thumb">
        <img
          className="like-thumb-img"
          src={likeCircleThumb(track.cover)}
          alt=""
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : undefined}
          decoding="async"
        />
        <span className="music-rank" title="Spotify 常聽排行">
          #{track.rank}
        </span>
      </div>
      <div className="like-body">
        <h3 className="like-title" title={track.title}>
          {track.title}
        </h3>
        <div className="like-sub" title={track.artist}>
          {track.artist}
        </div>
        <div
          className="music-play-count"
          title="網站從 Spotify 最近播放紀錄累積的次數，不是完整歷史播放次數"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M3 1.5v9L10 6z" />
          </svg>
          {track.recordedPlays === null ? (
            <span className="music-count-pending">等待同步</span>
          ) : (
            <span>
              已記錄 <strong>{numbers.format(track.recordedPlays)}</strong> 次
            </span>
          )}
        </div>
      </div>
    </a>
  );
}
