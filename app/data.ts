export interface Role {
  label: string;
  color: "blue" | "purple";
}

export interface Social {
  label: string;
  href: string;
}

export interface Like {
  title: string;
  sub?: string;
  cover?: string;
  href?: string;
  rating?: number;
  personRating?: number;
  status?: string;
  tags?: string[];
  note?: string;
  /** YouTube channel ID, only needed when `href` is an @handle URL that doesn't already encode it (used to match VSPO's own live-schedule feed). */
  channelId?: string;
}

export interface LikeCategory {
  key: string;
  label: string;
  en: string;
  layout?: "circle";
  items: Like[];
}

export interface ProjectTimelineEntry {
  version: string;
  date: string;
  note?: string;
}

export interface Project {
  slug: string;
  kicker: string;
  color: "blue" | "purple";
  title: string;
  desc: string;
  tags: string[];
  icon: string;
  href: string;
  cover: string;
  siteUrl?: string;
  longDesc?: string;
  why?: string;
  difficulties?: string;
  demoUrl?: string;
  timeline?: ProjectTimelineEntry[];
}

export const ROLES: Role[] = [
  { label: "A Student", color: "blue" },
  { label: "Mankind", color: "blue" },
  { label: "Dev.", color: "purple" },
  { label: "Vocalo-P", color: "purple" },
  { label: "Illust.", color: "purple" },
];

export const SOCIALS: Social[] = [
  { label: "X", href: "#" },
  { label: "YT", href: "#" },
  { label: "px", href: "#" },
  { label: "nc", href: "#" },
];

export const TILE_COLS: string[][] = [
  ["c", "cpp", "cs", "py", "html", "css"],
  ["js", "ts", "git", "github", "vscode", "docker"],
  ["unity", "godot", "linux", "dart", "flutter"],
];

export const MARQUEE: string[] = [
  "ciallo (∠·ω )⌒★",
  "I'm itouSouta",
  "人間になりたい",
  "DEVELOPER",
  "VOCALO-P",
  "ILLUSTRATOR",
  "情熱を失っては、何もできない。",
  "Zzzz",
];

