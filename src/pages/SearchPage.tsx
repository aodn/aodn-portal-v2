import * as React from 'react';
import SimpleTextSearch from "../components/search/SimpleTextSearch";
import ThemeOnlySmartPanel from "../components/smartpanel/ThemeOnlySmartPanel";
import ResultPanelSimpleFilter from "../components/common/filters/ResultPanelSimpleFilter";
import SearchResultPanel from "../components/result/SearchResultPanel";
import {useState} from "react";

const SearchPage = () => {
    const [showMap, setShowMap] = useState<boolean>(false);
    return(
        <>
            <SimpleTextSearch/>
            <ThemeOnlySmartPanel/>
            <ResultPanelSimpleFilter filterClicked={(e => setShowMap(!showMap))}/>
            <SearchResultPanel showMap={showMap}/>
        </>
    );
};

export default SearchPage;