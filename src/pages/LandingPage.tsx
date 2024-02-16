import * as React from 'react';
import MainMenu from '../components/menu/MainMenu';
import BannerOpenAccess from '../components/banner/BannerOpenAccess';
import ComplexTextSearch from '../components/search/ComplexTextSearch';
import StoryBoardPanel from "../components/storyboard/StoryBoardPanel";
import ShortCutSmartPanel, {CARD_ID} from '../components/smartpanel/ShortCutSmartPanel';
import PromotionSmartPanel from "../components/smartpanel/PromotionSmartPanel";
import {useState} from "react";
import {
    createSearchParamForImosRealTime,
    createSearchParamFrom,
    fetchResultWithStore
} from "../components/common/store/searchReducer";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../components/common/store/store";

const LandingPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const [display, setDisplay] = useState<boolean>(true)

    const onCardClick = (id: number, event: React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLAnchorElement>) => {
        switch(id) {
            case CARD_ID.ADVANCED_SEARCH: break;
            case CARD_ID.REAL_TIME:
                dispatch(fetchResultWithStore(createSearchParamForImosRealTime()))
                    .unwrap()
                    .then((v) => navigate('/search'));

                break;
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