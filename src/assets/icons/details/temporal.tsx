import { ComponentType, SVGProps } from "react";

export const TemporalIcon: ComponentType<SVGProps<SVGSVGElement>> = ({
  color = "#595959",
  width = 20,
  height = 20,
}: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 24 24"
  >
    <path
      fill={color}
      d="M0.96,3 L8.64,12 L0.96,21 L7.68,21 L15.36,12 L7.68,3 Z M9.6,3 L17.28,12 L9.6,21 L16.32,21 L24,12 L16.32,3 Z"
    />
  </svg>
);
