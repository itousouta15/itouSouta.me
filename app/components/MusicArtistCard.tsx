import { MusicArtist } from "../data";
import { artistAvatarThumb, songThumb } from "../lib/imageThumb";

export default function MusicArtistCard({ artist, index }: { artist: MusicArtist; index: number }) {
  return (
    <div className="artist-card-big">
      <div className="artist-card-head">
        <div className="artist-avatar-sm">
          {artist.avatar ? (
            <img src={artistAvatarThumb(artist.avatar)} alt={artist.name} loading="lazy" decoding="async" />
          ) : (
            <span>IMAGE</span>
          )}
        </div>
        <div className="artist-card-name">{artist.name}</div>
        <div className="artist-card-rank">#{index + 1}</div>
      </div>
      <div className="song-list-scroll">
        {artist.songs.map((song, i) => {
          const body = (
            <>
              <div className="song-rank">{i + 1}</div>
              <div className="song-thumb-sm">
                {song.cover && <img src={songThumb(song.cover)} alt={song.title} loading="lazy" decoding="async" />}
              </div>
              <div className="song-row-title">{song.title}</div>
            </>
          );
          return song.href ? (
            <a className="song-row" key={i} href={song.href} target="_blank" rel="noopener noreferrer">
              {body}
            </a>
          ) : (
            <div className="song-row" key={i}>
              {body}
            </div>
          );
        })}
      </div>
    </div>
  );
}
