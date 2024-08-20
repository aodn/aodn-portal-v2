import { Box, Stack } from "@mui/material";
import Layout from "../components/layout/layout";
import BannerOpenAccess from "../components/banner/BannerOpenAccess";
import ComplexTextSearch from "../components/search/ComplexTextSearch";
import StoryBoardPanel from "../components/storyboard/StoryBoardPanel";
import landingImageUrl from "@/assets/images/bg_landing_page.png";
import SmartPanel from "../components/smartpanel/SmartPanel";
import Logos from "../components/common/logos/Logos";

const LandingPage = () => {
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
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
          sx={{
            minWidth: "1020px",
            width: "80%",
            maxWidth: "1270px",
          }}
        >
          <BannerOpenAccess />
          <ComplexTextSearch />
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "80px 30px",
            }}
          >
            <Box width="1000px" height="160px">
              <SmartPanel />
            </Box>
          </Box>
        </Stack>
      </Box>
      <Box
        sx={{
          backgroundColor: "#fff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Stack
          direction="column"
          sx={{
            minWidth: "1020px",
            width: "80%",
            maxWidth: "1270px",
          }}
        >
          <StoryBoardPanel />
          <Logos />
        </Stack>
      </Box>
    </Layout>
  );
};

export default LandingPage;
