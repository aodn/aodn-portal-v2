import { FC } from "react";
import { Box } from "@mui/material";
import MainMenu from "./MainMenu";
import { padding } from "../../../styles/constants";
import AODNSiteLogo from "./AODNSiteLogo";

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
          width: "70%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <AODNSiteLogo />
        <MainMenu />
      </Box>
    </Box>
  );
};

export default Header;
