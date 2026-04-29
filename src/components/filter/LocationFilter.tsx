import React, {
  FC,
  SyntheticEvent,
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ReplayIcon from "@mui/icons-material/Replay";
import { color, fontSize, gap, padding } from "../../styles/constants";
import {
  ParameterState,
  updateFilterPolygon,
} from "../common/store/componentParamReducer";
import { useAppDispatch } from "../common/store/hooks";
import { bbox, booleanEqual, featureCollection, union } from "@turf/turf";
import {
  fetchAllenCoralAtlasOptions,
  fetchMarineEcoregionOptions,
  fetchMarineParkOptions,
  STATIC_LAYER_LABEL_LAYOUT,
  STATIC_LAYER_LABEL_PAINT,
} from "../map/mapbox/layers/StaticLayer";
import { MapDefaultConfig } from "../map/mapbox/constants";
import { TestHelper } from "../common/test/helper";
import { cqlDefaultFilters, PolygonOperation } from "../common/cqlFilters";
import useBreakpoint from "../../hooks/useBreakpoint";
import ReactMap from "../map/mapbox/Map";
import MapContext from "../map/mapbox/MapContext";
import Controls from "../map/mapbox/controls/Controls";
import NavigationControl from "../map/mapbox/controls/NavigationControl";
import { LngLatBounds } from "mapbox-gl";
import ScaleControl from "../map/mapbox/controls/ScaleControl";
import DisplayCoordinate from "../map/mapbox/controls/DisplayCoordinate";
import MenuControlGroup from "../map/mapbox/controls/menu/MenuControlGroup";
import BaseMapSwitcher from "../map/mapbox/controls/menu/BaseMapSwitcher";
import MenuControl from "../map/mapbox/controls/menu/MenuControl";
import DrawRect from "../map/mapbox/controls/menu/DrawRect";
import theme from "../../styles/themeRC8";
import { cssFontFamilyToMapboxTextFont } from "../../utils/MapUtils";
import { portalTheme } from "../../styles";
import StyledTabs from "../common/tab/StyledTabs";
import StyledTab from "../common/tab/StyledTab";
import store, { getComponentState } from "../common/store/store";
import { Feature, FeatureCollection, Polygon } from "geojson";
import { stringToColor } from "../common/colors/colorsUtils";

const MAP_ID = "location-filter-map";

const MARINE_PARK_GROUP_VALUE = "australian-marine-parks";

type LocationFilterMode = "marineEcoregion" | "allenCoralAtlas" | "marinePark";

interface LocationOptionType {
  value: string;
  label: string;
  geo?: FeatureCollection<Polygon>;
}

interface LocationFilterProps {
  handleClosePopup: () => void;
}

const SelectedAreaLayer: FC<{
  areas: FeatureCollection<Polygon> | undefined;
}> = ({ areas }) => {
  const { map } = React.useContext(MapContext);

  useEffect(() => {
    if (!map) return;

    const sourceId = "selected-area-source";
    const layerId = "selected-area-layer";
    const labelLayerId = "selected-area-label-layer";

    const addLayer = () => {
      const data = areas?.features?.length
        ? areas
        : { type: "FeatureCollection" as const, features: [] };

      if (!map.getSource(sourceId)) {
        map.addSource(sourceId, {
          type: "geojson",
          data,
        });

        map.addLayer({
          id: layerId,
          type: "fill",
          source: sourceId,
          paint: {
            "fill-color": stringToColor(layerId),
            "fill-outline-color": "black",
          },
        });

        map.addLayer({
          id: labelLayerId,
          type: "symbol",
          source: sourceId,
          layout: {
            ...STATIC_LAYER_LABEL_LAYOUT,
            "text-field": ["get", "name"],
            "text-font": cssFontFamilyToMapboxTextFont(
              theme.typography.body2Regular.fontFamily,
              { fontWeight: theme.typography.body2Regular.fontWeight }
            ),
          },
          paint: STATIC_LAYER_LABEL_PAINT,
        });
      } else {
        (
          map.getSource(sourceId) as { setData: (d: typeof data) => void }
        ).setData(data);
      }
    };

    if (map.isStyleLoaded()) {
      addLayer();
    } else {
      map.once("styledata", addLayer);
    }

    return () => {
      map.off("styledata", addLayer);
    };
  }, [map, areas]);

  return null;
};

const LocationCheckboxList: FC<{
  options: LocationOptionType[];
  selectedValues: Set<string>;
  onToggle: (value: string, checked: boolean) => void;
  testId: string;
  isMobile?: boolean;
}> = ({ options, selectedValues, onToggle, testId, isMobile }) => (
  <Box
    data-testid={testId}
    sx={{
      width: "100%",
      maxHeight: isMobile ? "calc(100vh - 380px)" : "450px",
      minHeight: 0,
      overflowY: "auto",
      overflowX: "hidden",
    }}
  >
    <FormGroup
      sx={{
        display: "flex",
        flexDirection: "column",
        flexWrap: "nowrap",
        alignItems: "stretch",
        width: "100%",
      }}
    >
      {options.map((item) => (
        <FormControlLabel
          key={item.value}
          control={
            <Checkbox
              checked={selectedValues.has(item.value)}
              onChange={(_, checked) => onToggle(item.value, checked)}
              data-testid={`checkbox-item-${item.value}`}
              sx={{
                "&.Mui-checked": {
                  color: theme.palette.primary1,
                },
                "&:not(.Mui-checked)": {
                  color: theme.palette.primary1,
                },
              }}
            />
          }
          label={item.label}
          sx={{
            marginLeft: 0,
            marginRight: 0,
            alignItems: "flex-start",
            width: "100%",
            ".MuiFormControlLabel-label": {
              fontFamily: theme.typography.slogan3.fontFamily,
              fontSize: theme.typography.slogan3.fontSize,
              color: theme.palette.text2,
              whiteSpace: "normal",
              wordBreak: "break-word",
            },
          }}
        />
      ))}
    </FormGroup>
  </Box>
);

const modeRadios: { value: LocationFilterMode; label: string }[] = [
  { value: "marinePark", label: "Australian Marine Parks" },
  { value: "allenCoralAtlas", label: "Allen Coral Atlas" },
  { value: "marineEcoregion", label: "Marine Ecoregions of the World" },
];

const LocationFilter: FC<LocationFilterProps> = ({ handleClosePopup }) => {
  const dispatch = useAppDispatch();
  const { isMobile } = useBreakpoint();
  const [filterMode, setFilterMode] =
    useState<LocationFilterMode>("marinePark");
  const [marineParkOptions, setMarineParkOptions] = useState<
    LocationOptionType[]
  >([]);
  const [selectedMarineParkValues, setSelectedMarineParkValues] = useState<
    Set<string>
  >(new Set());
  const [marineEcoregionOptions, setMarineEcoregionOptions] = useState<
    LocationOptionType[]
  >([]);
  const [selectedMarineEcoregionValues, setSelectedMarineEcoregionValues] =
    useState<Set<string>>(new Set());
  const [allenCoralAtlasOptions, setAllenCoralAtlasOptions] = useState<
    LocationOptionType[]
  >([]);
  const [selectedAllenCoralAtlasValues, setSelectedAllenCoralAtlasValues] =
    useState<Set<string>>(new Set());
  const [drawFeatures, setDrawFeatures] = useState<Feature<Polygon>[]>([]);

  const componentParam: ParameterState = getComponentState(store.getState());
  useEffect(() => {
    let cancelled = false;
    fetchMarineParkOptions(true)
      .then((opts) => {
        if (!cancelled) setMarineParkOptions(opts);
      })
      .catch((error) => {
        console.error("Error fetching Marine Park JSON:", error);
      });
    fetchMarineEcoregionOptions(true)
      .then((opts) => {
        if (!cancelled) setMarineEcoregionOptions(opts);
      })
      .catch((error) => {
        console.error("Error fetching Marine Ecoregion JSON:", error);
      });
    fetchAllenCoralAtlasOptions(true)
      .then((opts) => {
        if (!cancelled) setAllenCoralAtlasOptions(opts);
      })
      .catch((error) => {
        console.error("Error fetching Allen Coral Atlas JSON:", error);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const applyCombinedGeoSelections = useCallback(
    (
      parks: Set<string>,
      ecoregions: Set<string>,
      coralAtlas: Set<string>,
      draws: Feature<Polygon>[]
    ) => {
      const parkFeatures = marineParkOptions
        .filter((o) => parks.has(o.value))
        .map((o) => o.geo!.features[0]);

      const ecoregionFeatures = marineEcoregionOptions
        .filter((o) => ecoregions.has(o.value))
        .map((o) => o.geo!.features[0]);

      const coralFeatures = allenCoralAtlasOptions
        .filter((o) => coralAtlas.has(o.value))
        .map((o) => o.geo!.features[0]);

      const allFeatures = [
        ...parkFeatures,
        ...ecoregionFeatures,
        ...coralFeatures,
        ...draws,
      ];

      if (allFeatures.length === 0) {
        dispatch(updateFilterPolygon(undefined));
        return;
      } else if (allFeatures.length === 1) {
        dispatch(updateFilterPolygon(allFeatures[0]));
      } else {
        const merged = union(featureCollection(allFeatures));
        if (merged) {
          dispatch(updateFilterPolygon(merged));
        }
      }
    },
    [
      dispatch,
      marineParkOptions,
      marineEcoregionOptions,
      allenCoralAtlasOptions,
    ]
  );

  const handleFilterModeChange = useCallback(
    (_: SyntheticEvent, newValue: number) => {
      const mode = modeRadios[newValue].value;
      setFilterMode(mode);
    },
    []
  );

  const handleMarineParkCheckboxChange = useCallback(
    (parkValue: string, checked: boolean) => {
      setSelectedMarineParkValues((prev) => {
        const next = new Set(prev);
        if (checked) next.add(parkValue);
        else next.delete(parkValue);
        applyCombinedGeoSelections(
          next,
          selectedMarineEcoregionValues,
          selectedAllenCoralAtlasValues,
          drawFeatures
        );
        return next;
      });
    },
    [
      applyCombinedGeoSelections,
      selectedMarineEcoregionValues,
      selectedAllenCoralAtlasValues,
      drawFeatures,
    ]
  );

  const handleMarineEcoregionCheckboxChange = useCallback(
    (ecoregionValue: string, checked: boolean) => {
      setSelectedMarineEcoregionValues((prev) => {
        const next = new Set(prev);
        if (checked) next.add(ecoregionValue);
        else next.delete(ecoregionValue);
        applyCombinedGeoSelections(
          selectedMarineParkValues,
          next,
          selectedAllenCoralAtlasValues,
          drawFeatures
        );
        return next;
      });
    },
    [
      applyCombinedGeoSelections,
      selectedMarineParkValues,
      selectedAllenCoralAtlasValues,
      drawFeatures,
    ]
  );

  const handleAllenCoralAtlasCheckboxChange = useCallback(
    (coralValue: string, checked: boolean) => {
      setSelectedAllenCoralAtlasValues((prev) => {
        const next = new Set(prev);
        if (checked) next.add(coralValue);
        else next.delete(coralValue);
        applyCombinedGeoSelections(
          selectedMarineParkValues,
          selectedMarineEcoregionValues,
          next,
          drawFeatures
        );
        return next;
      });
    },
    [
      applyCombinedGeoSelections,
      selectedMarineParkValues,
      selectedMarineEcoregionValues,
      drawFeatures,
    ]
  );

  const handleClear = useCallback(() => {
    dispatch(updateFilterPolygon(undefined));
    setSelectedMarineParkValues(new Set());
    setSelectedMarineEcoregionValues(new Set());
    setSelectedAllenCoralAtlasValues(new Set());
  }, [dispatch]);

  const handleClose = useCallback(() => {
    handleClosePopup();
  }, [handleClosePopup]);

  const handleFeaturesChange = useCallback(
    (newFeatures: Feature<Polygon>[], removeFeature: (id: string) => void) => {
      setDrawFeatures(newFeatures);
      applyCombinedGeoSelections(
        selectedMarineParkValues,
        selectedMarineEcoregionValues,
        selectedAllenCoralAtlasValues,
        newFeatures
      );
    },
    [
      applyCombinedGeoSelections,
      selectedMarineParkValues,
      selectedMarineEcoregionValues,
      selectedAllenCoralAtlasValues,
    ]
  );

  useEffect(() => {
    const p = componentParam.polygon;
    if (!p) {
      if (filterMode === "marinePark") {
        startTransition(() => setSelectedMarineParkValues(new Set()));
      } else if (filterMode === "marineEcoregion") {
        startTransition(() => setSelectedMarineEcoregionValues(new Set()));
      } else if (filterMode === "allenCoralAtlas") {
        startTransition(() => setSelectedAllenCoralAtlasValues(new Set()));
      }
      return;
    }

    // Try to find matching parks
    const matchingParks = marineParkOptions
      .filter(
        (o) =>
          o.geo?.features[0] &&
          booleanEqual(o.geo.features[0], p as Feature<Polygon>)
      )
      .map((o) => o.value);

    // Try to find matching ecoregions
    const matchingEcoregions = marineEcoregionOptions
      .filter(
        (o) =>
          o.geo?.features[0] &&
          booleanEqual(o.geo.features[0], p as Feature<Polygon>)
      )
      .map((o) => o.value);

    // Try to find matching coral atlas regions
    const matchingCoralAtlas = allenCoralAtlasOptions
      .filter(
        (o) =>
          o.geo?.features[0] &&
          booleanEqual(o.geo.features[0], p as Feature<Polygon>)
      )
      .map((o) => o.value);

    if (matchingParks.length > 0) {
      startTransition(() =>
        setSelectedMarineParkValues(new Set(matchingParks))
      );
    }
    if (matchingEcoregions.length > 0) {
      startTransition(() =>
        setSelectedMarineEcoregionValues(new Set(matchingEcoregions))
      );
    }
    if (matchingCoralAtlas.length > 0) {
      startTransition(() =>
        setSelectedAllenCoralAtlasValues(new Set(matchingCoralAtlas))
      );
    }
  }, [
    componentParam.polygon,
    marineParkOptions,
    marineEcoregionOptions,
    allenCoralAtlasOptions,
    filterMode,
  ]);

  const highlightCollection = useMemo(():
    | FeatureCollection<Polygon>
    | undefined => {
    const allFeats: Feature<Polygon>[] = [];

    if (selectedMarineParkValues.size > 0) {
      marineParkOptions
        .filter((o) => selectedMarineParkValues.has(o.value))
        .forEach((o) => {
          const feature = o.geo!.features[0];
          allFeats.push({
            ...feature,
            properties: {
              ...feature.properties,
              name: feature.properties?.RESNAME ?? o.label,
            },
          });
        });
    }

    if (selectedMarineEcoregionValues.size > 0) {
      marineEcoregionOptions
        .filter((o) => selectedMarineEcoregionValues.has(o.value))
        .forEach((o) => {
          const feature = o.geo!.features[0];
          allFeats.push({
            ...feature,
            properties: {
              ...feature.properties,
              name: feature.properties?.ECOREGION ?? o.label,
            },
          });
        });
    }

    if (selectedAllenCoralAtlasValues.size > 0) {
      allenCoralAtlasOptions
        .filter((o) => selectedAllenCoralAtlasValues.has(o.value))
        .forEach((o) => {
          const feature = o.geo!.features[0];
          allFeats.push({
            ...feature,
            properties: {
              ...feature.properties,
              name: feature.properties?.ECOREGION ?? o.label,
            },
          });
        });
    }

    if (allFeats.length === 0) return undefined;
    return { type: "FeatureCollection", features: allFeats };
  }, [
    marineParkOptions,
    selectedMarineParkValues,
    marineEcoregionOptions,
    selectedMarineEcoregionValues,
    allenCoralAtlasOptions,
    selectedAllenCoralAtlasValues,
  ]);

  const mapBbox = useMemo(() => {
    const parkFeats = marineParkOptions
      .filter((o) => selectedMarineParkValues.has(o.value))
      .map((o) => o.geo!.features[0]);

    const ecoregionFeats = marineEcoregionOptions
      .filter((o) => selectedMarineEcoregionValues.has(o.value))
      .map((o) => o.geo!.features[0]);

    const coralFeats = allenCoralAtlasOptions
      .filter((o) => selectedAllenCoralAtlasValues.has(o.value))
      .map((o) => o.geo!.features[0]);

    const allFeats = [...parkFeats, ...ecoregionFeats, ...coralFeats];

    if (allFeats.length === 0) return undefined;
    const bounds =
      allFeats.length === 1
        ? bbox(allFeats[0])
        : bbox(featureCollection(allFeats));
    return new LngLatBounds([bounds[0], bounds[1]], [bounds[2], bounds[3]]);
  }, [
    marineParkOptions,
    selectedMarineParkValues,
    marineEcoregionOptions,
    selectedMarineEcoregionValues,
    allenCoralAtlasOptions,
    selectedAllenCoralAtlasValues,
  ]);

  const mergedPolygonForTests = useMemo(() => {
    const parkFeats = marineParkOptions
      .filter((o) => selectedMarineParkValues.has(o.value))
      .map((o) => o.geo!.features[0]);

    const ecoregionFeats = marineEcoregionOptions
      .filter((o) => selectedMarineEcoregionValues.has(o.value))
      .map((o) => o.geo!.features[0]);

    const coralFeats = allenCoralAtlasOptions
      .filter((o) => selectedAllenCoralAtlasValues.has(o.value))
      .map((o) => o.geo!.features[0]);

    const allFeats = [...parkFeats, ...ecoregionFeats, ...coralFeats];

    if (allFeats.length === 0) return undefined;
    if (allFeats.length === 1) return allFeats[0];
    return union(featureCollection(allFeats)) ?? undefined;
  }, [
    marineParkOptions,
    selectedMarineParkValues,
    marineEcoregionOptions,
    selectedMarineEcoregionValues,
    allenCoralAtlasOptions,
    selectedAllenCoralAtlasValues,
  ]);

  if (marineParkOptions.length === 0) return null;

  return (
    <Box sx={{ position: "relative", width: "100%" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          backgroundColor: portalTheme.palette.primary6,
          pt: "12px",
          pr: "12px",
          gap: "8px",
        }}
      >
        <IconButton
          onClick={handleClear}
          sx={{
            bgcolor: color.gray.extraLight,
            "&:hover": {
              bgcolor: color.blue.darkSemiTransparent,
            },
          }}
        >
          <ReplayIcon sx={{ fontSize: fontSize.info }} />
        </IconButton>
        <IconButton
          onClick={handleClose}
          sx={{
            bgcolor: color.gray.extraLight,
            "&:hover": {
              bgcolor: color.blue.darkSemiTransparent,
            },
          }}
        >
          <CloseIcon sx={{ fontSize: fontSize.info }} />
        </IconButton>
      </Box>

      <StyledTabs
        value={modeRadios.findIndex((m) => m.value === filterMode)}
        onChange={handleFilterModeChange}
        sx={{
          backgroundColor: portalTheme.palette.primary6,
          px: isMobile ? "12px" : "28px",
        }}
      >
        {modeRadios.map((m) => {
          let hasSelection = false;
          if (m.value === "marinePark")
            hasSelection = selectedMarineParkValues.size > 0;
          if (m.value === "marineEcoregion")
            hasSelection = selectedMarineEcoregionValues.size > 0;
          if (m.value === "allenCoralAtlas")
            hasSelection = selectedAllenCoralAtlasValues.size > 0;

          return (
            <StyledTab
              key={m.value}
              label={m.label}
              showBadge={hasSelection}
              sx={{ textTransform: "none" }}
            />
          );
        })}
      </StyledTabs>

      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          width: "100%",
          padding: padding.large,
          gap: padding.large,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flex: isMobile ? 1 : "0 0 280px",
            gap: gap.md,
            minWidth: 0,
            minHeight: 0,
          }}
        >
          {filterMode === "marinePark" && (
            <LocationCheckboxList
              options={marineParkOptions}
              selectedValues={selectedMarineParkValues}
              onToggle={handleMarineParkCheckboxChange}
              testId="marine-park-checkbox-scroll"
              isMobile={isMobile}
            />
          )}
          {filterMode === "marineEcoregion" && (
            <LocationCheckboxList
              options={marineEcoregionOptions}
              selectedValues={selectedMarineEcoregionValues}
              onToggle={handleMarineEcoregionCheckboxChange}
              testId="marine-ecoregion-checkbox-scroll"
              isMobile={isMobile}
            />
          )}
          {filterMode === "allenCoralAtlas" && (
            <LocationCheckboxList
              options={allenCoralAtlasOptions}
              selectedValues={selectedAllenCoralAtlasValues}
              onToggle={handleAllenCoralAtlasCheckboxChange}
              testId="allen-coral-atlas-checkbox-scroll"
              isMobile={isMobile}
            />
          )}
        </Box>

        {!isMobile && (
          <Box
            id={MAP_ID}
            sx={{ flex: 1, minHeight: "400px", position: "relative" }}
          >
            <ReactMap
              panelId={MAP_ID}
              bbox={mapBbox}
              zoom={MapDefaultConfig.ZOOM - 1}
            >
              <Controls>
                <SelectedAreaLayer areas={highlightCollection} />
                <NavigationControl />
                <ScaleControl />
                <DisplayCoordinate />
                <MenuControlGroup>
                  <MenuControl menu={<BaseMapSwitcher />} />
                  <MenuControl
                    menu={
                      <DrawRect
                        features={drawFeatures}
                        onChangeFeatures={handleFeaturesChange}
                      />
                    }
                  />
                </MenuControlGroup>
              </Controls>
            </ReactMap>
          </Box>
        )}
      </Box>

      <TestHelper
        id="selected-location"
        getSelectedLocationIntersects={() => {
          const funcIntersectPolygon = cqlDefaultFilters.get(
            "INTERSECT_POLYGON"
          ) as PolygonOperation;
          return mergedPolygonForTests
            ? funcIntersectPolygon(mergedPolygonForTests)
            : undefined;
        }}
      />
    </Box>
  );
};

export default LocationFilter;
