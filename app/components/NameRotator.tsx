const NAMES = ["itouSouta", "伊藤蒼太", "郭家睿"];

export default function NameRotator() {
  return (
    <span className="name-rotator">
      {/* Real, single-string name for search engines/screen readers — the
          animated track below stacks the names with no separator between
          them in the DOM, which reads as one jammed-together word. */}
      <span className="sr-only">{NAMES.join(" / ")}</span>
      <span className="name-rotator-track" aria-hidden="true">
        <b>itouSouta</b>
        <b>伊藤蒼太</b>
        <b>郭家睿</b>
        <b>itouSouta</b>
      </span>
    </span>
  );
}
