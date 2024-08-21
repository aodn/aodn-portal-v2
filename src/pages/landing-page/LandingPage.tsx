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

const LANDING_PAGE_MIN_WIDTH = 1020;
const LANDING_PAGE_MAX_WIDTH = 1270;

const BANNER_HEIGHT = 880;
const SMART_PANEL_CONTAINER_WIDTH = 1000;
const SMART_PANEL_CONTAINER_HEIGHT = 180;

interface ContentContainerProps {
  children: ReactNode;
  sx?: SxProps;
}
const ContentContainer = ({ children, sx }: ContentContainerProps) => (
  <Stack
    direction="column"
    justifyContent="center"
    alignItems="center"
    sx={{
      minWidth: LANDING_PAGE_MIN_WIDTH,
      width: "80%",
      maxWidth: LANDING_PAGE_MAX_WIDTH,
      ...sx,
    }}
  >
    {children}
  </Stack>
);

const LandingPage: FC = () => {
  return (
    <Layout>
      <Box
        sx={{
          backgroundImage: `url(${landingImageUrl})`,
          backgroundSize: "cover",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ContentContainer sx={{ height: BANNER_HEIGHT }}>
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
        </ContentContainer>
      </Box>
      <Box
        sx={{
          backgroundColor: "#fff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ContentContainer>
          <StoryBoardPanel />
        </ContentContainer>
      </Box>
      <Box
        sx={{
          backgroundColor: color.blue.extraDark,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ContentContainer>123</ContentContainer>
      </Box>
      <Box
        sx={{
          backgroundColor: color.blue.light,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ContentContainer>
          <Logos />
        </ContentContainer>
      </Box>
    </Layout>
  );
};

export default LandingPage;
