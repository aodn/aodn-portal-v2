import { createTheme, ThemeOptions } from "@mui/material/styles";
import { designTokensRC8 } from "./designTokensRC8";

// Type definitions are in rc8ThemeTypes.ts to extend Material-UI theme interfaces

const rc8ThemeOptions: ThemeOptions = {
  designTokens: designTokensRC8,

  typography: {
    fontFamily: [
      designTokensRC8.typography.fontFamily.poppins,
      designTokensRC8.typography.fontFamily.openSans,
    ].join(","),

    slogan1: designTokensRC8.typography.variants.slogan1,
    slogan2: designTokensRC8.typography.variants.slogan2,
    heading1: designTokensRC8.typography.variants.heading1,
    heading2: designTokensRC8.typography.variants.heading2,
    heading3: designTokensRC8.typography.variants.heading3,
    heading4: designTokensRC8.typography.variants.heading4,
    title1Medium: designTokensRC8.typography.variants.title1Medium,
    title2Regular: designTokensRC8.typography.variants.title2Regular,
    body1Medium: designTokensRC8.typography.variants.body1Medium,
    body2Regular: designTokensRC8.typography.variants.body2Regular,
    body3Small: designTokensRC8.typography.variants.body3Small,
  },

  palette: {
    // MUI system colors using RC8 tokens
    primary: {
      main: designTokensRC8.colours.product.primary1,
    },
    secondary: {
      main: designTokensRC8.colours.product.secondary1,
    },
    success: {
      main: designTokensRC8.colours.system.complete,
    },
    warning: {
      main: designTokensRC8.colours.system.warning,
    },
    error: {
      main: designTokensRC8.colours.system.error,
    },
    info: {
      main: designTokensRC8.colours.system.info,
    },

    // RC8 custom colors
    text1: designTokensRC8.colours.text.text1,
    text2: designTokensRC8.colours.text.text2,
    text3: designTokensRC8.colours.text.text3,
    rc8Background: designTokensRC8.colours.background.background,
    grey100: designTokensRC8.colours.grey.grey100,
    grey300: designTokensRC8.colours.grey.grey300,
    grey500: designTokensRC8.colours.grey.grey500,
    grey600: designTokensRC8.colours.grey.grey600,
    grey700: designTokensRC8.colours.grey.grey700,
    primary1: designTokensRC8.colours.product.primary1,
    primary2: designTokensRC8.colours.product.primary2,
    primary3: designTokensRC8.colours.product.primary3,
    primary4: designTokensRC8.colours.product.primary4,
    primary5: designTokensRC8.colours.product.primary5,
    primary6: designTokensRC8.colours.product.primary6,
    secondary1: designTokensRC8.colours.product.secondary1,
    neutral1: designTokensRC8.colours.product.neutral1,
    neutral2: designTokensRC8.colours.product.neutral2,
    neutral3: designTokensRC8.colours.product.neutral3,
    neutral4: designTokensRC8.colours.product.neutral4,
    tag1: designTokensRC8.colours.product.tag1,
    tag2: designTokensRC8.colours.product.tag2,
  },

  // TODO: Add custom RC8 theme properties

  // TODO: rc8Spacing - custom spacing tokens
  // rc8Spacing: {
  //   xs: "4px",
  //   sm: "8px",
  //   md: "16px",
  //   lg: "24px",
  //   xl: "32px",
  // },

  // TODO: rc8Breakpoints - custom breakpoint tokens
  // rc8Breakpoints: {
  //   mobile: 640,
  //   tablet: 768,
  //   desktop: 1024,
  //   wide: 1440,
  // },

  // TODO: rc8Elevation - custom shadow tokens
  // rc8Elevation: {
  //   card: "0px 2px 8px rgba(0, 0, 0, 0.1)",
  //   modal: "0px 8px 32px rgba(0, 0, 0, 0.2)",
  //   tooltip: "0px 4px 16px rgba(0, 0, 0, 0.15)",
  //   dropdown: "0px 6px 24px rgba(0, 0, 0, 0.12)",
  // },

  // TODO: rc8BorderRadius - custom border radius tokens
  // rc8BorderRadius: {
  //   small: "4px",
  //   medium: "8px",
  //   large: "12px",
  //   round: "50%",
  // },
};

const rc8Theme = createTheme(rc8ThemeOptions);

export default rc8Theme;