export const LIKE_CATEGORIES: LikeCategory[] = [
  {
    key: "novel",
    label: "輕小說/輕文學",
    en: "NOVEL",
    items: [
      { title: "義妹生活", tags: ["日常", "戀愛"], sub: "三河Ghost",cover:"https://upload.wikimedia.org/wikipedia/zh/b/b4/%E7%BE%A9%E5%A6%B9%E7%94%9F%E6%B4%BB1.jpg",note:"與其說這部是輕小說，我更覺得他是像輕文學，看著男女主慢慢理解彼此，磨合彼此的差異及拿捏距離。有時候不注意時間就會不小心看到天亮呢。不過在17卷中作者越來越著重描寫兩人在分開的環境中各自生活。有點現實到我了-w-",personRating: 4.8},
      { title: "那個已然飽和的夏天。", tags: ["音樂","戀愛"], sub: "カンザキイオリ" , cover: "https://tw.linovelib.com/files/article/image/3/3492/3492s.jpg?1701184476",note:"心目中カンザキイオリ老師的巔峰作，當初我是聽了音樂才買小說的，老實說前面有點折磨人，但是總體來說還是可以給到一個人上人。我記得差不多是兩年前看的，兩年過去了這首歌還是一樣好聽呢。夏天又到了呢。找個時間來二刷吧",personRating: 4.7},
      { title: "致親愛的你。", tags: ["音樂","戀愛", "懸疑"], sub: "カンザキイオリ" , cover: "https://tw.linovelib.com/files/article/image/3/3907/3907s.jpg?1701237584",personRating: 4.4 , note: "這本也是聽了音樂才買的，但相對於前一作，我覺得沒有那麼印象深刻的點。不過音樂好聽" },
      { title: "妹妹人生", tags: ["青春","戀愛"], sub: "入間人間" , cover: "https://tw.linovelib.com/files/article/image/1/1410/1410s.jpg?1705327677",personRating: 4.5 , note: "被譽為妹系聖經，整體讀下來有一種淡淡的悲傷感，描寫了一對兄妹平平淡淡的一生。沉重到了甚至有點喘不過氣。用最平凡的話語書寫最真摯的感情，表達最真實的心理。但我覺得完結的過於倉卒了。" },
      { title: "我和女友的妹妹接吻了。", tags: ["戀愛", "校園"], sub: "海空陸",cover:"https://tw.linovelib.com/files/article/image/2/2986/2986s.jpg?1756062135", personRating: 4.6, note: "劇情跌宕起伏，作者情感描寫細膩。看完之後我有千言萬語想講但感覺又說不出來。最後只有兩個字“難受”。作者最後給出了他心中最「純愛」的結局。這麼說來純愛又是什麼呢，姐姐得到了他的人，妹妹得到了他的心。這何嘗不是一種純愛呢。這個結局無疑讓整個故事上升了一個高度，但老實說我不喜歡這個結局。對於一個喜歡看糖文的人，在鋪墊了那麼多之後突然告訴我，“他們最後沒有在一起”這種感覺無疑是彆扭的。這種扭曲到最後的寫法也是貫徹始終了想想真是諷刺，姐姐不正是因為母親出軌才成長成了如此扭曲的價值觀，但結局似乎回到了一個死亡輪迴呢。真希望在那個世界裡大家都能幸福。看完心情難以平復。"},
      { title: "又做了，相同的夢", tags: ["青春"], sub: "住野夜" , cover: "https://tw.linovelib.com/files/article/image/2/2658/2658s.jpg?1661249974", personRating: 4.4, note: "住野夜一貫的細膩文筆，但不像前作胰臟那麼直白，對我來說有點過於隱晦了。講難聽一點就是我看不懂這本書想要述說些甚麼。但文中精美的句子還是讓我可以給到人上人。"},
      { title: "我想吃掉你的胰臟", tags: ["青春"], sub: "住野夜" , cover: "https://tw.linovelib.com/files/article/image/1/1500/1500s.jpg?1720457492", personRating: 4.8, note:"經典傷痛文學，用簡單的文字寫出最深刻的情感，看到日記那裡令人淚流不止QQ"},
      { title: "關於我在無意間被隔壁的天使變成廢柴這件事", tags: ["戀愛", "校園", "喜劇"], sub: "佐伯さん" , cover: "https://upload.wikimedia.org/wikipedia/zh/e/e9/%E9%97%9C%E6%96%BC%E6%88%91%E5%9C%A8%E7%84%A1%E6%84%8F%E9%96%93%E8%A2%AB%E9%9A%94%E5%A3%81%E7%9A%84%E5%A4%A9%E4%BD%BF%E8%AE%8A%E6%88%90%E5%BB%A2%E6%9F%B4%E9%80%99%E4%BB%B6%E4%BA%8B.jpg", personRating: 4.6, note: "入宅作，雖然作者寫道後免感覺有點水但還是可以給個情懷分" },
      { title: "我和班上第二可愛的女生成為朋友", tags: ["校園", "戀愛", "喜劇"], sub: "たかた" , cover:"https://upload.wikimedia.org/wikipedia/zh/b/b1/%E6%88%91%E5%92%8C%E7%8F%AD%E4%B8%8A%E7%AC%AC%E4%BA%8C%E5%8F%AF%E6%84%9B%E7%9A%84%E5%A5%B3%E7%94%9F%E6%88%90%E7%82%BA%E6%9C%8B%E5%8F%8B.jpg", personRating: 4.7, note: "科幻作品(x，海真的好婆:D，久違的讓我感受到了在床上翻滾然後縮成一團的感覺（x" },
      { title: "玩樂關係", tags: ["校園", "戀愛"], sub: "葵關南" ,cover:"https://storage.moegirl.tw/moegirl/commons/8/83/%E7%8E%A9%E4%B9%90%E5%85%B3%E7%B3%BB1%E5%9B%BE.jpg", href: "https://tw.linovelib.com/novel/4649.html", personRating: 4.5, note: "看了前幾卷目前觀感還不錯"},
      { title: "不起眼女主角培育法", tags: ["校園", "戀愛", "喜劇"], sub: "丸戶史明",cover:"https://im1.book.com.tw/image/getImage?i=https://www.books.com.tw/img/001/069/97/0010699786.jpg&v=56a9edc1k&w=375&h=375", personRating: 4.7, note: "惠好婆" },
      { title: "三日間的幸福", tags: ["戀愛", "懸疑"], sub: "三秋縋",cover:"https://bci.kinokuniya.com/jsp/images/book-img/97840/97840486/9784048661690.JPG",personRating: 4.9, note: "與所愛之人一起度過的最後三天，詮釋生命與幸福。兩個無可救藥的笨蛋互相救贖的故事，不該以一個人的孤獨守候結尾。作者善於描寫心態成長，真實而美好的幻想有強烈的帶入感。大晚上的自己看到破防@@，真希望如果我賣掉三十年壽命也可以有如此絢麗的結局啊。"},
      { title: "戀愛寄生蟲", tags: ["戀愛", "懸疑"], sub: "三秋縋",cover:"https://s.eslite.com/b2b/newItem/ebook_init/main1_194118.jpg", personRating: 4.8, note: "特殊的題材讓人眼前一亮，恰到好處的轉折，每一處都合乎情理。結尾的開放式結局也留足了想像空間。總體來說是個優秀的作品。但我比較喜歡三秋縋老師的另一部作品【三日間的幸福】" },
      { title: "通往夏天的隧道，再見的出口", tags: ["奇幻", "戀愛", "懸疑"], sub: "八目迷",cover:"https://upload.wikimedia.org/wikipedia/zh/2/2b/%E9%80%9A%E5%BE%80%E5%A4%8F%E5%A4%A9%E7%9A%84%E9%9A%A7%E9%81%93%EF%BC%8C%E5%86%8D%E8%A6%8B%E7%9A%84%E5%87%BA%E5%8F%A3.jpg",personRating: 4.6, note:"八目迷季節四部曲之夏日篇，也是最被大眾所知的一篇，另有被改編成動畫電影，我只想說:花城是個好女孩阿QAQ"},
      { title: "在昨日的春天等待你", tags: ["戀愛", "懸疑"], sub: "八目迷" ,cover:"https://s.eslite.com/upload/product/o/2681993645003/20210320040615185774.jpg",personRating: 4.7, note:"八目迷季節四部曲之春日篇，在劇情鋪墊上讓我有很深的印象，時間跳轉的手法蠻有趣的，整體也合乎邏輯"},
      { title: "櫻花庄的寵物女孩", tags: ["戀愛", "校園"], sub: "鴨志田一" ,cover:"https://tw.linovelib.com/files/article/image/1/1003/1003s.jpg?1727520866",personRating: 4.5, note:"除了男女主感情線都寫得蠻好的。值得一看的佳作"},


    ],
  },
  {
    key: "manga",
    label: "漫畫",
    en: "MANGA",
    items: [
      { title: "關於鄰家的天使大人不知不覺把我慣成廢人這檔子事", tags: ["校園", "戀愛", "日常"], sub: "芝田わん", cover: "https://www.bilimanga.net/files/cartoon/image/0/3/3s.jpg?1778696819", href: "https://home.gamer.com.tw/creationDetail.php?sn=4443577",personRating:4.6},
      { title: "躲在超市後門抽菸的兩人",personRating: 4.8, tags: ["戀愛", "日常"], sub: "地主", cover: "https://www.bilimanga.net/files/cartoon/image/0/921/921s.jpg?1779197884", href: "https://acg.gamer.com.tw/acgDetail.php?s=146348" },
      { title: "敗北女角太多了！",personRating: 5, tags: ["校園", "戀愛", "喜劇"], sub: "いたち", cover: "https://www.bilimanga.net/files/cartoon/image/0/54/54s.jpg?1770800917", href: "https://acg.gamer.com.tw/acgDetail.php?s=136968" },
      { title: "葬送的芙莉蓮",personRating: 4.8, tags: ["異世界", "奇幻", "戰鬥"], sub: "山田鐘人", cover: "https://www.bilimanga.net/files/cartoon/image/0/1/1s.jpg?1776867972", href: "https://wall.gamer.com.tw/fanpage.php?sn=21016&tab=7&userid=kuoray333" },
      { title: "【我推的孩子】",personRating: 4.7, tags: ["偶像", "懸疑"], sub: "赤坂アカ", cover: "https://www.bilimanga.net/files/cartoon/image/0/2/2s.jpg?1766597285", href: "https://wall.gamer.com.tw/fanpage.php?sn=22788&tab=7&userid=kuoray333" },
      { title: "輝夜姬想讓人告白 ～天才們的戀愛頭腦戰～", personRating: 4.6, tags: ["校園", "戀愛", "喜劇"], sub: "赤坂アカ", cover: "https://www.bilimanga.net/files/cartoon/image/0/23/23s.jpg?1778697209", href: "https://wall.gamer.com.tw/fanpage.php?sn=4921&tab=7&userid=kuoray333" },
      { title: "我當備胎女友也沒關係。", personRating: 4.6, tags: ["戀愛", "校園"], sub: "にの子", cover: "https://www.bilimanga.net/files/cartoon/image/0/24/24s.jpg?1778696806", href: "https://home.gamer.com.tw/creationDetail.php?sn=5622951" },
      { title: "總之就是非常可愛", personRating: 4.8, tags: ["戀愛", "喜劇", "日常"], sub: "畑健二郎", cover: "https://www.bilimanga.net/files/cartoon/image/0/72/72s.jpg?1782674202", href: "https://www.bilimanga.net/detail/72.html" },
      { title: "戀愛寄生蟲", personRating: 4.9, tags: ["戀愛", "懸疑"], sub: "ホタテユウキ", cover: "https://www.bilimanga.net/files/cartoon/image/0/88/88s.jpg?1729528881", href: "https://home.gamer.com.tw/artwork.php?sn=3489465" },
      { title: "借給朋友500圓，他竟然拿妹妹來抵債，我到底該如何是好", personRating: 4.6, tags: ["戀愛", "喜劇"], sub: "金子こがね", cover: "https://www.bilimanga.net/files/cartoon/image/0/150/150s.jpg?1725870112", href: "https://www.bilimanga.net/detail/150.html" },
      { title: "久保同學不放過我", personRating: 5, tags: ["校園", "戀愛", "喜劇"], sub: "雪森寧々", cover: "https://www.bilimanga.net/files/cartoon/image/0/325/325s.jpg?1774372428", href: "https://wall.gamer.com.tw/fanpage.php?sn=20798&tab=7&userid=kuoray333", note: "入宅作" },
      { title: "櫻花莊的寵物女孩", personRating: 4.8, tags: ["戀愛", "校園"], sub: "草野ほうき", cover: "https://www.bilimanga.net/files/cartoon/image/0/236/236s.jpg?1727528101", href: "https://acg.gamer.com.tw/acgDetail.php?s=41824" },
    ],
  },
  {
    key: "anime",
    label: "動漫",
    en: "ANIME",
    items: [
      { title: "想結束這場「我愛你」的遊戲",personRating: 5, tags: ["校園", "戀愛", "懸疑"], cover: "https://wall.bahamut.com.tw/B/80/4uymxm98jtc9moemj2wd1n0j1rpbtapfdxfp8lzq.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=52327&tab=7&userid=kuoray333" },
      { title: "關於我在無意間被隔壁的天使變成廢柴這件事 2", personRating: 4.0, tags: ["戀愛", "校園", "喜劇"], cover: "https://wall.bahamut.com.tw/B/88/mxc1yccd3qprsbuz6pr5ctjxaimb6js94cxushqc.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=59971&tab=7&userid=kuoray333" },
      { title: "我和班上第二可愛的女生成為朋友", personRating: 4.8, tags: ["校園", "戀愛", "喜劇"], cover: "https://wall.bahamut.com.tw/B/72/oipaqgjbtyywsetymrkbvkkrmtittslxs6kkdwtk.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=58203&tab=7&userid=kuoray333" },
      { title: "上伊那牡丹，醉姿如百合", personRating: 4.9, tags: ["校園", "戀愛", "喜劇"], cover: "https://wall.bahamut.com.tw/B/17/vvmnjtnx8jaknd2zqs2fmtlrgxepemfye4cpebis.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=65305&tab=7&userid=kuoray333" },
      { title: "靠死亡遊戲混飯吃。", personRating: 4.5, tags: ["懸疑", "戰鬥"], cover: "https://wall.bahamut.com.tw/B/35/cd6zqsw3afiavae4bo48emjas2qam2ysq6elgj9q.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=60343&tab=7&userid=kuoray333" },
      { title: "【我推的孩子】", personRating: 4.8, tags: ["偶像", "懸疑"], cover: "https://wall.bahamut.com.tw/B/96/feefjq2meiymeddflbswl4asqbrsrjoievl7sdji.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=22788&tab=7&userid=kuoray333" },
      { title: "朋友的妹妹只纏著我", personRating: 4.6, tags: ["戀愛", "校園", "後宮"], cover: "https://wall.bahamut.com.tw/B/64/5eylogpiqc5oujr2kbzykxwjybzc6wrksw9paufn.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=21026&tab=7&userid=kuoray333" },
      { title: "擁有超常技能的異世界流浪美食家 S2", personRating: 4.7, tags: ["異世界", "奇幻", "日常"], cover: "https://wall.bahamut.com.tw/B/96/czoayvm4qmcvs50gbosmmgxowx7xeppqazowetqt.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=60121&tab=7&userid=kuoray333" },
      { title: "持續狩獵史萊姆三百年，不知不覺就練到 LV MAX 第二季", personRating: 4.7, tags: ["異世界", "奇幻", "日常"], cover: "https://wall.bahamut.com.tw/B/07/xanbzylc4ghuxbvynlwxh8co98mmbowgbhfhsp94.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=52387&tab=7&userid=kuoray333" },
      { title: "水屬性的魔法師", personRating: 4.6, tags: ["異世界", "奇幻", "戰鬥"], cover: "https://wall.bahamut.com.tw/B/51/fj1azitbptfnxb7x8xxeicaydygusaf4pswsqh4u.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=64583&tab=7&userid=kuoray333" },
      { title: "公爵千金的家庭教師", personRating: 4.6, tags: ["異世界", "奇幻", "校園"], cover: "https://wall.bahamut.com.tw/B/04/jfkketwqcdaazrjlirpvhadqahplxnls0oajaub7.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=19078&tab=7&userid=kuoray333" },
      { title: "持續狩獵史萊姆三百年，不知不覺就練到 LV MAX", personRating: 4.7, tags: ["異世界", "奇幻", "日常"], cover: "https://wall.bahamut.com.tw/B/79/5d6c6dc53a09b3a1e49a97a7819b39ca9cac2454.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=4523&tab=7&userid=kuoray333" },
      { title: "酷愛電影的龐波小姐", personRating: 4.9, tags: ["日常", "喜劇"], cover: "https://wall.bahamut.com.tw/B/03/wzaankt2dvzhnx6su3cdmyhnodupc5ybo0fdzqqa.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=17577&tab=7&userid=kuoray333" },
      { title: "歲月流逝飯菜依舊美味", personRating: 4.8, tags: ["日常", "戀愛"], cover: "https://wall.bahamut.com.tw/B/89/otfavncpqnjbnqlblssydyc7nrxugoapirqi7p7g.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=65319&tab=7&userid=kuoray333" },
      { title: "帝乃三姊妹意外地容易相處。",personRating:4.7, tags: ["戀愛", "喜劇", "後宮"], cover: "https://wall.bahamut.com.tw/B/19/tii5s2unkuqotty33v0dlft9hsqdppic61aphzqh.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=62543&tab=7&userid=kuoray333" },
      { title: "我們不可能成為戀人！絕對不行。（※似乎可行？）",personRating:4.9, tags: ["校園", "戀愛", "喜劇"], cover: "https://wall.bahamut.com.tw/B/83/uksiqaihhfmrgnw0kqpgmzkbw4ec9ktibjhxquji.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=56950&tab=7&userid=kuoray333" },
      { title: "聲優廣播的幕前幕後",personRating:4.8, tags: ["校園", "喜劇", "日常"], cover: "https://wall.bahamut.com.tw/B/08/1mibbemmucb6cwg3h7szjzrw6pjncsurnmocr1o9.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=21828&tab=7&userid=kuoray333" },
      { title: "歡迎光臨流放者食堂！",personRating:4.8, tags: ["異世界", "奇幻", "日常"], cover: "https://wall.bahamut.com.tw/B/71/yybwogg3qxpklggw7awqeohpxfmgcpexfk1ickfn.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=53250&tab=7&userid=kuoray333" },
      { title: "K-ON！！輕音部",personRating:5, tags: ["校園", "音樂", "日常"], cover: "https://wall.bahamut.com.tw/B/92/12a45f7b40c8a42d78c7ad6fa71a7aa82e8ed965.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=9762&tab=7&userid=kuoray333" },
      { title: "青春豬頭少年不會夢到嬌憐外出妹",personRating:4.9, tags: ["校園", "戀愛", "奇幻"], cover: "https://wall.bahamut.com.tw/B/25/ouzel1f08axl2shw9np4jgqkyozkoxtny43s6vpk.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=56065&tab=7&userid=kuoray333" },
      { title: "青春豬頭少年不會夢到紅書包女孩",personRating:4.9, tags: ["校園", "戀愛", "奇幻"], cover: "https://wall.bahamut.com.tw/B/87/h2yw9tp1qsgk5zkoibwzeei5to2fummualrlc4jj.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=58639&tab=7&userid=kuoray333" },
      { title: "青春豬頭少年不會夢到聖誕服女郎",personRating:4.9, tags: ["校園", "戀愛", "奇幻"], cover: "https://wall.bahamut.com.tw/B/29/7lbutxemvcy0ummthndhzvu1kkgywm0wmuhf3mpw.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=60439&tab=7&userid=kuoray333" },
      { title: "膽大黨 第二季",personRating:4.8, tags: ["校園", "戰鬥", "喜劇"], cover: "https://wall.bahamut.com.tw/B/33/o1rnyzvyh3ofct4htmof1bywx77tgey79udh3krq.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=64133&tab=7&userid=kuoray333" },
      { title: "章魚嗶的原罪",personRating:4.9, tags: ["懸疑", "奇幻"], cover: "https://wall.bahamut.com.tw/B/76/er51yefygqsmsyijfryzs17myo3bfj1pl4yfcea0.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=54159&tab=7&userid=kuoray333" },
      { title: "K-ON！輕音部",personRating:5, tags: ["校園", "音樂", "日常"], cover: "https://wall.bahamut.com.tw/B/21/7c68a3c86f9041b51336d5387c0980dd2fb2098c.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=9753&tab=7&userid=kuoray333" },
      { title: "Summer Pockets",personRating:4.9, tags: ["戀愛", "日常", "懸疑"], cover: "https://wall.bahamut.com.tw/B/80/rkblj0x4iuvgeivwao2akmted3wfnbgkm04ubmbh.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=12485&tab=7&userid=kuoray333" },
      { title: "紫雲寺家的兄弟姊妹",personRating:4.4, tags: ["戀愛", "喜劇", "日常"], cover: "https://wall.bahamut.com.tw/B/78/yyklnbgntrro2wvsysvajlpfmi3vyvlchkclyqry.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=55663&tab=7&userid=kuoray333" },
      { title: "劇場總集篇 孤獨搖滾！Re:",personRating:4.9, tags: ["校園", "音樂", "喜劇"], cover: "https://wall.bahamut.com.tw/B/22/fwhq5ag9rts5oh5gcch4xw2uyzgl6moukv6lyxwa.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=60197&tab=7&userid=kuoray333" },
      { title: "劇場總集篇 孤獨搖滾！Re: Re:",personRating:4.9, tags: ["校園", "音樂", "喜劇"], cover: "https://wall.bahamut.com.tw/B/47/jmgk0vcmocpcomoo3dliovebo5jzz0jeuucduhbt.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=65354&tab=7&userid=kuoray333" },      { title: "男女之間存在純友情嗎？（不，不存在！）", tags: ["校園", "戀愛", "喜劇"], cover: "https://wall.bahamut.com.tw/B/72/zidhjoesl6l5fefacn0hrbaalma3p2ekfd42vlhc.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=53772&tab=7&userid=kuoray333" },
      { title: "道別的早晨就用約定之花點綴吧",personRating:5, tags: ["奇幻", "戀愛", "懸疑"], cover: "https://wall.bahamut.com.tw/B/32/7hyqjqeeqv8hqj9m6iiofmgoie7lrnkbfr0wbq4r.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=23038&tab=7&userid=kuoray333" },
      { title: "少女樂團 吶喊吧",personRating:5,  tags: ["音樂", "校園"], cover: "https://wall.bahamut.com.tw/B/21/k7btdckvucn4h5kkid6lfdijzkeg89dcrla86zx5.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=58078&tab=7&userid=kuoray333" },
      { title: "在地下城尋求邂逅是否搞錯了什麼 第五季",personRating:4.9, tags: ["異世界", "奇幻", "戰鬥"], cover: "https://wall.bahamut.com.tw/B/02/u1xbl0fnua0kgsgrneerksny95gvnvme6uvrl1io.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=60165&tab=7&userid=kuoray333" },
      { title: "在地下城尋求邂逅是否搞錯了什麼 第四季",personRating:4.8, tags: ["異世界", "奇幻", "戰鬥"], cover: "https://wall.bahamut.com.tw/B/25/hbqybqoqcynv9vryknhbhay63pihwihqvngajjip.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=21013&tab=7&userid=kuoray333" },
      { title: "在地下城尋求邂逅是否搞錯了什麼 第二季",personRating:4.7, tags: ["異世界", "奇幻", "戰鬥"], cover: "https://wall.bahamut.com.tw/B/66/f0c40dbac74dce8c557cab425666f35aa21c4e8e.PNG", href: "https://wall.gamer.com.tw/fanpage.php?sn=1491&tab=7&userid=kuoray333" },
      { title: "劇場版 在地下城尋求邂逅是否搞錯了什麼 ─ 獵戶座",personRating:4.8, tags: ["異世界", "奇幻", "戰鬥"], cover: "https://wall.bahamut.com.tw/B/06/a3371ad8dcfd8b50c977ffc349093f748e540eb6.PNG", href: "https://wall.gamer.com.tw/fanpage.php?sn=1492&tab=7&userid=kuoray333" },
      { title: "在地下城尋求邂逅是否搞錯了什麼 第三季",personRating:4.8, tags: ["異世界", "奇幻", "戰鬥"], cover: "https://wall.bahamut.com.tw/B/04/hvnnye19zulqckyeoltakn3hnrx2w9rdwttmqwbc.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=16080&tab=7&userid=kuoray333" },
      { title: "劍姬神聖譚",personRating:4.8, tags: ["異世界", "奇幻", "戰鬥"], cover: "https://wall.bahamut.com.tw/B/82/rrw8gbwgrqv6lvuzkyxdhw84jsh73v1daz36qsiq.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=10072&tab=7&userid=kuoray333" },
      { title: "在地下城尋求邂逅是否搞錯了什麼",personRating:4.8, tags: ["異世界", "奇幻", "戰鬥"], cover: "https://wall.bahamut.com.tw/B/74/afc0b8952feddf2a84a17422756ae2269c82bc5b.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=9935&tab=7&userid=kuoray333" },
      { title: "BanG Dream! It's MyGO!!!!!",personRating:5, tags: ["音樂", "校園"], cover: "https://wall.bahamut.com.tw/B/51/nsnjvjn6esb5hfnj4lryectgyyilezwpgetuzufk.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=57966&tab=7&userid=kuoray333" },
      { title: "群花綻放、彷如修羅",personRating:4.9, tags: ["百合", "戀愛"], cover: "https://wall.bahamut.com.tw/B/85/6egciygoyhviydqroh33sdib6xwanfa7x0ib4l1c.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=62330&tab=7&userid=kuoray333" },
      { title: "雖然是公會的櫃檯小姐，但因為不想加班所以打算獨自討伐迷宮頭目",personRating:4.7, tags: ["異世界", "奇幻", "喜劇"], cover: "https://wall.bahamut.com.tw/B/20/ksanawydi9neuh7fcryqzpd88oetje7xwy7mv6h9.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=58559&tab=7&userid=kuoray333" },
      { title: "為美好的世界獻上祝福！3",personRating:4.8, tags: ["異世界", "奇幻", "喜劇"], cover: "https://wall.bahamut.com.tw/B/10/0bofvjq6qnvmeplamzady1cfwetmmkwn93plikhv.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=22771&tab=7&userid=kuoray333" },
      { title: "為美好的世界獻上爆焰！",personRating:4.7, tags: ["異世界", "奇幻", "喜劇"], cover: "https://wall.bahamut.com.tw/B/86/51564202d44dc12efb1f7abc40def22650fa71e2.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=864&tab=7&userid=kuoray333" },
      { title: "為美好的世界獻上祝福！紅傳說",personRating:4.8, tags: ["異世界", "奇幻", "喜劇"], cover: "https://wall.bahamut.com.tw/B/83/emzhwdzzaaltkfj9y24qmelepnzx7fymcywma5oj.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=925&tab=7&userid=kuoray333" },
      { title: "為美好的世界獻上祝福！2",personRating:4.8, tags: ["異世界", "奇幻", "喜劇"], cover: "https://wall.bahamut.com.tw/B/49/79430d5bcfd0e981e38c81cf2df9c2c1d2f27a56.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=10051&tab=7&userid=kuoray333" },
      { title: "為美好的世界獻上祝福！",personRating:4.8, tags: ["異世界", "奇幻", "喜劇"], cover: "https://wall.bahamut.com.tw/B/86/de92fe1e0fc653f644f37c3eae57cb6f66ee39a7.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=9988&tab=7&userid=kuoray333" },
      { title: "BanG Dream! Ave Mujica",personRating:4.9, tags: ["音樂", "懸疑"], cover: "https://wall.bahamut.com.tw/B/23/antqpdhwl0gqmo6ugixlxnypgdbqk7ixk4ks6kyx.PNG", href: "https://wall.gamer.com.tw/fanpage.php?sn=59706&tab=7&userid=kuoray333" },
      { title: "歡迎來到日本，妖精小姐。",personRating:4.8, tags: ["奇幻", "戀愛", "喜劇"], cover: "https://wall.bahamut.com.tw/B/81/9uzbjwnveqbavtz8rqh2hnukmum7xm6r9wmtzmgf.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=50618&tab=7&userid=kuoray333" },
      { title: "我和班上最討厭的女生結婚了。",personRating:4.5, tags: ["校園", "戀愛", "喜劇"], cover: "https://wall.bahamut.com.tw/B/08/gaxdlmignmqakbtae0krdh2owqxc4lsdxh4e71c6.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=52092&tab=7&userid=kuoray333" },
      { title: "Re：從零開始的異世界生活 第三季",personRating:4.6, tags: ["異世界", "奇幻", "懸疑"], cover: "https://wall.bahamut.com.tw/B/21/kjfddskapir16avckw7tlov674iwjhwzlvvsxq62.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=57816&tab=7&userid=kuoray333" },
      { title: "膽大黨",personRating:4.8, tags: ["校園", "戰鬥", "喜劇"], cover: "https://wall.bahamut.com.tw/B/40/mk36qhpnfgal5wcnfqjzynbquxskjcgmmn4w4fh7.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=50466&tab=7&userid=kuoray333" },
      { title: "結緣甘神神社",personRating:4.7, tags: ["戀愛", "奇幻", "喜劇"], cover: "https://wall.bahamut.com.tw/B/72/5lx6hwtic4x0sexlaxxszvyukehzmibmrvxzhs1f.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=50241&tab=7&userid=kuoray333" },
      { title: "久保同學不放過我",personRating:4.9, tags: ["校園", "戀愛", "喜劇"], cover: "https://wall.bahamut.com.tw/B/19/wgomkacb68l7s92vaeiwewgcfgnn0mnw4hadutbc.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=20798&tab=7&userid=kuoray333" },
      { title: "孤獨搖滾！",personRating:5, tags: ["校園", "音樂", "喜劇"], cover: "https://wall.bahamut.com.tw/B/88/esgw88vnfmisuthhofjac4uc9rzxrhm3azo9dmhl.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=21154&tab=7&userid=kuoray333" },
      { title: "冰屬性男子與無表情女子",personRating:4.8, tags: ["校園", "戀愛", "喜劇"], cover: "https://wall.bahamut.com.tw/B/17/y95icgostjh8jw8bz4fdlu0t2pzq6dhw0tkt7qje.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=54845&tab=7&userid=kuoray333" },
      { title: "不要欺負我，長瀞同學",personRating:4.7, tags: ["校園", "戀愛", "喜劇"], cover: "https://wall.bahamut.com.tw/B/74/q6mysxytqftwzvedqqmmac27te1ivqmcwdbpvmqg.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=18707&tab=7&userid=kuoray333" },
      { title: "小桃小栗 Love Love 物語",personRating:4.7, tags: ["戀愛", "喜劇", "日常"], cover: "https://wall.bahamut.com.tw/B/92/c710ef88b369236e1d138e82e6a0c1ee56e29f44.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=9989&tab=7&userid=kuoray333" },
      { title: "堀與宮村",personRating:4.8, tags: ["校園", "戀愛", "日常"], cover: "https://wall.bahamut.com.tw/B/50/xngqujvi57tzrt9vi3zuklzcq5spk2wdurq36fpx.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=19719&tab=7&userid=kuoray333" },
      { title: "刮掉鬍子的我與撿到的女高中生",personRating:4.7, tags: ["戀愛", "日常"], cover: "https://wall.bahamut.com.tw/B/40/sxqs9ayhzryjnmeriqj5tap1kcwgtpwnmq0xhftt.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=14902&tab=7&userid=kuoray333" },
      { title: "擅長捉弄人的高木同學 第三季",personRating:4.7, tags: ["校園", "戀愛", "喜劇"], cover: "https://wall.bahamut.com.tw/B/35/tktyw6finnf4yrsuryjbpxhavpgionv22as9v6ce.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=49711&tab=7&userid=kuoray333" },
      { title: "劇場版 擅長捉弄人的高木同學",personRating:4.7, tags: ["校園", "戀愛", "喜劇"], cover: "https://wall.bahamut.com.tw/B/15/soopbvqrilgxgx3tlzerratz78hqpyqyr7g1c1u8.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=54165&tab=7&userid=kuoray333" },
      { title: "政宗君的復仇",personRating:4.7, tags: ["校園", "戀愛", "喜劇"], cover: "https://wall.bahamut.com.tw/B/66/b284fb4fab41aa5445a07fc511acc903a95c50a6.PNG", href: "https://wall.gamer.com.tw/fanpage.php?sn=10043&tab=7&userid=kuoray333" },
      { title: "異世界悠閒農家",personRating:4.8, tags: ["異世界", "奇幻", "日常"], cover: "https://wall.bahamut.com.tw/B/23/ff74331c3b68ba05ef391e693fec6ec6aba3a3fd.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=3395&tab=7&userid=kuoray333" },
      { title: "出租女友",personRating:4.0, tags: ["戀愛", "喜劇", "校園"], cover: "https://wall.bahamut.com.tw/B/43/wvs3nemn100grjztrmyhf3bzxhxkxrnksm1fg0e5.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=16853&tab=7&userid=kuoray333" },
      { title: "輝夜姬想讓人告白～天才們的戀愛頭腦戰～ 第二季",personRating:4.8, tags: ["校園", "戀愛", "喜劇"], cover: "https://wall.bahamut.com.tw/B/71/1xtoqtbpmhyxnrx66uho8iwczt9wjrtugy2vj6mz.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=16244&tab=7&userid=kuoray333" },
      { title: "輝夜姬想讓人告白？～天才們的戀愛頭腦戰～ 第二季 OVA",personRating:4.8, tags: ["校園", "戀愛", "喜劇"], cover: "https://wall.bahamut.com.tw/B/98/dujks6t9bj0cujoodcbjfvnv8poge3j8tnbvcfl2.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=54299&tab=7&userid=kuoray333" },
      { title: "輝夜姬想讓人告白～天才們的戀愛頭腦戰～",personRating:4.8, tags: ["校園", "戀愛", "喜劇"], cover: "https://wall.bahamut.com.tw/B/01/27f960f0c3e227d2746c81c1ed4bd1513ce7066f.PNG", href: "https://wall.gamer.com.tw/fanpage.php?sn=4921&tab=7&userid=kuoray333" },
      { title: "出租女友 第二季",personRating:4.1, tags: ["戀愛", "喜劇", "校園"], cover: "https://wall.bahamut.com.tw/B/23/f2lpwkrdtmlee95ouzlcuj5whecwb2ttfvfrvhqw.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=53335&tab=7&userid=kuoray333" },
      { title: "歡迎來到實力至上主義的教室",personRating:4.8, tags: ["校園", "懸疑"], cover: "https://wall.bahamut.com.tw/B/15/c03cc5d5f95bc7a88e5d8b655778527fd9265d60.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=10083&tab=7&userid=kuoray333" },
      { title: "歡迎來到實力至上主義的教室 第二季",personRating:4.7, tags: ["校園", "懸疑"], cover: "https://wall.bahamut.com.tw/B/65/uz1nsv8njhvurlpxiyyfmt2skvm5i4pouurcjrzh.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=53787&tab=7&userid=kuoray333" },
      { title: "戀上換裝娃娃",personRating:4.8, tags: ["校園", "戀愛", "日常"], cover: "https://wall.bahamut.com.tw/B/35/lsodmarts1teizpwf0c09wf0yrcmrzjghawsffnu.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=15092&tab=7&userid=kuoray333" },
      { title: "徒然喜歡你", tags: ["戀愛", "校園"],personRating:4.8, cover: "https://wall.bahamut.com.tw/B/27/9082c16857b940584205e61063ea5d0a838a302d.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=10078&tab=7&userid=kuoray333" },
      { title: "繼母的拖油瓶是我的前女友", tags: ["戀愛", "校園", "喜劇"],personRating:4.6, cover: "https://wall.bahamut.com.tw/B/80/b8rowk7nzj1yloaourj4msdvtpvszu5ueeefhcaf.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=19261&tab=7&userid=kuoray333" },
      { title: "果然我的青春戀愛喜劇搞錯了。", tags: ["校園", "戀愛", "喜劇"],personRating:4.8, cover: "https://wall.bahamut.com.tw/B/89/kwtf8xd64jwmhhqt7egoxkahul7uoarhtbpjmoq1.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=17481&tab=7&userid=kuoray333" },
      { title: "夫婦以上，戀人未滿", tags: ["戀愛", "喜劇"],personRating:4.8, cover: "https://wall.bahamut.com.tw/B/12/kum6o9gecedpieq3bkqgygk4r1dlgx4dw5c9bviy.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=13174&tab=7&userid=kuoray333" },
      { title: "式守同學不只可愛而已",personRating:4.8, tags: ["校園", "戀愛", "喜劇"], cover: "https://wall.bahamut.com.tw/B/33/twtn2ja75nimnhd2sgaa94zevpmf4ykntctsorbz.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=20684&tab=7&userid=kuoray333" },
      { title: "我家有個魚乾妹 R",personRating:4.8, tags: ["日常", "喜劇"], cover: "https://wall.bahamut.com.tw/B/98/qp1dnkmpqce9rsfrxpnkj7cvxxoffbn0u7g5hmpt.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=21506&tab=7&userid=kuoray333" },
      { title: "我家有個魚乾妹",personRating:4.8, tags: ["日常", "喜劇"], cover: "https://wall.bahamut.com.tw/B/72/00a39bb38b7fa8d7f4b8893564183e805a4d69a9.PNG", href: "https://wall.gamer.com.tw/fanpage.php?sn=11545&tab=7&userid=kuoray333" },
      { title: "不當哥哥了！",personRating:4.8, tags: ["戀愛", "喜劇", "校園"], cover: "https://wall.bahamut.com.tw/B/35/542c24275fcfe62a56bacac3fa9c092d2c8dd4da.PNG", href: "https://wall.gamer.com.tw/fanpage.php?sn=1392&tab=7&userid=kuoray333" },
      { title: "情色漫畫老師",personRating:4.8, tags: ["戀愛", "喜劇", "日常"], cover: "https://wall.bahamut.com.tw/B/39/e481e2c585bc38a9cc0a52352ccd2aba205a15a5.PNG", href: "https://wall.gamer.com.tw/fanpage.php?sn=11547&tab=7&userid=kuoray333" },
      { title: "在無神世界裡進行傳教活動",personRating:4.8, tags: ["異世界", "奇幻", "喜劇"], cover: "https://wall.bahamut.com.tw/B/39/qum9f7vwv5txsafgnbylsxvum3za4oculjxnrjmg.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=54428&tab=7&userid=kuoray333" },
      { title: "四月是你的謊言",personRating:4.9, tags: ["校園", "音樂", "戀愛"], cover: "https://wall.bahamut.com.tw/B/96/94425418a13d9d470436af4fac6813fd8eebda17.PNG", href: "https://wall.gamer.com.tw/fanpage.php?sn=11150&tab=7&userid=kuoray333" },
      { title: "青春豬頭少年不會夢到兔女郎學姊",personRating:4.9, tags: ["校園", "戀愛", "奇幻"], cover: "https://wall.bahamut.com.tw/B/15/75c366b0c536d552dfe8835b111e681af274af8d.PNG", href: "https://wall.gamer.com.tw/fanpage.php?sn=4874&tab=7&userid=kuoray333" },
      { title: "在異世界獲得超強能力的我，在現實世界照樣無敵～等級提升改變人生命運～",personRating:4.3, tags: ["異世界", "奇幻", "戰鬥"], cover: "https://wall.bahamut.com.tw/B/05/dnyojnyc7mtfz5x9ccwbv4brupgsd8nofzuexknv.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=52222&tab=7&userid=kuoray333" },
      { title: "熊熊勇闖異世界",personRating:4.7, tags: ["異世界", "奇幻", "日常"], cover: "https://wall.bahamut.com.tw/B/63/llw3yuuncmwz0m574s5elcblh4soaarssx0gkxnk.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=16992&tab=7&userid=kuoray333" },
      { title: "熊熊勇闖異世界 PUNCH！", tags: ["異世界", "奇幻", "日常"], cover: "https://wall.bahamut.com.tw/B/53/tkwzdxcxn32txw0uqqjq7yoxxaofr7kvaid6xma9.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=56498&tab=7&userid=kuoray333" },
      { title: "Lycoris Recoil 莉可麗絲",personRating:4.9, tags: ["戰鬥", "日常", "懸疑"], cover: "https://wall.bahamut.com.tw/B/30/wtz4zy3cietdmlo01jcu8dpviox6meum4figgu6q.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=52332&tab=7&userid=kuoray333" },
      { title: "輝夜姬想讓人告白－永不結束的初吻－",personRating:4.8, tags: ["校園", "戀愛", "喜劇"], cover: "https://wall.bahamut.com.tw/B/57/wm7rrpoxuofatsc3crv7s09pg8veraxhxh6qrurs.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=55107&tab=7&userid=kuoray333" },
      { title: "被解僱的暗黑士兵（30多歲）開始了慢生活的第二人生",personRating:4.7, tags: ["異世界", "奇幻", "日常"], cover: "https://wall.bahamut.com.tw/B/01/zum9evslqogc9udfhihssisqj2kxu7woixgrmlk8.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=55272&tab=7&userid=kuoray333" },
      { title: "果然我的青春戀愛喜劇搞錯了。完",personRating:4.9, tags: ["校園", "戀愛", "喜劇"], cover: "https://wall.bahamut.com.tw/B/35/axafcibzjdx1n2qro5dpshaqudqezbaxse98xifn.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=13722&tab=7&userid=kuoray333" },
      { title: "果然我的青春戀愛喜劇搞錯了。續",personRating:4.9, tags: ["校園", "戀愛", "喜劇"], cover: "https://wall.bahamut.com.tw/B/12/bee991e1895a8f87ba8d6930f69d8d2f25fe17c3.PNG", href: "https://wall.gamer.com.tw/fanpage.php?sn=9535&tab=7&userid=kuoray333" },
      { title: "昨日之歌", tags: ["戀愛", "懸疑"],personRating:4.7, cover: "https://wall.bahamut.com.tw/B/73/p2gqtdvymzffxkxz2asxvqttcovhw523gbmqi111.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=14012&tab=7&userid=kuoray333" },
      { title: "無論何時我們的戀情都是10厘米。",personRating:4.8, tags: ["戀愛", "校園"], cover: "https://wall.bahamut.com.tw/B/16/gyw5tezcll5yu9pscmokqnkv2j2e0w8t5nnackuo.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=48950&tab=7&userid=kuoray333" },
      { title: "從好久以前就喜歡你",personRating:4.8, tags: ["戀愛", "校園"], cover: "https://wall.bahamut.com.tw/B/12/7fcfr2hmzbtxeyy5kvuff408vbkgskxwe769g1bz.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=46552&tab=7&userid=kuoray333" },
      { title: "喜歡上你的那瞬間",personRating:4.8, tags: ["戀愛", "校園"], cover: "https://wall.bahamut.com.tw/B/46/dqnxwtdas13oy0as7jjbczw8di0oygzzkylukett.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=48002&tab=7&userid=kuoray333" },
      { title: "僕愛君愛：致深愛妳的那個我",personRating:4.6, tags: ["戀愛", "懸疑"], cover: "https://wall.bahamut.com.tw/B/55/j06b8cmiwavmm0fdtydmigxrd1xgdutnnswm5zee.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=54529&tab=7&userid=kuoray333" },
      { title: "線上遊戲的老婆不可能是女生？",personRating:4.7, tags: ["戀愛", "喜劇", "日常"], cover: "https://wall.bahamut.com.tw/B/63/910299852131ffe87163a4c3b48dd9def04b941d.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=10002&tab=7&userid=kuoray333" },
      { title: "偵探已經，死了。",personRating:4.7, tags: ["懸疑", "戰鬥", "戀愛"], cover: "https://wall.bahamut.com.tw/B/32/rwdrmn7pzuhbmugsaoy5v9zjcwt28xdyqpzbjwod.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=20377&tab=7&userid=kuoray333" },
      { title: "我們的重製人生",personRating:4.8, tags: ["音樂", "懸疑", "日常"], cover: "https://wall.bahamut.com.tw/B/89/x4nvxidj97xqucmhrzzqo3qkcbwnkufggp7crm3r.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=16914&tab=7&userid=kuoray333" },
      { title: "契約之吻",personRating:4.8, tags: ["戀愛", "校園"], cover: "https://wall.bahamut.com.tw/B/12/cf5muhbdbhps5dq4otikhgrsuhiren7mzlfu6vfy.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=54226&tab=7&userid=kuoray333" },
      { title: "葬送的芙莉蓮",personRating:4.8, tags: ["異世界", "奇幻", "戰鬥"], cover: "https://wall.bahamut.com.tw/B/47/1pxnmg0tfo2q48bc0m7nvpvpm486vwwdrajnlmyy.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=21016&tab=7&userid=kuoray333" },
      { title: "笨拙之極的上野",personRating:4.8, tags: ["戀愛", "校園", "喜劇"], cover: "https://wall.bahamut.com.tw/B/76/dfarrro2zrafitydrbwtc0u1oxoe8xk4hxvgesk8.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=4918&tab=7&userid=kuoray333" },
      { title: "家裡蹲吸血姬的鬱悶",personRating:4.8, tags: ["喜劇", "奇幻", "日常"], cover: "https://wall.bahamut.com.tw/B/17/owtpkedfurvz2vtdp6ezdnvbygwjmxnda4m7x7el.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=53636&tab=7&userid=kuoray333" },
      { title: "超超超超超喜歡你的 100 個女朋友",personRating:4.7, tags: ["戀愛", "校園", "後宮", "喜劇"], cover: "https://wall.bahamut.com.tw/B/16/5tfp8e1vdhuvuxy5syah1wduef6gonojqjlpapea.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=21319&tab=7&userid=kuoray333" },
      { title: "加油吧同期醬",personRating:4.8, tags: ["喜劇", "日常"], cover: "https://wall.bahamut.com.tw/B/91/2z9pcuf22kxf4n0kcueq2meks7z99ygrdxnzc4q2.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=23059&tab=7&userid=kuoray333" },
      { title: "女朋友 and 女朋友 第二季",personRating:4.8, tags: ["戀愛", "校園", "後宮", "喜劇"], cover: "https://wall.bahamut.com.tw/B/33/fppchh3wzdpjv6ejpowplbb6cqvyhlqtimzku1lf.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=55956&tab=7&userid=kuoray333" },
    ],
  },
  {
    key: "vtuber",
    label: "VTuber",
    en: "VTUBER",
    layout: "circle",
    items: [
      { title: "花芽すみれ",tags:["VSPO"], sub: "VSPO", href: "https://www.youtube.com/@kagasumire", channelId: "UCyLGcqYs7RsBb3L0SJfzGYA", cover: "https://yt3.googleusercontent.com/62gVOJZDVb-9pPCbljnoRlwqEuvcGk0pNl32GNi_GA_KQS3N7X6-B660Pk3crHh3zi1XSzHMNQ=s900-c-k-c0x00ffffff-no-rj" },
      { title: "花芽なずな", tags: ["VSPO"], sub: "VSPO", href: "https://www.youtube.com/@nazunakaga", channelId: "UCiMG6VdScBabPhJ1ZtaVmbw", cover: "https://yt3.googleusercontent.com/AiM0dD6-tajxuBeozH1YberZhKAANawzH_WDwLo9zLaqlGaen_nxW6q1RQt7k79FXEeQLXPFOIM=s900-c-k-c0x00ffffff-no-rj" },
      { title: "胡桃のあ", tags: ["VSPO"], sub: "VSPO", href: "https://www.youtube.com/@963Noah", channelId: "UCIcAj6WkJ8vZ7DeJVgmeqKw", cover: "https://yt3.googleusercontent.com/P0TCuLWSv_bK-G6p7j-wY2XM6w78G8Z-vtZ-XxkuIXfjFuScBCL3_LLCl1W6dgdMe3GcikiskQ=s900-c-k-c0x00ffffff-no-rj" },
      { title: "猫汰つな", tags: ["VSPO"], sub: "VSPO", href: "https://www.youtube.com/@tsuna_nekota", channelId: "UCIjdfjcSaEgdjwbgjxC3ZWg", cover: "https://yt3.googleusercontent.com/t8oKW3u3BqieOUZ4j3d_qxV2fBEypIpVkq3vY2SYlOD2gblH-4fSjBOGW9O5eiOagOhhuUzA=s900-c-k-c0x00ffffff-no-rj" },
      { title: "小雀とと", tags: ["VSPO"], sub: "VSPO", href: "https://www.youtube.com/channel/UCgTzsBI0DIRopMylJEDqnog", cover: "https://yt3.googleusercontent.com/ytc/AIdro_lEifEusAxSkqQg12z_wUO1bGfGIqo9Vv4OYz6X5BhCIg=s900-c-k-c0x00ffffff-no-rj" },
      { title: "一ノ瀬うるは", tags: ["VSPO"], sub: "VSPO", href: "https://www.youtube.com/channel/UC5LyYg6cCA4yHEYvtUsir3g", cover: "https://yt3.googleusercontent.com/ytc/AIdro_myySkwnJbRZM78Ct6Zqok5H0oegoEjLOtg6sdq117VRAM=s900-c-k-c0x00ffffff-no-rj" },
      { title: "兎咲ミミ", tags: ["VSPO"], sub: "VSPO", href: "https://www.youtube.com/channel/UCnvVG9RbOW3J6Ifqo-zKLiw", cover: "https://yt3.googleusercontent.com/9cJ6zJabky32vTsNMD4NdQQrCIttzqpmC_kW55tKwJuh6OUiCs8MVziidVYfJOa9dBLlgcNwHw=s900-c-k-c0x00ffffff-no-rj" },
      { title: "空澄セナ", tags: ["VSPO"], sub: "VSPO", href: "https://www.youtube.com/channel/UCF_U2GCKHvDz52jWdizppIA", cover: "https://yt3.googleusercontent.com/lBR2WoXWscLmYRBvwkwJBQR8-hkPl3aWzEZWzIlRLLG2hJMY-JZxwQ7Cc_EGqcyxqbzfMEzi=s900-c-k-c0x00ffffff-no-rj" },
      { title: "橘ひなの", tags: ["VSPO"], sub: "VSPO", href: "https://www.youtube.com/channel/UCvUc0m317LWTTPZoBQV479A", cover: "https://yt3.googleusercontent.com/qBHwrzfOske0YrfKhyd-tCBGcsoka2h1tHdX09EOdx7uAmAYpYeIEldA-aYYhBROPvADi9_4FA=s900-c-k-c0x00ffffff-no-rj" },
      { title: "英リサ", tags: ["VSPO"], sub: "VSPO", href: "https://www.youtube.com/channel/UCurEA8YoqFwimJcAuSHU0MQ", cover: "https://yt3.googleusercontent.com/ytc/AIdro_nDEKrUIjF9DlTu-bEc-DenqIj-md5YkUqhGhqwyBLBgQ=s900-c-k-c0x00ffffff-no-rj" },
      { title: "如月れん", tags: ["VSPO"], sub: "VSPO", href: "https://www.youtube.com/channel/UCGWa1dMU_sDCaRQjdabsVgg", cover: "https://yt3.googleusercontent.com/l2mkMKBJ9OKCEKuY2HhDx_i0oKYWvjXQontI0pi3_AZwisv6FOQArd13bNpU4ko_rMhfdR-v7zU=s900-c-k-c0x00ffffff-no-rj" },
      { title: "神成きゅぴ", tags: ["VSPO"], sub: "VSPO", href: "https://www.youtube.com/channel/UCMp55EbT_ZlqiMS3lCj01BQ", cover: "https://yt3.googleusercontent.com/5IgSXAOfwIFU60tdD88_gdEDZBvJs-3u-ogu3VWWSpWepyN1H9n6Gdyvlgya5PuR0ARtfNl9=s900-c-k-c0x00ffffff-no-rj" },
      { title: "八雲べに", tags: ["VSPO"], sub: "VSPO", href: "https://www.youtube.com/channel/UCjXBuHmWkieBApgBhDuJMMQ", cover: "https://yt3.googleusercontent.com/3DKslDQ-fYLyIA5WNS3cl3Hesu6QRWD74C1kU1MYgoLtzenCSdkz1H4mOmFJ3HT_3ZlhNfFR=s900-c-k-c0x00ffffff-no-rj" },
      { title: "藍沢エマ", tags: ["VSPO"], sub: "VSPO", href: "https://www.youtube.com/channel/UCPkKpOHxEDcwmUAnRpIu-Ng", cover: "https://yt3.googleusercontent.com/wuec9EJq49vLP5Urd_Jtr-2-UcRnKA_Z0VffwgIV5OCkrdiYqKURoN8q431M6MxCnGzMGDtlLw=s900-c-k-c0x00ffffff-no-rj" },
      { title: "紫宮るな", tags: ["VSPO"], sub: "VSPO", href: "https://www.youtube.com/channel/UCD5W21JqNMv_tV9nfjvF9sw", cover: "https://yt3.googleusercontent.com/Rgt9lslf7OZntxcW8A9mMFWDdXTG1IxqCq4tZ14Rd7rB1rm4gxQZPTc5kM9LdGTPmXGWkfyzWw=s900-c-k-c0x00ffffff-no-rj" },
      { title: "白波らむね", tags: ["VSPO"], sub: "VSPO", href: "https://www.youtube.com/channel/UC61OwuYOVuKkpKnid-43Twg", cover: "https://yt3.googleusercontent.com/zkGtVL-NEnjNR53Bf02AeO5AlzwxXOcrTBbaY62YY9wQoQh7S13ASJdMGMsPXyw2U2zxNFUysg=s900-c-k-c0x00ffffff-no-rj" },
      { title: "小森めと", tags: ["VSPO"], sub: "VSPO", href: "https://www.youtube.com/@Met_Komori", channelId: "UCzUNASdzI4PV5SlqtYwAkKQ", cover: "https://yt3.googleusercontent.com/8km4MzJjHfYgZ7gbACC42-p2iwGFjmRFL-mppdpn4y35mIWhDTg2qVxmrGV1WQCqrjV7ZB9_Bw=s900-c-k-c0x00ffffff-no-rj" },
      { title: "夢野あかり", tags: ["VSPO"], sub: "VSPO", href: "https://www.youtube.com/@akarindao", channelId: "UCS5l_Y0oMVTjEos2LuyeSZQ", cover: "https://yt3.googleusercontent.com/hW-Z9l93zqxXn56bdRyo4OgVHn9XIMq7T991dsmnwJ-LTWACf306bVYRb8GSbWEATM3UNhqklw=s900-c-k-c0x00ffffff-no-rj" },
      { title: "夜乃くろむ", tags: ["VSPO"], sub: "VSPO", href: "https://www.youtube.com/@YanoKuromu", channelId: "UCX4WL24YEOUYd7qDsFSLDOw", cover: "https://yt3.googleusercontent.com/1akMwH-5NFyiA_cSCHjkOi-h0ZygMVcxMdRHYmCgBtjfha__trYziilH92BCAYgYZQBGOWynsg=s900-c-k-c0x00ffffff-no-rj" },
      { title: "紡木こかげ", tags: ["VSPO"], sub: "VSPO", href: "https://www.youtube.com/@Kokage_Tsumugi", channelId: "UC-WX1CXssCtCtc2TNIRnJzg", cover: "https://yt3.googleusercontent.com/k5cVF6C4_wfjYaf3iNU9ZfqTUZp6nwk_f4_Jid3VPIMJcjQj4Zll31sdE0J3yP1HEJoNtl0gyho=s900-c-k-c0x00ffffff-no-rj" },
      { title: "千燈ゆうひ", tags: ["VSPO"], sub: "VSPO", href: "https://www.youtube.com/@SendoYuuhi", channelId: "UCuDY3ibSP2MFRgf7eo3cojg", cover: "https://yt3.googleusercontent.com/LwrClvbMurf6c81aevjCuKoy8CKwQbuChZlNExzHHeWfaeQQ1kQpbMZPjqBu24TmVeg0RBH7Cg=s900-c-k-c0x00ffffff-no-rj" },
      { title: "蝶屋はなび", tags: ["VSPO"], sub: "VSPO", href: "https://www.youtube.com/@HanabiChoya", channelId: "UCL9hJsdk9eQa0IlWbFB2oRg", cover: "https://yt3.googleusercontent.com/N7qEUQMbq8z1lQdp4WBUz3vQ83gYiYmPt-alI5K1xMYnOh4uAxuQlUVPneZQKetzACogh6E_qA=s900-c-k-c0x00ffffff-no-rj" },
      { title: "甘結もか", tags: ["VSPO"], sub: "VSPO", href: "https://www.youtube.com/@Moka_Amayui", channelId: "UC8vKBjGY2HVfbW9GAmgikWw", cover: "https://yt3.googleusercontent.com/e_Vc-qiRBWmj9PaysPGhh9b2bn5YDLs-FhmqDwZTiog6umosQzQEa7phbJwz4eaZsGwzfFze=s900-c-k-c0x00ffffff-no-rj" },
      { title: "銀城サイネ", tags: ["VSPO"], sub: "VSPO", href: "https://www.youtube.com/@Saine_Ginjo", channelId: "UC2xXx1m1jeL0W84_0jTg-Yw", cover: "https://yt3.googleusercontent.com/1GsQmWJZ_ABGy-QkyuVM59_5F-iOPMMk5r5dR8bBVwRWjfY2u_Y-vuQptYrnezEvcDiTqXU7=s900-c-k-c0x00ffffff-no-rj" },
      { title: "龍巻ちせ", tags: ["VSPO"], sub: "VSPO", href: "https://www.youtube.com/@Chise_Tatsumaki", channelId: "UCoW8qQy80mKH0RJTKAK-nNA", cover: "https://yt3.googleusercontent.com/iY4fKYP5hjgVTNz69v9pXqmndDfJgYj3YSA47zsDeROBIp3tzxgZQqG3x6W6UZFQum64Dse2b5k=s900-c-k-c0x00ffffff-no-rj" },
      { title: "Nachoneko", tags: ["個人勢"], sub: "個人勢", href: "https://www.youtube.com/@Nachoneko_dayo", cover: "https://yt3.googleusercontent.com/N5l6FkLje3jSEAvxcSuqFFlE734_Ld0iI0QoTU5q-tbdfPQd2_dPHfFUWK3XIIoM6T4ep1itsw=s900-c-k-c0x00ffffff-no-rj" },
      { title: "我部りえる", tags: ["あおぎり高校"], sub: "あおぎり高校", href: "https://www.youtube.com/channel/UCFvEuP2EDkvrgJpHI6-pyNw", cover: "https://yt3.googleusercontent.com/PQTsSjQKuLXwv22OmnrQC0PwID65eb-0ltBcI29VNcFGvNB-zepdiuPQo-PGBn7kpyHYNS_nxQ=s900-c-k-c0x00ffffff-no-rj" },
      { title: "音霊魂子", tags: ["あおぎり高校"], sub: "あおぎり高校", href: "https://www.youtube.com/@tamako0212", cover: "https://yt3.googleusercontent.com/mZMKfTknmgnZ7SCyJ58hsJklu5H0BXZvxfnMoVy9dEOnO9KmAFLqX4LIgKewn2x_NxB1oJTPjg=s900-c-k-c0x00ffffff-no-rj" },
      { title: "栗駒こまる", tags: ["あおぎり高校"], sub: "あおぎり高校", href: "https://www.youtube.com/@komaru0814", cover: "https://yt3.googleusercontent.com/Oelzda0aP6xQ6nym6PabNrn11nMTY2InAR8P3Neq7b0FunhS-EnflrX-2BUkyMb0f_ai8fqMiQ=s900-c-k-c0x00ffffff-no-rj" },
      { title: "仲町あられ", tags: ["夢限大みゅーたいぷ"], sub: "夢限大みゅーたいぷ", href: "https://www.youtube.com/@arale_yumemita", cover: "https://yt3.googleusercontent.com/I0mwftAJiprbJyaBo_1UwcLlO1iWJvinlMdEQ3RlLQutvqZ0PRFH4Oyw1p1zHxRTp5QyAvLNkg8=s900-c-k-c0x00ffffff-no-rj" },
    ],
  },
];

