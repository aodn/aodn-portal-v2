import * as React from 'react';
import MainMenu from '../components/menu/MainMenu';
import BannerOpenAccess from '../components/banner/BannerOpenAccess';
import TextSearch from '../components/search/TextSearch';

const LandingPage = () => {

    return (
        <>
            <MainMenu/>
            <BannerOpenAccess/>
            <TextSearch/>
        </>
    );
}

export default LandingPage;