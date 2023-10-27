import * as React from 'react';
import {SmartCard_1_1, SmartCard_2_1, SmartCard_2_2} from "./SmartCard";
import ComplexSmartPanel from "./ComplexSmartPanel";

/**
 * The panel below the text search box
 * @constructor
 */
const ShortCutSmartPanel = () => {
    return(
        <ComplexSmartPanel>
            <SmartCard_2_1 caption='Get started' imageUrl='/smartcard/getstarted.png'/>
            <SmartCard_2_2 caption='Surface Waves' imageUrl='/smartcard/wave.png'/>
            <SmartCard_1_1 caption='Satellite' imageUrl='/smartcard/satellite.png'/>
            <SmartCard_1_1 caption='Reef' imageUrl='/smartcard/reef.png'/>
            <SmartCard_1_1 caption='Location' imageUrl='/smartcard/location.png'/>
            <SmartCard_2_1 caption='Advanced Search' imageUrl='/smartcard/advancedSearch.png'/>
            <SmartCard_1_1 caption='Tutorials' imageUrl='/smartcard/tutorial.png'/>
            <SmartCard_1_1 caption='All Topics' imageUrl='/smartcard/all_topics.png'/>
            <SmartCard_1_1 caption='Ocean Biota' imageUrl='/smartcard/leave.png'/>
            <SmartCard_2_1 caption='Explore on Map' imageUrl='/smartcard/explorerOnMap.png'/>
            <SmartCard_1_1 caption='Fishery' imageUrl='/smartcard/fishery.png'/>
            <SmartCard_1_1 caption='Tourism' imageUrl='/smartcard/tour.png'/>
        </ComplexSmartPanel>
    );
}

export default ShortCutSmartPanel;