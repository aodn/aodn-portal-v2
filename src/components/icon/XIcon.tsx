import { SvgIcon } from "@mui/material";
import React from "react";

interface XIconProps {
  color?: string;
}

const XIcon: React.FC<XIconProps> = ({ color = "red" }) => {
  return (
    <SvgIcon
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line x1="6" y1="6" x2="18" y2="18" stroke={color} strokeWidth="2" />
      <line x1="6" y1="18" x2="18" y2="6" stroke={color} strokeWidth="2" />
    </SvgIcon>
  );
};

export default XIcon;
