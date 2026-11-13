import { FC, ReactElement } from "react";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Grid,
  Icon,
  IconButton,
  Stack,
  SxProps,
  Tooltip,
  Typography,
} from "@mui/material";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import traditional from "@/assets/icons/traditional_80.webp";
import { borderRadius, color, fontSize, padding } from "@/styles/constants";
import AODNSiteLogo from "./AODNSiteLogo";
import SectionContainer from "@/components/common/container/SectionContainer";
import { openInNewTab } from "@/utils/LinkUtils";
import { scrollToTop } from "@/utils/ScrollUtils";
import { useLocation } from "react-router-dom";
import {
  dateDefault,
  imosInfoDefault,
  pageDefault,
} from "@/components/common/constants";
import { NorthIcon } from "@/components/icon/NorthIcon";
import { portalTheme } from "@/styles";
import { BlueskyLogoIcon } from "@/components/icon/BlueskyLogoIcon";
import { PAGE_CONTENT_WIDTH_LANDING } from "@/app/layout/constant";
import React from "react";

interface IconContainerProps {
  children: ReactElement;
  sx?: SxProps;
}

const IconContainer: FC<IconContainerProps> = ({ children, sx }) => (
  <Icon sx={{ color: "#000", display: "flex", alignItems: "center", ...sx }}>
    {children}
  </Icon>
);

const handleClickContactUs = () => {
  window.location.href = `mailto:${imosInfoDefault.EMAIL.RECIPIENT}?subject=${encodeURIComponent(imosInfoDefault.EMAIL.SUBJECT)}`;
};

const version = import.meta.env.VITE_APP_VERSION;

