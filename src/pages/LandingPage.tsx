import * as React from 'react';
import MainMenu from '../components/menu/MainMenu';
import BannerOpenAccess from '../components/banner/BannerOpenAccess';
import ComplexTextSearch from '../components/search/ComplexTextSearch';
import StoryBoardPanel from "../components/storyboard/StoryBoardPanel";
import ShortCutSmartPanel from '../components/smartpanel/ShortCutSmartPanel';
import PromotionSmartPanel from "../components/smartpanel/PromotionSmartPanel";

const LandingPage = () => {

    return (
        <>
            <MainMenu/>
            <BannerOpenAccess/>
            <ComplexTextSearch/>
            <ShortCutSmartPanel/>
            <StoryBoardPanel/>
            <PromotionSmartPanel/>
        </>
    );
}

export default LandingPage;