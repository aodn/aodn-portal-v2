import { IconProps } from "../../../types/assets/iconsTypes";

export const InfoIcon = ({
  color = "currentColor",
  width = 40,
  height = 40,
}: IconProps) => (
  <svg
    id="Layer_1"
    data-name="Layer 1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 40 40"
    width={width}
    height={height}
    fill={color}
    data-testid="InfoIcon"
  >
    <path
      d="M19.19,10.03c8.86-.62,14.16,9.61,8.42,16.45-4.63,5.52-13.47,4.34-16.61-2.09-3.06-6.28,1.24-13.87,8.19-14.36ZM19.7,12c-5.92.23-9.59,6.66-6.7,11.89,3.2,5.79,11.68,5.37,14.32-.69,2.34-5.37-1.79-11.43-7.62-11.2Z"
      stroke={color}
      strokeWidth="0.3"
    />
    <path
      d="M19.89,18c.55-.04,1.04.29,1.09.85.15,1.71-.11,3.66,0,5.39-.21,1.06-1.87,1.01-1.97-.09-.15-1.71.11-3.66,0-5.39.08-.43.45-.73.88-.77Z"
      stroke={color}
      strokeWidth="0.3"
    />
    <path
      d="M19.89,15c1.3-.14,1.49,1.84.26,2-1.36.18-1.58-1.86-.26-2Z"
      stroke={color}
      strokeWidth="0.3"
    />
  </svg>
);
