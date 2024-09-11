import { Backdrop, Box, CircularProgress } from "@mui/material";
import StyledLoadingBox from "./StyledLoadingBox";
import React from "react";

interface CircleLoaderProps {
  isLoading: boolean;
}

const CircleLoader: React.FC<CircleLoaderProps> = ({ isLoading }) => {
  return (
    <Backdrop
      open={isLoading}
      sx={{
        zIndex: 10,
        width: "100%",
        height: "100%",
        position: "absolute",
        backgroundColor: "rgba(255, 255, 255, 0.5)",
      }}
    >
      <Box
        sx={{ width: "100%", height: "100%" }}
        data-testid="loading-progress"
      >
        <StyledLoadingBox>
          <CircularProgress />
        </StyledLoadingBox>
      </Box>
    </Backdrop>
  );
};

export default CircleLoader;
