import { padding } from "../../../styles/constants";
import { Grid, Paper } from "@mui/material";
import Map from "../../../components/map/mapbox/Map";
import Controls from "../../../components/map/mapbox/controls/Controls";
import ToggleControl from "../../../components/map/mapbox/controls/ToggleControl";
import NavigationControl from "../../../components/map/mapbox/controls/NavigationControl";
import ScaleControl from "../../../components/map/mapbox/controls/ScaleControl";
import MenuControl, {
  BaseMapSwitcher,
  MapLayerSwitcher,
} from "../../../components/map/mapbox/controls/MenuControl";
import React, { useCallback, useState } from "react";
import { MapboxEvent as MapEvent } from "mapbox-gl";
import Layers from "../../../components/map/mapbox/layers/Layers";
import ClusterLayer from "../../../components/map/mapbox/layers/ClusterLayer";
import HeatmapLayer from "../../../components/map/mapbox/layers/HeatmapLayer";
import { OGCCollection } from "../../../components/common/store/OGCCollectionDefinitions";
import {
  AustraliaMarineParkLayer,
  StaticLayersDef,
} from "../../../components/map/mapbox/layers/StaticLayer";

const mapContainerId = "map-container-id";

interface MapSectionProps {
  collections: OGCCollection[];
  showFullMap: boolean;
  onMapZoomOrMove: (
    event: MapEvent<MouseEvent | WheelEvent | TouchEvent | undefined>
  ) => void;
  onToggleClicked: (v: boolean) => void;
  onDatasetSelected?: (uuid: Array<string>) => void;
}

const MapSection: React.FC<MapSectionProps> = ({
  onMapZoomOrMove,
  onToggleClicked,
  onDatasetSelected,
  collections,
  showFullMap,
}) => {
  const [selectedLayer, setSelectedLayer] = useState<string | null>("heatmap");
  const [staticLayer, setStaticLayer] = useState<Array<string>>([]);

  const createPresentationLayers = useCallback(
    (id: string | null) => {
      switch (id) {
        case "heatmap":
          return (
            <HeatmapLayer
              collections={collections}
              onDatasetSelected={onDatasetSelected}
            />
          );

        default:
          return (
            <ClusterLayer
              collections={collections}
              onDatasetSelected={onDatasetSelected}
            />
          );
      }
    },
    [collections, onDatasetSelected]
  );

  const createStaticLayers = useCallback(
    (ids: Array<string>) => (
      <>
        {ids.map((id) => {
          if (id === StaticLayersDef.AUSTRALIA_MARINE_PARKS.id) {
            return <AustraliaMarineParkLayer key={"s" + id} />;
          }
        })}
      </>
    ),
    []
  );

  return (
    <Grid
      item
      sx={{
        paddingLeft: padding.medium,
        pr: 2,
        pb: 2,
        flex: 1,
      }}
    >
      <Paper id={mapContainerId} sx={{ minHeight: "80vh" }}>
        <Map
          panelId={mapContainerId}
          onZoomEvent={onMapZoomOrMove}
          onMoveEvent={onMapZoomOrMove}
        >
          <Controls>
            <ToggleControl
              onToggleClicked={onToggleClicked}
              showFullMap={showFullMap}
            />
            <NavigationControl />
            <ScaleControl />
            <MenuControl
              menu={
                <BaseMapSwitcher
                  layers={[
                    {
                      id: StaticLayersDef.AUSTRALIA_MARINE_PARKS.id,
                      name: StaticLayersDef.AUSTRALIA_MARINE_PARKS.name,
                      default: false,
                    },
                  ]}
                  onEvent={(target: EventTarget & HTMLInputElement) =>
                    setStaticLayer((values) => {
                      // Remove the item and add it back if selected
                      const e = values?.filter((i) => i !== target.value);
                      if (target.checked) {
                        e.push(target.value);
                      }
                      return [...e];
                    })
                  }
                />
              }
            />
            <MenuControl
              menu={
                <MapLayerSwitcher
                  layers={[
                    {
                      id: "cluster",
                      name: "Cluster",
                      default: selectedLayer === "cluster",
                    },
                    {
                      id: "heatmap",
                      name: "Heatmap",
                      default: selectedLayer === "heatmap",
                    },
                  ]}
                  onEvent={(id: string) => setSelectedLayer(id)}
                />
              }
            />
          </Controls>
          <Layers>
            {createPresentationLayers(selectedLayer)}
            {createStaticLayers(staticLayer)}
          </Layers>
        </Map>
      </Paper>
    </Grid>
  );
};

export default MapSection;
