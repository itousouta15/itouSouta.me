import type { ExperienceItem } from "../../data";
import { experienceImageThumb } from "../../lib/imageThumb";

export default function ExperienceDetailBody({
  item,
}: {
  item: ExperienceItem;
}) {
  return (
    <>
      <div className="proj-tags" style={{ marginTop: 4 }}>
        <span className="proj-tag">{item.period}</span>
        {item.org && <span className="proj-tag">{item.org}</span>}
      </div>

      {item.desc && (
        <div className="proj-detail-section">
          <p className="about-p">{item.desc}</p>
        </div>
      )}

      {item.images && item.images.length > 0 && (
        <div className="proj-detail-section exp-detail-gallery">
          {item.images.map((src, i) => (
            <a
              key={src + i}
              className="exp-detail-gallery-item"
              href={src}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={experienceImageThumb(src)}
                alt={`${item.title} 圖片 ${i + 1}`}
                loading="lazy"
                decoding="async"
              />
            </a>
          ))}
        </div>
      )}

      {item.longDesc && (
        <div className="proj-detail-section">
          <div className="card-kicker">詳細內容</div>
          <p className="about-p">{item.longDesc}</p>
        </div>
      )}

      {item.href && (
        <div className="proj-detail-actions">
          <a
            className="btn-primary"
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none" }}
          >
            相關連結 <span className="btn-arrow dark">→</span>
          </a>
        </div>
      )}
    </>
  );
}