export interface MusicSong {
  title: string;
  cover?: string;
  href?: string;
}

export interface MusicArtist {
  name: string;
  avatar?: string;
  songs: MusicSong[];
}

export const MUSIC_ARTISTS: MusicArtist[] = [
  {
    name: "Ayase",
    avatar: "https://image.joox.com/JOOXcover/0/3a9ab294-4805-4593-b8ce-bee6281a8c78/300",
    songs: [
      { title: "フィクションブルー", cover: "https://img.youtube.com/vi/tqR74vsc6Mc/mqdefault.jpg", href: "https://www.youtube.com/watch?v=tqR74vsc6Mc" },
      { title: "泣いてない", cover: "https://img.youtube.com/vi/_lmwvFgV_04/mqdefault.jpg", href: "https://www.youtube.com/watch?v=_lmwvFgV_04" },
      { title: "夜撫でるメノウ", cover: "https://img.youtube.com/vi/2sHKKjeKfVM/mqdefault.jpg", href: "https://www.youtube.com/watch?v=2sHKKjeKfVM" },
      { title: "飽和", cover: "https://img.youtube.com/vi/bP3OQzw_fvE/mqdefault.jpg", href: "https://www.youtube.com/watch?v=bP3OQzw_fvE" },
      { title: "シネマ", cover: "https://img.youtube.com/vi/8dywenCWPI0/mqdefault.jpg", href: "https://www.youtube.com/watch?v=8dywenCWPI0" },
    ],
  },
  {
    name: "YOASOBI",
    avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIP5-tHAZcqvNaIYCKizVIZbtPQINkT8Lz4g&s",
    songs: [
      { title: "たぶん", cover: "https://img.youtube.com/vi/8iuLXODzL04/mqdefault.jpg", href: "https://www.youtube.com/watch?v=8iuLXODzL04" },
      { title: "あの夢をなぞって", cover: "https://img.youtube.com/vi/sAuEeM_6zpk/mqdefault.jpg", href: "https://www.youtube.com/watch?v=sAuEeM_6zpk" },
      { title: "夜に駆ける", cover: "https://img.youtube.com/vi/x8VYWazR5mE/mqdefault.jpg", href: "https://www.youtube.com/watch?v=x8VYWazR5mE" },
      { title: "勇者", cover: "https://img.youtube.com/vi/OIBODIPC_8Y/mqdefault.jpg", href: "https://www.youtube.com/watch?v=OIBODIPC_8Y" },
      { title: "祝福", cover: "https://img.youtube.com/vi/3eytpBOkOFA/mqdefault.jpg", href: "https://www.youtube.com/watch?v=3eytpBOkOFA" },
    ],
  },
  {
    name: "りりあ。",
    avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRbzGiZAcjH6rUpc5Bxw4OMCq7RlmcZ1cTOtV7_XWdq0Q53FIGevjjssfs&s=10",
    songs: [
      { title: "私じゃなかったんだね", cover: "https://img.youtube.com/vi/sMSBAQ0tnBY/mqdefault.jpg", href: "https://www.youtube.com/watch?v=sMSBAQ0tnBY" },
      { title: "貴方の側に", cover: "https://img.youtube.com/vi/QCbPn0jpju8/mqdefault.jpg", href: "https://www.youtube.com/watch?v=QCbPn0jpju8" },
      { title: "失恋ソング沢山聴いて 泣いてばかりの私はもう。", cover: "https://img.youtube.com/vi/z9ocQhHVgLQ/mqdefault.jpg", href: "https://www.youtube.com/watch?v=z9ocQhHVgLQ" },
      { title: "最後のバイバイ", cover: "https://img.youtube.com/vi/dkqt-QZV1R8/mqdefault.jpg", href: "https://www.youtube.com/watch?v=dkqt-QZV1R8" },
      { title: "君の隣で", cover: "https://img.youtube.com/vi/c3TzuUeFnVk/mqdefault.jpg", href: "https://www.youtube.com/watch?v=c3TzuUeFnVk" },
    ],
  },
  {
    name: "椎名林檎",
    avatar: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Shiina_Ringo_2016.jpg/250px-Shiina_Ringo_2016.jpg",
    songs: [
      { title: "丸ノ内サディスティック", cover: "https://img.youtube.com/vi/Ej1fyNdnuFI/mqdefault.jpg", href: "https://www.youtube.com/watch?v=Ej1fyNdnuFI" },
      { title: "１７", cover:"https://i.ytimg.com/vi/8kpVAvMgUc4/mqdefault.jpg" },
    ],
  },
  {
    name: "supercell / ryo",
    avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_69Gy4cp64byEI_K5SPnbRn-rOovQyS2_6PUPlwGrFldDKr1TS7SMWVk&s=10",
    songs: [
      { title: "君の知らない物語", cover: "https://img.youtube.com/vi/jpV5jeFlt_E/mqdefault.jpg", href: "https://www.youtube.com/watch?v=jpV5jeFlt_E" },
      { title: "メルト" , cover: "https://upload.wikimedia.org/wikipedia/zh/thumb/e/e3/Melt_Cover_by_ryo.jpg/250px-Melt_Cover_by_ryo.jpg"},
      { title: "マイディアレスト", cover: "https://img.youtube.com/vi/a6nmtJAC4NM/mqdefault.jpg", href: "https://www.youtube.com/watch?v=a6nmtJAC4NM" },
    ],
  },
  {
    name: "藤井風",
    avatar: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Fujii_Kaze_performing_during_Best_Of_Fujii_Kaze_2020-2024_Asia_Tour_in_Axiata_Arena_Kuala_Lumpur_%28cropped%29_%282%29.jpg/250px-Fujii_Kaze_performing_during_Best_Of_Fujii_Kaze_2020-2024_Asia_Tour_in_Axiata_Arena_Kuala_Lumpur_%28cropped%29_%282%29.jpg",
    songs: [
      { title: "きらり", cover: "https://img.youtube.com/vi/TcLLpZBWsck/mqdefault.jpg", href: "https://www.youtube.com/watch?v=TcLLpZBWsck" },
      { title: "死ぬのがいいわ", cover: "https://img.youtube.com/vi/dawrQnvwMTY/mqdefault.jpg", href: "https://www.youtube.com/watch?v=dawrQnvwMTY" },
      { title: "まつり", cover: "https://img.youtube.com/vi/NwOvu-j_WjY/mqdefault.jpg", href: "https://www.youtube.com/watch?v=NwOvu-j_WjY" },
      { title: "満ちてゆく", cover: "https://img.youtube.com/vi/ptiK8U4WlSc/mqdefault.jpg", href: "https://www.youtube.com/watch?v=ptiK8U4WlSc" },
      { title: "ガーデン",cover:"https://p2.bahamut.com.tw/HOME/creationCover/19/0005771719_B.JPG" },
    ],
  },
  {
    name: "ヨルシカ",
    avatar: "https://yt3.googleusercontent.com/ytc/AIdro_kVKEa-EG-3DL3jnIwzZ13S4zo8G57by8Gq-nJLBOcuqg=s96-c-k-c0x00ffffff-no-rj",
    songs: [
      { title: "あぶく", cover: "https://img.youtube.com/vi/OHAjc-ayhus/mqdefault.jpg", href: "https://www.youtube.com/watch?v=OHAjc-ayhus" },
      { title: "千鳥", cover: "https://img.youtube.com/vi/t75qlQPXJGw/mqdefault.jpg", href: "https://www.youtube.com/watch?v=t75qlQPXJGw" },
      { title: "左右盲", cover: "https://img.youtube.com/vi/1IlTeOMCNJU/mqdefault.jpg", href: "https://www.youtube.com/watch?v=1IlTeOMCNJU" },
      { title: "チノカテ", cover: "https://img.youtube.com/vi/Fq55MMfHoJg/mqdefault.jpg", href: "https://www.youtube.com/watch?v=Fq55MMfHoJg" },
      { title: "春泥棒", cover: "https://img.youtube.com/vi/Sw1Flgub9s8/mqdefault.jpg", href: "https://www.youtube.com/watch?v=Sw1Flgub9s8" },
    ],
  },
];

