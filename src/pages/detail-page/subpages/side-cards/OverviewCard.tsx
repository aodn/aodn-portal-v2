import React from "react";
import SideCardContainer from "./SideCardContainer";
import { Box } from "@mui/material";
import bgLandingPage from "../../../../../public/bg_landing_page.png";

// TODO: replace with real picture url
const OverviewCard = () => {
  return (
    <SideCardContainer title="Overview">
      <Box sx={{ width: "100%", height: "200px" }}>
        <img
          src={bgLandingPage}
          alt="imos_logo"
          style={{
            objectFit: "cover",
            width: "100%",
            height: "100%",
          }}
        />
      </Box>
    </SideCardContainer>
  );
};

export default OverviewCard;
