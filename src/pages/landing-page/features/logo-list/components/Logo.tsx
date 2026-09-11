import { FC } from "react";

interface LogoProps {
  src: string;
  alt: string;
  height?: string;
}

const Logo: FC<LogoProps> = ({ src, alt, height = "80%" }) => {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      style={{
        objectFit: "contain",
        width: "80%",
        height: height,
      }}
    />
  );
};

export default Logo;
