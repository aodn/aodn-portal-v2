import * as React from 'react';
import SimpleTextSearch from "../components/search/SimpleTextSearch";
import ThemeOnlySmartPanel from "../components/smartpanel/ThemeOnlySmartPanel";
import ResultPanelSimpleFilter from "../components/common/filters/ResultPanelSimpleFilter";

const SearchPage = () => {
    return(
        <>
            <SimpleTextSearch/>
            <ThemeOnlySmartPanel/>
            <ResultPanelSimpleFilter/>
        </>
    );
};

export default SearchPage;