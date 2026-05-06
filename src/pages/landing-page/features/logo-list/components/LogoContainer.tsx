import { Box, SxProps } from "@mui/material";
import { FC, ReactNode } from "react";

interface LogoContainerProps {
  children: ReactNode;
  sx?: SxProps;
}

const LogoContainer: FC<LogoContainerProps> = ({ children, sx }) => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    width="100%"
    height="110px"
    bgcolor="#fff"
    sx={{ ...sx }}
  >
    {children}
  </Box>
);

export default LogoContainer;
