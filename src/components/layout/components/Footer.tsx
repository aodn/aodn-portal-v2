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
  padding,
} from "../../../styles/constants";
import { SectionContainer } from "../../../pages/landing-page/LandingPage";
import AODNSiteLogo from "./AODNSiteLogo";

const handleBackToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

const currentYear = dayjs(new Date()).year();

const Footer: FC = () => {
  return (
    <SectionContainer>
      <Grid container paddingY={padding.quadruple}>
        <Grid item xs={12} display="flex" justifyContent="space-between">
          <AODNSiteLogo />
          <Box>
            <Button>
              <Icon sx={{ color: "#000", paddingBottom: padding.small }}>
                <MenuIcon fontSize="small" />
              </Icon>
              <Typography color="#000" paddingTop={gap.md}>
                Site Menu
              </Typography>
            </Button>
            <Button onClick={handleBackToTop}>
              <Icon sx={{ color: "#000", paddingBottom: padding.small }}>
                <NorthIcon fontSize="small" />
              </Icon>
              <Typography color="#000" paddingTop={gap.md}>
                Back to Top
              </Typography>
            </Button>
          </Box>
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
              <Box minWidth="415px" maxWidth="70%">
                <Paper
                  component="form"
                  elevation={0}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    height: "50px",
                    border: border.xs,
                    borderBlockColor: color.blue.dark,
                    borderRadius: borderRadius.medium,
                    overflow: "hidden",
                  }}
                >
                  <Icon sx={{ p: padding.extraSmall, pb: "8px" }}>
                    <MailOutlineIcon />
                  </Icon>
                  <InputBase
                    sx={{ flex: 1, p: 0 }}
                    placeholder="email@example.com"
                  />
                  <Box
                    sx={{
                      height: "100%",
                      width: "20%",
                      bgcolor: color.blue.extraDark,
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
                    >
                      <Typography
                        color="#fff"
                        paddingTop={0}
                        fontSize={fontSize.label}
                        textAlign="center"
                      >
                        Subscription
                      </Typography>
                    </Button>
                  </Box>
                </Paper>
              </Box>
            </Grid>
            <Grid item xs={6} display="flex" justifyContent="end" gap={2}>
              <Button>
                <Typography color="#000" paddingTop={gap.md}>
                  Acknowledge Us
                </Typography>
              </Button>
              <Button>
                <Typography color="#000" paddingTop={gap.md}>
                  Site Map
                </Typography>
              </Button>
              <Button>
                <Typography color="#000" paddingTop={gap.md}>
                  Term of Use
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
                @IMOS {currentYear}
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
