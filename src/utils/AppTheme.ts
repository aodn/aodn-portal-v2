import { createTheme } from "@mui/material/styles";

const AppTheme = createTheme({
  palette: {
    primary: {
      main: "#3B6E8F",
      light: "#52BDEC",
      dark: "#2F4F6C",
    },
    secondary: {
      main: "#54BCEB",
      light: "#B3E2F7",
      dark: "#1C9FE4",
    },
    divider: "#DDDDDD",
    info: {
      main: "#51BCEB",
      light: "#B3C8D4",
      dark: "#3A6F8F",
    },
    common: {
      white: "#FFF",
      black: "#000",
    },
    success: {
      main: "#4CAF50",
      light: "",
      dark: "",
    },
  },

  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
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
      fontWeight: "700",
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
          color: "#747474",
          "&:hover": {
            textDecoration: "underline",
            color: "#54BCEB",
          },
        },
      },
    },
  },
});

export default AppTheme;
