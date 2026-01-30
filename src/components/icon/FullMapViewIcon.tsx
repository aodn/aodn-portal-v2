import { ComponentType, SVGProps } from "react";

const FullMapViewIcon: ComponentType<SVGProps<SVGSVGElement>> = ({
  width = 23,
  height = 17,
  color = "3B6E8F",
}: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 23 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="22.8398"
        y="16.8828"
        width="22.8398"
        height="16.8816"
        rx="1"
        transform="rotate(-180 22.8398 16.8828)"
        fill={color}
      />
      <rect
        x="20.8555"
        y="14.8984"
        width="1.98607"
        height="12.9094"
        rx="0.993035"
        transform="rotate(-180 20.8555 14.8984)"
        fill="#ECECEC"
      />
    </svg>
  );
};

export default FullMapViewIcon;