export const PROJECTS: Project[] = [
    { slug: "yetanotherbusapp", kicker: "APP", color: "blue", title: "YetAnotherBusApp", desc: "現代化跨平台公車動態查詢 App", tags: ["Flutter", "Dart"], icon: "flutter", href: "https://github.com/AvianJay/yetanotherbusapp", cover: "/assets/YABus.webp",siteUrl: "https://busapp.avianjay.sbs/" },
    { slug: "scaict-uwu", kicker: "BOT", color: "blue", title: "SCAICT-uwu", desc: "中電喵：中電會 Discord Bot", tags: ["Python", "flask"], icon: "scaict", href: "https://github.com/SCAICT/SCAICT-uwu", cover: "https://raw.githubusercontent.com/SCAICT/doc/main/static/img/charge-demo.gif" },
    { slug: "dlhit-website", kicker: "WEB", color: "blue", title: "DLHIT-Website", desc: "大里高中資訊校隊官網", tags: ["Next.js", "TypeScript"], icon: "dlhit", href: "https://github.com/itousouta15/DLHIT-website", cover: "/assets/DLHIT.webp",siteUrl: "https://dlhit.itousouta.me" },
    { slug: "scaict-github-io", kicker: "WEB", color: "blue", title: "SCAICT.github.io", desc: "中電會官方網站", tags: ["HTML", "CSS","JavaScript"], icon: "scaict", href: "https://github.com/SCAICT/SCAICT.github.io", cover: "/assets/SCAICT.webp", siteUrl: "https://scaict.github.io" },
    { slug: "itousouta.me", kicker: "PORTFOLIO", color: "blue", title: "itousouta.me", desc: "就是這裡 www", tags: ["Next.js", "TypeScript", "itou 系列"], icon: "nextjs", href: "https://github.com/itousouta15/itousouta.me", cover: "/assets/itousouta15.webp", siteUrl: "https://itousouta.me" },
    { slug: "itoubloga", kicker: "BLOG", color: "blue", title: "itouBLoGa", desc: "一個基於 Hexo 的部落格", tags: ["Hexo", "Node.js", "itou 系列"], icon: "hexo", href: "https://github.com/itousouta15/itouBLoGa", cover: "https://github.com/itousouta15/itouBLoGa/raw/source/source/images/mainweb.webp", siteUrl: "https://blog.itousouta.me" },
    { slug: "itoubloldga", kicker: "ARCHIVE", color: "blue", title: "itouBLoldGa", desc: "一個基於 Hexo 及 anzhiyu 主題的舊部落格", tags: ["Hexo", "Node.js", "itou 系列"], icon: "hexo", href: "https://github.com/itousouta15/itouBLoldGa", cover: "/assets/Newweb.webp" },
    { slug: "itouslides", kicker: "TOOL", color: "blue", title: "itouSlides", desc: "用 Astro + slidev 構建的公開簡報展示頁", tags: ["Astro", "TypeScript", "itou 系列"], icon: "astro", href: "https://github.com/itousouta15/itouSlides", cover: "/assets/Slides.webp" },
    { slug: "itouOJ", kicker: "TOOL", color: "blue", title: "itouOJ", desc: "我的Online Judge", tags: ["Next.js", "TypeScript"], icon: "nextjs", href: "https://github.com/itousouta15/itouOJ", cover: "/assets/OJ.webp",siteUrl: "https://oj.itousouta.me" },
    { slug: "115-summer-camp", kicker: "WEB", color: "blue", title: "115-summer-camp", desc: "SCAICT 2026 暑訓官網", tags: ["Vite", "React"], icon: "scaict", href: "https://github.com/SCAICT/115-summer-camp", cover: "/assets/SCAICTsc.webp" ,siteUrl: "https://sc.scaict.org"},
    { slug: "wintercamp2026", kicker: "WEB", color: "blue", title: "WinterCamp2026", desc: "SCIST x SCAICT 2026 寒訓官網", tags: ["Next.js", "React"], icon: "scaict", href: "https://github.com/scist-tw/WinterCamp2026", cover: "/assets/SCIST.webp", siteUrl: "https://scist.camp" },
    { slug: "itoucards", kicker: "SHOWCASE", color: "blue", title: "itouCards", desc: "一個用純 HTML / CSS / JavaScript 製作的名片展示頁", tags: ["HTML", "CSS","JavaScript", "itou 系列"], icon: "html", href: "https://github.com/itousouta15/itouCards", cover: "https://github.com/itousouta15/itouCards/raw/main/web.webp", siteUrl: "https://cards.itousouta.me" },
    { slug: "2025codefestteam30", kicker: "HACKATHON", color: "blue", title: "2025codefestteam30", desc: "北市微服務大黑客松作品：北市避難設施資訊整合系統", tags: ["Flutter", "Dart"], icon: "flutter", href: "https://github.com/Twcat0503/2025Taipei-codefest-team30", cover: "/assets/cf.webp" },
  ];
  
