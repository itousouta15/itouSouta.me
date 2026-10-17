import type { MusicTrack } from "../../lib/music";
import { likeCircleThumb } from "../../lib/imageThumb";

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
      </div>
    </a>
  );
}
