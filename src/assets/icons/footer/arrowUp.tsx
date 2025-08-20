import { IconProps } from "../../../types/assets/iconsTypes";

export const NorthIcon = ({
  color = "#000",
  width = 26,
  height = 24,
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 25 24"
    fill="none"
  >
    <path
      d="M5.02344 10.5L12.5644 3M12.5644 3L20.1054 10.5M12.5644 3V21"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
