import * as React from 'react';
import MainMenu from '../components/menu/MainMenu';
import BannerOpenAccess from '../components/banner/BannerOpenAccess';
import ComplexTextSearch from '../components/search/ComplexTextSearch';
import StoryBoardPanel from "../components/storyboard/StoryBoardPanel";
import ShortCutSmartPanel from '../components/smartpanel/ShortCutSmartPanel';
import PromotionSmartPanel from "../components/smartpanel/PromotionSmartPanel";
import {useState} from "react";

const LandingPage = () => {

    const [display, setDisplay] = useState<boolean>(true)

    return (
        <>
            <MainMenu/>
            <BannerOpenAccess isDisplay={display}/>
            <ComplexTextSearch onFilterCallback={(e, show) => setDisplay(!show)}/>
            <ShortCutSmartPanel/>
            <StoryBoardPanel/>
            <PromotionSmartPanel/>
        </>
    );
}

export default LandingPage;