import StyledLoadingBox from "./StyledLoadingBox";
import { Box, CircularProgress, Modal } from "@mui/material";
import React from "react";

interface LoadingModalProps {
  isLoading: boolean;
}

const LoadingModal: React.FC<LoadingModalProps> = ({ isLoading }) => {
  return (
    <Modal open={isLoading}>
      <Box sx={{ width: "100%", height: "100%" }}>
        <StyledLoadingBox>
          <CircularProgress />
        </StyledLoadingBox>
      </Box>
    </Modal>
  );
};

export default LoadingModal;
