import { FC } from "react";
import { IconProps } from "./types";

const RelevancyIcon: FC<IconProps> = ({
  width = 24,
  height = 24,
  color = "#ADADAD",
}) => {
  return (
    <svg width={width} height={height} viewBox="0 0 51 30" fill={color}>
      <g opacity="1">
        <rect x="21.25" y="1.90039" width="29.75" height="5.25" />
        <rect x="21.25" y="12.4004" width="22.75" height="5.25" />
        <rect x="21.25" y="22.9004" width="15.75" height="5.25" />
        <path
          d="M8.125 1.90039V28.1504M8.125 28.1504L14.25 22.0254M8.125 28.1504L2 22.0254"
          stroke={color}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};
export default RelevancyIcon;
