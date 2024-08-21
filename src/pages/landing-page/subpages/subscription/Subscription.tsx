import { FC } from "react";
import {
  Box,
  Button,
  Divider,
  Grid,
  Icon,
  InputBase,
  Paper,
  Typography,
} from "@mui/material";
import {
  border,
  borderRadius,
  color,
  fontSize,
  gap,
  padding,
} from "../../../../styles/constants";
import imosLogo from "@/assets/logos/imos-logo-full-title.png";
import MenuIcon from "@mui/icons-material/Menu";
import NorthIcon from "@mui/icons-material/North";
import MailOutlineIcon from "@mui/icons-material/MailOutline";

const handleBackToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

const Subscription: FC = () => {
  return (
    <Grid container paddingY={padding.quadruple}>
      <Grid item xs={12}>
        <img
          src={imosLogo}
          alt="imos_logo"
          style={{
            objectFit: "contain",
            height: "40px",
          }}
        />
      </Grid>
      <Grid item xs={12} paddingY={padding.large}>
        <Grid container>
          <Grid item xs={7}>
            <Typography
              color="#000"
              fontSize={fontSize.subscription}
              lineHeight={2}
            >
              Australia’s Integrated Marine Observing System (IMOS) is enabled
              by the National Collaborative Research Infrastructure Strategy
              (NCRIS). It is operated by a consortium of institutions as an
              unincorporated joint venture, with the University of Tasmania as
              Lead Agent.
            </Typography>
          </Grid>
          <Grid
            item
            xs={5}
            display="flex"
            justifyContent="end"
            alignItems="end"
          >
            <Box>
              <Button>
                <Icon sx={{ color: "#000", paddingBottom: padding.small }}>
                  <MenuIcon fontSize="small" />
                </Icon>
                <Typography color="#000" paddingTop={gap.md}>
                  Menu
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
        </Grid>
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
                  // inputProps={{ "aria-label": "search google maps" }}
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
          <Grid item xs={12} md={6}>
            <Typography
              color="#000"
              fontSize={fontSize.subscription}
              lineHeight={2}
            >
              IMOS acknowledges the Traditional Custodians and Elders of the
              land and sea on which we work and observe and recognise their
              unique connection to land and sea. We pay our respects to
              Aboriginal and Torres Strait Islander peoples past and present.
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
            display="flex"
            justifyContent="end"
            alignItems="end"
          >
            <Box>
              <Typography fontSize={fontSize.info}>
                The hero images on this page were photographed by xxx
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Subscription;