export const DISCORD_USER_ID = "942765194571055164";
export const GITHUB_USERNAME = "itousouta15";

export interface Thought {
  date: string;
  text: string;
  tag?: string;
}

export const THOUGHTS: Thought[] = [
  { date: "2026-07-01", text: "雜談頁面上線了。這裡大概會放一些腦中突然跑出來的奇怪想法，或是記錄一些沒什麼意義但就是想說的廢話。", tag: "雜談" },
  { date: "2026-07-01", text: "好想睡覺 Zzzz", tag: "日常" },
];

export interface LinkItem {
  name: string;
  handle: string;
  href: string;
  desc?: string;
  avatar?: string;
}

export const LINKS: LinkItem[] = [
  { name: "D-Sketon", handle: "d-sketon.github.io", href: "https://d-sketon.github.io/", desc: "一個車萬人", avatar: "https://d-sketon.github.io/avatar/avatar.webp" },
  { name: "Small R", handle: "smallr-portfolio.vercel.app", href: "https://smallr-portfolio.vercel.app/en", desc: "全端電佬一個", avatar: "/assets/smallR.webp" },
  { name: "PepperSauce", handle: "peppersauce0712.github.io", href: "https://peppersauce0712.github.io/", desc: "程式路上的小白", avatar: "/assets/3.webp" },
  { name: "Small Z", handle: "yuzen9622.github.io", href: "https://yuzen9622.github.io/", desc: "前端電佬一個", avatar: "/assets/smallZ.webp" },
  { name: "南宮柳信", handle: "nangong5421.com", href: "https://www.nangong5421.com/", desc: "電到我抬不起頭", avatar: "/assets/南宮.webp" },
  { name: "Chumy", handle: "blog.chummydns.com", href: "https://blog.chummydns.com", desc: "AIS3隊友 | 資安大電神", avatar: "https://blog.chummydns.com/images/me.png" },
  { name: "Frank", handle: "frankk.uk", href: "https://frankk.uk/", desc: "AIS3隊友 | 資安大電神", avatar: "/assets/frank.webp" },
  { name: "yochan06", handle: "yochan06.github.io", href: "https://yochan06.github.io/", desc: "AIS3隊友 | 資安電神", avatar: "https://yochan06.github.io/images/132590659.png" },
  { name: "伊藤喵喵", handle: "twcat0503.org", href: "https://twcat0503.org/", desc: "喵", avatar: "https://avatars.githubusercontent.com/u/130988476?v=4" },
  { name: "UmmIt Kin", handle: "l.ummit.dev", href: "https://ummit.dev/", desc: "Can't life without GNU/Linux", avatar: "https://avatars.githubusercontent.com/u/128139875?v=4" },
  { name: "橘子", handle: "橘.tw", href: "https://橘.tw", desc: "橘子喵", avatar: "https://橘.tw/resource/佩佩.png" },
  { name: "小一", handle: "@littleonechung", href: "https://www.instagram.com/littleonechung/", desc: "一個喜歡開發遊戲的人類", avatar: "https://avatars.githubusercontent.com/u/67142736?v=4" },
  { name: "匿名用戶9487", handle: "qwo877.github.io", href: "https://qwo877.github.io/me/", desc: "被電爛的廢物", avatar: "https://avatars.githubusercontent.com/u/178977233?v=4" },
  { name: "su2u4", handle: "@su2u4-1", href: "https://github.com/su2u4-1/", desc: "蘇", avatar: "https://avatars.githubusercontent.com/u/70791378?v=4" },
  { name: "檸檬茶", handle: "blog-lemontea.pages.dev", href: "https://blog-lemontea.pages.dev/", desc: "一個小廢物(才怪)", avatar: "https://blog-lemontea.pages.dev/avatar/avator.png" },
  { name: "Justin", handle: "justin0711.com", href: "https://justin0711.com/", desc: "大電神", avatar: "https://justin0711.com/static/img/profile.jpg" },
  { name: "jackoha", handle: "jackoha.github.io", href: "https://jackoha.github.io/about/", desc: "東方廚", avatar: "https://jackoha.github.io/avatar/jackoha.webp" },
  { name: "凡凡FanFan", handle: "casperlin100w.github.io", href: "https://casperlin100w.github.io/", desc: "可愛小男娘", avatar: "https://casperlin100w.github.io/image/sidebar/avatar.jpg" },
  { name: "WalNut", handle: "walnut8569.github.io", href: "https://walnut8569.github.io/", desc: "中一中電神，前輩", avatar: "https://cdn.rafled.com/anime-icons/images/iWW9c1VjhALFAWMhNLsQ3VdPojw0O9J7.jpg" },
  { name: "Sanxian三線", handle: "sanxian-4348.github.io", href: "https://sanxian-4348.github.io/", desc: "考古學家", avatar: "https://sanxian-4348.github.io/avatar/avatar.webp" },
  { name: "g4o2", handle: "g4o2.com", href: "https://www.g4o2.com/", desc: "我不是電神", avatar: "https://avatars.githubusercontent.com/u/103299803" },
];

