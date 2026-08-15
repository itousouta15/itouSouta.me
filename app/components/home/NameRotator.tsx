const NAMES = ["itouSouta", "伊藤蒼太", "郭家睿"];

/* 輪播的名字走 data-name + CSS ::before，不是真的文字節點。
   原本是 sr-only 一份正常字串 + aria-hidden 一份動畫用的，aria-hidden 擋得住
   螢幕閱讀器、擋不住 Google——爬蟲抓的是「畫面上看得到的文字」，兩份都算數，
   所以 <h1> 的文字內容變成「I'm itouSouta / 伊藤蒼太 / 郭家睿itouSouta伊藤蒼太
   郭家睿itouSouta」，名字出現七次。Google 拿它改寫標題、拼 snippet，SERP 上就是
   那串黏在一起的亂碼。
   CSS 產生的內容不進 DOM 文字，textContent 撈不到、Google 也不索引，於是 <h1>
   只剩下 sr-only 那份乾淨的「itouSouta / 伊藤蒼太 / 郭家睿」，畫面完全沒變。
   最後一個是頭尾接回去用的複製品，所以 key 不能只用名字。 */
export default function NameRotator() {
  const track = [...NAMES, NAMES[0]];

  return (
    <span className="name-rotator">
      <span className="sr-only">{NAMES.join(" / ")}</span>
      <span className="name-rotator-track" aria-hidden="true">
        {track.map((name, i) => (
          <b key={`${name}-${i}`} data-name={name} />
        ))}
      </span>
    </span>
  );
}
