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
}

export interface LikeCategory {
  key: string;
  label: string;
  en: string;
  items: Like[];
}

export interface Project {
  kicker: string;
  color: "blue" | "purple";
  title: string;
  desc: string;
  tags: string[];
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
    label: "小說",
    en: "NOVEL",
    items: [
      { title: "作品名稱", sub: "作者・佔位文字" },
      { title: "作品名稱", sub: "作者・佔位文字" },
      { title: "作品名稱", sub: "作者・佔位文字" },
    ],
  },
  {
    key: "manga",
    label: "漫畫",
    en: "MANGA",
    items: [
      { title: "作品名稱", sub: "作者・佔位文字" },
      { title: "作品名稱", sub: "作者・佔位文字" },
      { title: "作品名稱", sub: "作者・佔位文字" },
    ],
  },
  {
    key: "anime",
    label: "動漫",
    en: "ANIME",
    items: [
      /*
      { title: "想結束這場「我愛你」的遊戲", cover: "https://wall.bahamut.com.tw/B/80/4uymxm98jtc9moemj2wd1n0j1rpbtapfdxfp8lzq.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=52327&tab=7&userid=kuoray333" },
      { title: "關於我在無意間被隔壁的天使變成廢柴這件事 2", cover: "https://wall.bahamut.com.tw/B/88/mxc1yccd3qprsbuz6pr5ctjxaimb6js94cxushqc.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=59971&tab=7&userid=kuoray333" },
      { title: "我和班上第二可愛的女生成為朋友", cover: "https://wall.bahamut.com.tw/B/72/oipaqgjbtyywsetymrkbvkkrmtittslxs6kkdwtk.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=58203&tab=7&userid=kuoray333" },
      { title: "上伊那牡丹，醉姿如百合", cover: "https://wall.bahamut.com.tw/B/17/vvmnjtnx8jaknd2zqs2fmtlrgxepemfye4cpebis.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=65305&tab=7&userid=kuoray333" },
      { title: "靠死亡遊戲混飯吃。", cover: "https://wall.bahamut.com.tw/B/35/cd6zqsw3afiavae4bo48emjas2qam2ysq6elgj9q.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=60343&tab=7&userid=kuoray333" },
      { title: "【我推的孩子】", cover: "https://wall.bahamut.com.tw/B/96/feefjq2meiymeddflbswl4asqbrsrjoievl7sdji.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=22788&tab=7&userid=kuoray333" },
      { title: "Code Geass 反叛的魯路修", cover: "https://wall.bahamut.com.tw/B/07/uzebi6snr6yspbapshxk4y8fgiaf3k6e5qwbolg5.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=23484&tab=7&userid=kuoray333" },
      { title: "轉生為第七王子，隨心所欲的魔法學習之路", cover: "https://wall.bahamut.com.tw/B/47/sc728f4nzchjsrjalguiyw6j7onl8nyay2ogsuez.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=51779&tab=7&userid=kuoray333" },
      { title: "魔法科高中的劣等生 第三季", cover: "https://wall.bahamut.com.tw/B/50/nc7i11ohwxf5ujgawducldb4rztk2fweqv1fu3pz.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=58979&tab=7&userid=kuoray333" },
      { title: "不中用的前輩。", cover: "https://wall.bahamut.com.tw/B/37/bb5dk6kczie10s3sxpaikeudwsibcirosl1xb4ul.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=21787&tab=7&userid=kuoray333" },
      { title: "對我垂涎欲滴的非人少女", cover: "https://wall.bahamut.com.tw/B/16/zjcpi66zi73jz1gnyqooos1b8uyt2topy5ec1mki.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=64302&tab=7&userid=kuoray333" },
      { title: "機械女僕‧瑪麗", cover: "https://wall.bahamut.com.tw/B/36/xqrn0dpgoriekjlxs5nxapbggzabmoycs6b2ciay.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=62777&tab=7&userid=kuoray333" },
      { title: "朋友的妹妹只纏著我", cover: "https://wall.bahamut.com.tw/B/64/5eylogpiqc5oujr2kbzykxwjybzc6wrksw9paufn.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=21026&tab=7&userid=kuoray333" },
      { title: "擁有超常技能的異世界流浪美食家 S2", cover: "https://wall.bahamut.com.tw/B/96/czoayvm4qmcvs50gbosmmgxowx7xeppqazowetqt.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=60121&tab=7&userid=kuoray333" },
      { title: "無職英雄：技能什麼的毫無用處", cover: "https://wall.bahamut.com.tw/B/13/jzlg48gcqwnjrze4g6x06pyh9yjmlomobw4co2ml.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=65272&tab=7&userid=kuoray333" },
      { title: "Let′s Play 充滿挑戰的人生", cover: "https://i2.bahamut.com.tw/image/bh_no_image.svg", href: "https://wall.gamer.com.tw/fanpage.php?sn=67036&tab=7&userid=kuoray333" },
      { title: "我想成為影之強者！", cover: "https://wall.bahamut.com.tw/B/81/z7iio2sngjtj8n4pl9zjsqorr1xyqovulsj3eykp.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=17919&tab=7&userid=kuoray333" },
      { title: "持續狩獵史萊姆三百年，不知不覺就練到 LV MAX 第二季", cover: "https://wall.bahamut.com.tw/B/07/xanbzylc4ghuxbvynlwxh8co98mmbowgbhfhsp94.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=52387&tab=7&userid=kuoray333" },
      { title: "水屬性的魔法師", cover: "https://wall.bahamut.com.tw/B/51/fj1azitbptfnxb7x8xxeicaydygusaf4pswsqh4u.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=64583&tab=7&userid=kuoray333" },
      { title: "公爵千金的家庭教師", cover: "https://wall.bahamut.com.tw/B/04/jfkketwqcdaazrjlirpvhadqahplxnls0oajaub7.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=19078&tab=7&userid=kuoray333" },
      { title: "持續狩獵史萊姆三百年，不知不覺就練到 LV MAX", cover: "https://wall.bahamut.com.tw/B/79/5d6c6dc53a09b3a1e49a97a7819b39ca9cac2454.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=4523&tab=7&userid=kuoray333" },
      { title: "酷愛電影的龐波小姐", cover: "https://wall.bahamut.com.tw/B/03/wzaankt2dvzhnx6su3cdmyhnodupc5ybo0fdzqqa.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=17577&tab=7&userid=kuoray333" },
      { title: "歲月流逝飯菜依舊美味", cover: "https://wall.bahamut.com.tw/B/89/otfavncpqnjbnqlblssydyc7nrxugoapirqi7p7g.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=65319&tab=7&userid=kuoray333" },
      { title: "帝乃三姊妹意外地容易相處。", cover: "https://wall.bahamut.com.tw/B/19/tii5s2unkuqotty33v0dlft9hsqdppic61aphzqh.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=62543&tab=7&userid=kuoray333" },
      { title: "Bad Girl 不良少女", cover: "https://wall.bahamut.com.tw/B/24/wrfegn90pknwbcwfhseqeuqrfixgkhgk1csjyaui.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=56476&tab=7&userid=kuoray333" },
      { title: "我們不可能成為戀人！絕對不行。（※似乎可行？）", cover: "https://wall.bahamut.com.tw/B/83/uksiqaihhfmrgnw0kqpgmzkbw4ec9ktibjhxquji.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=56950&tab=7&userid=kuoray333" },
      { title: "9-nine- 支配者的王冠", cover: "https://wall.bahamut.com.tw/B/40/h0trifs1qpv5mzpdn2tqzrvokagmvkfmkjxw9jqa.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=13121&tab=7&userid=kuoray333" },
      { title: "Silent Witch 沉默魔女的祕密", cover: "https://wall.bahamut.com.tw/B/25/e3m6oz0ijnwm82vxpv5xlpzoa5usqdplojglw3uy.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=52227&tab=7&userid=kuoray333" },
      { title: "戀愛中的小行星", cover: "https://wall.bahamut.com.tw/B/08/sgjszlo6mf1nmx9eauxejzgyazj1do1requdsjs8.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=13493&tab=7&userid=kuoray333" },
      { title: "聲優廣播的幕前幕後", cover: "https://wall.bahamut.com.tw/B/08/1mibbemmucb6cwg3h7szjzrw6pjncsurnmocr1o9.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=21828&tab=7&userid=kuoray333" },
      { title: "歡迎光臨流放者食堂！", cover: "https://wall.bahamut.com.tw/B/71/yybwogg3qxpklggw7awqeohpxfmgcpexfk1ickfn.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=53250&tab=7&userid=kuoray333" },
      { title: "K-ON！！輕音部", cover: "https://wall.bahamut.com.tw/B/92/12a45f7b40c8a42d78c7ad6fa71a7aa82e8ed965.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=9762&tab=7&userid=kuoray333" },
      { title: "青春豬頭少年不會夢到嬌憐外出妹", cover: "https://wall.bahamut.com.tw/B/25/ouzel1f08axl2shw9np4jgqkyozkoxtny43s6vpk.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=56065&tab=7&userid=kuoray333" },
      { title: "青春豬頭少年不會夢到紅書包女孩", cover: "https://wall.bahamut.com.tw/B/87/h2yw9tp1qsgk5zkoibwzeei5to2fummualrlc4jj.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=58639&tab=7&userid=kuoray333" },
      { title: "徹夜之歌 Season 2", cover: "https://wall.bahamut.com.tw/B/79/ghedfs5vas5v1zudwrt77pd1srbkyyvypqitj0ln.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=61341&tab=7&userid=kuoray333" },
      { title: "戀上換裝娃娃 Season 2", cover: "https://wall.bahamut.com.tw/B/48/rhr9yqnpouxxohm82gvltkbenknxrgzlwyrt9e0x.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=55990&tab=7&userid=kuoray333" },
      { title: "青春豬頭少年不會夢到聖誕服女郎", cover: "https://wall.bahamut.com.tw/B/29/7lbutxemvcy0ummthndhzvu1kkgywm0wmuhf3mpw.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=60439&tab=7&userid=kuoray333" },
      { title: "膽大黨 第二季", cover: "https://wall.bahamut.com.tw/B/33/o1rnyzvyh3ofct4htmof1bywx77tgey79udh3krq.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=64133&tab=7&userid=kuoray333" },
      { title: "章魚嗶的原罪", cover: "https://wall.bahamut.com.tw/B/76/er51yefygqsmsyijfryzs17myo3bfj1pl4yfcea0.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=54159&tab=7&userid=kuoray333" },
      { title: "K-ON！輕音部", cover: "https://wall.bahamut.com.tw/B/21/7c68a3c86f9041b51336d5387c0980dd2fb2098c.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=9753&tab=7&userid=kuoray333" },
      { title: "LAZARUS 拉撒路", cover: "https://wall.bahamut.com.tw/B/76/jsap3yqikb81zq2qeuyuek4db8ij2pyuyzypmg64.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=59264&tab=7&userid=kuoray333" },
      { title: "Summer Pockets", cover: "https://wall.bahamut.com.tw/B/80/rkblj0x4iuvgeivwao2akmted3wfnbgkm04ubmbh.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=12485&tab=7&userid=kuoray333" },
      { title: "WITCH WATCH 魔女守護者", cover: "https://wall.bahamut.com.tw/B/05/gr56cjoveohm8zwyuzaem4ta2tz9bvwb7wlup67y.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=22552&tab=7&userid=kuoray333" },
      { title: "紫雲寺家的兄弟姊妹", cover: "https://wall.bahamut.com.tw/B/78/yyklnbgntrro2wvsysvajlpfmi3vyvlchkclyqry.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=55663&tab=7&userid=kuoray333" },
      { title: "快藏好！瑪琪娜同學!!", cover: "https://wall.bahamut.com.tw/B/60/9jf8epovzsy1k7poswqxz2hh3b98bz1rv9wzzbal.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=61996&tab=7&userid=kuoray333" },
      { title: "劇場總集篇 孤獨搖滾！Re:", cover: "https://wall.bahamut.com.tw/B/22/fwhq5ag9rts5oh5gcch4xw2uyzgl6moukv6lyxwa.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=60197&tab=7&userid=kuoray333" },
      { title: "劇場總集篇 孤獨搖滾！Re: Re:", cover: "https://wall.bahamut.com.tw/B/47/jmgk0vcmocpcomoo3dliovebo5jzz0jeuucduhbt.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=65354&tab=7&userid=kuoray333" },
      { title: "完美到難以接近的聖女遭到解除婚約後被賣到鄰國", cover: "https://i2.bahamut.com.tw/image/bh_no_image.svg", href: "https://wall.gamer.com.tw/fanpage.php?sn=63480&tab=7&userid=kuoray333" },
      { title: "男女之間存在純友情嗎？（不，不存在！）", cover: "https://wall.bahamut.com.tw/B/72/zidhjoesl6l5fefacn0hrbaalma3p2ekfd42vlhc.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=53772&tab=7&userid=kuoray333" },
      { title: "乘浪之約", cover: "https://wall.bahamut.com.tw/B/29/somrb3gelmj7t9yjdbshuij2zawnxjxiucowvst2.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=11853&tab=7&userid=kuoray333" },
      { title: "道別的早晨就用約定之花點綴吧", cover: "https://wall.bahamut.com.tw/B/32/7hyqjqeeqv8hqj9m6iiofmgoie7lrnkbfr0wbq4r.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=23038&tab=7&userid=kuoray333" },
      { title: "孤獨搖滾！團結 Band LIVE-恆星-", cover: "https://wall.bahamut.com.tw/B/04/gcjbbvxun8wptuwmqt8l3ua5ybhesheozxhemoxl.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=64257&tab=7&userid=kuoray333" },
      { title: "幻日夜羽 -鏡中暉光-", cover: "https://wall.bahamut.com.tw/B/38/ot1ouv4yvmpi5pnszoaex3hdxl51wftzggbew4vx.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=54990&tab=7&userid=kuoray333" },
      { title: "少女樂團 吶喊吧", cover: "https://wall.bahamut.com.tw/B/21/k7btdckvucn4h5kkid6lfdijzkeg89dcrla86zx5.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=58078&tab=7&userid=kuoray333" },
      { title: "凍牌~地下麻將鬥牌錄~", cover: "https://wall.bahamut.com.tw/B/62/zczgoulviajq3b40ofoz0xq33nyo3snejf6hrcyu.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=60834&tab=7&userid=kuoray333" },
      { title: "怪人的沙拉碗", cover: "https://wall.bahamut.com.tw/B/47/t3pdlqv2tnfhd0tjf3qgia0edddwjazhbuuhsvep.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=57187&tab=7&userid=kuoray333" },
      { title: "在地下城尋求邂逅是否搞錯了什麼 第五季", cover: "https://wall.bahamut.com.tw/B/02/u1xbl0fnua0kgsgrneerksny95gvnvme6uvrl1io.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=60165&tab=7&userid=kuoray333" },
      { title: "在地下城尋求邂逅是否搞錯了什麼 第四季", cover: "https://wall.bahamut.com.tw/B/25/hbqybqoqcynv9vryknhbhay63pihwihqvngajjip.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=21013&tab=7&userid=kuoray333" },
      { title: "電影版 搖曳露營△", cover: "https://wall.bahamut.com.tw/B/13/nnngxvk4nawijzwczfjvzucne78znn9pxagzldq9.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=11519&tab=7&userid=kuoray333" },
      { title: "在地下城尋求邂逅是否搞錯了什麼 第二季", cover: "https://wall.bahamut.com.tw/B/66/f0c40dbac74dce8c557cab425666f35aa21c4e8e.PNG", href: "https://wall.gamer.com.tw/fanpage.php?sn=1491&tab=7&userid=kuoray333" },
      { title: "劇場版 在地下城尋求邂逅是否搞錯了什麼 ─ 獵戶座", cover: "https://wall.bahamut.com.tw/B/06/a3371ad8dcfd8b50c977ffc349093f748e540eb6.PNG", href: "https://wall.gamer.com.tw/fanpage.php?sn=1492&tab=7&userid=kuoray333" },
      { title: "在地下城尋求邂逅是否搞錯了什麼 第三季", cover: "https://wall.bahamut.com.tw/B/04/hvnnye19zulqckyeoltakn3hnrx2w9rdwttmqwbc.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=16080&tab=7&userid=kuoray333" },
      { title: "劍姬神聖譚", cover: "https://wall.bahamut.com.tw/B/82/rrw8gbwgrqv6lvuzkyxdhw84jsh73v1daz36qsiq.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=10072&tab=7&userid=kuoray333" },
      { title: "BanG Dream！FILM LIVE 2nd Stage", cover: "https://wall.bahamut.com.tw/B/80/ii04qlfu1jhhg0bmuolulbwcecsafodzfisdtvwv.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=17792&tab=7&userid=kuoray333" },
      { title: "轉生公主與天才千金的魔法革命", cover: "https://wall.bahamut.com.tw/B/92/ntfzubmyreaukxsgk0akxe5ewgxjatxg6eg1x1xo.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=53615&tab=7&userid=kuoray333" },
      { title: "撿走被人悔婚的千金，教會她壞壞的幸福生活～讓她享受美食精心打扮，打造世上最幸福的少女！～", cover: "https://wall.bahamut.com.tw/B/92/n00zq7jfztjkexqbkv9m8zvz33kajutpch61nl8o.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=55772&tab=7&userid=kuoray333" },
      { title: "婚戒物語", cover: "https://wall.bahamut.com.tw/B/81/8of61otz3n1rrfukul1gpnar4djopjsopqmnwm0h.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=46087&tab=7&userid=kuoray333" },
      { title: "聽說你們要結婚！？", cover: "https://wall.bahamut.com.tw/B/75/j0yvzvehu07joqvkytnyrqfkqzgmwtjry61xircd.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=55267&tab=7&userid=kuoray333" },
      { title: "在地下城尋求邂逅是否搞錯了什麼", cover: "https://wall.bahamut.com.tw/B/74/afc0b8952feddf2a84a17422756ae2269c82bc5b.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=9935&tab=7&userid=kuoray333" },
      { title: "離開 A 級隊伍的我，和從前的弟子往迷宮深處邁進", cover: "https://wall.bahamut.com.tw/B/50/e81elo0gy0auud2cswcxjiuxedjwkeqr94w2knbc.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=60279&tab=7&userid=kuoray333" },
      { title: "BanG Dream! It's MyGO!!!!!", cover: "https://wall.bahamut.com.tw/B/51/nsnjvjn6esb5hfnj4lryectgyyilezwpgetuzufk.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=57966&tab=7&userid=kuoray333" },
      { title: "群花綻放、彷如修羅", cover: "https://wall.bahamut.com.tw/B/85/6egciygoyhviydqroh33sdib6xwanfa7x0ib4l1c.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=62330&tab=7&userid=kuoray333" },
      { title: "遲早是最強的鍊金術師？", cover: "https://wall.bahamut.com.tw/B/65/frm031iotulqbuvgxlidg6cnhu1gssxaa0eyastv.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=61984&tab=7&userid=kuoray333" },
      { title: "從 Lv2 開始開外掛的前勇者候補過著悠哉異世界生活", cover: "https://wall.bahamut.com.tw/B/54/r1yrmww0e76sbae3bjntugkpyu6suzmd2yfmqdlp.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=50512&tab=7&userid=kuoray333" },
      { title: "雖然是公會的櫃檯小姐，但因為不想加班所以打算獨自討伐迷宮頭目", cover: "https://wall.bahamut.com.tw/B/20/ksanawydi9neuh7fcryqzpd88oetje7xwy7mv6h9.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=58559&tab=7&userid=kuoray333" },
      { title: "為美好的世界獻上祝福！3", cover: "https://wall.bahamut.com.tw/B/10/0bofvjq6qnvmeplamzady1cfwetmmkwn93plikhv.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=22771&tab=7&userid=kuoray333" },
      { title: "為美好的世界獻上爆焰！", cover: "https://wall.bahamut.com.tw/B/86/51564202d44dc12efb1f7abc40def22650fa71e2.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=864&tab=7&userid=kuoray333" },
      { title: "為美好的世界獻上祝福！紅傳說", cover: "https://wall.bahamut.com.tw/B/83/emzhwdzzaaltkfj9y24qmelepnzx7fymcywma5oj.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=925&tab=7&userid=kuoray333" },
      { title: "為美好的世界獻上祝福！2", cover: "https://wall.bahamut.com.tw/B/49/79430d5bcfd0e981e38c81cf2df9c2c1d2f27a56.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=10051&tab=7&userid=kuoray333" },
      { title: "為美好的世界獻上祝福！", cover: "https://wall.bahamut.com.tw/B/86/de92fe1e0fc653f644f37c3eae57cb6f66ee39a7.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=9988&tab=7&userid=kuoray333" },
      { title: "喜歡本大爺的竟然就妳一個？", cover: "https://wall.bahamut.com.tw/B/95/a236b89f89f931e61d284b78ade55d05d55b957c.PNG", href: "https://wall.gamer.com.tw/fanpage.php?sn=11516&tab=7&userid=kuoray333" },
      { title: "BanG Dream! Ave Mujica", cover: "https://wall.bahamut.com.tw/B/23/antqpdhwl0gqmo6ugixlxnypgdbqk7ixk4ks6kyx.PNG", href: "https://wall.gamer.com.tw/fanpage.php?sn=59706&tab=7&userid=kuoray333" },
      { title: "歡迎來到日本，妖精小姐。", cover: "https://wall.bahamut.com.tw/B/81/9uzbjwnveqbavtz8rqh2hnukmum7xm6r9wmtzmgf.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=50618&tab=7&userid=kuoray333" },
      { title: "吉伊卡哇", cover: "https://wall.bahamut.com.tw/B/61/yj8pa0dh80nwsgu6fifgrkh73amofqazjhlf7zl0.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=51604&tab=7&userid=kuoray333" },
      { title: "我和班上最討厭的女生結婚了。", cover: "https://wall.bahamut.com.tw/B/08/gaxdlmignmqakbtae0krdh2owqxc4lsdxh4e71c6.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=52092&tab=7&userid=kuoray333" },
      { title: "Re：從零開始的異世界生活 第三季", cover: "https://wall.bahamut.com.tw/B/21/kjfddskapir16avckw7tlov674iwjhwzlvvsxq62.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=57816&tab=7&userid=kuoray333" },
      { title: "膽大黨", cover: "https://wall.bahamut.com.tw/B/40/mk36qhpnfgal5wcnfqjzynbquxskjcgmmn4w4fh7.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=50466&tab=7&userid=kuoray333" },
      { title: "結緣甘神神社", cover: "https://wall.bahamut.com.tw/B/72/5lx6hwtic4x0sexlaxxszvyukehzmibmrvxzhs1f.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=50241&tab=7&userid=kuoray333" },
      { title: "妙廟美少女", cover: "https://wall.bahamut.com.tw/B/51/tynawbbzofzsrvppovriat6aikzxs5s6f6ghvym0.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=50587&tab=7&userid=kuoray333" },
      { title: "天籟人偶", cover: "https://wall.bahamut.com.tw/B/19/yvxmlnnnzolnpwdrak4vr65owmrexj9mtlpeahxj.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=53534&tab=7&userid=kuoray333" },
      { title: "約會大作戰 DATE A BULLET 赤黑新章：虛或實", cover: "https://wall.bahamut.com.tw/B/03/14963954b6dfc48fa1f72957401b1295f9c67a9f.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=939&tab=7&userid=kuoray333" },
      { title: "約會大作戰 DATE A BULLET 赤黑新章：紅或白", cover: "https://wall.bahamut.com.tw/B/69/zfftbiyo4qmtfaccm8nnwg6kncn4jt4b65phzhwu.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=22105&tab=7&userid=kuoray333" },
      { title: "約會大作戰 DATE A LIVE V", cover: "https://wall.bahamut.com.tw/B/00/afsvohgnk7ro2jw1apmz8wkdgpncgbupi2x3cuop.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=54912&tab=7&userid=kuoray333" },
      { title: "2.5 次元的誘惑", cover: "https://wall.bahamut.com.tw/B/16/civfuozix2lm5nk6339nztmpwrfm6mbmwpnzt3vj.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=16412&tab=7&userid=kuoray333" },
      { title: "這個世界漏洞百出", cover: "https://wall.bahamut.com.tw/B/34/4nptzcoal4xbre6o9nmxqawz8i3htxqmwbw9asn5.JPG", href: "https://wall.gamer.com.tw/fanpage.php?sn=57790&tab=7&userid=kuoray333" },
      */
    ],
  },
  {
    key: "music",
    label: "音樂",
    en: "MUSIC",
    items: [
      { title: "曲名 / 歌手", sub: "佔位文字" },
      { title: "曲名 / 歌手", sub: "佔位文字" },
      { title: "曲名 / 歌手", sub: "佔位文字" },
    ],
  },
];

