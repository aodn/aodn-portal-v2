import { FC, useCallback } from "react";
import Layout from "../../components/layout/layout";
import Banner from "./subpages/banner/Banner";
import Searchbar from "../../components/search/Searchbar";
import { color, padding } from "../../styles/constants";
import Logos from "./subpages/logo-list/LogoList";
import News from "./subpages/news/News";
import SectionContainer from "../../components/layout/components/SectionContainer";
import {
  updateDateTimeFilterRange,
  updateImosOnly,
  updateParameterVocabs,
  updateSearchText,
  updateUpdateFreq,
} from "../../components/common/store/componentParamReducer";
import { useAppDispatch } from "../../components/common/store/hooks";
import useRedirectSearch from "../../hooks/useRedirectSearch";
import SmartPanel from "./subpages/smartpanel/SmartPanel";

const LandingPage: FC = () => {
  const dispatch = useAppDispatch();
  const redirectSearch = useRedirectSearch();

  // This is a simple click smart card function that with update search input text and clear all the filters
  // Can be change to a function-switcher if any other functions are designed in the future
  const handleClickSmartCard = useCallback(
    (value: string) => {
      dispatch(updateParameterVocabs([]));
      dispatch(updateDateTimeFilterRange({}));
      dispatch(updateImosOnly(false));
      dispatch(updateUpdateFreq(undefined));
      dispatch(updateSearchText(value));
      redirectSearch("SmartPanel");
    },
    [dispatch, redirectSearch]
  );

  return (
    <Layout>
      <SectionContainer
        sectionAreaStyle={{
          backgroundColor: "#fff",
        }}
        contentAreaStyle={{
          paddingY: padding.double,
        }}
      >
        <Banner />
        <Searchbar />
      </SectionContainer>

      <SectionContainer
        sectionAreaStyle={{
          backgroundColor: color.blue.xLight,
        }}
        contentAreaStyle={{
          paddingY: padding.double,
        }}
      >
        <SmartPanel handleClickSmartCard={handleClickSmartCard} />
      </SectionContainer>

      {/*commented out the StoryBoardPanel for demo purposes*/}
      {/* <SectionContainer sectionAreaStyle={{ backgroundColor: "#fff" }}>
        <StoryBoardPanel />
      </SectionContainer> */}

      <SectionContainer
        sectionAreaStyle={{ backgroundColor: color.blue.extraDark }}
      >
        <News />
      </SectionContainer>

      <SectionContainer
        sectionAreaStyle={{ backgroundColor: color.blue.light }}
      >
        <Logos />
      </SectionContainer>
    </Layout>
  );
};

export default LandingPage;
