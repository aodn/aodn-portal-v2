import { FC } from "react";
import { IconProps } from "./types";

const FullMapViewIcon: FC<IconProps> = ({
  width = 22,
  height = 22,
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
        x="23.7012"
        y="17.6475"
        width="22.8398"
        height="16.8816"
        transform="rotate(-180 23.7012 17.6475)"
        fill={color}
      />
      <rect
        x="21.7148"
        y="15.6599"
        width="1.98607"
        height="12.9094"
        transform="rotate(-180 21.7148 15.6599)"
        fill={bgColor}
      />
    </svg>
  );
};

export default FullMapViewIcon;
