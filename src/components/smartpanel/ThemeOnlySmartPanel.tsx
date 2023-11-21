import * as React from 'react';
import ComplexSmartPanel from "./ComplexSmartPanel";
import {SmartCard11} from "./SmartCard";
import {margin} from "../common/constants";

/**
 * Empty for now, implement it later
 * @constructor
 */
const ThemeOnlySmartPanel = () => {
    return (
        <ComplexSmartPanel
            sx={{
                marginTop: 0,
                marginBottom: 0
            }}
            columns={10}
            gridColumns={11}
            rows={1}
        >
            <SmartCard11 imageUrl='/smartcard/all_topics.png' caption='More Topics'/>
            <SmartCard11 imageUrl='/smartcard/environmental.png' caption='Environmental'/>
            <SmartCard11 imageUrl='/smartcard/leave.png' caption='Ocean Biota'/>
            <SmartCard11 imageUrl='/smartcard/tour.png' caption='Tourism'/>
            <SmartCard11 imageUrl='/smartcard/oceancurrent.png' caption='Ocean Current'/>
            <SmartCard11 imageUrl='/smartcard/location.png' caption='Location'/>
            <SmartCard11 imageUrl='/smartcard/climate.png' caption='Climatic'/>
            <SmartCard11 imageUrl='/smartcard/fishery.png' caption='Fishery'/>
            <SmartCard11 imageUrl='/smartcard/chemical.png' caption='Chemical'/>
            <SmartCard11 imageUrl='/smartcard/animal.png' caption='Animal'/>
        </ComplexSmartPanel>
    );
}

export default ThemeOnlySmartPanel;