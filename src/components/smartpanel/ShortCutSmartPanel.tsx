import * as React from 'react';
import {SmartCard11, SmartCard21, SmartCard22} from "./SmartCard";
import ComplexSmartPanel from "./ComplexSmartPanel";

/**
 * The panel below the text search box
 * @constructor
 */
const ShortCutSmartPanel = () => {
    return(
        <ComplexSmartPanel>
            <SmartCard21 caption='Get started' imageUrl='/smartcard/getstarted.png'/>
            <SmartCard22 caption='Surface Waves' imageUrl='/smartcard/wave.png'/>
            <SmartCard11 caption='Satellite' imageUrl='/smartcard/satellite.png'/>
            <SmartCard11 caption='Reef' imageUrl='/smartcard/reef.png'/>
            <SmartCard11 caption='Location' imageUrl='/smartcard/location.png'/>
            <SmartCard21 caption='Advanced Search' imageUrl='/smartcard/advancedSearch.png'/>
            <SmartCard11 caption='Tutorials' imageUrl='/smartcard/tutorial.png'/>
            <SmartCard11 caption='All Topics' imageUrl='/smartcard/all_topics.png'/>
            <SmartCard11 caption='Ocean Biota' imageUrl='/smartcard/leave.png'/>
            <SmartCard21 caption='Explore on Map' imageUrl='/smartcard/explorerOnMap.png'/>
            <SmartCard11 caption='Fishery' imageUrl='/smartcard/fishery.png'/>
            <SmartCard11 caption='Tourism' imageUrl='/smartcard/tour.png'/>
        </ComplexSmartPanel>
    );
}

export default ShortCutSmartPanel;