import { ComponentType, SVGProps } from "react";
import { portalTheme } from "../../../styles";

export const IconCitation: ComponentType<SVGProps<SVGSVGElement>> = ({
  color = portalTheme.palette.grey700,
  width = 20,
  height = 20,
}: SVGProps<SVGSVGElement>) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M13.77,16.4c-.1,0-.22-.08-.26-.13s-.06-.21-.02-.3l2.36-4.75h-4.22c-.33,0-.55-.28-.54-.6v-6.51c0-.29.25-.53.54-.53h6.84c.28.03.52.23.52.53v7.1s-2.3,4.61-2.3,4.61c-.18.35-.49.56-.88.57h-2.04Z"
      fill={color}
    />
    <path
      d="M3.67,16.4c-.1,0-.22-.08-.25-.14s-.05-.21-.01-.29l2.36-4.76H1.54c-.31,0-.53-.26-.54-.56v-6.54c0-.29.25-.53.53-.53h6.84c.32.02.53.25.53.57v7.07s-2.33,4.66-2.33,4.66c-.17.34-.5.51-.86.52h-2.05Z"
      fill={color}
    />
  </svg>
);
