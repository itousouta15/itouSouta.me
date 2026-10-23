export interface MusicArtist {
  name: string;
  avatar?: string;
}

/** Used as an offline preview when the enabled Spotify service is unavailable. */
export const MUSIC_ARTISTS: MusicArtist[] = [
  { name: "喜歡的音樂人", avatar: "/assets/template/avatar.svg" },
];
