import { createTheme, Theme } from '@mui/material/styles';

const AppTheme = createTheme({
  palette: {
    primary: {
      main: '#3B6E8F',
      light: '#4490B6',
      dark: '#2F4F6C',
    },
    secondary: {
      main: '#54BCEB',
      light: '#B3E2F7',
      dark: '#1C9FE4',
    },
  },
  typography: {
    fontFamily: ['Helvetica Neue', 'Roboto', 'Ariel', 'sans-serif'].join(','),

    body1: {
      padding: '10px 0 0 0',
      lineHeight: '1.5',
    },
    body2: {
      fontSize: '0.8rem',
    },
    h5: {
      fontSize: '1.5rem',
      fontWeight: 400,
      padding: '40px 0 0 0',
    },
    h6: {},
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          textDecoration: 'none',
          '&:hover': {
            textDecoration: 'underline',
            color: '#54BCEB',
          },
        },
      },
    },
  },
});

export default AppTheme;
