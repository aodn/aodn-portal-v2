import { FC } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Box } from "@mui/material";
import { color, padding } from "../../../styles/constants";
import AODNSiteLogo from "./AODNSiteLogo";
import SectionContainer from "./SectionContainer";
import HeaderMenu from "./HeaderMenu";
import MainMenu from "./MainMenu";
import { pageDefault } from "../../common/constants";
import ComplexTextSearch from "../../search/ComplexTextSearch";
import { PAGE_CONTENT_MAX_WIDTH, PAGE_CONTENT_WIDTH } from "../constant";
import { getSearchbarExpanded } from "../../common/store/store";
import { SEARCHBAR_EXPAND_WIDTH } from "../../search/constants";

const Header: FC = () => {
  const path = useLocation().pathname;
  const isSearchResultPage = path === pageDefault.search;

  const shouldExpandSearchbar = useSelector(getSearchbarExpanded);

  return (
    <>
      <SectionContainer
        sectionAreaStyle={{
          backgroundColor: color.blue.xLight,
        }}
        contentAreaStyle={{
          alignItems: "end",
          width: isSearchResultPage ? "90%" : PAGE_CONTENT_WIDTH,
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
          width: isSearchResultPage ? "90%" : PAGE_CONTENT_WIDTH,
          maxWidth: isSearchResultPage ? "90%" : PAGE_CONTENT_MAX_WIDTH,
        }}
      >
        <AODNSiteLogo />

        {/* Main menu just for display, will implement later once design is finished */}
        {isSearchResultPage ? (
          shouldExpandSearchbar ? (
            <Box
              display="flex"
              flexDirection="row"
              alignItems="center"
              gap={2}
              minWidth={SEARCHBAR_EXPAND_WIDTH}
            >
              <MainMenu isCollapsed />
              <ComplexTextSearch />
            </Box>
          ) : (
            <Box display="flex" flexDirection="row" alignItems="center" gap={2}>
              <MainMenu />
              <ComplexTextSearch />
            </Box>
          )
        ) : (
          <MainMenu />
        )}
      </SectionContainer>
    </>
  );
};

export default Header;
