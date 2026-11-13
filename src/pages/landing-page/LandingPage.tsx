import { FC } from "react";
import Banner from "./features/banner/Banner";
import Searchbar from "../../components/search/Searchbar";
import { color, padding } from "../../styles/constants";
import Logos from "./features/partners/LogoList";
import Partners from "./features/partners/Partners";
import { isPartnersSectionEnabled } from "./features/partners/constants";
import News from "@/pages/landing-page/features/news/News";
import LegacyNews from "@/pages/landing-page/features/news/LegacyNews";
import { isFeaturedDatasetsSectionEnabled } from "@/pages/landing-page/features/news/constants";
import SectionContainer from "@/components/common/container/SectionContainer";
import { PAGE_CONTENT_WIDTH_LANDING } from "@/app/layout/constant";
import TopicsPanel from "./features/topics-panel/TopicsPanel";
import {
  TOPICS_SECTION_PADDING_BOTTOM,
  TOPICS_SECTION_PADDING_TOP,
} from "./features/topics-panel/constants";
import { portalTheme } from "@/styles";

const LandingPage: FC = () => {
  return (
    <>
      <SectionContainer
        sectionAreaStyle={{
          backgroundColor: "#fff",
        }}
        contentAreaStyle={{
          pt: { xs: padding.double, md: "40px" },
          pb: { xs: padding.double, md: "52px" },
          width: PAGE_CONTENT_WIDTH_LANDING,
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
          pt: TOPICS_SECTION_PADDING_TOP,
          pb: TOPICS_SECTION_PADDING_BOTTOM,
          width: PAGE_CONTENT_WIDTH_LANDING,
        }}
      >
        <TopicsPanel />
      </SectionContainer>

      <SectionContainer
        sectionAreaStyle={{ backgroundColor: color.blue.extraDark }}
        contentAreaStyle={{ width: PAGE_CONTENT_WIDTH_LANDING }}
      >
        {isFeaturedDatasetsSectionEnabled ? <News /> : <LegacyNews />}
      </SectionContainer>

      {isPartnersSectionEnabled ? (
        <SectionContainer
          sectionAreaStyle={{ backgroundColor: portalTheme.palette.primary6 }}
          contentAreaStyle={{ width: PAGE_CONTENT_WIDTH_LANDING }}
        >
          <Partners />
        </SectionContainer>
      ) : (
        <SectionContainer
          sectionAreaStyle={{ backgroundColor: color.blue.light }}
          contentAreaStyle={{ width: PAGE_CONTENT_WIDTH_LANDING }}
        >
          <Logos />
        </SectionContainer>
      )}
    </>
  );
};

export default LandingPage;
