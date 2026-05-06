import React, {
  FC,
  SyntheticEvent,
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  IconButton,
  alpha,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ReplayIcon from "@mui/icons-material/Replay";
import { color, fontSize, gap, padding } from "../../styles/constants";
import {
  ParameterState,
  SelectedStaticArea,
  updateFilterPolygon,
  updateFilterStaticAreas,
} from "../common/store/componentParamReducer";
import { useAppDispatch, useAppSelector } from "../common/store/hooks";
import { featureCollection, union } from "@turf/turf";
import {
  fetchAllenCoralAtlasOptions,
  fetchMarineEcoregionOptions,
  fetchMarineParkOptions,
  BoundaryName,
  BoundaryProperties,
  STATIC_LAYER_LABEL_LAYOUT,
  STATIC_LAYER_LABEL_PAINT,
} from "../map/mapbox/layers/StaticLayer";
import { TestHelper } from "../common/test/helper";
import { cqlDefaultFilters, PolygonOperation } from "../common/cqlFilters";
import useBreakpoint from "../../hooks/useBreakpoint";
import ReactMap from "../map/mapbox/Map";
import MapContext from "../map/mapbox/MapContext";
import Controls from "../map/mapbox/controls/Controls";
import NavigationControl from "../map/mapbox/controls/NavigationControl";
import ScaleControl from "../map/mapbox/controls/ScaleControl";
import DisplayCoordinate from "../map/mapbox/controls/DisplayCoordinate";
import MenuControlGroup from "../map/mapbox/controls/menu/MenuControlGroup";
import BaseMapSwitcher from "../map/mapbox/controls/menu/BaseMapSwitcher";
import MenuControl from "../map/mapbox/controls/menu/MenuControl";
import DrawRect from "../map/mapbox/controls/menu/DrawRect";
import { cssFontFamilyToMapboxTextFont } from "../../utils/MapUtils";
import { portalTheme as theme } from "../../styles";
import StyledTabs from "../common/tab/StyledTabs";
import StyledTab from "../common/tab/StyledTab";
import { Feature, FeatureCollection, MultiPolygon, Polygon } from "geojson";
import { stringToColor } from "../common/colors/colorsUtils";

const MAP_ID = "location-filter-map";

type LocationFilterMode = "marineEcoregion" | "allenCoralAtlas" | "marinePark";

interface LocationOptionType {
  boundaryName: string;
  value: string;
  label: string;
  geo?: FeatureCollection<Polygon | MultiPolygon, BoundaryProperties>;
}

interface LocationFilterProps {
  handleClosePopup: () => void;
}

const SelectedAreaLayer: FC<{
  areas: FeatureCollection<Polygon | MultiPolygon> | undefined;
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
    const onStyleData = () => {
      if (!map.getSource(sourceId)) {
        addLayer();
      }
    };

    if (map.isStyleLoaded()) {
      addLayer();
    } else {
      map.once("styledata", addLayer);
    }

    map.on("styledata", onStyleData);

    return () => {
      map.off("styledata", onStyleData);
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
      maxHeight: isMobile ? "calc(100vh - 360px)" : "400px",
      minHeight: 0,
      overflowY: "auto",
      overflowX: "hidden",
      scrollbarColor: `${theme.palette.primary1} ${alpha(theme.palette.primary1, 0.1)}`,
      "&::-webkit-scrollbar-thumb": {
        backgroundColor: theme.palette.primary1,
      },
      "&::-webkit-scrollbar-track": {
        backgroundColor: alpha(theme.palette.primary1, 0.1),
      },
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
              fontFamily: theme.typography.fontFamily,
              fontSize: theme.typography.fontSize,
              color: theme.palette.neutral1,
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
  // Must use useAppSelector instead of useMemo to subscribe to state changes
  const componentParam: ParameterState = useAppSelector((s) => s.paramReducer);
  const [filterMode, setFilterMode] =
    useState<LocationFilterMode>("marinePark");

  const [marineParkOptions, setMarineParkOptions] = useState<
    LocationOptionType[]
  >([]);
  const [marineEcoregionOptions, setMarineEcoregionOptions] = useState<
    LocationOptionType[]
  >([]);
  const [allenCoralAtlasOptions, setAllenCoralAtlasOptions] = useState<
    LocationOptionType[]
  >([]);

  const [selectedMarineParkValues, setSelectedMarineParkValues] = useState<
    Set<string>
  >(() => {
    const parkSet = new Set<string>();
    componentParam.staticAreas?.forEach((area) => {
      if (area.boundaryName === BoundaryName.AUSTRALIAN_MARINE_PARKS) {
        parkSet.add("" + area.value);
      }
    });
    return parkSet;
  });

  const [selectedMarineEcoregionValues, setSelectedMarineEcoregionValues] =
    useState<Set<string>>(() => {
      const ecoregionSet = new Set<string>();
      componentParam.staticAreas?.forEach((area) => {
        if (area.boundaryName === BoundaryName.MEOW) {
          ecoregionSet.add("" + area.value);
        }
      });
      return ecoregionSet;
    });

  const [selectedAllenCoralAtlasValues, setSelectedAllenCoralAtlasValues] =
    useState<Set<string>>(() => {
      const coralAtlasSet = new Set<string>();
      componentParam.staticAreas?.forEach((area) => {
        if (area.boundaryName === BoundaryName.CORAL_ATLAS) {
          coralAtlasSet.add("" + area.value);
        }
      });
      return coralAtlasSet;
    });
  const [drawFeatures, setDrawFeatures] = useState<
    Feature<Polygon | MultiPolygon>[]
  >(() => componentParam.polygon?.properties?.drawFeatures || []);
  const removeFeatureRef = useRef<((id: string) => void) | null>(null);

  const { isMobile } = useBreakpoint();
  useEffect(() => {
    let cancelled = false;
    fetchMarineParkOptions(false)
      .then((opts) => {
        if (!cancelled) setMarineParkOptions(opts);
      })
      .catch((error) => {
        console.error("Error fetching Marine Park JSON:", error);
      });
    fetchMarineEcoregionOptions(false)
      .then((opts) => {
        if (!cancelled) setMarineEcoregionOptions(opts);
      })
      .catch((error) => {
        console.error("Error fetching Marine Ecoregion JSON:", error);
      });
    fetchAllenCoralAtlasOptions(false)
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

  const getStaticAreasFromSets = useCallback(
    (
      parks: Set<string>,
      ecoregions: Set<string>,
      coralAtlas: Set<string>
    ): SelectedStaticArea[] => {
      const result: SelectedStaticArea[] = [];
      parks.forEach((v) =>
        result.push({
          boundaryName: BoundaryName.AUSTRALIAN_MARINE_PARKS,
          value: v,
        })
      );
      ecoregions.forEach((v) =>
        result.push({ boundaryName: BoundaryName.MEOW, value: v })
      );
      coralAtlas.forEach((v) =>
        result.push({ boundaryName: BoundaryName.CORAL_ATLAS, value: v })
      );
      return result;
    },
    []
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

        dispatch(
          updateFilterStaticAreas(
            getStaticAreasFromSets(
              next,
              selectedMarineEcoregionValues,
              selectedAllenCoralAtlasValues
            )
          )
        );
        return next;
      });
    },
    [
      dispatch,
      selectedMarineEcoregionValues,
      selectedAllenCoralAtlasValues,
      getStaticAreasFromSets,
    ]
  );

  const handleMarineEcoregionCheckboxChange = useCallback(
    (ecoregionValue: string, checked: boolean) => {
      setSelectedMarineEcoregionValues((prev) => {
        const next = new Set(prev);
        if (checked) next.add(ecoregionValue);
        else next.delete(ecoregionValue);

        dispatch(
          updateFilterStaticAreas(
            getStaticAreasFromSets(
              selectedMarineParkValues,
              next,
              selectedAllenCoralAtlasValues
            )
          )
        );
        return next;
      });
    },
    [
      dispatch,
      selectedMarineParkValues,
      selectedAllenCoralAtlasValues,
      getStaticAreasFromSets,
    ]
  );

  const handleAllenCoralAtlasCheckboxChange = useCallback(
    (coralValue: string, checked: boolean) => {
      setSelectedAllenCoralAtlasValues((prev) => {
        const next = new Set(prev);
        if (checked) next.add(coralValue);
        else next.delete(coralValue);

        dispatch(
          updateFilterStaticAreas(
            getStaticAreasFromSets(
              selectedMarineParkValues,
              selectedMarineEcoregionValues,
              next
            )
          )
        );
        return next;
      });
    },
    [
      dispatch,
      selectedMarineParkValues,
      selectedMarineEcoregionValues,
      getStaticAreasFromSets,
    ]
  );

  const handleClear = useCallback(() => {
    dispatch(updateFilterPolygon(undefined));
    dispatch(updateFilterStaticAreas([]));

    setSelectedMarineParkValues(new Set());
    setSelectedMarineEcoregionValues(new Set());
    setSelectedAllenCoralAtlasValues(new Set());

    // Clear drawn features from map and state
    if (removeFeatureRef.current) {
      drawFeatures.forEach((f) => {
        if (f.id) removeFeatureRef.current!(String(f.id));
      });
    }
    startTransition(() => setDrawFeatures([]));
  }, [dispatch, drawFeatures]);

  const handleClose = useCallback(() => {
    handleClosePopup();
  }, [handleClosePopup]);

  const handleFeaturesChange = useCallback(
    (
      newFeatures: Feature<Polygon | MultiPolygon>[],
      removeFeature: (id: string) => void
    ) => {
      removeFeatureRef.current = removeFeature;
      setDrawFeatures(newFeatures);

      if (newFeatures.length === 0) {
        dispatch(updateFilterPolygon(undefined));
        return;
      }

      let merged: Feature<Polygon | MultiPolygon> | undefined;
      if (newFeatures.length === 1) {
        merged = { ...newFeatures[0] };
      } else {
        merged = union(featureCollection(newFeatures)) ?? undefined;
      }

      if (merged) {
        merged.properties = {
          ...merged.properties,
          drawFeatures: newFeatures,
        };
        dispatch(updateFilterPolygon(merged));
      }
    },
    [dispatch]
  );

  const highlightCollection = useMemo(():
    | FeatureCollection<Polygon | MultiPolygon>
    | undefined => {
    const allFeats: Feature<Polygon | MultiPolygon>[] = [];

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

    if (drawFeatures.length > 0) {
      drawFeatures.forEach((f) => {
        allFeats.push({
          ...f,
          properties: {
            ...f.properties,
            name: f.properties?.name ?? "Drawn Area",
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
    drawFeatures,
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

    const allFeats = [
      ...parkFeats,
      ...ecoregionFeats,
      ...coralFeats,
      ...drawFeatures,
    ];

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
    drawFeatures,
  ]);

  useEffect(() => {
    startTransition(() => {
      // Sync static areas
      const staticAreas = componentParam.staticAreas || [];
      const parks = new Set<string>();
      const ecoregions = new Set<string>();
      const coralAtlas = new Set<string>();

      staticAreas.forEach((area) => {
        if (area.boundaryName === BoundaryName.AUSTRALIAN_MARINE_PARKS) {
          parks.add("" + area.value);
        } else if (area.boundaryName === BoundaryName.MEOW) {
          ecoregions.add("" + area.value);
        } else if (area.boundaryName === BoundaryName.CORAL_ATLAS) {
          coralAtlas.add("" + area.value);
        }
      });

      setSelectedMarineParkValues(parks);
      setSelectedMarineEcoregionValues(ecoregions);
      setSelectedAllenCoralAtlasValues(coralAtlas);

      // Sync drawn features
      const drawn = componentParam.polygon?.properties?.drawFeatures || [];
      setDrawFeatures(drawn);
    });
  }, [componentParam.staticAreas, componentParam.polygon]);

  if (marineParkOptions.length === 0) return null;

  return (
    <Box sx={{ position: "relative", width: "100%" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          backgroundColor: theme.palette.primary6,
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
          backgroundColor: theme.palette.primary6,
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
            <ReactMap panelId={MAP_ID} zoom={0}>
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
