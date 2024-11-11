import {
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { LngLatBounds, MapboxEvent as MapEvent } from "mapbox-gl";
import { bboxPolygon, booleanEqual } from "@turf/turf";
import { SearchPageContext } from "./SearchPageContext";
import { SearchResultLayoutEnum } from "../../../components/common/buttons/ResultListLayoutButton";
import { SortResultEnum } from "../../../components/common/buttons/ResultListSortButton";
import { useAppDispatch } from "../../../components/common/store/hooks";
import {
  formatToUrlParam,
  ParameterState,
  unFlattenToParameterState,
  updateFilterPolygon,
  updateParameterStates,
  updateSortBy,
  updateZoom,
} from "../../../components/common/store/componentParamReducer";
import store, {
  getComponentState,
} from "../../../components/common/store/store";
import {
  createSearchParamFrom,
  DEFAULT_SEARCH_PAGE,
  fetchResultNoStore,
  fetchResultWithStore,
  SearchParameters,
} from "../../../components/common/store/searchReducer";
import { useLocation, useNavigate } from "react-router-dom";
import {
  OGCCollection,
  OGCCollections,
} from "../../../components/common/store/OGCCollectionDefinitions";
import { pageDefault } from "../../../components/common/constants";
import { checkLoading, createFilterString } from "./utils";

interface SearchPageProviderProps {
  children: ReactNode;
}

const REFERER = "SEARCH_PAGE";

const SearchPageProvider: FC<SearchPageProviderProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Layers contains record with uuid and bbox only
  const [layers, setLayers] = useState<Array<OGCCollection>>([]);

  // State to store the layout that user selected
  const [selectedLayout, setSelectedLayout] = useState<SearchResultLayoutEnum>(
    SearchResultLayoutEnum.LIST
  );

  // CurrentLayout is used to remember last layout, which is SearchResultLayoutEnum exclude the value FULL_MAP
  const [currentLayout, setCurrentLayout] = useState<Exclude<
    SearchResultLayoutEnum,
    SearchResultLayoutEnum.FULL_MAP
  > | null>(null);

  // State to store the sort option that user selected
  const [currentSort, setCurrentSort] = useState<SortResultEnum | null>(null);

  const [bbox, setBbox] = useState<LngLatBounds | undefined>(undefined);

  const [zoom, setZoom] = useState<number | undefined>(undefined);

  // selectedUuid is the uuid of a selected dataset when user click on a result card or dot on map
  // it is an array of string but only contains one element, since the click of map dot returns an array of features
  const [selectedUuid, setSelectedUuid] = useState<Array<string>>([]);

  // selectedDataset is the dataset of the selectedUuid when user click on a result card or dot on map
  // it is an array of OGCCollection but only contains one element (if only one selectedUuid)
  const [selectedDataset, setDatasetSelected] = useState<OGCCollection[]>([]);

  const [pinList, setPinList] = useState<OGCCollection[]>([]);

  const [loadingThreadCount, setLoadingThreadCount] = useState<number>(0);

  const startOneLoadingThread = useCallback(() => {
    setLoadingThreadCount((prev) => prev + 1);
  }, []);

  const endOneLoadingThread = useCallback(() => {
    setLoadingThreadCount((prev) => prev - 1);
  }, []);

  const doMapSearch = useCallback(() => {
    const componentParam: ParameterState = getComponentState(store.getState());

    // Use a different parameter so that it return id and bbox only and do not store the values,
    // we cannot add page because we want to show all record on map
    const paramNonPaged = createSearchParamFrom(componentParam);
    return dispatch(
      // add param "sortby: id" for fetchResultNoStore to ensure data source for map is always sorted
      // and ordered by uuid to avoid affecting cluster calculation
      fetchResultNoStore({
        ...paramNonPaged,
        properties: "id,centroid",
        sortby: "id",
      })
    )
      .unwrap()
      .then((collections) => {
        setLayers(collections.collections);
      });
  }, [dispatch]);

  const doSearch = useCallback(
    (needNavigate: boolean = true) => {
      startOneLoadingThread();
      const componentParam: ParameterState = getComponentState(
        store.getState()
      );

      // Use standard param to get fields you need, record is stored in redux,
      // set page so that it returns fewer records
      const paramPaged = createSearchParamFrom(componentParam, {
        pagesize: DEFAULT_SEARCH_PAGE,
      });

      dispatch(fetchResultWithStore(paramPaged));
      doMapSearch()
        .then(() => {
          if (needNavigate) {
            navigate(
              pageDefault.search + "?" + formatToUrlParam(componentParam),
              {
                state: {
                  fromNavigate: true,
                  requireSearch: false,
                  referer: REFERER,
                },
              }
            );
          }
        })
        .finally(() => {
          endOneLoadingThread();
        });
    },
    [
      startOneLoadingThread,
      dispatch,
      doMapSearch,
      navigate,
      endOneLoadingThread,
    ]
  );

  // The result will be changed based on the zoomed area, that is only
  // dataset where spatial extends fall into the zoomed area will be selected.
  const onMapZoomOrMove = useCallback(
    (event: MapEvent<MouseEvent | WheelEvent | TouchEvent | undefined>) => {
      if (event.type === "zoomend" || event.type === "moveend") {
        const componentParam: ParameterState = getComponentState(
          store.getState()
        );

        const bounds = event.target.getBounds();
        const ne = bounds.getNorthEast(); // NorthEast corner
        const sw = bounds.getSouthWest(); // SouthWest corner
        // Note order: longitude, latitude.2
        const polygon = bboxPolygon([sw.lng, sw.lat, ne.lng, ne.lat]);

        // Sometimes the map fire zoomend even nothing happens, this may
        // due to some redraw, so in here we check if the polygon really
        // changed, if not then there is no need to do anything
        if (
          componentParam.polygon &&
          !booleanEqual(componentParam.polygon, polygon)
        ) {
          setBbox(bounds);
          setZoom(event.target.getZoom());
          dispatch(updateFilterPolygon(polygon));
          dispatch(updateZoom(event.target.getZoom()));
          doSearch();
        }
      }
    },
    [dispatch, doSearch]
  );

  // If this flag is set, that means it is call from within react
  // and the search status already refresh and useSelector contains
  // the correct values, else it is user paste the url directly
  // and content may not refresh
  const handleNavigation = useCallback(() => {
    if (!location.state?.fromNavigate) {
      // The first char is ? in the search string, so we need to remove it.
      const param = location?.search.substring(1);
      if (param !== null) {
        const paramState: ParameterState = unFlattenToParameterState(param);
        dispatch(updateParameterStates(paramState));
        // URL request, we need to adjust the map to the same area as mentioned
        // in the url
        setBbox(
          new LngLatBounds(
            paramState.polygon?.bbox as [number, number, number, number]
          )
        );
        setZoom(paramState.zoom);

        doSearch();
      }
    } else {
      if (location.state?.requireSearch) {
        // Explicitly call search from navigation, so you just need search
        // but do not navigate again.
        doSearch(false);
      }
      // If it is navigate from this component, and no need to search, that
      // mean we already call doSearch() + doMapSearch(), however if you
      // come from other page, the result list is good because we remember it
      // but the map need init again and therefore need to do a doMapSearch()
      else if (location.state?.referer !== REFERER) {
        const componentParam: ParameterState = getComponentState(
          store.getState()
        );
        setBbox(
          new LngLatBounds(
            componentParam.polygon?.bbox as [number, number, number, number]
          )
        );
        setZoom(componentParam.zoom);

        startOneLoadingThread();
        doMapSearch().finally(() => {
          endOneLoadingThread();
        });
      }
    }
  }, [
    location,
    dispatch,
    doSearch,
    doMapSearch,
    startOneLoadingThread,
    endOneLoadingThread,
  ]);

  // You will see this trigger twice, this is due to use of strict-mode
  // which is ok.
  // TODO: Optimize call if possible, this happens when navigate from page
  // to this page.
  useEffect(() => handleNavigation(), [handleNavigation]);

  // Value true meaning full map. So if true set the selected layout as full-map
  // Else set the selected layout as the last layout remembered (stored in currentLayout)
  // or LIST view by default if user hasn't chosen any view mode
  const onToggleDisplay = useCallback(
    (value: boolean) => {
      setSelectedLayout(
        value
          ? SearchResultLayoutEnum.FULL_MAP
          : currentLayout || SearchResultLayoutEnum.LIST
      );
    },
    [currentLayout]
  );

  const onChangeSorting = useCallback(
    (sort: SortResultEnum) => {
      setCurrentSort(sort);
      switch (sort) {
        case SortResultEnum.RELEVANT:
          dispatch(
            updateSortBy([
              { field: "score", order: "DESC" },
              { field: "rank", order: "DESC" },
            ])
          );
          break;

        case SortResultEnum.TITLE:
          dispatch(
            updateSortBy([
              { field: "title", order: "ASC" },
              { field: "rank", order: "DESC" },
            ])
          );
          break;

        case SortResultEnum.POPULARITY:
          //TODO: need ogcapi change
          break;

        case SortResultEnum.MODIFIED:
          dispatch(
            updateSortBy([
              { field: "temporal", order: "DESC" },
              { field: "rank", order: "DESC" },
            ])
          );
          break;
      }

      doSearch();
    },
    [dispatch, doSearch]
  );

  const onChangeLayout = useCallback(
    (layout: SearchResultLayoutEnum) => {
      setSelectedLayout(layout);
      // If user select layout full map, just return so the last selected layout is not changed in currentLayout
      if (layout === SearchResultLayoutEnum.FULL_MAP) return;
      setCurrentLayout(layout);
    },
    [setCurrentLayout]
  );

  const isLoading = useMemo(
    () => checkLoading(loadingThreadCount),
    [loadingThreadCount]
  );

  const getCollectionsData = useCallback(
    async (uuids: Array<string>): Promise<void | OGCCollection[]> => {
      const uuidsString = createFilterString(uuids);
      // if uuids array is an empty array, no need fetch collection data
      if (uuidsString.length === 0) return;
      const param: SearchParameters = {
        filter: uuidsString,
      };
      return dispatch(fetchResultNoStore(param))
        .unwrap()
        .then((res: OGCCollections) => {
          setDatasetSelected(res.collections);
        })
        .catch((error: any) => {
          console.error("Error fetching collection data:", error);
          // TODO: handle error in ErrorBoundary
        });
    },
    [dispatch]
  );

  // On select a dataset, update the states: selected uuid(s) and get the collection data
  const onSelectDataset = useCallback(
    (uuids: Array<string>) => {
      if (uuids.length === 0) {
        setSelectedUuid([]);
        setDatasetSelected([]);
      }
      setSelectedUuid(uuids);
      getCollectionsData(uuids);
    },
    [getCollectionsData]
  );

  const onClickCard = useCallback(
    (uuid: string) => {
      onSelectDataset([uuid]);
    },
    [onSelectDataset]
  );

  return (
    <SearchPageContext.Provider
      value={{
        currentSort,
        onChangeSorting,
        currentLayout,
        onChangeLayout,
        onToggleDisplay,
        selectedLayout,
        layers,
        onMapZoomOrMove,
        bbox,
        zoom,
        isLoading,
        onClickCard,
        selectedDataset,
        onSelectDataset,
        selectedUuid,
      }}
    >
      {children}
    </SearchPageContext.Provider>
  );
};

export default SearchPageProvider;
