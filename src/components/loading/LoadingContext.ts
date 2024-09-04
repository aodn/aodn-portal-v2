import { createContext, useContext } from "react";

interface LoadingContextType {
  startLoading: (loadingName: string) => void;
  endLoading: (loadingName: string) => void;
}

const defaultFunction = (loadingName: string) => {
  console.log("DEFAULT LOADING CONTEXT FUNC:", loadingName);
};

const LoadingContext = createContext<LoadingContextType>({
  startLoading: defaultFunction,
  endLoading: defaultFunction,
});

const useLoadingContext = () => useContext(LoadingContext);

export { useLoadingContext };
export default LoadingContext;
