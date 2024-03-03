import MainMenu from '../components/menu/MainMenu';
import BannerOpenAccess from '../components/banner/BannerOpenAccess';
import ComplexTextSearch from '../components/search/ComplexTextSearch';
import StoryBoardPanel from "../components/storyboard/StoryBoardPanel";
import ShortCutSmartPanel, {CARD_ID} from '../components/smartpanel/ShortCutSmartPanel';
import PromotionSmartPanel from "../components/smartpanel/PromotionSmartPanel";
import {useState} from "react";
import {
    createSearchParamForImosRealTime,
    //createSearchParamFrom,
    fetchResultWithStore
} from "../components/common/store/searchReducer";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../components/common/store/store";
import { Box } from '@mui/material';

const LandingPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const [display, setDisplay] = useState<boolean>(true)

    const onCardClick = (id: number) => {
        switch(id) {
            case CARD_ID.ADVANCED_SEARCH: break;
            case CARD_ID.REAL_TIME:
                dispatch(fetchResultWithStore(createSearchParamForImosRealTime()))
                    .unwrap()
                    .then(() => navigate('/search'));

                break;
            default: break;
        }
    }

    return (
        <>
            <Box sx={{backgroundImage: 'url(/bg_landing_page.png)',  backgroundSize: 'cover' }}>
                <MainMenu/>
                <BannerOpenAccess isDisplay={display}/>
                <ComplexTextSearch onFilterCallback={(_, show) => setDisplay(!show)}/>
                <ShortCutSmartPanel onCardClicked={onCardClick}/>
            </Box>
            <StoryBoardPanel/>
            <PromotionSmartPanel/>
        </>
    );
}

export default LandingPage;