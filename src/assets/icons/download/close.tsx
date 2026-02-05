import { ComponentType, SVGProps } from "react";

export const CloseIcon: ComponentType<SVGProps<SVGSVGElement>> = ({
  color = "#8c8c8c",
  width = 12,
  height = 13,
}: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 12 13"
    fill={color}
  >
    <path
      d="M11 11.6562L1 1.65625"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M1 11.6562L11 1.65625"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
