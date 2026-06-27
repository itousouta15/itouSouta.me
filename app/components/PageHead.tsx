import Link from "next/link";

interface PageHeadProps {
  kicker: string;
  title: string;
}

export default function PageHead({ kicker, title }: PageHeadProps) {
  return (
    <div className="page-head">
      <Link className="back-btn" href="/" aria-label="back" style={{ textDecoration: "none" }}>
        ←
      </Link>
      <div>
        <div className="page-kicker">{kicker}</div>
        <h1 className="page-title">{title}</h1>
      </div>
    </div>
  );
}
