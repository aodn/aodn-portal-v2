import { ComponentType, SVGProps } from "react";
import { portalTheme } from "../../styles";
import {
  LINK_ICON_PATHS,
  LINK_ICON_VIEWBOX,
} from "../../assets/icons/result/link";

export const IconLink: ComponentType<SVGProps<SVGSVGElement>> = ({
  color = portalTheme.palette.grey700,
}: SVGProps<SVGSVGElement>) => (
  <span style={{ display: "inline-flex" }}>
    <svg
      width={20}
      height={20}
      viewBox={LINK_ICON_VIEWBOX}
      xmlns="http://www.w3.org/2000/svg"
    >
      {LINK_ICON_PATHS.map((d) => (
        <path key={d} d={d} fill={color} />
      ))}
    </svg>
  </span>
);
