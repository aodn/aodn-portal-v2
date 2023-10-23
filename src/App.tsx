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

const app = () => <RouterProvider router={router} fallbackElement={<Fallback />} />;

export default app;
