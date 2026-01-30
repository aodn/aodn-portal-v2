import { ComponentType, SVGProps } from "react";

const PopularityIcon: ComponentType<SVGProps<SVGSVGElement>> = ({
  width = 24,
  height = 24,
  color = "#ADADAD",
}: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      version="1.0"
      width={width}
      height={height}
      viewBox="0 0 108.000000 108.000000"
      preserveAspectRatio="xMidYMid meet"
    >
      <g
        transform="translate(0.000000,108.000000) scale(0.100000,-0.100000)"
        fill={color}
        stroke="none"
      >
        <path
          d="M480 979 c-128 -21 -257 -118 -312 -235 -61 -131 -61 -260 2 -387
l32 -65 -42 -107 c-38 -95 -41 -108 -28 -122 14 -13 28 -8 127 41 l112 57 47
-17 c248 -86 518 80 562 347 31 179 -79 381 -245 455 -45 19 -171 47 -195 43
-3 -1 -30 -5 -60 -10z m133 -236 l37 -71 68 -7 c121 -13 129 -32 46 -116 l-56
-56 13 -77 c11 -69 10 -79 -5 -94 -16 -16 -21 -14 -91 21 l-74 38 -65 -36
c-103 -57 -121 -39 -96 96 l10 53 -55 56 c-82 82 -74 102 46 114 l65 7 37 75
c49 99 67 98 120 -3z"
        />
      </g>
    </svg>
  );
};

export default PopularityIcon;
