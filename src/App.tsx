import React from 'react';
import './App.css';
import { RouterProvider } from 'react-router-dom';

import Fallback from './pages/Fallback';
import { ThemeProvider } from '@mui/material/styles';
import AppTheme from './utils/AppTheme';
import AppRouter from './utils/AppRouter';
import Footer from './components/footer/footer';

const app = () => {
  return (
    <div
      style={
        {
          //backgroundImage: 'url(/landing_page_bg.png)',
          //backgroundPosition: 'center',
          //backgroundRepeat: 'no-repeat',
          //backgroundSize: 'cover',
          //height: '100%',
        }
      }
    >
      <ThemeProvider theme={AppTheme}>
        <RouterProvider router={AppRouter} fallbackElement={<Fallback />} />
        <Footer />
      </ThemeProvider>
    </div>
  );
};

export default app;
