import { SvgIcon } from "@mui/material";
import { portalTheme } from "../../styles";
import { ComponentType, SVGProps } from "react";

const MinusIcon: ComponentType<SVGProps<SVGSVGElement>> = ({
  color = portalTheme.palette.primary1,
}: SVGProps<SVGSVGElement>) => {
  return (
    <SvgIcon xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
      <path
        d="M11.5 4.35156M18.25 11.1016H4.75"
        stroke={color}
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SvgIcon>
  );
};

export default MinusIcon;
