import { IconProps } from "../../../types/assets/iconsTypes";

export const ReplyIcon = ({
  color = "#52BDEC",
  width = 34,
  height = 34,
}: IconProps) => (
  <svg
    id="Layer_1"
    data-name="Layer 1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 40 40"
    width={width}
    height={height}
    fill={color}
    data-testid="ReplyIcon"
  >
    <path d="M23.15,15.77h-10.43s1.04,1.58,1.04,1.58c.28.43.33.95.09,1.43-.2.39-.62.71-1.13.74s-.97-.17-1.29-.58l-3.27-4.08c-.2-.25-.21-.63,0-.88l3.27-4.09c.28-.35.66-.55,1.11-.58.53-.03,1.01.24,1.25.64.28.45.31,1.03.01,1.47l-1.08,1.63h10.43c4.91,0,8.83,3.96,8.85,8.79s-3.87,8.85-8.79,8.85h-2.98c-.77,0-1.35-.6-1.37-1.32-.02-.76.58-1.4,1.37-1.4h2.94c3.4,0,6.1-2.74,6.11-6.08s-2.7-6.13-6.14-6.13Z" />
  </svg>
);
