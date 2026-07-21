const NAMES = ["itouSouta", "伊藤蒼太", "郭家睿"];

export default function NameRotator() {
  return (
    <span className="name-rotator" aria-label={NAMES.join(", ")}>
      <span className="name-rotator-track">
        <b>itouSouta</b>
        <b>伊藤蒼太</b>
        <b>郭家睿</b>
        <b>itouSouta</b>
      </span>
    </span>
  );
}
