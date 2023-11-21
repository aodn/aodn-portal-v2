import * as React from 'react';
import {SmartCard11, SmartCard21, SmartCard22} from "./SmartCard";
import ComplexSmartPanel from "./ComplexSmartPanel";

export const CARD_ID = {
    GET_START: 1,
    SURFACE_WAVES: 2,
    SATELLITE: 3,
    REEF: 4,
    LOCATION: 5,
    ADVANCED_SEARCH: 6,
    TUTORIAL: 7,
    ALL_TOPICS: 8,
    OCEAN_BIOTA: 9,
    EXPLORER_ON_MAP: 10,
    FISHERY: 11,
    TOURISM: 12
}

interface ShortCutSmartPanelProps {
    onCardClicked?: (id: number, event: React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLAnchorElement>) => void;
}
/**
 * The panel below the text search box
 * @constructor
 */
const ShortCutSmartPanel = (props: ShortCutSmartPanelProps) => {
    return(
        <ComplexSmartPanel>
            <SmartCard21 caption='Get started' imageUrl='/smartcard/getstarted.png' onCardClicked={(e) => props.onCardClicked && props.onCardClicked(CARD_ID.GET_START, e)}/>
            <SmartCard22 caption='Surface Waves' imageUrl='/smartcard/wave.png' onCardClicked={(e) => props.onCardClicked && props.onCardClicked(CARD_ID.SURFACE_WAVES, e)}/>
            <SmartCard11 caption='Satellite' imageUrl='/smartcard/satellite.png' onCardClicked={(e) => props.onCardClicked && props.onCardClicked(CARD_ID.SATELLITE, e)}/>
            <SmartCard11 caption='Reef' imageUrl='/smartcard/reef.png' onCardClicked={(e) => props.onCardClicked && props.onCardClicked(CARD_ID.REEF, e)}/>
            <SmartCard11 caption='Location' imageUrl='/smartcard/location.png' onCardClicked={(e) => props.onCardClicked && props.onCardClicked(CARD_ID.LOCATION, e)}/>
            <SmartCard21 caption='Advanced Search' imageUrl='/smartcard/advancedSearch.png' onCardClicked={(e) => props.onCardClicked && props.onCardClicked(CARD_ID.ADVANCED_SEARCH, e)}/>
            <SmartCard11 caption='Tutorials' imageUrl='/smartcard/tutorial.png' onCardClicked={(e) => props.onCardClicked && props.onCardClicked(CARD_ID.TUTORIAL, e)}/>
            <SmartCard11 caption='All Topics' imageUrl='/smartcard/all_topics.png' onCardClicked={(e) => props.onCardClicked && props.onCardClicked(CARD_ID.ALL_TOPICS, e)}/>
            <SmartCard11 caption='Ocean Biota' imageUrl='/smartcard/leave.png' onCardClicked={(e) => props.onCardClicked && props.onCardClicked(CARD_ID.OCEAN_BIOTA, e)}/>
            <SmartCard21 caption='Explore on Map' imageUrl='/smartcard/explorerOnMap.png' onCardClicked={(e) => props.onCardClicked && props.onCardClicked(CARD_ID.EXPLORER_ON_MAP, e)}/>
            <SmartCard11 caption='Fishery' imageUrl='/smartcard/fishery.png' onCardClicked={(e) => props.onCardClicked && props.onCardClicked(CARD_ID.FISHERY, e)}/>
            <SmartCard11 caption='Tourism' imageUrl='/smartcard/tour.png' onCardClicked={(e) => props.onCardClicked && props.onCardClicked(CARD_ID.TOURISM, e)}/>
        </ComplexSmartPanel>
    );
}

export default ShortCutSmartPanel;