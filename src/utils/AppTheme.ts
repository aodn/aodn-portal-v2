import { createTheme, ThemeOptions } from "@mui/material/styles";

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
  palette: {
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
