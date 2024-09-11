import StyledLoadingBox from "./StyledLoadingBox";
import { Box, CircularProgress, Modal } from "@mui/material";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import loadingEmitter from "./LoadingEmitter";
import { EventName } from "./EventName";

interface LoadingManagerProps {
  children?: React.ReactNode;
}

const LoadingManager: React.FC<LoadingManagerProps> = ({ children }) => {
  const loadingBuffer = useMemo((): string[] => [], []);
  const [isLoading, setIsLoading] = useState(false);

  const checkState = useCallback(() => {
    console.log("aaa buffer", loadingBuffer);
    if (loadingBuffer.length > 0) {
      setIsLoading(true);
      console.log("aaa set loading true");
    }
    if (loadingBuffer.length === 0) {
      setIsLoading(false);
      console.log("aaa set loading false");
    }
  }, [loadingBuffer]);

  useEffect(() => {
    console.log("aaa isloading", isLoading);
  }, [isLoading]);

  const startLoadingHandler = useCallback(
    (loadingName: string) => {
      loadingBuffer.push(loadingName);
      checkState();
    },
    [checkState, loadingBuffer]
  );

  const endLoadingHandler = useCallback(
    (msg: string) => {
      const index = loadingBuffer.indexOf(msg);
      if (index !== -1) {
        loadingBuffer.splice(index, 1);
      }
      checkState();
    },
    [checkState, loadingBuffer]
  );

  const startUniqueLoadingHandler = useCallback(
    (loadingName: string) => {
      if (loadingBuffer.includes(loadingName)) {
        return;
      }
      startLoadingHandler(loadingName);
    },
    [loadingBuffer, startLoadingHandler]
  );

  useEffect(() => {
    loadingEmitter
      .on(EventName.START_LOADING, startLoadingHandler)
      .on(EventName.END_LOADING, endLoadingHandler)
      .on(EventName.START_UNIQUE_LOADING, startUniqueLoadingHandler);

    return () => {
      loadingEmitter
        .off(EventName.START_LOADING, startLoadingHandler)
        .off(EventName.END_LOADING, endLoadingHandler)
        .off(EventName.START_UNIQUE_LOADING, startUniqueLoadingHandler);
    };
  }, [
    checkState,
    startLoadingHandler,
    endLoadingHandler,
    loadingBuffer,
    startUniqueLoadingHandler,
  ]);

  return (
    <>
      <Modal open={isLoading}>
        <Box
          sx={{ width: "100%", height: "100%" }}
          data-testid="loading-progress"
        >
          <StyledLoadingBox>
            <CircularProgress />
          </StyledLoadingBox>
        </Box>
      </Modal>
      {children}
    </>
  );
};

export default LoadingManager;
