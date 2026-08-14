/*
Breakpoints as per UI design:
320px  - xs (mobile) height typically 640px (iPhone 14)
768px  - sm (tablet) height typically 1024px (iPad)
1024px - md (laptop) height typically 720px-800px
1440px - lg (desktop) height typically 900px
1920px - xl (extra large/4K) height typically 1080px
*/

export const BREAKPOINT = {
  MOBILE: 320,
  SMALL_MOBILE: 360, // Extra breakpoint for very tight mobile layouts (e.g. iPhone SE)
  LARGE_MOBILE: 430, // Extra breakpoint for phone layouts
  TABLET: 768,
  LAPTOP: 1024,
  DESKTOP: 1440,
  FOUR_K: 1920,
};

export const PAGE_CONTENT_MIN_WIDTH = BREAKPOINT.MOBILE;
export const PAGE_CONTENT_MAX_WIDTH = BREAKPOINT.DESKTOP;

// Responsive content widths for header
export const PAGE_CONTENT_WIDTH_HEADER = {
  xs: "calc(100% - 30px)", // mobile
  md: "calc(100% - 120px)", // laptop+
};

// Responsive content widths for landing page
export const PAGE_CONTENT_WIDTH_LANDING = {
  xs: "calc(100% - 30px)", // mobile
  sm: "calc(100% - 100px)", // tablet
  md: "calc(100% - 120px)", // laptop
  lg: "calc(100% - 160px)", // desktop+
};

// Responsive content widths for detail page
export const PAGE_CONTENT_WIDTH_DETAIL = {
  xs: "calc(100% - 30px)", // mobile
  sm: "calc(100% - 30px)", // tablet
  md: "calc(100% - 100px)", // laptop
  lg: "calc(100% - 150px)", // desktop+
};

export const SEARCHBAR_CONTENT_WIDTH = 0.9;

import { border, padding } from "@/styles/constants";

const px = (value: string) => parseInt(value, 10);

export const AODN_SITE_LOGO_HEIGHT = "72px";
export const AODN_SITE_LOGO_HEIGHT_MOBILE = "50px";

// Matches the unpadded header nav row (PlainMenu 16px / 1.75 line-height + 6px py)
export const HEADER_MENU_ROW_HEIGHT = 40;

// logo row: paddingY medium above and below the logo
const HEADER_LOGO_ROW_HEIGHT =
  px(padding.medium) * 2 + px(AODN_SITE_LOGO_HEIGHT);

export const HEADER_HEIGHT =
  HEADER_MENU_ROW_HEIGHT + HEADER_LOGO_ROW_HEIGHT + px(border.sm);

export const HEADER_HEIGHT_MOBILE = 80;
