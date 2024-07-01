import { Divider, Grid, Box, Typography, Stack } from "@mui/material";

import AIOMS from "@/assets/logos/aioms-logo2.png";
import AustralianGovernment from "@/assets/logos/aioms-logo1.png";
import BOM from "@/assets/logos/bom-logo.png";
import CSIRO from "@/assets/logos/csiro-logo.png";
import CurtinUniversity from "@/assets/logos/curtinuni-logo.png";
import DAWE from "@/assets/logos/dawe-aap.png";
import DeakinUniversity from "@/assets/logos/deakinuniversity-logo.png";
import GovSA from "@/assets/logos/govsa-logo.png";
import MacquarieUniversity from "@/assets/logos/macquarie-logo.png";
import NCRIS from "@/assets/logos/ncris-logo.png";
import SARDI from "@/assets/logos/sardi-logo.png";
import SIMS from "@/assets/logos/sims-logo.png";
import UniversityOfMelbourne from "@/assets/logos/The-University-of-Melbourne-Logo.png";
import UniversityOfSydney from "@/assets/logos/unisyd-logo.png";
import UNSW from "@/assets/logos/unsw-logo.png";
import UTAS from "@/assets/logos/utas-logo.png";
import UTS from "@/assets/logos/uts-logo.png";
import UWA from "@/assets/logos/uniwa-logo.png";
import {
  color,
  fontColor,
  fontWeight,
  padding,
} from "../../../styles/constants";

type LogoProps = { src: string; alt: string; height: string };

const Logo = ({ src, alt, height }: LogoProps) => {
  return (
    <Box
      component="img"
      src={src}
      alt={alt}
      sx={{ height: height, padding: padding.small }}
    />
  );
};

const LogoList = () => {
  const principals = [
    AustralianGovernment,
    AIOMS,
    BOM,
    CSIRO,
    GovSA,
    SARDI,
    UWA,
  ];

  const sims = [UTS, UniversityOfSydney, MacquarieUniversity, UNSW];
  const associates = [
    CurtinUniversity,
    DAWE,
    DeakinUniversity,
    UniversityOfMelbourne,
  ];

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            alignItems="center"
            sx={{
              width: "60%",
            }}
          >
            <Logo src={NCRIS} alt={"logo-NCRIS"} height="150px" />
            <Typography textAlign="left" padding={0}>
              Australia&apos;s Integrated Marine Observing System (IMOS) is
              enabled by the National Collaborative Research Infrastructre
              Strategy (NCRIS) It is operated by a consortium of institutions as
              an unincorperated joint venture with the Unviersity of Tasmania as
              Lead Agent.
            </Typography>
          </Stack>
        </Grid>
      </Grid>
      <Grid
        item
        xs={12}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography paddingY={padding.small} fontWeight={fontWeight.extraBold}>
          PRINCIPLE PARTICIPANTS
        </Typography>
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={1}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Logo
              src={UTAS}
              alt={"logo-University-of-Tasmania"}
              height="40px"
            />
            <Typography
              fontWeight={600}
              padding={`0 ${padding.medium} 0 0`}
              fontSize="small"
            >
              LEAD AGENT
            </Typography>
          </Box>
          {principals.map((logo, index) => (
            <Box key={index}>
              <Logo src={logo} alt={`logo-${index}`} height="60px" />
            </Box>
          ))}
        </Stack>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          spacing={1}
        >
          <Logo src={SIMS} alt="logo-sims" height="60px" />
          <Divider
            orientation="vertical"
            sx={{
              height: "60%",
              "&.MuiDivider-root": {
                borderColor: color.gray.medium,
              },
            }}
          />
          {sims.map((logo, index) => (
            <Box key={index}>
              <Logo src={logo} alt={`logo-${index}`} height="60px" />
            </Box>
          ))}
        </Stack>
        <Typography
          paddingY={padding.extraSmall}
          fontSize="small"
          fontWeight={fontWeight.extraBold}
          color={fontColor.gray.light}
        >
          SIMS IS A PARTNERSHIP INVOLVING FOUR UNIVERSITIES
        </Typography>
      </Grid>
      <Grid
        item
        xs={12}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          paddingBottom: padding.extraLarge,
        }}
      >
        <Typography paddingY={padding.small} fontWeight={fontWeight.extraBold}>
          ASSOCIATE PARTICIPANTS
        </Typography>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          spacing={1}
        >
          {associates.map((logo, index) => (
            <Box key={index}>
              <Logo
                src={logo}
                alt={`logo-${index}`}
                height={index === 0 ? "30px" : "60px"}
              />
            </Box>
          ))}
        </Stack>
      </Grid>
    </Grid>
  );
};

export default LogoList;
