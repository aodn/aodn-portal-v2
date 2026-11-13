import { ImgHTMLAttributes } from "react";
import mobileLogo from "@/assets/logos/imos-logo-mobile.webp";

export const ImosMobileLogoIcon = (
  props: ImgHTMLAttributes<HTMLImageElement>
) => (
  <img
    src={mobileLogo}
    width={244}
    height={46}
    alt="Integrated Marine Observing System - Australian Ocean Data Network"
    decoding="async"
    {...props}
  />
);
