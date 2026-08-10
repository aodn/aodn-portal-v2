import { ComponentType, SVGProps } from "react";

// Both variants draw the same silhouette so the icon does not shift when a
// dataset is bookmarked: an 18x22 glyph in a 24 viewBox, notch apex 25% up from
// the bottom edge. Every vertex is a tangent arc — top corners, both bottom
// corners and the notch apex — rather than a hard vertex softened by
// strokeLinejoin, which left the bottom corners looking cut off.
//
// The outlined path follows the stroke centreline; the filled path is that same
// polygon offset outward by the half stroke (0.95), so both land on identical
// outer bounds.

export const BookmarkFilledIcon: ComponentType<SVGProps<SVGSVGElement>> = ({
  color = "currentColor",
  width = 20,
  height = 20,
  ...rest
}: SVGProps<SVGSVGElement>) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    data-testid="BookmarkFilledIcon"
    {...rest}
  >
    <path
      d="M6.15 1L17.85 1A3.15 3.15 0 0 1 21 4.15L21 19.65A2.25 2.25 0 0 1 17.52 21.53L12.16 18.04A0.3 0.3 0 0 0 11.84 18.04L6.48 21.53A2.25 2.25 0 0 1 3 19.65L3 4.15A3.15 3.15 0 0 1 6.15 1Z"
      fill={color}
    />
  </svg>
);

export const BookmarkOutlinedIcon: ComponentType<SVGProps<SVGSVGElement>> = ({
  color = "currentColor",
  width = 20,
  height = 20,
  ...rest
}: SVGProps<SVGSVGElement>) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    data-testid="BookmarkOutlinedIcon"
    {...rest}
  >
    <path
      d="M6.15 1.95L17.85 1.95A2.2 2.2 0 0 1 20.05 4.15L20.05 19.65A1.3 1.3 0 0 1 18.04 20.74L12.6 17.19A1.1 1.1 0 0 0 11.4 17.19L5.96 20.74A1.3 1.3 0 0 1 3.95 19.65L3.95 4.15A2.2 2.2 0 0 1 6.15 1.95Z"
      stroke={color}
      strokeWidth="1.9"
      strokeLinejoin="round"
    />
  </svg>
);
