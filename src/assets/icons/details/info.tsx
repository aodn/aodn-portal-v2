import { IconProps } from "../../../types/assets/iconsTypes";

export const InfoIcon = ({
  color = "currentColor",
  width = 30,
  height = 30,
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
    <path d="M19.1,8.05c9.54-.61,16.09,9.56,11.28,17.93-4.52,7.86-15.84,8.04-20.6.32-4.7-7.61.42-17.68,9.32-18.25ZM19.66,12.91c-2.16.3-2.1,3.61.04,3.82,3.01.3,2.84-4.22-.04-3.82ZM19.15,18.38c-.38.06-.75.46-.8.84v7.05c.1.36.41.72.77.81.29.07,1.34.07,1.64.02.4-.07.75-.46.85-.84v-7.1c-.09-.34-.37-.68-.72-.77-.28-.07-1.45-.07-1.74-.02Z" />
  </svg>
);
