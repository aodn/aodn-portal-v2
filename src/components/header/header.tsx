import { Box, Divider, Typography } from "@mui/material";
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
        display: "flex",
        justifyContent: "center",
        backgroundColor: "#fff",
        paddingY: padding.medium,
      }}
    >
      <Box
        sx={{
          width: "80%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
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
        <MainMenu />
      </Box>
    </Box>
  );
};

export default Header;
