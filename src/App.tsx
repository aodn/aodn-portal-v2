import React from 'react';
import './App.css';
import {
  RouterProvider,
  createBrowserRouter
} from 'react-router-dom';

import LandingPage from './pages/LandingPage';
import Fallback from './pages/Fallback';

let router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
    children: [
    ],
  },
]);

const app = () =>
  <div style={{
      backgroundImage: 'url(/landing_page_bg.png)',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      height: '100%'
  }}>
      <RouterProvider router={router} fallbackElement={<Fallback />} />
  </div>

export default app;
