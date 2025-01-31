import { FC, useState } from "react";
import { useLocation } from "react-router-dom";
import { Box } from "@mui/material";
import { color, padding } from "../../../styles/constants";
import AODNSiteLogo from "./AODNSiteLogo";
import SectionContainer from "./SectionContainer";
import HeaderMenu from "./HeaderMenu";
import MainMenu from "./MainMenu";
import { pageDefault } from "../../common/constants";
import Searchbar from "../../search/Searchbar";
import {
  PAGE_CONTENT_MAX_WIDTH,
  PAGE_CONTENT_WIDTH_ABOVE_LAPTOP,
} from "../constant";
import { SEARCHBAR_EXPANSION_WIDTH } from "../../search/constants";
import useBreakpoint from "../../../hooks/useBreakpoint";

const Header: FC = () => {
  const { isUnderLaptop, isMobile } = useBreakpoint();
  const path = useLocation().pathname;
  const isSearchResultPage = path === pageDefault.search;

  const [shouldExpandSearchbar, setShouldExpandSearchbar] =
    useState<boolean>(false);

  return (
    <Box>
      <SectionContainer
        sectionAreaStyle={{
          backgroundColor: color.blue.xLight,
        }}
        contentAreaStyle={{
          alignItems: "end",
          width: isSearchResultPage ? "90%" : PAGE_CONTENT_WIDTH_ABOVE_LAPTOP,
          maxWidth: isSearchResultPage ? "90%" : PAGE_CONTENT_MAX_WIDTH,
        }}
      >
        <HeaderMenu />
      </SectionContainer>
      <SectionContainer
        sectionAreaStyle={{
          backgroundColor: "#fff",
          paddingY: padding.medium,
        }}
        contentAreaStyle={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: isSearchResultPage ? "90%" : PAGE_CONTENT_WIDTH_ABOVE_LAPTOP,
          maxWidth: isSearchResultPage ? "90%" : PAGE_CONTENT_MAX_WIDTH,
        }}
      >
        <AODNSiteLogo />

        {/* Main menu just for display, will implement later once design is finished */}
        {isSearchResultPage ? (
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            gap={2}
            minWidth={
              shouldExpandSearchbar
                ? isUnderLaptop
                  ? "auto"
                  : SEARCHBAR_EXPANSION_WIDTH
                : "auto"
            }
          >
            {isUnderLaptop ? (
              <MainMenu isCollapsed={true} />
            ) : (
              <MainMenu isCollapsed={shouldExpandSearchbar} />
            )}
            {!isMobile && (
              <Searchbar setShouldExpandSearchbar={setShouldExpandSearchbar} />
            )}
          </Box>
        ) : isUnderLaptop ? (
          <MainMenu isCollapsed={true} />
        ) : (
          <MainMenu />
        )}
      </SectionContainer>
      {isSearchResultPage && isMobile && (
        <Box p={padding.extraSmall} pt={0}>
          <Searchbar setShouldExpandSearchbar={setShouldExpandSearchbar} />
        </Box>
      )}
    </Box>
  );
};

export default Header;
