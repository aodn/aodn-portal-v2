import { ComponentType, SVGProps } from "react";
import { portalTheme } from "../../../styles";

export const IconInformation: ComponentType<SVGProps<SVGSVGElement>> = ({
  color = portalTheme.palette.grey700,
  width = 20,
  height = 20,
}: SVGProps<SVGSVGElement>) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <polygon
      points="6.65 19 6.64 16.85 8.17 16.84 8.15 9.72 8.13 8.71 6.69 8.7 6.68 6.45 8.13 6.43 12.03 6.41 12.06 13.32 12.08 16.81 13.34 16.81 13.35 17.63 13.36 18.98 6.65 19"
      fill={color}
    />
    <path
      d="M12.11,3.09c-.09,1.08-.97,1.74-2.06,1.75-.71,0-1.38-.29-1.75-.91-.47-.78-.36-1.79.29-2.41.42-.4.94-.58,1.5-.51.71-.08,1.39.27,1.75.87.22.36.31.8.27,1.21Z"
      fill={color}
    />
  </svg>
);
