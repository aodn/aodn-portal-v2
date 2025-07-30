/**
 * AppTheme.ts - Legacy Theme with RC8 Integration
 *
 * MIGRATION PLAN:
 *
 * CURRENT FILES:
 * ├── src/
 * │   ├── styles/
 * │   │   ├── designTokensRC8.ts     (✅ New - RC8 design tokens from Figma)
 * │   │   └── theme.ts               (✅ New - Clean RC8 theme implementation)
 * │   └── utils/
 * │       └── AppTheme.ts            (📝 Current file - Legacy + RC8 integration)
 *
 * MIGRATION PHASES:
 *
 * Phase 1: Legacy + RC8 Integration
 * - AppTheme.ts: Spreads rc8Theme as base, legacy configs override
 * - All existing components continue to work unchanged
 * - RC8 features available for new development
 * - Usage: import AppTheme from "./utils/AppTheme"
 *
 * Phase 2 (CURRENT): Component Migration
 * - Gradually replace legacy styles with RC8 equivalents:
 *   ❌ <Typography variant="detailTitle">
 *   ✅ <Typography variant="heading4">
 *   ❌ sx={{ color: theme.palette.detail.text }}
 *   ✅ sx={{ color: theme.palette.text1 }}
 *   ❌ sx={{ padding: theme.mp.md }}
 *   ✅ sx={{ padding: theme.rc8Spacing.md }}
 *
 * Phase 3: Complete Migration
 * - Delete utils/AppTheme.ts file
 * - Update App.tsx: import theme from "./styles/theme"
 * - Remove legacy type declarations from styles/theme.ts
 * - Clean RC8-only theme system
 *
 * LEGACY FEATURES (to be removed after migration):
 * - theme.border.* (detailBtnLight, detailSubtabBtn, detailNa)
 * - theme.mp.* (nil, xs, sm, md, lg, xlg, xxlg)
 * - theme.borderRadius.* (sm, md, lg, xlg, xxlg)
 * - theme.palette.detail.*
 * - Typography variants: detailTitle, detailContent
 *
 * RC8 FEATURES (new):
 * - theme.designTokens.* (complete RC8 design system)
 * - Typography variants: slogan1, slogan2, heading1-4, title1Medium, etc.
 * - Palette: primary1-6, secondary1, text1-3, grey100-700, etc.
 * - Future: rc8Spacing, rc8Breakpoints, rc8Elevation, rc8BorderRadius
 */

import { createTheme, ThemeOptions } from "@mui/material/styles";
import rc8Theme from "../styles/themeRC8";

declare module "@mui/material/styles" {
  interface Theme {
    border: {
      nil: string;
      detailBtnLight: string;
      detailSubtabBtn: string;
      detailNa: string;
    };
    mp: {
      nil: string;
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xlg: string;
      xxlg: string;
    };
    borderRadius: {
      sm: string;
      md: string;
      lg: string;
      xlg: string;
      xxlg: string;
    };
  }

  interface ThemeOptions {
    border?: {
      nil?: string;
      detailBtnLight?: string;
      detailSubtabBtn?: string;
      detailNa?: string;
    };
    mp?: {
      nil?: string;
      xs?: string;
      sm?: string;
      md?: string;
      lg?: string;
      xlg?: string;
      xxlg?: string;
    };
    borderRadius?: {
      sm?: string;
      md?: string;
      lg?: string;
      xlg?: string;
      xxlg?: string;
    };
  }

  interface Palette {
    detail: {
      text: string;
      listItemBG: string;
      listItemBGHover: string;
      na: {
        dark: string;
        light: string;
      };
    };
  }

  interface PaletteOptions {
    detail?: {
      text?: string;
      listItemBG?: string;
      listItemBGHover?: string;
      na?: {
        dark?: string;
        light?: string;
      };
    };
  }

  interface TypographyVariants {
    detailTitle: TypographyVariants["body1"];
    detailContent: TypographyVariants["body1"];
  }

  interface TypographyVariantsOptions {
    detailTitle?: TypographyVariantsOptions["body1"];
    detailContent?: TypographyVariantsOptions["body1"];
  }
}

declare module "@mui/material/Typography/Typography" {
  interface TypographyPropsVariantOverrides {
    detailTitle: true;
    detailContent: true;
  }
}

