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
      d="M1,3 L9,12 L1,21 L8,21 L16,12 L8,3 Z M10,3 L18,12 L10,21 L17,21 L25,12 L17,3 Z"
    />
  </svg>
);
