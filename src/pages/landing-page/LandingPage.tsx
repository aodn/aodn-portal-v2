import { FC } from "react";
import Banner from "./features/banner/Banner";
import Searchbar from "../../components/search/Searchbar";
import { color, padding } from "../../styles/constants";
import Logos from "./features/logo-list/LogoList";
import News from "./features/news/News";
import SectionContainer from "@/components/common/container/SectionContainer";
import { PAGE_CONTENT_WIDTH_LANDING } from "@/app/layout/constant";
import TopicsPanel from "./features/topics-panel/TopicsPanel";
import AnnouncementDialog from "@/components/info/AnnouncementDialog";
import { InfoContentType } from "@/components/info/InfoDefinition";

// TEMPORARY (backlog#9348): notice for the DAS batch queue replacement.
// Fill in the maintenance window before deploying and remove this constant
// and its render below once the maintenance is complete.
const MAINTENANCE_ANNOUNCEMENT: InfoContentType = {
  title: "Scheduled maintenance",
  body:
    "From [START DATE, TIME] to [END DATE, TIME] AEST, downloads for " +
    'datasets tagged "IMOS" or "Integrated" in the Download Service panel ' +
    "may be temporarily unavailable while we carry out scheduled " +
    "maintenance.<br/>You can still search and browse datasets, and use " +
    'the other options in each dataset\'s "Data Access" tab. Please try ' +
    "your download again once the maintenance is complete.",
};

const LandingPage: FC = () => {
  return (
    <>
      {import.meta.env.MODE !== "playwright-local" && (
        <AnnouncementDialog infoContent={MAINTENANCE_ANNOUNCEMENT} />
      )}
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

      <SectionContainer
        sectionAreaStyle={{ backgroundColor: color.blue.light }}
        contentAreaStyle={{ width: PAGE_CONTENT_WIDTH_LANDING }}
      >
        <Logos />
      </SectionContainer>
    </>
  );
};

export default LandingPage;
