import { ComponentType, SVGProps } from "react";

export const ExpandMore: ComponentType<SVGProps<SVGSVGElement>> = ({
  color = "#3B6E8F",
  width = 20,
  height = 7,
}: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 12 7"
    fill="none"
    data-testid="ExpandMore"
  >
    <path
      d="M11 1L6 6L1 1"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
