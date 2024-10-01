import { SvgIcon } from "@mui/material";
import React from "react";

interface EndpointedDiamondIconProps {
  isHighlighted?: boolean;
}

const EndpointedDiamondIcon: React.FC<EndpointedDiamondIconProps> = ({
  isHighlighted,
}) => {
  const color = "#797B7C";
  const highlightedColor = "#3B6E8F";
  return (
    <SvgIcon xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 4 L20 12 L12 20 L4 12 Z"
        stroke={color}
        strokeWidth="0.5"
        fill="none"
      />
      <circle cx="12" cy="4" r="2.2" fill={color} />
      <circle cx="20" cy="12" r="2.2" fill={color} />
      <circle cx="12" cy="20" r="2.2" fill={color} />
      <circle cx="4" cy="12" r="2.2" fill={color} />
      {isHighlighted && (
        <path
          d="M12 0.7 L23.3 12 L12 23.3 L0.7 12 Z"
          stroke={highlightedColor}
          strokeWidth="0.5"
          fill={highlightedColor}
          opacity="0.6"
        />
      )}
    </SvgIcon>
  );
};

export default EndpointedDiamondIcon;
