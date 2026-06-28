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
            一個喜歡 VOCALOID 和畫插畫的怪人。平常在做 Vocalo-P 與插畫，偶爾寫點程式。人間になりたい。
          </p>
          <p className="about-note">（此處為佔位文字，之後可換成你的自我介紹）</p>
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
              <div className="stat-k">身分</div>
              <div className="stat-v sans">Vocalo-P・Illustrator</div>
            </div>
            <div className="stat">
              <div className="stat-k">加入時間</div>
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
