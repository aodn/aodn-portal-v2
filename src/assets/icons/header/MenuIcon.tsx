import { SvgIcon, SvgIconProps } from "@mui/material";

export const MenuIcon = ({
  width = "30",
  height = "30",
  ...prop
}: SvgIconProps) => (
  <SvgIcon
    width={width}
    height={height}
    viewBox="0 0 30 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4.6875 8.4375H25.3125M4.6875 15H25.3125M15 21.5625H25.3125"
      stroke="black"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </SvgIcon>
);
