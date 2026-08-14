export interface MusicArtist {
  name: string;
  avatar?: string;
}

/* 音樂資料的正本是 Spotify Web API（app/lib/spotify.ts）。這份清單只在缺
   credentials 或 Spotify 掛掉時當 /about 音樂卡片的頭像 fallback，所以只留
   名字跟頭像；原本的曲目清單已隨資料源轉移移除（要找的話在 git 歷史裡）。 */
export const MUSIC_ARTISTS: MusicArtist[] = [
  {
    name: "Ayase",
    avatar:
      "https://image.joox.com/JOOXcover/0/3a9ab294-4805-4593-b8ce-bee6281a8c78/300",
  },
  {
    name: "YOASOBI",
    avatar:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIP5-tHAZcqvNaIYCKizVIZbtPQINkT8Lz4g&s",
  },
  {
    name: "りりあ。",
    avatar:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRbzGiZAcjH6rUpc5Bxw4OMCq7RlmcZ1cTOtV7_XWdq0Q53FIGevjjssfs&s=10",
  },
  {
    name: "椎名林檎",
    avatar:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Shiina_Ringo_2016.jpg/250px-Shiina_Ringo_2016.jpg",
  },
  {
    name: "supercell / ryo",
    avatar:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_69Gy4cp64byEI_K5SPnbRn-rOovQyS2_6PUPlwGrFldDKr1TS7SMWVk&s=10",
  },
  {
    name: "藤井風",
    avatar:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Fujii_Kaze_performing_during_Best_Of_Fujii_Kaze_2020-2024_Asia_Tour_in_Axiata_Arena_Kuala_Lumpur_%28cropped%29_%282%29.jpg/250px-Fujii_Kaze_performing_during_Best_Of_Fujii_Kaze_2020-2024_Asia_Tour_in_Axiata_Arena_Kuala_Lumpur_%28cropped%29_%282%29.jpg",
  },
  {
    name: "ヨルシカ",
    avatar:
      "https://yt3.googleusercontent.com/ytc/AIdro_kVKEa-EG-3DL3jnIwzZ13S4zo8G57by8Gq-nJLBOcuqg=s96-c-k-c0x00ffffff-no-rj",
  },
];
