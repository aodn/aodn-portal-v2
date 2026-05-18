import { ComponentType, SVGProps } from "react";
import { portalTheme } from "../../../styles";

export const IconMap: ComponentType<SVGProps<SVGSVGElement>> = ({
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
    <path
      d="M7.35,1l.26.07,5.22,3.13,5.13-1.54c.26-.08.5-.01.72.15.17.12.32.36.32.63v13.12c0,.38-.28.67-.62.77l-5.43,1.63c-.22.06-.42.05-.62-.08l-5.16-3.1-5.13,1.54c-.45.13-.89-.15-.99-.57l-.04-.18V3.39c.06-.32.21-.61.54-.71l5.51-1.65c.05-.02.19,0,.21-.02h.09ZM2.63,15.45l3.83-1.14V2.91s-3.83,1.15-3.83,1.15v11.39ZM11.91,16.74V5.55s-3.82-2.29-3.82-2.29v11.19s3.82,2.29,3.82,2.29ZM17.37,15.94V4.55s-3.82,1.14-3.82,1.14v11.39s3.82-1.14,3.82-1.14Z"
      fill={color}
    />
  </svg>
);
