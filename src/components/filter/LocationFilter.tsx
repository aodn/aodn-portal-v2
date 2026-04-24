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
  FormControl,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ReplayIcon from "@mui/icons-material/Replay";
import {
  color,
  fontFamily,
  fontSize,
  fontWeight,
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
import { useAppDispatch } from "../common/store/hooks";
import store, { getComponentState } from "../common/store/store";
import { simplify, booleanEqual, bbox, bboxPolygon } from "@turf/turf";
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

const MAP_ID = "location-filter-map";

// Selected area layer
const SelectedAreaLayer: FC<{ area: Feature<Polygon> | undefined }> = ({
  area,
}) => {
  const { map } = React.useContext(MapContext);

  useEffect(() => {
    if (!map) return;

    const sourceId = "selected-area-source";
    const layerId = "selected-area-layer";

    const addLayer = () => {
      if (!map.getSource(sourceId)) {
        map.addSource(sourceId, {
          type: "geojson",
          data: area || { type: "FeatureCollection", features: [] },
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
      } else {
        (map.getSource(sourceId) as any).setData(
          area || { type: "FeatureCollection", features: [] }
        );
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
  }, [map, area]);

  return null;
};

interface LocationOptionType {
  value: string;
  label: string;
  geo?: FeatureCollection<Polygon>;
}

interface LocationFilterProps {
  handleClosePopup: () => void;
}

const locationOptions: LocationOptionType[] = [];

const DEFAULT_LOCATION = {
  label: "None",
  value: "none",
  geo: undefined,
};
// Given a polygon find the item in the location type option that matches
// the feature geometry
const findMatch = (
  polygon: Feature<Polygon> | undefined,
  locations: LocationOptionType[]
): string => {
  const o = locations.find(
    (l) =>
      l.geo?.features[0] && polygon && booleanEqual(l.geo?.features[0], polygon)
  );
  return o ? o.value : "none";
};

fetch(marineParkDefault.geojson)
  .then((response) => response.json())
  .then((json: FeatureCollection<Polygon>) => {
    // Regroup the Features by name and create a new array or FeatureCollection
    const grouped = _.groupBy(
      json.features,
      (feature) => feature.properties?.RESNAME
    );
    return Object.values(grouped).map<FeatureCollection<Polygon>>(
      (features) => ({
        type: "FeatureCollection",
        features: features as Feature<Polygon>[],
      })
    );
  })
  .then((values: Array<FeatureCollection<Polygon>>) => {
    // Create the drop-down list items
    const l = values
      .map<LocationOptionType>((value) => {
        // simplify the polygon here, otherwise too big of url for query
        value.features[0] = simplify(value.features[0], {
          tolerance: 0.05,
          highQuality: false,
        });
        const option: LocationOptionType = {
          label: value.features[0].properties?.RESNAME,
          value: "" + value.features[0].properties?.OBJECTID,
          geo: value,
        };
        return option;
      })
      .sort((a, b) => a.label.localeCompare(b.label));

    locationOptions.push(DEFAULT_LOCATION);
    locationOptions.push(...l);
  })
  .catch((error) => {
    console.error("Error fetching JSON in LocationFilter:", error);
  });

const LocationFilter: FC<LocationFilterProps> = ({ handleClosePopup }) => {
  const dispatch = useAppDispatch();
  const { isMobile } = useBreakpoint();
  const componentParam: ParameterState = getComponentState(store.getState());
  const [selectedOption, setSelectedOption] = useState<string | undefined>(
    "none"
  );

  // TODO: need to update redux as well if ogcapi support this query
  const handleRadioChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const l = locationOptions?.find((o) => o.value === event.target.value);
      if (l && l.geo?.features) {
        // The marineParkDefault is a boundary json so only 1 feature found.
        const area = l.geo.features[0];
        dispatch(updateFilterPolygon(area));
        // Set focus to that area by moving the bbox of the map
        // if users selected filter by particular area.
        const areaBbox = bbox(area);
        dispatch(updateFilterBBox(bboxPolygon(areaBbox)));
        dispatch(
          updateZoom(
            (MapDefaultConfig.MIN_ZOOM + MapDefaultConfig.MAX_ZOOM) / 2
          )
        );
        setSelectedOption(event.target.value);
      } else {
        dispatch(updateFilterPolygon(undefined));
        setSelectedOption(DEFAULT_LOCATION.value);
      }
    },
    [dispatch]
  );

  const handleClear = useCallback(() => {
    dispatch(updateFilterPolygon(undefined));
    setSelectedOption(DEFAULT_LOCATION.value);
  }, [dispatch]);

  const handleClose = useCallback(() => {
    handleClosePopup();
  }, [handleClosePopup]);

  const handleFeaturesChange = useCallback(
    (
      newFeatures: Feature<Polygon>[],
      removeFeature: (id: string) => void
    ) => {},
    []
  );

  useEffect(() => {
    startTransition(() => {
      setSelectedOption((prevOption) => {
        const matchedLocation = findMatch(
          componentParam.polygon,
          locationOptions
        );
        return prevOption === matchedLocation ? prevOption : matchedLocation;
      });
    });
  }, [componentParam.polygon]);

  const mapBbox = useMemo(() => {
    const selectedLocation = locationOptions?.find(
      (o) => o.value === selectedOption
    );
    const area = selectedLocation?.geo?.features[0];
    if (area) {
      const areaBbox = bbox(area);
      return new LngLatBounds(
        [areaBbox[0], areaBbox[1]],
        [areaBbox[2], areaBbox[3]]
      );
    }
    return undefined;
  }, [selectedOption]);

  const selectedArea = useMemo(() => {
    const selectedLocation = locationOptions?.find(
      (o) => o.value === selectedOption
    );
    return selectedLocation?.geo?.features[0];
  }, [selectedOption]);

  if (locationOptions.length === 0) return null;

  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        width: "100%",
        padding: padding.large,
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
          flex: isMobile ? 1 : "0 0 300px",
        }}
      >
        <Typography
          pt={isMobile ? 0 : padding.large}
          fontSize={fontSize.info}
          fontWeight={fontWeight.bold}
        >
          Australian Marine Parks
        </Typography>
        <FormControl
          sx={{
            maxHeight: isMobile ? "200px" : "400px",
            overflowY: "auto",
            flex: 1,
          }}
        >
          <RadioGroup
            defaultValue={locationOptions[0].value}
            value={selectedOption}
            onChange={handleRadioChange}
          >
            {locationOptions.map((item) => (
              <FormControlLabel
                value={item.value}
                control={<Radio />}
                label={item.label}
                key={item.value}
                data-testid={`radio-${item.label}`}
                sx={{
                  ".MuiFormControlLabel-label": {
                    fontFamily: fontFamily.general,
                    fontSize: fontSize.info,
                    padding: 0,
                  },
                }}
              />
            ))}
          </RadioGroup>
        </FormControl>
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
          const selectedLocation = locationOptions?.find(
            (o) => o.value === selectedOption
          );
          const area = selectedLocation?.geo?.features[0];
          const funcIntersectPolygon = cqlDefaultFilters.get(
            "INTERSECT_POLYGON"
          ) as PolygonOperation;
          return area ? funcIntersectPolygon(area) : undefined;
        }}
      />
    </Box>
  );
};

export default LocationFilter;
