import { ComponentType, SVGProps } from "react";

export const ArrowOutwardIcon: ComponentType<SVGProps<SVGSVGElement>> = ({
  color = "#090c02",
  width = 12,
  height = 12,
}: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 14 15"
    fill="none"
    data-testid="ArrowOutwardIcon"
  >
    <path
      d="M1 13.5L13.5 1M13.5 1H4.125M13.5 1V10.375"
      stroke={color}
      strokeLinecap="square"
    />
  </svg>
);
