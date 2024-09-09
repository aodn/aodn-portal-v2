import { FC } from "react";
import { IconProps } from "./types";

const ModifiedIcon: FC<IconProps> = ({
  width = 22,
  height = 22,
  color = "#ADADAD",
}) => {
  return (
    <svg
      version="1.0"
      width={width}
      height={height}
      viewBox="0 0 87.000000 88.000000"
      preserveAspectRatio="xMidYMid meet"
    >
      <g
        transform="translate(0.000000,88.000000) scale(0.100000,-0.100000)"
        fill={color}
        stroke="none"
      >
        <path
          d="M731 828 c-63 -43 -63 -51 4 -118 l60 -61 38 40 c44 47 48 87 15 125
-33 38 -75 43 -117 14z"
        />
        <path
          d="M483 588 l-141 -143 -12 -67 c-7 -37 -9 -71 -6 -76 3 -6 32 -4 73 4
l68 15 145 144 145 145 -60 60 c-33 33 -62 60 -65 60 -3 0 -69 -64 -147 -142z"
        />
        <path
          d="M54 682 c-42 -33 -44 -50 -44 -339 0 -260 1 -280 20 -311 l20 -32
316 2 317 3 21 28 c19 25 21 45 25 181 3 167 -4 200 -42 194 -21 -3 -22 -7
-25 -167 -1 -101 -7 -170 -13 -178 -9 -10 -70 -13 -280 -13 -265 0 -268 0
-283 22 -24 33 -24 513 0 546 15 21 21 22 178 22 153 0 164 1 169 19 9 37 -11
41 -188 41 -146 0 -173 -3 -191 -18z"
        />
      </g>
    </svg>
  );
};

export default ModifiedIcon;
