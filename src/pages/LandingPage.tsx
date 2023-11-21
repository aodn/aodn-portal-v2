import * as React from 'react';
import MainMenu from '../components/menu/MainMenu';
import BannerOpenAccess from '../components/banner/BannerOpenAccess';
import ComplexTextSearch from '../components/search/ComplexTextSearch';
import StoryBoardPanel from "../components/storyboard/StoryBoardPanel";
import ShortCutSmartPanel, {CARD_ID} from '../components/smartpanel/ShortCutSmartPanel';
import PromotionSmartPanel from "../components/smartpanel/PromotionSmartPanel";
import {useState} from "react";

const LandingPage = () => {

    const [display, setDisplay] = useState<boolean>(true)

    const onCardClick = (id: number, event: React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLAnchorElement>) => {
        switch(id) {
            case CARD_ID.ADVANCED_SEARCH: break;
            default: break;
        }
    }

    return (
        <>
            <MainMenu/>
            <BannerOpenAccess isDisplay={display}/>
            <ComplexTextSearch onFilterCallback={(e, show) => setDisplay(!show)}/>
            <ShortCutSmartPanel onCardClicked={onCardClick}/>
            <StoryBoardPanel/>
            <PromotionSmartPanel/>
        </>
    );
}

export default LandingPage;