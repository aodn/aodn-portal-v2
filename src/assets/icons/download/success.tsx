import { IconProps } from "../../../types/assets/iconsTypes";

export const SuccessIcon = ({
  color = "none",
  width = 20,
  height = 14,
}: IconProps) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 20 14"
    fill={color}
    xmlns="http://www.w3.org/2000/svg"
    data-testid="SuccessIcon"
  >
    <path
      d="M2.13477 5.94798L7.8151 11.8402L17.8649 2.16016"
      stroke="#88C057"
      strokeWidth="3.02502"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
