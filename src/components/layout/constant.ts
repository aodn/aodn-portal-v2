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

export const AODN_SITE_LOGO_HEIGHT = "72px";
export const AODN_SITE_LOGO_HEIGHT_MOBILE = "50px";

export const HEADER_HEIGHT = 150;
export const HEADER_HEIGHT_MOBILE = 80;
