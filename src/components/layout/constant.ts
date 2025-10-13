/*
Breakpoints as per UI design:
320px  - xs (mobile) height typically 640px (iPhone 14)
768px  - sm (tablet) height typically 1024px (iPad)
1280px - md (laptop) height typically 720px-800px
1440px - lg (desktop) height typically 900px
1920px - xl (extra large/4K) height typically 1080px
*/

export const BREAKPOINT = {
  MOBILE: 320,
  TABLET: 768,
  LAPTOP: 1280,
  DESKTOP: 1440,
  FOUR_K: 1920,
};

export const PAGE_CONTENT_MIN_WIDTH = BREAKPOINT.MOBILE;
export const PAGE_CONTENT_MAX_WIDTH = BREAKPOINT.DESKTOP;
export const PAGE_CONTENT_WIDTH_ABOVE_LAPTOP = 0.8;
export const PAGE_CONTENT_WIDTH_UNDER_LAPTOP = 0.95;
export const SEARCHBAR_CONTENT_WIDTH = 0.9;

export const AODN_SITE_LOGO_WIDTH = "72px";
export const AODN_SITE_LOGO_WIDTH_MOBILE = "50px";

export const HEADER_HEIGHT = 120;
export const HEADER_HEIGHT_MOBILE = 65;
