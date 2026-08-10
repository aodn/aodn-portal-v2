import { ComponentType, SVGProps } from "react";

export const DetailsIcon: ComponentType<SVGProps<SVGSVGElement>> = ({
  color = "currentColor",
  width = 20,
  height = 20,
  ...rest
}: SVGProps<SVGSVGElement>) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    data-testid="DetailsIcon"
    {...rest}
  >
    <circle cx="12" cy="12" r="10.55" stroke={color} strokeWidth="1.9" />
    <circle cx="6.8" cy="12" r="1.35" fill={color} />
    <circle cx="12" cy="12" r="1.35" fill={color} />
    <circle cx="17.2" cy="12" r="1.35" fill={color} />
  </svg>
);
