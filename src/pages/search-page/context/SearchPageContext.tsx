import { createContext, useContext } from "react";
import { LngLatBounds, MapboxEvent as MapEvent } from "mapbox-gl";
import { SortResultEnum } from "../../../components/common/buttons/ResultListSortButton";
import { SearchResultLayoutEnum } from "../../../components/common/buttons/ResultListLayoutButton";
import { OGCCollection } from "../../../components/common/store/OGCCollectionDefinitions";

interface SearchPageContextType {
  currentSort: SortResultEnum | null;
  onChangeSorting: (sort: SortResultEnum) => void;
  currentLayout: Exclude<
    SearchResultLayoutEnum,
    SearchResultLayoutEnum.FULL_MAP
  > | null;
  onChangeLayout: (layout: SearchResultLayoutEnum) => void;
  onToggleDisplay: (value: boolean) => void;
  selectedLayout: SearchResultLayoutEnum;
  layers: OGCCollection[];
  onMapZoomOrMove: (
    event: MapEvent<MouseEvent | WheelEvent | TouchEvent | undefined>
  ) => void;
  bbox: LngLatBounds | undefined;
  zoom: number | undefined;
  isLoading: boolean;
  onClickCard: (uuid: string) => void;
  datasetsSelected: OGCCollection[] | undefined;
  onSelectDataset: (uuids: Array<string>) => void;
  selectedUuids: string[];
}

const searchPageContextDefault = {
  currentSort: null,
  onChangeSorting: () => {},
  currentLayout: null,
  onChangeLayout: () => {},
  onToggleDisplay: () => {},
  selectedLayout: SearchResultLayoutEnum.LIST,
  layers: [] as OGCCollection[],
  onMapZoomOrMove: () => {},
  bbox: undefined,
  zoom: undefined,
  isLoading: false,
  onClickCard: () => {},
  datasetsSelected: undefined,
  onSelectDataset: () => {},
  selectedUuids: [],
};

export const SearchPageContext = createContext<SearchPageContextType>(
  searchPageContextDefault
);

export const useSearchPageContext = () => useContext(SearchPageContext);
