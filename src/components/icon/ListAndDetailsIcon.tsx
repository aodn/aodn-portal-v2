import { FC } from "react";
import { IconProps } from "./types";

const ListAndDetailsIcon: FC<IconProps> = ({
  width = 20,
  height = 20,
  color = "#ADADAD",
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 21 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="21" height="3" fill={color} />
      <rect y="6" width="21" height="3" fill={color} />
      <rect y="12" width="21" height="3" fill={color} />
    </svg>
  );
};

export default ListAndDetailsIcon;
