import { createContext, Dispatch, useContext } from "react";
import { OGCCollection } from "../../../components/common/store/searchReducer";

interface DetailPageContextType {
  collection: OGCCollection | undefined;
  setCollection: Dispatch<React.SetStateAction<OGCCollection | undefined>>;
}

const DetailPageContextDefault = {
  collection: {} as OGCCollection | undefined,
  setCollection: () => {},
};

export const DetailPageContext = createContext<DetailPageContextType>(
  DetailPageContextDefault
);

export const useDetailPageContext = () => useContext(DetailPageContext);
