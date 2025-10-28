import { FC, useState } from "react";
import { useLocation } from "react-router-dom";
import { Box, Stack } from "@mui/material";
import {
  border,
  borderRadius,
  color,
  padding,
  shadow,
  zIndex,
} from "../../../styles/constants";
import AODNSiteLogo from "./AODNSiteLogo";
import SectionContainer from "./SectionContainer";
import HeaderMenu, { HeaderMenuStyle } from "./HeaderMenu";
import { pageDefault } from "../../common/constants";
import Searchbar from "../../search/Searchbar";
import {
  PAGE_CONTENT_MAX_WIDTH,
  PAGE_CONTENT_WIDTH_ABOVE_LAPTOP,
  SEARCHBAR_CONTENT_WIDTH,
} from "../constant";
import { SEARCHBAR_EXPANSION_WIDTH } from "../../search/constants";
import useBreakpoint from "../../../hooks/useBreakpoint";
import ShareButtonMenu from "../../menu/ShareButtonMenu";
import HeaderIconMenu from "./HeaderIconMenu";

const Header: FC = () => {
  const { isUnderLaptop, isMobile } = useBreakpoint();
  const path = useLocation().pathname;
  const isSearchResultPage = path === pageDefault.search;

  const [shouldExpandSearchbar, setShouldExpandSearchbar] =
    useState<boolean>(false);

  return (
    <Box
      sx={{
        position: "sticky",
        top: 0,
        zIndex: zIndex.header,
        borderBottom: `${border.sm} ${color.gray.xxLight}`,
        boxShadow: shadow.bottom,
      }}
    >
      {!isMobile && (
        <SectionContainer
          sectionAreaStyle={{
            backgroundColor: color.blue.xLight,
          }}
          contentAreaStyle={{
            alignItems: "end",
            width: isSearchResultPage
              ? SEARCHBAR_CONTENT_WIDTH
              : PAGE_CONTENT_WIDTH_ABOVE_LAPTOP,
            maxWidth: isSearchResultPage
              ? SEARCHBAR_CONTENT_WIDTH
              : PAGE_CONTENT_MAX_WIDTH,
          }}
        >
          <HeaderMenu menuStyle={HeaderMenuStyle.DROPDOWN_MENU} />
        </SectionContainer>
      )}

      <SectionContainer
        sectionAreaStyle={{
          backgroundColor: "#fff",
          paddingY: padding.medium,
        }}
        contentAreaStyle={{
          flexDirection: isMobile ? "column" : "row",
          width: isSearchResultPage
            ? SEARCHBAR_CONTENT_WIDTH
            : PAGE_CONTENT_WIDTH_ABOVE_LAPTOP,
          maxWidth: isSearchResultPage
            ? SEARCHBAR_CONTENT_WIDTH
            : PAGE_CONTENT_MAX_WIDTH,
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          width="100%"
        >
          <AODNSiteLogo />
          {isMobile && <HeaderIconMenu />}
        </Stack>

        {isSearchResultPage && (
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
            {!isMobile && (
              <>
                <Searchbar
                  setShouldExpandSearchbar={setShouldExpandSearchbar}
                />
                {!isUnderLaptop && (
                  <ShareButtonMenu
                    hideText
                    sx={{ maxWidth: "40px", borderRadius: borderRadius.circle }}
                  />
                )}
              </>
            )}
          </Box>
        )}
      </SectionContainer>

      {isSearchResultPage && isMobile && (
        <Box p={padding.extraSmall} pt={0} bgcolor="#fff">
          <Searchbar setShouldExpandSearchbar={setShouldExpandSearchbar} />
        </Box>
      )}
    </Box>
  );
};

export default Header;
