import { FC, ReactNode } from "react";
import { Box, Stack, SxProps } from "@mui/material";
import landingImageUrl from "@/assets/images/bg_landing_page.png";
import Layout from "../../components/layout/layout";
import BannerOpenAccess from "./subpages/banner/BannerOpenAccess";
import ComplexTextSearch from "../../components/search/ComplexTextSearch";
import SmartPanel from "./subpages/smartpanel/SmartPanel";
import StoryBoardPanel from "./subpages/storyboard/StoryBoardPanel";
import { color } from "../../styles/constants";
import Logos from "./subpages/logos/Logos";
import News from "./subpages/news/News";

const LANDING_PAGE_MIN_WIDTH = 1020;
const LANDING_PAGE_MAX_WIDTH = 1270;

const BANNER_HEIGHT = 880;
const SMART_PANEL_CONTAINER_WIDTH = 1000;
const SMART_PANEL_CONTAINER_HEIGHT = 180;

interface ContentContainerProps {
  children: ReactNode;
  contentAreaStyle?: SxProps;
  sectionAreaStyle?: SxProps;
}

export const SectionContainer = ({
  children,
  contentAreaStyle,
  sectionAreaStyle,
}: ContentContainerProps) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      ...sectionAreaStyle,
    }}
  >
    <Stack
      direction="column"
      justifyContent="center"
      alignItems="center"
      sx={{
        minWidth: LANDING_PAGE_MIN_WIDTH,
        width: "80%",
        maxWidth: LANDING_PAGE_MAX_WIDTH,
        ...contentAreaStyle,
      }}
    >
      {children}
    </Stack>
  </Box>
);

const LandingPage: FC = () => {
  return (
    <Layout>
      <SectionContainer
        sectionAreaStyle={{
          backgroundImage: `url(${landingImageUrl})`,
          backgroundSize: "cover",
        }}
        contentAreaStyle={{ height: BANNER_HEIGHT }}
      >
        <BannerOpenAccess />
        <ComplexTextSearch />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Box
            width={SMART_PANEL_CONTAINER_WIDTH}
            height={SMART_PANEL_CONTAINER_HEIGHT}
          >
            <SmartPanel />
          </Box>
        </Box>
      </SectionContainer>
      <SectionContainer sectionAreaStyle={{ backgroundColor: "#fff" }}>
        <StoryBoardPanel />
      </SectionContainer>
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
      {/* <SectionContainer sectionAreaStyle={{ backgroundColor: "#fff" }}>
        <Subscription />
      </SectionContainer> */}
    </Layout>
  );
};

export default LandingPage;
