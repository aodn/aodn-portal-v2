/**
 * For better readability and additions to the theme, consider putting style constants here
 */
const gap = {
  xs: "1px",
  sm: "2px",
  md: "5px",
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
  bannerTitleLarge: "78px",
  bannerTitleMedium: "62px",
  bannerSubtitle: "20px",
  mapMenuItem: 14,
  mapMenuSubItem: 13,
  detailPageHeading: "20px",
  icon: "10px",
  label: "12px",
  info: "14px",
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
  },
  gray: {
    dark: "#575757",
    medium: "#787878",
    light: "#979797",
    extraLight: "#dfdfdf",
    xxLight: "#f8f8f8",
  },
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
};
