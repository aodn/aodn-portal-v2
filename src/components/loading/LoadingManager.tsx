import React, { useMemo, useState } from "react";
import { CircularProgress, Modal } from "@mui/material";
import LoadingContext from "./LoadingContext";
import _ from "lodash";
import StyledLoadingBox from "./StyledLoadingBox";

interface LoadingManagerProps {
  children: React.ReactNode;
}

const LoadingManager: React.FC<LoadingManagerProps> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const loadingBuffer: string[] = useMemo(() => [], []);

  const startLoading = (loadingName: string) => {
    loadingBuffer.push(loadingName);
    if (!open) {
      setOpen(true);
    }
  };

  /**
   * please remember using the same loadingName used in startLoading
   * @param loadingName
   */
  const endLoading = (loadingName: string) => {
    const index = _.findIndex(loadingBuffer, (name) => name === loadingName);
    if (index === -1) {
      throw new Error("Loading name not found");
    }
    _.pullAt(loadingBuffer, index);
    if (loadingBuffer.length === 0) {
      setOpen(false);
    }
  };

  return (
    <LoadingContext.Provider value={{ startLoading, endLoading }}>
      <Modal open={open}>
        <StyledLoadingBox>
          <CircularProgress size={80} thickness={6} />
        </StyledLoadingBox>
      </Modal>
      {children}
    </LoadingContext.Provider>
  );
};

export default LoadingManager;
