import React, {
  startTransition,
  useCallback,
  useEffect,
  useState,
} from "react";
import loadingManager from "./LoadingManager";
import { EventName } from "./enum/EventName";
import CircleLoader from "./CircleLoader";

interface GlobalLoaderProps {
  children?: React.ReactNode;
}

const GlobalLoader: React.FC<GlobalLoaderProps> = ({ children }) => {
  const [loadingBuffer, _] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const checkState = useCallback(() => {
    startTransition(() => {
      setIsLoading(loadingBuffer.length > 0);
    });
  }, [loadingBuffer]);

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
    loadingManager
      .subscribe(EventName.START_LOADING, startLoadingHandler)
      .subscribe(EventName.END_LOADING, endLoadingHandler)
      .subscribe(EventName.START_UNIQUE_LOADING, startUniqueLoadingHandler);

    return () => {
      loadingManager
        .unsubscribe(EventName.START_LOADING, startLoadingHandler)
        .unsubscribe(EventName.END_LOADING, endLoadingHandler)
        .unsubscribe(EventName.START_UNIQUE_LOADING, startUniqueLoadingHandler);
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
      <CircleLoader isLoading={isLoading} />
      {children}
    </>
  );
};

export default GlobalLoader;
