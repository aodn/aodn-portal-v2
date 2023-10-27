import * as React from 'react';
import ComplexSmartPanel from "./ComplexSmartPanel";
import {SmartCard_1_1} from "./SmartCard";
import {margin} from "../common/constants";

/**
 * Empty for now, implement it later
 * @constructor
 */
const ThemeOnlySmartPanel = () => {
    return (
        <ComplexSmartPanel
            sx={{
                marginTop: margin['top'],
                marginBottom: margin['bottom']
            }}
            columns={10}
            rows={1}
            bottomDivider={true}
        >
            <SmartCard_1_1 imageUrl='/smartcard/all_topics.png' caption='More Topics'/>
            <SmartCard_1_1 imageUrl='/smartcard/environmental.png' caption='Environmental'/>
            <SmartCard_1_1 imageUrl='/smartcard/leave.png' caption='Ocean Biota'/>
            <SmartCard_1_1 imageUrl='/smartcard/tour.png' caption='Tourism'/>
            <SmartCard_1_1 imageUrl='/smartcard/oceancurrent.png' caption='Ocean Current'/>
            <SmartCard_1_1 imageUrl='/smartcard/location.png' caption='Location'/>
            <SmartCard_1_1 imageUrl='/smartcard/climate.png' caption='Climatic'/>
            <SmartCard_1_1 imageUrl='/smartcard/fishery.png' caption='Fishery'/>
            <SmartCard_1_1 imageUrl='/smartcard/chemical.png' caption='Chemical'/>
            <SmartCard_1_1 imageUrl='/smartcard/animal.png' caption='Animal'/>
        </ComplexSmartPanel>
    );
}

export default ThemeOnlySmartPanel;