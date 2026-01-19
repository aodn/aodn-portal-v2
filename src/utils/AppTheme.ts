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
 * - AppTheme.ts: Spreads portalTheme as base, legacy configs override
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

import { createTheme, Shadows, ThemeOptions } from "@mui/material/styles";
import { portalTheme } from "../styles";
import { FONT_FAMILIES } from "../styles/fontsRC8";

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
  ...portalTheme,

  palette: {
    ...portalTheme.palette, // Include all RC8 colors (primary1, text1, etc.)
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
    ...portalTheme.typography, // Include all RC8 variants (heading1, slogan1, etc.)

    // Only override what needs to be changed, keep everything else intact
    fontFamily: FONT_FAMILIES.openSans, // Global font changed to RC8

    // Existing variants: only change font, keep other properties unchanged
    detailTitle: {
      fontSize: "16px",
      fontStyle: "normal",
      fontWeight: 600,
      color: "#5B5B5B",
      fontFamily: FONT_FAMILIES.poppins, // Use Poppins for titles/headings
    },
    detailContent: {
      lineHeight: "22.5px",
      fontSize: "14px",
      fontStyle: "normal",
      fontWeight: 400,
      color: "#5B5B5B",
      fontFamily: FONT_FAMILIES.openSans, // Body text uses Open Sans
      wordBreak: "break-word",
    },

    body1: {
      padding: "10px 0 0 0",
      lineHeight: "1.5",
      color: "#747474",
      fontFamily: FONT_FAMILIES.openSans, // Body text uses Open Sans
    },
    body2: {
      fontSize: "0.8rem",
      color: "#BBBBBB",
      fontFamily: FONT_FAMILIES.openSans, // Body text uses Open Sans
    },
    subtitle1: {
      padding: "10px 0 0 0",
      lineHeight: "1.5",
      color: "#FFFFFF",
      fontFamily: FONT_FAMILIES.openSans, // Body text uses Open Sans
    },
    h1: {
      fontWeight: 700,
      fontFamily: FONT_FAMILIES.poppins, // Use Poppins for titles/headings
    },
    // h3 is now used for the title on the filter. Any other can use it but please
    // only modify it just for the filter title
    h3: {
      fontSize: "1rem",
      fontWeight: 800,
      padding: "10px 0 0 0",
      fontFamily: FONT_FAMILIES.poppins, // Use Poppins for titles/headings
      color: "#3A6F8F",
    },
    h4: {
      fontSize: "1.5rem",
      fontWeight: 400,
      padding: "10px 0 0 0",
      fontFamily: FONT_FAMILIES.poppins, // Use Poppins for titles/headings
      color: "#747474",
    },
    h5: {
      fontSize: "1.5rem",
      fontWeight: 400,
      padding: "40px 0 0 0",
      fontFamily: FONT_FAMILIES.poppins, // Use Poppins for titles/headings
      color: "#747474",
    },
    h6: {
      fontSize: "16px",
      fontWeight: 400,
      fontFamily: FONT_FAMILIES.poppins, // Use Poppins for titles/headings
    },
  },
  shape: {
    borderRadius: 10,
  },
  /** when using shadows, please use existing shadows if they are the same with
   * your requirement. If not, please replace one placeholder with your shadow values.
   * Please be very careful when trying to modify existing shadows because they
   * are in use. Default array size for shadow is 25, you should change this number
   * if more shadow is needed
   */
  shadows: Array(25)
    .fill("none")
    .map((_, index) => {
      switch (index) {
        case 1:
          return "1.5px 1.5px 3px 0px rgba(0, 0, 0, 0.20)";
        case 2:
          return "1px 1px 10px 1px #d4d4d4"; // filter toggle button
        case 3:
          return "0 0 10px rgba(0, 0, 0, 0.1)"; // banner heading
        case 4:
          return "0 0 30px rgba(0, 0, 0, 1.9)"; // banner subtitle
        case 5:
          return "1px 1px 4px 0 rgba(0, 0, 0, 0.25)"; // detail page select
        case 6:
          return "0 0 10px rgba(0, 0, 0, 0.1)"; // share button header
        case 7:
          return "0 0 6px rgba(0, 0, 0, 0.25)"; // share style toggle button
        default:
          return "none";
      }
    }) as Shadows,

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
