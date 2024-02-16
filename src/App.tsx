import React from 'react';
import './App.css';
import {
    RouterProvider,
    createBrowserRouter
} from 'react-router-dom';

import LandingPage from './pages/LandingPage';
import SearchPage from './pages/SearchPage';
import Fallback from './pages/Fallback';
import DetailsPage from "./pages/DetailsPage";
import {pageDefault} from "./components/common/constants";

let router = createBrowserRouter([
    {
        path: pageDefault.landing,
        Component: LandingPage,
        children: [],
    },
    {
        path: pageDefault.search,
        Component: SearchPage,
        children: [],
    },
    {
        path: pageDefault.details,
        Component: DetailsPage,
        children: [],
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
        <RouterProvider router={router} fallbackElement={<Fallback/>}/>
    </div>

export default app;