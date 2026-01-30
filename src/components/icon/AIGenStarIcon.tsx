import { ComponentType, SVGProps } from "react";

const AIGenStarIcon: ComponentType<SVGProps<SVGSVGElement>> = ({
  width = 20,
  height = 20,
  color = "#ADADAD",
}: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 80 80"
      width={width}
      height={height}
      fill={color}
    >
      <g
        transform="translate(0.000000,80.000000) scale(0.100000,-0.100000)"
        fill={color}
        stroke="none"
      >
        <path
          d="M386 698 c-44 -137 -50 -150 -91 -192 -34 -36 -58 -49 -121 -69 -44
-14 -79 -31 -79 -38 0 -7 28 -20 63 -30 120 -34 169 -82 207 -201 13 -40 29
-73 36 -73 7 0 20 29 30 64 34 119 91 176 210 210 35 10 64 23 64 30 0 7 -33
23 -73 36 -119 38 -167 87 -201 207 -17 60 -36 84 -45 56z"
        />
      </g>
    </svg>
  );
};

export default AIGenStarIcon;
