import { FC } from "react";
import {
  Box,
  Button,
  Divider,
  Grid,
  Icon,
  IconButton,
  SxProps,
  Tooltip,
  Typography,
} from "@mui/material";
import NorthIcon from "@mui/icons-material/North";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import XIcon from "@mui/icons-material/X";
import dayjs from "dayjs";
import {
  borderRadius,
  color,
  fontSize,
  gap,
  margin,
  padding,
} from "../../../styles/constants";
import AODNSiteLogo from "./AODNSiteLogo";
import SectionContainer from "./SectionContainer";
import { openInNewTab } from "../../../utils/LinkUtils";

interface IconContainerProps {
  children: JSX.Element;
  sx?: SxProps;
}
const IconContainer: FC<IconContainerProps> = ({ children, sx }) => (
  <Icon sx={{ color: "#000", display: "flex", alignItems: "center", ...sx }}>
    {children}
  </Icon>
);

const handleBackToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

const handleClickContactUs = () => {
  const recipient = "info@aodn.org.au";
  const subject = "AODN Data Discovery enquiry";
  const body = "**This is a test - please ignore**";

  window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

const currentYear = dayjs(new Date()).year();
const version = import.meta.env.VITE_APP_VERSION;

const Footer: FC = () => {
  return (
    <SectionContainer>
      <Grid container paddingY={{ xs: padding.medium, sm: padding.quadruple }}>
        <Grid
          item
          xs={12}
          display="flex"
          flexDirection={{ xs: "column-reverse", sm: "row" }}
          justifyContent="space-between"
          gap={{ xs: 2, sm: 0 }}
        >
          <AODNSiteLogo />
          <Button onClick={handleBackToTop}>
            <IconContainer>
              <NorthIcon
                sx={{ color: color.gray.medium, fontSize: fontSize.info }}
              />
            </IconContainer>
            <Typography
              paddingTop={0}
              color={color.gray.medium}
              fontSize={fontSize.info}
            >
              Back to Top
            </Typography>
          </Button>
        </Grid>
        <Grid item xs={12} paddingY={padding.large}>
          <Typography
            color="#000"
            fontSize={fontSize.subscription}
            textAlign="left"
            lineHeight={2}
            px={1}
          >
            The Australian Ocean Data Network (AODN) stands at the forefront of
            marine data management in Australia, providing an essential
            infrastructure for the discovery, sharing and reuse of comprehensive
            marine and climate data. By managing the IMOS data collection
            program and incorporating contributions from universities and
            government research agencies, AODN supports a diverse range of users
            including researchers, data scientists, government, and industry.
            Our commitment to making these data freely available underscores our
            dedication to fostering an informed and engaged public, promoting
            sustainable environmental practices and driving economic growth
            through innovation.
          </Typography>
        </Grid>
        <Divider
          sx={{
            width: "100%",
            borderColor: color.blue.dark,
          }}
        />
        <Grid item xs={12} paddingY={padding.small}>
          <Box
            display="flex"
            flexDirection={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
          >
            <Tooltip title="Contact us by email" placement="top">
              <Box
                sx={{
                  height: "100%",
                  width: { xs: "100%", sm: "180px" },
                  bgcolor: color.blue.extraDark,
                  borderRadius: borderRadius.small,
                }}
              >
                <Button
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                    width: "100%",
                  }}
                  onClick={handleClickContactUs}
                >
                  <IconContainer sx={{ marginRight: margin.lg, color: "#fff" }}>
                    <MailOutlineIcon />
                  </IconContainer>
                  <Typography
                    color="#fff"
                    paddingTop={0}
                    fontSize={fontSize.info}
                    letterSpacing={1}
                    textAlign="center"
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
                onClick={() => openInNewTab("https://imos.org.au/terms-of-use")}
              >
                <Typography color="#000" paddingTop={gap.md}>
                  Terms of Use
                </Typography>
              </Button>
              <Button
                onClick={() =>
                  openInNewTab("https://imos.org.au/resources/acknowledging-us")
                }
              >
                <Typography color="#000" paddingTop={gap.md}>
                  Acknowledge Us
                </Typography>
              </Button>
              <Button
                onClick={() =>
                  openInNewTab("https://imos.org.au/conditions-of-use")
                }
              >
                <Typography color="#000" paddingTop={gap.md}>
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
        <Grid item xs={12} paddingY={padding.large}>
          <Grid container>
            <Grid item xs={12} sm={6}>
              <Typography
                color="#000"
                fontSize={fontSize.subscription}
                textAlign={{ xs: "center", sm: "left" }}
              >
                Copyright © {currentYear}. All rights reserved. Version :&nbsp;
                {version}
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              display="flex"
              justifyContent={{ xs: "center", sm: "end" }}
              alignItems="center"
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
                    openInNewTab("https://www.linkedin.com/company/18409795")
                  }
                >
                  <LinkedInIcon />
                </IconButton>
                <IconButton
                  sx={{ color: color.blue.extraDark }}
                  aria-label="X"
                  onClick={() => openInNewTab("https://twitter.com/IMOS_AUS")}
                >
                  <XIcon />
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
};

export default Footer;
