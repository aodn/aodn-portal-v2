import { createTheme } from "@mui/material/styles";

const AppTheme = createTheme({
  palette: {
    primary: {
      main: "#3B6E8F",
      light: "#4490B6",
      dark: "#2F4F6C",
    },
    secondary: {
      main: "#54BCEB",
      light: "#B3E2F7",
      dark: "#1C9FE4",
    },
    divider: "#DDDDDD",
  },
  typography: {
    fontFamily: [
      "Lexend",
      "Helvetica Neue",
      "Noto Sans",
      "Ariel",
      "sans-serif",
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
