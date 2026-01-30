import { ComponentType, SVGProps } from "react";

const GridAndMapIcon: ComponentType<SVGProps<SVGSVGElement>> = ({
  width = 20,
  height = 20,
  color = "#ADADAD",
}: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 23 18"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="5.51562"
        y="0.0415039"
        width="7.14433"
        height="5.10309"
        transform="rotate(90 5.51562 0.0415039)"
        fill={color}
      />
      <rect
        x="5.51562"
        y="10.2478"
        width="7.14433"
        height="5.10309"
        transform="rotate(90 5.51562 10.2478)"
        fill={color}
      />
      <rect
        x="12.6602"
        y="0.0415039"
        width="7.14433"
        height="5.10309"
        transform="rotate(90 12.6602 0.0415039)"
        fill={color}
      />
      <rect
        x="12.6602"
        y="10.2478"
        width="7.14433"
        height="5.10309"
        transform="rotate(90 12.6602 10.2478)"
        fill={color}
      />
      <rect
        x="15.7207"
        y="0.0415039"
        width="7.14433"
        height="17.3505"
        fill={color}
      />
    </svg>
  );
};

export default GridAndMapIcon;
