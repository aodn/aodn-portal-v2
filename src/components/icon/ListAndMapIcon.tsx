import { FC } from "react";
import { IconProps } from "./types";

const ListAndMapIcon: FC<IconProps> = ({
  width = 22,
  height = 22,
  color = "#ADADAD",
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 18"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="0.392578"
        y="1.06299"
        width="12.2474"
        height="3.06186"
        fill={color}
      />
      <rect
        x="0.392578"
        y="7.18652"
        width="12.2474"
        height="3.06186"
        fill={color}
      />
      <rect
        x="0.392578"
        y="13.3101"
        width="12.2474"
        height="3.06186"
        fill={color}
      />
      <rect
        x="15.7012"
        y="0.0422363"
        width="8.16495"
        height="17.3505"
        fill={color}
      />
    </svg>
  );
};
export default ListAndMapIcon;
