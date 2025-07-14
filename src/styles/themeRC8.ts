import { createTheme, ThemeOptions } from "@mui/material/styles";
import { designTokensRC8 } from "./designTokensRC8";

declare module "@mui/material/styles" {
  interface Theme {
    designTokens: typeof designTokensRC8;
    // TODO: Add custom theme properties
    // rc8Spacing: {
    //   xs: string;
    //   sm: string;
    //   md: string;
    //   lg: string;
    //   xl: string;
    // };
    // rc8Breakpoints: {
    //   mobile: number;
    //   tablet: number;
    //   desktop: number;
    //   wide: number;
    // };
    // rc8Elevation: {
    //   card: string;
    //   modal: string;
    //   tooltip: string;
    //   dropdown: string;
    // };
    // rc8BorderRadius: {
    //   small: string;
    //   medium: string;
    //   large: string;
    //   round: string;
    // };
  }

  interface ThemeOptions {
    designTokens?: typeof designTokensRC8;
    // TODO: Add custom theme options
    // rc8Spacing?: {
    //   xs?: string;
    //   sm?: string;
    //   md?: string;
    //   lg?: string;
    //   xl?: string;
    // };
    // rc8Breakpoints?: {
    //   mobile?: number;
    //   tablet?: number;
    //   desktop?: number;
    //   wide?: number;
    // };
    // rc8Elevation?: {
    //   card?: string;
    //   modal?: string;
    //   tooltip?: string;
    //   dropdown?: string;
    // };
    // rc8BorderRadius?: {
    //   small?: string;
    //   medium?: string;
    //   large?: string;
    //   round?: string;
    // };
  }

  interface TypographyVariants {
    slogan1: React.CSSProperties;
    slogan2: React.CSSProperties;
    heading1: React.CSSProperties;
    heading2: React.CSSProperties;
    heading3: React.CSSProperties;
    heading4: React.CSSProperties;
    title1Medium: React.CSSProperties;
    title2Regular: React.CSSProperties;
    body1Medium: React.CSSProperties;
    body2Regular: React.CSSProperties;
    body3Small: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    slogan1?: React.CSSProperties;
    slogan2?: React.CSSProperties;
    heading1?: React.CSSProperties;
    heading2?: React.CSSProperties;
    heading3?: React.CSSProperties;
    heading4?: React.CSSProperties;
    title1Medium?: React.CSSProperties;
    title2Regular?: React.CSSProperties;
    body1Medium?: React.CSSProperties;
    body2Regular?: React.CSSProperties;
    body3Small?: React.CSSProperties;
  }

  interface Palette {
    // RC8 custom colors
    text1: string;
    text2: string;
    text3: string;
    rc8Background: string;
    grey100: string;
    grey300: string;
    grey500: string;
    grey600: string;
    grey700: string;
    primary1: string;
    primary2: string;
    primary3: string;
    primary4: string;
    primary5: string;
    primary6: string;
    secondary1: string;
    neutral1: string;
    neutral2: string;
    neutral3: string;
    neutral4: string;
    tag1: string;
    tag2: string;
  }

  interface PaletteOptions {
    text1?: string;
    text2?: string;
    text3?: string;
    rc8Background?: string;
    grey100?: string;
    grey300?: string;
    grey500?: string;
    grey600?: string;
    grey700?: string;
    primary1?: string;
    primary2?: string;
    primary3?: string;
    primary4?: string;
    primary5?: string;
    primary6?: string;
    secondary1?: string;
    neutral1?: string;
    neutral2?: string;
    neutral3?: string;
    neutral4?: string;
    tag1?: string;
    tag2?: string;
  }
}

declare module "@mui/material/Typography/Typography" {
  interface TypographyPropsVariantOverrides {
    slogan1: true;
    slogan2: true;
    heading1: true;
    heading2: true;
    heading3: true;
    heading4: true;
    title1Medium: true;
    title2Regular: true;
    body1Medium: true;
    body2Regular: true;
    body3Small: true;
  }
}

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
