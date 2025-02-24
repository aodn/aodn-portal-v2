/**
 * For better readability and additions to the theme, consider putting style constants here
 */
const gap = {
  xs: "1px",
  sm: "2px",
  md: "4px",
  lg: "8px",
  xlg: "10px",
  xxlg: "15px",
};

const margin = {
  nil: "0",
  sm: "2px",
  md: "5px",
  lg: "10px",
  xlg: "15px",
  xxlg: "25px",
  top: "15px",
  bottom: "15px",
  left: "15px",
  right: "15px",
  doubleTop: "30px",
  doubleBottom: "30px",
  doubleLeft: "30px",
  doubleRight: "30px",
  tripleTop: "45px",
  tripleBottom: "45px",
  quadruple: "60px",
};

const padding = {
  nil: "0",
  extraSmall: "6px",
  small: "10px",
  medium: "15px",
  large: "20px",
  extraLarge: "25px",
  double: "30px",
  triple: "45px",
  quadruple: "60px",
};

const fontSize = {
  AODNSiteLogoText: "14px",
  AODNSiteLogoTextMobile: "12px",
  bannerTitleExtraLarge: "64px",
  bannerTitleLarge: "48px",
  bannerTitleMedium: "36px",
  bannerTitleSmall: "28px",
  bannerSubtitle: "14px",
  bannerSubtitleSmall: "10px",
  mapMenuItem: 14,
  mapMenuSubItem: 13,
  detailPageHeading: "20px",
  detailPageHeadingMobile: "14px",
  newsHeading: "40px",
  newsTitle: "20px",
  slideCardTitle: "16px",
  slideCardSubTitle: "14px",
  newsLabel: "16px",
  newsInfo: "14px",
  subscription: "14px",
  icon: "10px",
  label: "12px",
  info: "14px",
  resultCardTitle: "14px",
  resultCardTitleUnderLaptop: "12px",
  resultCardContent: "12px",
  resultCardContentUnderLaptop: "12px",
};

const fontFamily = {
  general: "Noto Sans",
};

const fontWeight = {
  extraLight: "200",
  light: "300",
  regular: "400",
  medium: "500",
  bold: "600",
  extraBold: "800",
};

const fontColor = {
  gray: {
    extraDark: "#3C3C3C",
    dark: "#575757",
    medium: "#787878",
    light: "#979797",
  },
  blue: {
    dark: "#356183",
    medium: "#468CB6",
  },
};

const color = {
  tabPanel: {
    background: "#fff",
    tabOnFocused: "#182C3A",
    tabOnHover: "#182C3A",
    divider: "#8B959C",
  },
  blue: {
    extraLightSemiTransparent: "rgba(231,242,255,0.5)",
    xLight: "#eaf1f6",
    light: "#E2ECF3",
    medium: "#E7F2FF",
    dark: "#618CA5",
    darkSemiTransparent: "rgba(97,140,165,0.5)",
    extraDark: "#182C3A",
  },
  brightBlue: {
    dark: "#51BCEB",
    semiTransparentDark: "rgba(82, 189, 236, 0.4)",
  },
  gray: {
    dark: "#595959",
    medium: "#787878",
    light: "#979797",
    extraLight: "#dfdfdf",
    xxLight: "#f8f8f8",
  },
  white: {
    twoTenTransparent: " rgba(255, 255, 255, 0.2  )",
    sixTenTransparent: " rgba(255, 255, 255, 0.6  )",
  },
  success: {
    main: "#4CAF50",
  },
  pace: "#D7F4F2",
};

const border = {
  buttonBorder: "2px solid #fff",
  xs: "1px solid",
  sm: "2px solid",
};

const borderRadius = {
  circle: "50%",
  underline: "24px",
  button: "24px",
  filter: "10px",
  menu: "5px",
  menuTop: "5px 5px 0 0",
  small: "5px",
  medium: "8px",
  large: "10px",
  xlg: "15px",
  xxlg: "34px",
};

const filterList = {
  filterListMaxDisplay: 4,
};

const zIndex = {
  MAP_COORD: 1,
  FILTER_MODAL: 9,
  FILTER_OVERLAY: 10,
  header: 100,
};

const shadow = {
  inner: "inset 1px 1px rgba(0, 0, 0, 0.1)",
  bottom: "0 2px 2px 0 rgba(0, 0, 0, 0.1)",
};

export {
  gap,
  margin,
  padding,
  fontSize,
  fontFamily,
  fontWeight,
  fontColor,
  color,
  border,
  borderRadius,
  filterList,
  zIndex,
  shadow,
};
