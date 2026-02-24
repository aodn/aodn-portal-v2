import { FC, useState } from "react";
import { useLocation } from "react-router-dom";
import { Box, Link, Stack } from "@mui/material";
import { portalTheme } from "../../../styles";
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
import {
  SEARCHBAR_EXPANSION_WIDTH_LAPTOP,
  SEARCHBAR_EXPANSION_WIDTH_TABLET,
} from "../../search/constants";
import useBreakpoint from "../../../hooks/useBreakpoint";
import ShareButtonMenu from "../../menu/ShareButtonMenu";
import HeaderIconMenu from "./HeaderIconMenu";

const FEEDBACK_URL =
  "https://forms.office.com/pages/responsepage.aspx?id=VV3rFZEZvEaNp6slI03uCIbxNcrqZltDmWw3jsls7JBUMEJTRENHV1o4QzcyWUtKUzJZU1U2SDk1US4u&route=shorturl";

const FEEDBACK_TEXT =
  "This portal is currently in a Beta stage. To provide much appreciated feedback please";

const Header: FC = () => {
  const { isUnderLaptop, isMobile } = useBreakpoint();
  const path = useLocation().pathname;
  const isSearchResultPage = path === pageDefault.search;
  const isLandingPage = path !== pageDefault.search;

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
          sx={{ flex: 1 }}
        >
          <AODNSiteLogo />
          {isLandingPage && !isMobile && (
            <Box
              sx={{
                ...portalTheme.typography.body3Small,
                color: portalTheme.palette.primary2,
                backgroundColor: portalTheme.palette.primary6,
                border: `1px solid ${portalTheme.palette.primary4}`,
                borderRadius: "8px",
                maxWidth: "350px",
                px: 1.5,
                py: 0.5,
              }}
            >
              {FEEDBACK_TEXT}{" "}
              <Link
                href={FEEDBACK_URL}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ fontWeight: 600, color: "inherit" }}
              >
                click here
              </Link>
            </Box>
          )}
          {isMobile && <HeaderIconMenu />}
        </Stack>

        {isSearchResultPage && (
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="right"
            gap={2}
            flex={2}
          >
            {!isMobile && (
              <>
                <Box
                  minWidth={
                    shouldExpandSearchbar
                      ? isUnderLaptop
                        ? SEARCHBAR_EXPANSION_WIDTH_TABLET
                        : SEARCHBAR_EXPANSION_WIDTH_LAPTOP
                      : "auto"
                  }
                >
                  <Searchbar
                    setShouldExpandSearchbar={setShouldExpandSearchbar}
                  />
                </Box>

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
