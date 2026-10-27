import { FC } from "react";
import Banner from "./features/banner/Banner";
import Searchbar from "../../components/search/Searchbar";
import { color, padding } from "../../styles/constants";
import Logos from "./features/partners/LogoList";
import Partners from "./features/partners/Partners";
import { isPartnersSectionEnabled } from "./features/partners/constants";
import News from "./features/news/News";
import SectionContainer from "@/components/common/container/SectionContainer";
import { PAGE_CONTENT_WIDTH_LANDING } from "@/app/layout/constant";
import TopicsPanel from "./features/topics-panel/TopicsPanel";
import { portalTheme } from "@/styles";

const LandingPage: FC = () => {
  return (
    <>
      <SectionContainer
        sectionAreaStyle={{
          backgroundColor: "#fff",
        }}
        contentAreaStyle={{
          paddingY: padding.double,
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
          paddingY: padding.double,
          width: PAGE_CONTENT_WIDTH_LANDING,
        }}
      >
        <TopicsPanel />
      </SectionContainer>

      <SectionContainer
        sectionAreaStyle={{ backgroundColor: color.blue.extraDark }}
        contentAreaStyle={{ width: PAGE_CONTENT_WIDTH_LANDING }}
      >
        <News />
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
