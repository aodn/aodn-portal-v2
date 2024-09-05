import StyledLoadingBox from "./StyledLoadingBox";
import { Modal, Typography } from "@mui/material";
import React from "react";

interface LoadingModalProps {
  isLoading: boolean;
}

const LoadingModal: React.FC<LoadingModalProps> = ({ isLoading }) => {
  return (
    <Modal open={isLoading}>
      <StyledLoadingBox>
        <Typography sx={{ fontSize: "30px" }}>LOADING....</Typography>
      </StyledLoadingBox>
    </Modal>
  );
};

export default LoadingModal;
