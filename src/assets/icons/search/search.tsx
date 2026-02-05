import { ComponentType, SVGProps } from "react";

export const SearchIcon: ComponentType<SVGProps<SVGSVGElement>> = ({
  color = "none",
  width = 22,
  height = 22,
}: SVGProps<SVGSVGElement>) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 22 22"
    fill={color}
    xmlns="http://www.w3.org/2000/svg"
    data-testid="SearchIcon"
  >
    <path
      d="M21 21L15.2258 15.2258M15.2258 15.2258C16.7886 13.663 17.6666 11.5434 17.6666 9.33328C17.6666 7.12316 16.7886 5.00356 15.2258 3.44076C13.663 1.87797 11.5434 1 9.33328 1C7.12316 1 5.00356 1.87797 3.44076 3.44076C1.87797 5.00356 1 7.12316 1 9.33328C1 11.5434 1.87797 13.663 3.44076 15.2258C5.00356 16.7886 7.12316 17.6666 9.33328 17.6666C11.5434 17.6666 13.663 16.7886 15.2258 15.2258Z"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
