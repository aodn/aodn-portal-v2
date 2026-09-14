import { ImgHTMLAttributes } from "react";
import useBreakpoint from "@/hooks/useBreakpoint";
import mobileLogo from "@/assets/logos/imos-logo-mobile.webp";
import desktopLogo from "@/assets/logos/imos-logo-desktop.webp";

const LOGO = {
  mobile: { src: mobileLogo, width: 244, height: 46 },
  desktop: { src: desktopLogo, width: 354, height: 88 },
} as const;

export const IconImosLogoWithTitle = (
  props: ImgHTMLAttributes<HTMLImageElement>
) => {
  const { isMobile } = useBreakpoint();
  const { src, width, height } = isMobile ? LOGO.mobile : LOGO.desktop;

  return (
    <img
      src={src}
      width={width}
      height={height}
      alt="Integrated Marine Observing System - Australian Ocean Data Network"
      decoding="async"
      {...props}
    />
  );
};
