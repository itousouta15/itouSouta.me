import Link from "next/link";

interface PageHeadProps {
  kicker: string;
  title: string;
  desc?: string;
  back?: string;
}

export default function PageHead({ kicker, title, desc, back = "/" }: PageHeadProps) {
  return (
    <div className="page-head">
      <Link className="back-btn" href={back} aria-label="back" style={{ textDecoration: "none" }}>
        ←
      </Link>
      <div>
        <div className="page-kicker">{kicker}</div>
        <h1 className="page-title">{title}</h1>
      </div>
      {desc && <p className="page-head-desc">{desc}</p>}
    </div>
  );
}
