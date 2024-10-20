import { FC } from "react";
import { color, padding } from "../../../styles/constants";
import AODNSiteLogo from "./AODNSiteLogo";
import SectionContainer from "./SectionContainer";
import { Box } from "@mui/material";
import HeaderMenu from "./HeaderMenu";
import MainMenu from "./MainMenu";
import { useLocation } from "react-router-dom";

const Header: FC = () => {
  const path = useLocation().pathname;
  console.log("path====", path);
  return (
    <>
      <SectionContainer
        sectionAreaStyle={{
          backgroundColor: color.blue.xLight,
        }}
      >
        <Box
          display="flex"
          justifyContent="end"
          alignItems="center"
          width="100%"
        >
          <HeaderMenu />
        </Box>
      </SectionContainer>
      <SectionContainer
        sectionAreaStyle={{
          backgroundColor: "#fff",
          paddingY: padding.medium,
        }}
        contentAreaStyle={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <AODNSiteLogo />
        {/* Just for display, will implement later once design is finished */}
        <MainMenu />
      </SectionContainer>
    </>
  );
};

export default Header;
