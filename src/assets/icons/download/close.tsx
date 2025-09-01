import { IconProps } from "../../../components/icon/types";

export const CloseIcon = ({
  color = "#8c8c8c",
  width = 12,
  height = 13,
}: IconProps) => (
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
