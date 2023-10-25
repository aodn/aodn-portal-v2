import * as React from 'react';
import MainMenu from '../components/menu/MainMenu';
import BannerOpenAccess from '../components/banner/BannerOpenAccess';
import TextSearch from '../components/search/TextSearch';
import ComplexSmartPanel from "../components/smartpanel/ComplexSmartPanel";
import StoryBoardPanel from "../components/storyboard/StoryBoardPanel";

const LandingPage = () => {

    return (
        <>
            <MainMenu/>
            <BannerOpenAccess/>
            <TextSearch/>
            <ComplexSmartPanel/>
            <StoryBoardPanel/>
        </>
    );
}

export default LandingPage;