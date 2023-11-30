import * as React from 'react';
import SimpleTextSearch from "../components/search/SimpleTextSearch";
import ThemeOnlySmartPanel from "../components/smartpanel/ThemeOnlySmartPanel";
import ResultPanelSimpleFilter from "../components/common/filters/ResultPanelSimpleFilter";
import SearchResultPanel from "../components/result/SearchResultPanel";

const SearchPage = () => {

    return(
        <>
            <SimpleTextSearch/>
            <ThemeOnlySmartPanel/>
            <ResultPanelSimpleFilter/>
            <SearchResultPanel/>
        </>
    );
};

export default SearchPage;