export interface ExperienceItem {
  period: string;
  title: string;
  org?: string;
  desc?: string;
  color?: "blue" | "purple";
  category?: string;
}

export const EXPERIENCE: ExperienceItem[] = [
  { period: "2024-現在", title: "臺中市立大里高級中學", org: "資訊校隊隊長", desc: "加入資訊校隊，開始製作各式專案，參與各式比賽與活動，領導資訊社群，持續精進自我並朝理想邁進。", color: "blue", category: "學歷" },
  { period: "2021-2024", title: "臺中市立大雅國民中學", org: "學生", desc: "開始接觸Scratch，對程式設計開始感興趣", color: "blue", category: "學歷" },
  { period: "2015-2021", title: "臺中市立大明國民小學", org: "學生", desc: "", color: "blue", category: "學歷" },
  { period: "2025", title: "臺北市城市通微服務大黑客松", org: "參賽", color: "blue", category: "比賽" },
  { period: "2025", title: "全國高中醫療科技競賽", org: "參賽", color: "blue", category: "比賽" },
  { period: "2025", title: "全國人文社會永續行動創新應用競賽", org: "參賽", color: "blue", category: "比賽" },
  { period: "2025", title: "FuStar 未來之星-科學創意挑戰賽", org: "參賽", color: "blue", category: "比賽" },
  { period: "2026", title: "PDAO 程式設計與最佳化競賽", org: "第 21 名", color: "purple", category: "比賽" },
  { period: "2025", title: "AIS3 Pre-exam", org: "rk.67", color: "purple", category: "比賽" },
  { period: "2026", title: "AIS3 Pre-exam", org: "rk.140", color: "purple", category: "比賽" },
  { period: "2025", title: "FhCTF", org: "rk.1", color: "purple", category: "比賽" },
  { period: "2026", title: "TSCCTF", org: "rk.25 / 115", color: "purple", category: "比賽" },
  { period: "2026", title: "diceCTF", org: "rk.121 / 497", color: "purple", category: "比賽" },
  { period: "2026", title: "PicoCTF", org: "rk.82 / 8295", color: "purple", category: "比賽" },
  { period: "2026", title: "AIS3 EOF 初賽", org: "參賽", color: "blue", category: "比賽" },
  { period: "2025", title: "大里高中資訊校隊", org: "隊長、教學", color: "blue", category: "社群" },
  { period: "2025", title: "北台灣學生資訊社群", org: "美宣", color: "blue", category: "社群" },
  { period: "2025-2026", title: "第五屆 SCAICT 中電會", org: "會長、資訊組組長", color: "purple", category: "社群" },
  { period: "2026", title: "第二屆 大里高中電腦研究社", org: "社長、教學", color: "purple", category: "社群" },
  { period: "2026", title: "大里高中 C# 與 Unity 遊戲設計營", org: "總召", color: "blue", category: "社群" },
  { period: "2026", title: "第三屆 THJCC 臺灣高中聯合資安競賽", org: "網管", color: "purple", category: "社群" },
  { period: "2026", title: "TWNOG 台灣網路維運論壇", org: "設計組", color: "purple", category: "社群" },
  { period: "2026", title: "g0v Summit", org: "場務組", color: "blue", category: "社群" },
  { period: "2026", title: "SITCON Camp", org: "庶務組", color: "purple", category: "社群" },
  { period: "2026", title: "SCIST x SCAICT 聯合寒訓", org: "副召、資訊組", color: "blue", category: "社群" },
  { period: "2026", title: "SITCON", org: "社群攤位", color: "purple", category: "社群" },
  { period: "2026", title: "COSCUP", org: "社群攤位", color: "blue", category: "社群" },
  { period: "2026", title: "北中南學生資訊社群聯合大黑客松", org: "副召", color: "blue", category: "社群" },
  { period: "2026", title: "SCAICT x 中興大學 聯合暑訓", org: "總召、資訊組", color: "purple", category: "社群" },
  { period: "2026", title: "一日資訊體驗營", org: "美宣", color: "blue", category: "社群" },
];
