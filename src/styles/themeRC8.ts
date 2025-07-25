import { createTheme, ThemeOptions } from "@mui/material/styles";
import { designTokensRC8 as designTokens } from "./designTokensRC8";

// Type definitions are in rc8ThemeTypes.ts to extend Material-UI theme interfaces

const rc8ThemeOptions: ThemeOptions = {
  designTokens: designTokens,

  typography: {
    fontFamily: [
      designTokens.typography.fontFamily.poppins,
      designTokens.typography.fontFamily.openSans,
    ].join(","),

    slogan1: designTokens.typography.variants.slogan1,
    slogan2: designTokens.typography.variants.slogan2,
    heading1: designTokens.typography.variants.heading1,
    heading2: designTokens.typography.variants.heading2,
    heading3: designTokens.typography.variants.heading3,
    heading4: designTokens.typography.variants.heading4,
    title1Medium: designTokens.typography.variants.title1Medium,
    title2Regular: designTokens.typography.variants.title2Regular,
    body1Medium: designTokens.typography.variants.body1Medium,
    body2Regular: designTokens.typography.variants.body2Regular,
    body3Small: designTokens.typography.variants.body3Small,
  },

  palette: {
    // MUI system colors using RC8 tokens
    primary: {
      main: designTokens.colours.product.primary1,
    },
    secondary: {
      main: designTokens.colours.product.secondary1,
    },
    success: {
      main: designTokens.colours.system.complete,
    },
    warning: {
      main: designTokens.colours.system.warning,
    },
    error: {
      main: designTokens.colours.system.error,
    },
    info: {
      main: designTokens.colours.system.info,
    },

    // RC8 custom colors
    text1: designTokens.colours.text.text1,
    text2: designTokens.colours.text.text2,
    text3: designTokens.colours.text.text3,
    rc8Background: designTokens.colours.background.background,
    grey100: designTokens.colours.grey.grey100,
    grey300: designTokens.colours.grey.grey300,
    grey500: designTokens.colours.grey.grey500,
    grey600: designTokens.colours.grey.grey600,
    grey700: designTokens.colours.grey.grey700,
    primary1: designTokens.colours.product.primary1,
    primary2: designTokens.colours.product.primary2,
    primary3: designTokens.colours.product.primary3,
    primary4: designTokens.colours.product.primary4,
    primary5: designTokens.colours.product.primary5,
    primary6: designTokens.colours.product.primary6,
    secondary1: designTokens.colours.product.secondary1,
    neutral1: designTokens.colours.product.neutral1,
    neutral2: designTokens.colours.product.neutral2,
    neutral3: designTokens.colours.product.neutral3,
    neutral4: designTokens.colours.product.neutral4,
    tag1: designTokens.colours.product.tag1,
    tag2: designTokens.colours.product.tag2,
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
