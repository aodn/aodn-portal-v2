import { ImgHTMLAttributes } from "react";
import mobileLogo from "@/assets/logos/imos-logo-mobile.webp";

// Mobile header logo. The desktop header composes the mark, divider and text
// in AODNSiteLogo so the spacing follows Figma.
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
