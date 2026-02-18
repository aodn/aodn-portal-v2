import { FC } from "react";
import Layout from "../../components/layout/layout";
import Banner from "./sections/banner/Banner";
import Searchbar from "../../components/search/Searchbar";
import { color, padding } from "../../styles/constants";
import Logos from "./sections/logo-list/LogoList";
import News from "./sections/news/News";
import SectionContainer from "../../components/layout/components/SectionContainer";
import TopicsPanel from "./sections/topics-panel/TopicsPanel";

const LandingPage: FC = () => {
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
        <TopicsPanel />
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
