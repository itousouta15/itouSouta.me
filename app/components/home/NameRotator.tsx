import { site } from "../../template/config";

// The CSS rotation has three slots plus one copy to loop back to the start.
const NAMES = [site.author.name, ...site.author.aliases.slice(0, 2)];
while (NAMES.length < 3) NAMES.push(site.author.name);

/* Names are rendered visually through CSS without duplicating them in the H1
   text that search engines and screen readers index. */
export default function NameRotator() {
  const track = [...NAMES, NAMES[0]];

  return (
    <span className="name-rotator">
      <span className="sr-only">{[...new Set(NAMES)].join(" / ")}</span>
      <span className="name-rotator-track" aria-hidden="true">
        {track.map((name, i) => (
          <b key={`${name}-${i}`} data-name={name} />
        ))}
      </span>
    </span>
  );
}
