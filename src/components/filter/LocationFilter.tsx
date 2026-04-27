import React, {
  FC,
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  IconButton,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ReplayIcon from "@mui/icons-material/Replay";
import {
  color,
  fontFamily,
  fontSize,
  gap,
  padding,
} from "../../styles/constants";
import { marineParkDefault } from "../common/constants";
import { Feature, FeatureCollection, Polygon } from "geojson";
import _ from "lodash";
import {
  ParameterState,
  updateFilterBBox,
  updateFilterPolygon,
  updateZoom,
} from "../common/store/componentParamReducer";
import { useAppDispatch, useAppSelector } from "../common/store/hooks";
import {
  bbox,
  bboxPolygon,
  booleanEqual,
  featureCollection,
  simplify,
  union,
} from "@turf/turf";
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

const MAP_ID = "location-filter-map";

const MARINE_PARK_GROUP_VALUE = "australian-marine-parks";

type LocationFilterMode = "country" | "ocean" | "marinePark" | "mapBoundary";

interface LocationOptionType {
  value: string;
  label: string;
  geo?: FeatureCollection<Polygon>;
}

interface LocationFilterProps {
  handleClosePopup: () => void;
}

const loadMarineParkOptions = async (): Promise<LocationOptionType[]> => {
  const response = await fetch(marineParkDefault.geojson);
  const json: FeatureCollection<Polygon> = await response.json();
  const grouped = _.groupBy(
    json.features,
    (feature) => feature.properties?.RESNAME
  );
  const collections = Object.values(grouped).map<FeatureCollection<Polygon>>(
    (features) => ({
      type: "FeatureCollection",
      features: features as Feature<Polygon>[],
    })
  );

  return collections
    .map<LocationOptionType>((value) => {
      value.features[0] = simplify(value.features[0], {
        tolerance: 0.05,
        highQuality: false,
      });
      return {
        label: value.features[0].properties?.RESNAME,
        value: "" + value.features[0].properties?.OBJECTID,
        geo: value,
      };
    })
    .sort((a, b) => (a.label ?? "").localeCompare(b.label ?? ""));
};

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
            "fill-color": "rgba(66,100,251, 0.3)",
            "fill-outline-color": "#0000ff",
          },
        });

        map.addLayer({
          id: labelLayerId,
          type: "symbol",
          source: sourceId,
          layout: {
            "symbol-placement": "point",
            "text-field": ["coalesce", ["get", "name"], ["get", "RESNAME"], ""],
            "text-font": cssFontFamilyToMapboxTextFont(
              theme.typography.body2Regular.fontFamily,
              { fontWeight: theme.typography.body2Regular.fontWeight }
            ),
            "text-size": 14,
            "text-anchor": "center",
            "text-allow-overlap": true,
          },
          paint: {
            "text-color": "#FFFFFF",
            "text-halo-color": "#000000",
            "text-halo-width": 1.2,
          },
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

const modeRadios: { value: LocationFilterMode; label: string }[] = [
  { value: "country", label: "By country" },
  { value: "ocean", label: "By ocean or sea name" },
  { value: "marinePark", label: "By marine park" },
  { value: "mapBoundary", label: "By map boundary" },
];

const LocationFilter: FC<LocationFilterProps> = ({ handleClosePopup }) => {
  const dispatch = useAppDispatch();
  const { isMobile } = useBreakpoint();
  const componentParam: ParameterState = useAppSelector((s) => s.paramReducer);
  const [filterMode, setFilterMode] =
    useState<LocationFilterMode>("marinePark");
  const [marineParkOptions, setMarineParkOptions] = useState<
    LocationOptionType[]
  >([]);
  const [selectedMarineParkValues, setSelectedMarineParkValues] = useState<
    Set<string>
  >(new Set());

  useEffect(() => {
    let cancelled = false;
    loadMarineParkOptions()
      .then((opts) => {
        if (!cancelled) setMarineParkOptions(opts);
      })
      .catch((error) => {
        console.error("Error fetching JSON in LocationFilter:", error);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const applyMarineParkSelection = useCallback(
    (next: Set<string>) => {
      const features = marineParkOptions
        .filter((o) => next.has(o.value))
        .map((o) => o.geo!.features[0]);

      if (features.length === 0) {
        dispatch(updateFilterPolygon(undefined));
        return;
      }
      if (features.length === 1) {
        dispatch(updateFilterPolygon(features[0]));
        const areaBbox = bbox(features[0]);
        dispatch(updateFilterBBox(bboxPolygon(areaBbox)));
        dispatch(
          updateZoom(
            (MapDefaultConfig.MIN_ZOOM + MapDefaultConfig.MAX_ZOOM) / 2
          )
        );
        return;
      }
      const merged = union(featureCollection(features));
      if (merged) {
        dispatch(updateFilterPolygon(merged));
        const areaBbox = bbox(merged);
        dispatch(updateFilterBBox(bboxPolygon(areaBbox)));
        dispatch(
          updateZoom(
            (MapDefaultConfig.MIN_ZOOM + MapDefaultConfig.MAX_ZOOM) / 2
          )
        );
      }
    },
    [dispatch, marineParkOptions]
  );

  const handleFilterModeChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const mode = event.target.value as LocationFilterMode;
      setFilterMode(mode);
      if (mode !== "marinePark") {
        setSelectedMarineParkValues(new Set());
        dispatch(updateFilterPolygon(undefined));
      }
    },
    [dispatch]
  );

  const handleMarineParkCheckboxChange = useCallback(
    (parkValue: string, checked: boolean) => {
      setSelectedMarineParkValues((prev) => {
        const next = new Set(prev);
        if (checked) next.add(parkValue);
        else next.delete(parkValue);
        applyMarineParkSelection(next);
        return next;
      });
    },
    [applyMarineParkSelection]
  );

  const handleClear = useCallback(() => {
    dispatch(updateFilterPolygon(undefined));
    setSelectedMarineParkValues(new Set());
  }, [dispatch]);

  const handleClose = useCallback(() => {
    handleClosePopup();
  }, [handleClosePopup]);

  const handleFeaturesChange = useCallback(
    (
      _newFeatures: Feature<Polygon>[],
      _removeFeature: (id: string) => void
    ) => {},
    []
  );

  useEffect(() => {
    if (filterMode !== "marinePark" || marineParkOptions.length === 0) return;
    const p = componentParam.polygon;
    if (!p) {
      startTransition(() => setSelectedMarineParkValues(new Set()));
      return;
    }
    const exact = marineParkOptions.find(
      (o) =>
        o.geo?.features[0] &&
        booleanEqual(o.geo.features[0], p as Feature<Polygon>)
    );
    if (exact) {
      startTransition(() =>
        setSelectedMarineParkValues(new Set([exact.value]))
      );
    }
  }, [componentParam.polygon, filterMode, marineParkOptions]);

  const highlightCollection = useMemo(():
    | FeatureCollection<Polygon>
    | undefined => {
    if (filterMode !== "marinePark" || selectedMarineParkValues.size === 0) {
      return undefined;
    }
    const feats = marineParkOptions
      .filter((o) => selectedMarineParkValues.has(o.value))
      .map((o) => {
        const feature = o.geo!.features[0];
        return {
          ...feature,
          properties: {
            ...feature.properties,
            // Keep an explicit display label for map symbol rendering.
            name: feature.properties?.RESNAME ?? o.label,
          },
        };
      });
    if (feats.length === 0) return undefined;
    return { type: "FeatureCollection", features: feats };
  }, [filterMode, marineParkOptions, selectedMarineParkValues]);

  const mapBbox = useMemo(() => {
    if (filterMode !== "marinePark" || selectedMarineParkValues.size === 0) {
      return undefined;
    }
    const feats = marineParkOptions
      .filter((o) => selectedMarineParkValues.has(o.value))
      .map((o) => o.geo!.features[0]);
    if (feats.length === 0) return undefined;
    const bounds =
      feats.length === 1 ? bbox(feats[0]) : bbox(featureCollection(feats));
    return new LngLatBounds([bounds[0], bounds[1]], [bounds[2], bounds[3]]);
  }, [filterMode, marineParkOptions, selectedMarineParkValues]);

  const mergedPolygonForTests = useMemo(() => {
    if (filterMode !== "marinePark") return undefined;
    const feats = marineParkOptions
      .filter((o) => selectedMarineParkValues.has(o.value))
      .map((o) => o.geo!.features[0]);
    if (feats.length === 0) return undefined;
    if (feats.length === 1) return feats[0];
    return union(featureCollection(feats)) ?? undefined;
  }, [filterMode, marineParkOptions, selectedMarineParkValues]);

  if (marineParkOptions.length === 0) return null;

  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        width: "100%",
        padding: padding.large,
        pt: padding.triple,
        gap: padding.large,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: gap.md,
          right: gap.md,
          zIndex: 2,
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

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: isMobile ? 1 : "0 0 200px",
          gap: gap.sm,
        }}
      >
        <Typography variant="title1Medium">Filter by</Typography>
        <FormControl>
          <RadioGroup value={filterMode} onChange={handleFilterModeChange}>
            {modeRadios.map((m) => (
              <FormControlLabel
                key={m.value}
                value={m.value}
                control={
                  <Radio
                    sx={{
                      "&.Mui-checked": {
                        color: theme.palette.secondary2,
                      },
                    }}
                  />
                }
                label={m.label}
                data-testid={`filter-mode-${m.value}`}
                sx={{
                  ".MuiFormControlLabel-label": {
                    fontFamily: fontFamily.general,
                    fontSize: fontSize.info,
                    color: theme.palette.primary1,
                    padding: 0,
                  },
                }}
              />
            ))}
          </RadioGroup>
        </FormControl>
      </Box>

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
          <>
            <FormControl size="small" fullWidth>
              <Select
                value={MARINE_PARK_GROUP_VALUE}
                displayEmpty
                data-testid="marine-park-region-select"
              >
                <MenuItem value={MARINE_PARK_GROUP_VALUE}>
                  Australian Marine Parks
                </MenuItem>
              </Select>
            </FormControl>
            <Box
              data-testid="marine-park-checkbox-scroll"
              sx={{
                width: "100%",
                maxHeight: isMobile ? "200px" : "360px",
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
                {marineParkOptions.map((item) => (
                  <FormControlLabel
                    key={item.value}
                    control={
                      <Checkbox
                        checked={selectedMarineParkValues.has(item.value)}
                        onChange={(_, checked) =>
                          handleMarineParkCheckboxChange(item.value, checked)
                        }
                        data-testid={`checkbox-park-${item.value}`}
                        sx={{
                          "&.Mui-checked": {
                            color: theme.palette.secondary2,
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
                        fontFamily: fontFamily.general,
                        fontSize: fontSize.info,
                        color: theme.palette.primary1,
                        whiteSpace: "normal",
                        wordBreak: "break-word",
                      },
                    }}
                  />
                ))}
              </FormGroup>
            </Box>
          </>
        )}
        {filterMode === "country" && (
          <Typography variant="body2" color="text.secondary" sx={{ pr: 1 }}>
            Country and region filters will be available in a future update.
          </Typography>
        )}
        {filterMode === "ocean" && (
          <Typography variant="body2" color="text.secondary" sx={{ pr: 1 }}>
            Ocean and sea filters will be available in a future update.
          </Typography>
        )}
        {filterMode === "mapBoundary" && (
          <Typography variant="body2" color="text.secondary" sx={{ pr: 1 }}>
            Use the rectangle tool on the map to define a search region.
          </Typography>
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
            <SelectedAreaLayer areas={highlightCollection} />
            <Controls>
              <NavigationControl />
              <ScaleControl />
              <DisplayCoordinate />
              <MenuControlGroup>
                <MenuControl menu={<BaseMapSwitcher />} />
                <MenuControl
                  menu={<DrawRect onChangeFeatures={handleFeaturesChange} />}
                />
              </MenuControlGroup>
            </Controls>
          </ReactMap>
        </Box>
      )}

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