const theme: ThemeOptions = {
  // RC8 theme as foundation (provides designTokens, RC8 typography, RC8 palette)
  ...rc8Theme,

  palette: {
    ...rc8Theme.palette, // Include all RC8 colors (primary1, text1, etc.)
    detail: {
      text: "#5B5B5B",
      listItemBG: "#F2F6F9",
      listItemBGHover: "#E8F0F4",
      na: {
        dark: "#52BDEC",
        light: "#DCF2FB",
      },
    },
    primary: {
      main: "#3B6E8F",
      light: "#52BDEC",
      dark: "#2F4F6C",
    },
    info: {
      main: "#000000", // not in use yet, so set to black
      light: "#000000", // not in use yet, so set to black
      dark: "#3A6F8F",
    },
    common: {
      white: "#FFF",
      black: "#000",
    },
    warning: {
      main: "#E76F51",
      light: "#000000", // not in use yet, so set to black
      dark: "#000000", // not in use yet, so set to black
      contrastText: "#000000", // not in use yet, so set to black
    },
    success: {
      main: "#4CAF50",
      // light: "",
      // dark: "",
    },
  },

  border: {
    nil: "none",
    detailBtnLight: "0.9px solid var(--Brand---secondary, #54BCEB)",
    detailSubtabBtn: " 1px solid var(--brand_dark-blue_80, #618CA5)",
    detailNa: "2px solid #52BDEC",
  },

  mp: {
    nil: "0",
    xs: "2px",
    sm: "5px",
    md: "10px",
    lg: "15px",
    xlg: "25px",
    xxlg: "30px",
  },

  borderRadius: {
    sm: "5px",
    md: "8px",
    lg: "10px",
    xlg: "15px",
    xxlg: "20px",
  },

  breakpoints: {
    values: {
      xs: 320,
      sm: 768,
      md: 1280,
      lg: 1440,
      xl: 1920,
    },
  },

  typography: {
    // TODO: RC8 design update not complete yet, temporarily not using new fonts
    ...rc8Theme.typography, // Include all RC8 variants (heading1, slogan1, etc.)
    fontFamily: [
      "Lexend",
      "Helvetica Neue",
      "Noto Sans",
      "Ariel",
      "sans-serif",
      "Roboto",
    ].join(","),

    detailTitle: {
      fontSize: "16px",
      fontStyle: "normal",
      fontWeight: 600,
      color: "#5B5B5B",
      fontFamily: "Noto Sans",
    },
    detailContent: {
      lineHeight: "22.5px",
      fontSize: "14px",
      fontStyle: "normal",
      fontWeight: 400,
      color: "#5B5B5B",
      fontFamily: "Noto Sans",
      wordBreak: "break-word",
    },

    body1: {
      padding: "10px 0 0 0",
      lineHeight: "1.5",
      color: "#747474",
      fontFamily: "Noto Sans",
    },
    body2: {
      fontSize: "0.8rem",
      color: "#BBBBBB",
    },
    subtitle1: {
      padding: "10px 0 0 0",
      lineHeight: "1.5",
      color: "#FFFFFF",
      fontFamily: "Lexend",
    },
    h1: {
      fontWeight: 700,
    },
    // h3 is now used for the title on the filter. Any other can use it but please
    // only modify it just for the filter title
    h3: {
      fontSize: "1rem",
      fontWeight: 800,
      padding: "10px 0 0 0",
      fontFamily: "Noto Sans",
      color: "#3A6F8F",
    },
    h4: {
      fontSize: "1.5rem",
      fontWeight: 400,
      padding: "10px 0 0 0",
      fontFamily: "Noto Sans",
      color: "#747474",
    },
    h5: {
      fontSize: "1.5rem",
      fontWeight: 400,
      padding: "40px 0 0 0",
      fontFamily: "Noto Sans",
      color: "#747474",
    },
    h6: {
      fontSize: "16px",
      fontWeight: 400,
    },
  },
  shape: {
    borderRadius: 10,
  },
  /** when using shadows, please use existing shadows if they are the same with
   * your requirement. If not, please replace one placeholder with your shadow values.
   * Please be very careful when trying to modify existing shadows because they
   * are in use.
   */
  shadows: [
    "none",
    "1.5px 1.5px 3px 0px rgba(0, 0, 0, 0.20)",
    "1px 1px 10px 1px #d4d4d4", // filter toggle button
    "0 0 10px rgba(0, 0, 0, 0.1)", // banner heading
    "0 0 30px rgba(0, 0, 0, 1.9)", // banner subtitle
    "inset 1px 1px rgba(0, 0, 0, 0.1)", // detail page select
    "0 0 10px rgba(0, 0, 0, 0.1)", // share button header
    "placeholder",
    "placeholder",
    "placeholder",
    "placeholder",
    "placeholder",
    "placeholder",
    "placeholder",
    "placeholder",
    "placeholder",
    "placeholder",
    "placeholder",
    "placeholder",
    "placeholder",
    "placeholder",
    "placeholder",
    "placeholder",
    "placeholder",
    "placeholder",
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          border: "none",
          "&:hover": {
            border: "none",
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          textDecoration: "none",
          fontSize: "14px",
          fontStyle: "normal",
          fontWeight: 400,
          lineHeight: "22px",
          color: "#468CB6",
          "&:hover": {
            textDecoration: "underline",
            color: "#54BCEB",
          },
        },
      },
    },
  },
};

const AppTheme = createTheme(theme);

export default AppTheme;
// TODO: move this to different place that is more related