export const PROJECTS: Project[] = [
  { kicker: "MUSIC", color: "blue", title: "Project 01", desc: "專案說明佔位文字，之後可換成你的作品介紹。", tags: ["Vocaloid", "2024"] },
  { kicker: "ILLUST", color: "purple", title: "Project 02", desc: "專案說明佔位文字，之後可換成你的作品介紹。", tags: ["Illustration", "pixiv"] },
  { kicker: "CODE", color: "blue", title: "Project 03", desc: "專案說明佔位文字，之後可換成你的作品介紹。", tags: ["Web", "GitHub"] },
];

/**
 * Lanyard live status (Spotify + Discord) for the home page cards.
 * Lanyard reads your presence from Discord — to enable it:
 *   1. Join the Lanyard Discord server: https://discord.gg/lanyard
 *   2. Put your numeric Discord user ID below (developer mode → 右鍵頭像 → 複製使用者 ID)
 * Leave it empty and the cards render a friendly "未連結" placeholder instead.
 */
export const DISCORD_USER_ID = "942765194571055164";

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
  { name: "南宮柳信", handle: "nangong5421.github.io", href: "https://nangong5421.github.io/", desc: "電到我抬不起頭", avatar: "/assets/南宮.webp" },
  { name: "Chumy", handle: "blog.chummydns.com", href: "https://blog.chummydns.com", desc: "AIS3隊友 | 資安大電神", avatar: "https://blog.chummydns.com/images/me.png" },
  { name: "Frank", handle: "frankk.uk", href: "https://frankk.uk/", desc: "AIS3隊友 | 資安大電神", avatar: "/assets/frank.webp" },
  { name: "yochan06", handle: "yochan06.github.io", href: "https://yochan06.github.io/", desc: "AIS3隊友 | 資安電神", avatar: "https://yochan06.github.io/images/132590659.png" },
  { name: "伊藤喵喵", handle: "@shooting.twcat", href: "https://www.instagram.com/shooting.twcat?igsh=OWx2djZmbDB6ZW1k", desc: "喵", avatar: "https://avatars.githubusercontent.com/u/130988476?v=4" },
  { name: "UmmIt Kin", handle: "l.ummit.dev", href: "https://l.ummit.dev", desc: "Can't life without GNU/Linux", avatar: "https://avatars.githubusercontent.com/u/128139875?v=4" },
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
}

export const EXPERIENCE: ExperienceItem[] = [
  { period: "2024 — 現在", title: "經歷標題佔位", org: "單位 / 組織", desc: "經歷說明佔位文字，之後可換成你的實際內容。", color: "blue" },
  { period: "2022 — 2024", title: "經歷標題佔位", org: "單位 / 組織", desc: "經歷說明佔位文字，之後可換成你的實際內容。", color: "purple" },
  { period: "2020 — 2022", title: "經歷標題佔位", org: "單位 / 組織", desc: "經歷說明佔位文字，之後可換成你的實際內容。", color: "blue" },
];
