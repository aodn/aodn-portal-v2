import { SVGProps } from "react";
import { portalTheme } from "../../../styles";

export const MailOutlineIcon = ({
  color = portalTheme.palette.grey700,
  width = 22,
  height = 22,
}: SVGProps<SVGSVGElement>) => (
  <svg
    id="Layer_1"
    data-name="Layer 1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 40 40"
    width={width}
    height={height}
    opacity="0.7"
    data-testid="MailOutlineIcon"
  >
    <path
      d="M39 9.54228V30.4723C38.7 31.8523 37.82 32.9323 36.42 33.2723C25.68 33.4923 14.91 33.3023 4.16 33.3623C2.49 33.2223 1.34 32.0723 1 30.4723V9.54228C1.34 7.94228 2.49 6.79228 4.16 6.65228C14.91 6.71228 25.69 6.52228 36.42 6.74228C37.69 7.01228 38.84 8.25228 39 9.54228ZM35.14 8.87228H4.86L17.77 21.7523C19.04 22.8723 20.83 22.8923 22.15 21.8223L35.14 8.87228ZM3.23 10.5023V29.5023L12.8 19.9723L3.23 10.5023ZM36.77 10.5023L27.2 19.9723L36.77 29.5023V10.5023ZM35.14 31.1323L25.54 21.6423C23.81 23.4323 22.37 24.9623 19.66 24.8323C17.25 24.7123 16.02 23.1323 14.4 21.6423L4.85 31.1323H35.13H35.14Z"
      fill={color}
    />
  </svg>
);
