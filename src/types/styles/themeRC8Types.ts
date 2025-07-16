import { designTokensRC8 } from "../../styles/designTokensRC8";

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
