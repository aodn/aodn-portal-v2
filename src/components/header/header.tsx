import { Box, Divider, Grid, Typography } from "@mui/material";
import IMOS from "@/assets/logos/imos-logo.png";
import MainMenu from "../menu/MainMenu";
import { FC } from "react";
import {
  fontColor,
  fontSize,
  fontWeight,
  padding,
} from "../../styles/constants";

const Header: FC = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#FFF",
        paddingY: padding.medium,
      }}
    >
      <Grid
        container
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Grid item xs={4}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "end",
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
        </Grid>
        <Grid item xs={8} sx={{ paddingLeft: padding.quadruple }}>
          <MainMenu />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Header;
