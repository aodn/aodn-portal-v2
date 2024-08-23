import { FC } from "react";
import { Grid, Box, Typography, Divider } from "@mui/material";
import AUMS from "@/assets/logos/aus-unstitute-of-marine-science.png";
import BM from "@/assets/logos/bureo-of-meteorology.png";
import CSIRO from "@/assets/logos/csiro-logo.png";
import CurtinUni from "@/assets/logos/curtinuni-logo.png";
import DAWE from "@/assets/logos/dawe-aap.png";
import DeakinUni from "@/assets/logos/deakinuniversity-logo.png";
import GovSA from "@/assets/logos/govsa-logo.png";
import MacquarieUni from "@/assets/logos/macquarie-uni.png";
import NCRIS from "@/assets/logos/ncris-logo.png";
import SARDI from "@/assets/logos/sardi-logo.png";
import SIMS from "@/assets/logos/sims-logo.png";
import UMEL from "@/assets/logos/The-University-of-Melbourne-Logo.png";
import USYD from "@/assets/logos/unisyd-logo.png";
import UNSW from "@/assets/logos/unsw-logo.png";
import UTAS from "@/assets/logos/utas-logo.png";
import UTS from "@/assets/logos/uts-logo.png";
import UWA from "@/assets/logos/uniwa-logo.png";
import {
  color,
  fontSize,
  fontWeight,
  padding,
} from "../../../../styles/constants";
import LogoContainer from "./components/LogoContainer";
import Logo from "./components/Logo";

const LogoList: FC = () => {
  return (
    <Grid container paddingY={padding.quadruple} spacing={2}>
      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid item xs={4} lg={3}>
            <LogoContainer>
              <Logo src={NCRIS} alt={NCRIS} />
            </LogoContainer>
          </Grid>
          <Grid item xs={6} lg={6}>
            <Typography color="#000" textAlign="left" padding={0}>
              Australia&apos;s Integrated Marine Observing System (IMOS) is
              enabled by the National Collaborative Research Infrastructre
              Strategy (NCRIS) It is operated by a consortium of institutions as
              an unincorperated joint venture with the Unviersity of Tasmania as
              Lead Agent.
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Typography fontWeight={fontWeight.bold} color="#000">
          Principal Participants
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid item xs={4} lg={3}>
            <LogoContainer>
              <Logo src={UTAS} alt={UTAS} height="40px" />
            </LogoContainer>
          </Grid>
          <Grid item xs={4} lg={3}>
            <LogoContainer>
              <Logo src={AUMS} alt={AUMS} height="50px" />
            </LogoContainer>
          </Grid>
          <Grid item xs={4} lg={3}>
            <LogoContainer>
              <Logo src={BM} alt={UTAS} height="100px" />
            </LogoContainer>
          </Grid>
          <Grid item xs={4} lg={3}>
            <LogoContainer>
              <Logo src={CSIRO} alt={CSIRO} height="70px" />
            </LogoContainer>
          </Grid>
          <Grid item xs={4} lg={3}>
            <LogoContainer>
              <Box>
                <Logo src={GovSA} alt={GovSA} height="75px" />
              </Box>
              <Box>
                <Logo src={SARDI} alt={SARDI} height="85px" />
              </Box>
            </LogoContainer>
          </Grid>
          <Grid item xs={4} lg={3}>
            <LogoContainer>
              <Logo src={UWA} alt={UWA} height="60px" />
            </LogoContainer>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <LogoContainer sx={{ minWidth: "100%" }}>
          <Logo src={SIMS} alt={SIMS} height="80px" />
          <Divider
            sx={{ height: "48px", m: 0.5, borderColor: color.gray.dark }}
            orientation="vertical"
          />
          <Logo src={UTS} alt={UTS} height="50px" />
          <Logo src={USYD} alt={USYD} height="50px" />
          <Logo src={MacquarieUni} alt={MacquarieUni} height="80px" />
          <Logo src={UNSW} alt={UNSW} height="70px" />
        </LogoContainer>
        <Typography
          paddingTop={-padding.small}
          fontWeight={fontWeight.regular}
          fontSize={fontSize.label}
        >
          SIMS is a partnership involving four universities
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography fontWeight={fontWeight.bold} color="#000">
          Associate Participants
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid item xs={4} lg={3}>
            <LogoContainer>
              <Logo src={CurtinUni} alt={CurtinUni} height="35px" />
            </LogoContainer>
          </Grid>
          <Grid item xs={4} lg={3}>
            <LogoContainer>
              <Logo src={DAWE} alt={DAWE} height="50px" />
            </LogoContainer>
          </Grid>
          <Grid item xs={4} lg={3}>
            <LogoContainer>
              <Logo src={DeakinUni} alt={DeakinUni} height="65px" />
            </LogoContainer>
          </Grid>
          <Grid item xs={4} lg={3}>
            <LogoContainer>
              <Logo src={UMEL} alt={UMEL} height="70px" />
            </LogoContainer>
          </Grid>
          <Grid item xs={12}>
            <Typography
              padding={0}
              fontWeight={fontWeight.regular}
              fontSize={fontSize.label}
              lineHeight={2}
            >
              IMOS thanks the many other organisations who partner with IMOS,
              providing co-investment,
              <br />
              funding and operational support, including investment from the
              Tasmanian,
              <br />
              Western Australian and Queensland State Governments.
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default LogoList;
