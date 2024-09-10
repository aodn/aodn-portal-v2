import { FC } from "react";
import {
  Box,
  Button,
  Divider,
  Grid,
  Icon,
  IconButton,
  InputBase,
  Paper,
  SxProps,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NorthIcon from "@mui/icons-material/North";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import XIcon from "@mui/icons-material/X";
import dayjs from "dayjs";
import {
  border,
  borderRadius,
  color,
  fontSize,
  gap,
  margin,
  padding,
} from "../../../styles/constants";
import AODNSiteLogo from "./AODNSiteLogo";
import SectionContainer from "./SectionContainer";

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
  const subject = "This is a test - please ignore";
  const body = "This is being sent from AODN's Data Discovery portal.";

  window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

const currentYear = dayjs(new Date()).year();
const version = import.meta.env.VITE_APP_VERSION;

const Footer: FC = () => {
  return (
    <SectionContainer>
      <Grid container paddingY={padding.quadruple}>
        <Grid item xs={12} display="flex" justifyContent="space-between">
          <AODNSiteLogo />
          <Button onClick={handleBackToTop}>
            <IconContainer>
              <NorthIcon fontSize="small" />
            </IconContainer>
            <Typography color="#000" paddingTop={0}>
              Back to Top
            </Typography>
          </Button>
        </Grid>
        <Grid item xs={12} paddingY={padding.large}>
          <Typography
            color="#000"
            fontSize={fontSize.subscription}
            lineHeight={2}
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
          <Grid container>
            <Grid item xs={6}>
              <Box
                sx={{
                  height: "100%",
                  width: "180px",
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
            </Grid>
            <Grid item xs={6} display="flex" justifyContent="end" gap={2}>
              <Button
                onClick={() => window.open("https://imos.org.au/terms-of-use")}
              >
                <Typography color="#000" paddingTop={gap.md}>
                  Terms of Use
                </Typography>
              </Button>
              <Button
                onClick={() =>
                  window.open("https://imos.org.au/resources/acknowledging-us")
                }
              >
                <Typography color="#000" paddingTop={gap.md}>
                  Acknowledge Us
                </Typography>
              </Button>
              <Button
                onClick={() =>
                  window.open("https://imos.org.au/conditions-of-use")
                }
              >
                <Typography color="#000" paddingTop={gap.md}>
                  Conditions of Use
                </Typography>
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Divider
          sx={{
            width: "100%",
            borderColor: color.blue.dark,
          }}
        />
        <Grid item xs={12} paddingY={padding.large}>
          <Grid container>
            <Grid item xs={6}>
              <Typography color="#000" fontSize={fontSize.subscription}>
                Copyright © {currentYear}. All rights reserved. Version :&nbsp;
                {version}
              </Typography>
            </Grid>
            <Grid
              item
              xs={6}
              display="flex"
              justifyContent="end"
              alignItems="center"
            >
              <Box>
                <IconButton
                  sx={{ color: color.blue.extraDark }}
                  aria-label="Facebook"
                  onClick={() =>
                    window.open(
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
                    window.open("https://www.linkedin.com/company/18409795")
                  }
                >
                  <LinkedInIcon />
                </IconButton>
                <IconButton
                  sx={{ color: color.blue.extraDark }}
                  aria-label="X"
                  onClick={() => window.open("https://twitter.com/IMOS_AUS")}
                >
                  <XIcon />
                </IconButton>
                <IconButton
                  sx={{ color: color.blue.extraDark }}
                  aria-label="Instagram"
                  onClick={() =>
                    window.open("https://www.instagram.com/imos_australia")
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
