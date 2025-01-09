import { Box, Divider, Typography } from "@mui/material";
import IMOS from "@/assets/logos/imos-logo.png";
import {
  fontColor,
  fontSize,
  fontWeight,
  padding,
} from "../../../styles/constants";

const AODNSiteLogo = () => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minWidth: "240px",
    }}
  >
    <a href="/">
      <img
        height="30px"
        src={IMOS}
        alt="IMOS Logo"
        style={{ paddingRight: padding.medium }}
      />
    </a>
    <Divider orientation="vertical" flexItem></Divider>
    <Typography
      textAlign="left"
      fontSize={fontSize.info}
      fontWeight={fontWeight.medium}
      color={fontColor.blue.dark}
      padding={0}
      paddingLeft={padding.medium}
    >
      Australian Ocean <br />
      Data Network
    </Typography>
  </Box>
);

export default AODNSiteLogo;
