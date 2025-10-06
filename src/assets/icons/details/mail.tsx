import { IconProps } from "../../../types/assets/iconsTypes";

export const MailOutlineIcon = ({
  color = "currentColor",
  width = 22,
  height = 22,
}: IconProps) => (
  <svg
    id="Layer_1"
    data-name="Layer 1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 40 40"
    width={width}
    height={height}
    opacity="0.7"
    data-testid="MailOutlineIcon"
  >
    <path d="M39,9.54v20.93c-.3,1.38-1.18,2.46-2.58,2.8-10.74.22-21.51.03-32.26.09-1.67-.14-2.82-1.29-3.16-2.89V9.54c.34-1.6,1.49-2.75,3.16-2.89,10.75.06,21.53-.13,32.26.09,1.27.27,2.42,1.51,2.58,2.8ZM35.14,8.87H4.86l12.91,12.88c1.27,1.12,3.06,1.14,4.38.07l12.99-12.95ZM3.23,10.5v19l9.57-9.53L3.23,10.5ZM36.77,10.5l-9.57,9.47,9.57,9.53V10.5ZM35.14,31.13l-9.6-9.49c-1.73,1.79-3.17,3.32-5.88,3.19-2.41-.12-3.64-1.7-5.26-3.19l-9.55,9.49h30.28Z" />
  </svg>
);