const Footer: FC = () => {
  const { pathname } = useLocation();

  switch (pathname) {
    case pageDefault.search: {
      return <React.Fragment />;
    }
    default:
      return (
        <SectionContainer
          contentAreaStyle={{
            width: PAGE_CONTENT_WIDTH_LANDING,
          }}
        >
          <Grid
            container
            paddingTop={{ xs: padding.medium, sm: "38px" }}
            paddingBottom={{ xs: padding.medium, sm: padding.quadruple }}
          >
            <Grid
              display="flex"
              flexDirection={{ xs: "column-reverse", sm: "row" }}
              justifyContent="space-between"
              gap={{ xs: 2, sm: 0 }}
              size={12}
            >
              <AODNSiteLogo />
              <Button onClick={() => scrollToTop()}>
                <IconContainer>
                  <NorthIcon />
                </IconContainer>
                <Typography
                  paddingTop={0}
                  typography="title1Medium"
                  sx={{ lineHeight: "24px", ml: "8px" }}
                >
                  Back to Top
                </Typography>
              </Button>
            </Grid>
            <Grid
              paddingTop={{ xs: padding.large, sm: "27px" }}
              paddingBottom={padding.large}
              size={12}
            >
              <Typography
                color="#000"
                fontSize={fontSize.subscription}
                textAlign="left"
                lineHeight={2}
                px={1}
              >
                The IMOS Australian Ocean Data Network (AODN) stands at the
                forefront of marine data management in Australia, providing an
                essential infrastructure for the discovery, sharing and reuse of
                comprehensive marine and climate data. By managing the IMOS data
                collection program and incorporating contributions from
                universities and government research agencies, AODN supports a
                diverse range of users including researchers, data scientists,
                government, and industry. Our commitment to making these data
                freely available underscores our dedication to fostering an
                informed and engaged public, promoting sustainable environmental
                practices and driving economic growth through innovation.
              </Typography>
            </Grid>

            <Divider
              sx={{
                width: "100%",
                borderColor: color.blue.dark,
              }}
            />
            <Grid paddingY={{ xs: padding.small, sm: "16px" }} size={12}>
              <Box
                display="flex"
                flexDirection={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "stretch", sm: "center" }}
              >
                <Tooltip title="Contact us by email" placement="top">
                  <Box
                    sx={{
                      width: { xs: "100%", sm: "200px" },
                      bgcolor: portalTheme.palette.primary2,
                      borderRadius: borderRadius.medium,
                    }}
                  >
                    <Button
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "8px",
                        width: "100%",
                        height: "44px",
                      }}
                      onClick={handleClickContactUs}
                    >
                      <MailOutlineIcon
                        sx={{
                          fontSize: "26px",
                          color: portalTheme.palette.common.white,
                        }}
                      />
                      <Typography
                        sx={{
                          ...portalTheme.typography.title2Regular,
                          color: portalTheme.palette.common.white,
                          padding: 0,
                        }}
                      >
                        Contact Us
                      </Typography>
                    </Button>
                  </Box>
                </Tooltip>

                <Box
                  display="flex"
                  flexDirection={{ xs: "column", sm: "row" }}
                  justifyContent="end"
                  gap={{ xs: 0, sm: 2 }}
                >
                  <Button
                    onClick={() =>
                      openInNewTab(`${pageDefault.url.IMOS}/terms-of-use`)
                    }
                  >
                    <Typography color="#000" paddingTop={0}>
                      Terms of Use
                    </Typography>
                  </Button>
                  <Button
                    onClick={() =>
                      openInNewTab(
                        `${pageDefault.url.IMOS}/resources/acknowledging-us`
                      )
                    }
                  >
                    <Typography color="#000" paddingTop={0}>
                      Acknowledge Us
                    </Typography>
                  </Button>
                  <Button
                    onClick={() =>
                      openInNewTab(`${pageDefault.url.IMOS}/conditions-of-use`)
                    }
                  >
                    <Typography color="#000" paddingTop={0}>
                      Conditions of Use
                    </Typography>
                  </Button>
                </Box>
              </Box>
            </Grid>
            <Divider
              sx={{
                width: "100%",
                borderColor: color.blue.dark,
              }}
            />
            <Grid paddingY={padding.large} size={12}>
              <Grid container>
                <Grid
                  size={{
                    xs: 12,
                    sm: "grow",
                  }}
                >
                  <Stack
                    direction="row"
                    gap={{ xs: 2, sm: "20px" }}
                    alignItems="center"
                    marginBottom={2}
                  >
                    {/* Decorative: the acknowledgement text alongside carries the meaning */}
                    <Avatar
                      src={traditional}
                      alt=""
                      sx={{
                        width: { xs: "40px", sm: "56px" },
                        height: { xs: "40px", sm: "56px" },
                      }}
                      slotProps={{
                        img: { loading: "lazy", decoding: "async" },
                      }}
                    />
                    <Typography
                      sx={{
                        ...portalTheme.typography.body2Regular,
                        color: portalTheme.palette.text2,
                        maxWidth: "940px",
                        padding: 0,
                      }}
                    >
                      IMOS acknowledges the Traditional Custodians and Elders of
                      the land and sea on which we work and observe, and
                      recognise them as Australia’s first marine scientists and
                      carers of sea Country. We pay our respects to Aboriginal
                      and Torres Strait Islander peoples past and present.
                    </Typography>
                  </Stack>
                  <Typography
                    color="#000"
                    fontSize={fontSize.subscription}
                    textAlign={{ xs: "center", sm: "left" }}
                  >
                    Copyright © {dateDefault.currentYear}. All rights reserved.
                    Version :&nbsp;
                    {version}
                  </Typography>
                </Grid>
                <Grid
                  display="flex"
                  justifyContent={{ xs: "center", sm: "end" }}
                  alignItems="center"
                  size={{
                    xs: 12,
                    sm: "auto",
                  }}
                >
                  <Box>
                    <IconButton
                      sx={{ color: color.blue.extraDark }}
                      aria-label="Facebook"
                      onClick={() =>
                        openInNewTab(
                          "https://www.facebook.com/IntegratedMarineObservingSystem"
                        )
                      }
                    >
                      <FacebookIcon />
                    </IconButton>
                    <IconButton
                      sx={{ color: color.blue.extraDark }}
                      aria-label="LinkedIn"
                      onClick={() =>
                        openInNewTab(
                          "https://www.linkedin.com/company/18409795"
                        )
                      }
                    >
                      <LinkedInIcon />
                    </IconButton>
                    <IconButton
                      sx={{ color: color.blue.extraDark }}
                      aria-label="Bluesky"
                      onClick={() =>
                        openInNewTab(
                          "https://bsky.app/profile/imos-aus.bsky.social"
                        )
                      }
                    >
                      <BlueskyLogoIcon />
                    </IconButton>
                    <IconButton
                      sx={{ color: color.blue.extraDark }}
                      aria-label="Instagram"
                      onClick={() =>
                        openInNewTab("https://www.instagram.com/imos_australia")
                      }
                    >
                      <InstagramIcon />
                    </IconButton>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </SectionContainer>
      );
  }
};

export default Footer;
