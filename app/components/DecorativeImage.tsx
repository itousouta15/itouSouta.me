import type { CSSProperties } from "react";

type DecorativeImageProps = {
  className?: string;
  src: string;
  title?: string;
  style?: CSSProperties;
};

export default function DecorativeImage({ className, src, title, style }: DecorativeImageProps) {
  return (
    <span
      aria-hidden="true"
      className={className}
      title={title}
      style={{
        ...style,
        backgroundImage: `url("${src}")`,
      }}
    />
  );
}
