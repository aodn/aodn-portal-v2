import { FC } from "react";
import { IconProps } from "./types";

const FullMapViewIcon: FC<IconProps> = ({
  width = 24,
  height = 18,
  color = "#ADADAD",
  bgColor = "white",
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="23.6992"
        y="17.6484"
        width="22.8398"
        height="16.8816"
        transform="rotate(-180 23.6992 17.6484)"
        fill={color}
      />
      <rect
        x="21.7148"
        y="15.6602"
        width="1.98607"
        height="12.9094"
        transform="rotate(-180 21.7148 15.6602)"
        fill={bgColor}
      />
    </svg>
  );
};

export default FullMapViewIcon;
