import { ComponentType, SVGProps } from "react";

export const DownloadsIcon: ComponentType<SVGProps<SVGSVGElement>> = ({
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
    data-testid="DownloadsIcon"
    {...rest}
  >
    <path
      d="M12 1.5V17.7"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
    />
    <path
      d="M6 10.3L12 17.7L18 10.3"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M1.1 21.2H22.9"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
    />
  </svg>
);
