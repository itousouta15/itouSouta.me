import type { Metadata } from "next";
import PageHead from "../components/PageHead";

export const metadata: Metadata = { title: "關於我 | itousouta15.tw" };

export default function AboutPage() {
  return (
    <section style={{ paddingBottom: 8 }}>
      <PageHead kicker="ABOUT" title="關於我" />
      <div className="about-grid">
        <div className="about-main">
          <div className="about-lead">ciallo～ 我是 itouSouta</div>
          <p className="about-p">
            一個喜歡 VOCALOID 和畫插畫的怪人。平常在做 Vocalo-P 與插畫，偶爾寫點程式/ᐠ｡ꞈ｡ᐟ\
          </p>
          <p className="about-p">
            嗯....我也想把自己說的好像很厲害，但感覺這樣蠻家豪的。反正我就是一個無聊的高中生
          </p>
          <p className="about-p">
            目前是臺中市立大里高中的學生，同時擔任校內資訊校隊隊長，也是第五屆 SCAICT 中電會會長。平常喜歡到處跑，順便認識一堆電到爆的人們
          </p>
          <p className="about-p">
            除了寫程式之外，對資安也稍微有點興趣，順便投稿一些 VOCALOID 歌曲、畫畫插畫打發時間。座右銘是「情熱を失っては、何もできない」，希望自己能一直保持這份熱情，把想做的事情一件一件做出來
          </p>
          <div className="divider" />
          <div className="stat-grid">
            <div className="stat">
              <div className="stat-k">本名</div>
              <div className="stat-v">郭家睿</div>
            </div>
            <div className="stat">
              <div className="stat-k">別名</div>
              <div className="stat-v">伊藤蒼太</div>
            </div>
            <div className="stat">
              <div className="stat-k">生日</div>
              <div className="stat-v mono">2009/01/15</div>
            </div>
          </div>
        </div>
        <div className="about-side">
          <img src="/assets/banner.webp" alt="" />
          <div className="about-side-body">
            <div className="label">狀態</div>
            <div className="about-side-v">人間になりたい</div>
            <div className="label mt16">座右銘</div>
            <div className="about-side-quote">情熱を失っては、何もできない。</div>
          </div>
        </div>
      </div>
    </section>
  );
}
