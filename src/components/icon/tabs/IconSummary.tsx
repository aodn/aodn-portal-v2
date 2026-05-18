import { ComponentType, SVGProps } from "react";
import { portalTheme } from "../../../styles";

export const IconSummary: ComponentType<SVGProps<SVGSVGElement>> = ({
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
      d="M17.46,10.29c-.15.54-.54.79-1.05.9H3.56c-.64-.15-1.07-.61-1.05-1.23.02-.58.5-1.13,1.15-1.13h12.71c.75,0,1.28.8,1.08,1.46Z"
      fill={color}
    />
    <path
      d="M16.6,4.83H3.45c-.34,0-.62-.33-.78-.57-.21-.33-.22-.71-.04-1.08.13-.26.42-.57.81-.66h13.11c.68.17,1.08.8.93,1.46-.15.41-.41.72-.87.85Z"
      fill={color}
    />
    <path
      d="M11.8,17.49H3.53c-.53-.09-.91-.47-1.02-.99-.07-.64.31-1.18.94-1.32h8.38c.56.13.9.6.93,1.13-.01.56-.36,1.02-.96,1.18Z"
      fill={color}
    />
  </svg>
);
