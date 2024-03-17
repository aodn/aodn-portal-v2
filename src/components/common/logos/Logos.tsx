import { Divider, Grid, Box, Typography } from "@mui/material";

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

type LogoProps = { src: string; alt: string; height: string };

const Logo = ({ src, alt, height }: LogoProps) => {
  return (
    <Box component="img" src={src} alt={alt} sx={{ height: height, p: 2 }} />
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
    <Grid container spacing={2} pb={6}>
      <Grid item xs={12}>
        <Grid
          item
          xs={6}
          sx={{
            display: "flex",
            flexDirection: "row",
            alignContent: "center",
            alignItems: "center",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <Logo src={NCRIS} alt={"logo-NCRIS"} height="200px" />
          <Typography textAlign="left" pl={2}>
            Australia&apos;s Integrated Marine Observing System (IMOS) is
            enabled by the National Collaborative Research Infrastructre
            Strategy (NCRIS) It is operated by a consortium of institutions as
            an unincorperated joint venture with the Unviersity of Tasmania as
            Lead Agent.
          </Typography>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Typography fontWeight={500}>PRINCIPLE PARTICIPANTS</Typography>
      </Grid>
      <Grid
        item
        xs={10}
        sx={{
          display: "flex",
          flexDirection: "row",
          alignContent: "center",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <Box>
          <Logo src={UTAS} alt={"logo-University-of-Tasmania"} height="60px" />
          <Typography fontWeight={500}>LEAD AGENT</Typography>
        </Box>
        {principals.map((logo, index) => (
          <Grid item xs={12} key={index}>
            <Logo src={logo} alt={`logo-${index}`} height="60px" />
          </Grid>
        ))}
      </Grid>
      <Grid
        item
        sx={{
          display: "flex",
          flexDirection: "row",
          alignContent: "center",
          alignItems: "center",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <Logo src={SIMS} alt="logo-sims" height="60px" />
        <Divider orientation="vertical" flexItem />
        {sims.map((logo, index) => (
          <Grid item xs={12} key={index}>
            <Logo src={logo} alt={`logo-${index}`} height="60px" />
          </Grid>
        ))}
      </Grid>
      <Grid item xs={12}>
        <Typography fontWeight={500}>
          SIMS IS A PARTNERSHIP INVOLVING FOUR UNIVERSITIES
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography fontWeight={500}>ASSOCIATE PARTICIPANTS</Typography>
      </Grid>
      <Grid
        item
        sx={{
          display: "flex",
          flexDirection: "row",
          alignContent: "center",
          alignItems: "center",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        {associates.map((logo, index) => (
          <Grid item xs={12} key={index}>
            <Logo src={logo} alt={`logo-${index}`} height="60px" />
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

export default LogoList;
