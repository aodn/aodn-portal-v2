import { FC, useContext, useEffect, useRef } from "react";
import { RasterTileSource } from "mapbox-gl";
import MapContext from "../../../MapContext";
import { LayerBasicType } from "../../Layers";
import { MapDefaultConfig, MapEventEnum } from "../../../constants";
import { addDataLayer } from "../../../layerOrder";
import MapLayerSelect from "../../../component/MapLayerSelect";
import { TestHelper } from "../../../../../common/test/helper";
import {
  buildGriddedTileUrl,
  GriddedRasterLayerControls,
  toSelectItems,
} from "./Common";

enum LAYER_VISIBILITY {
  VISIBLE = "visible",
  NONE = "none",
}

/**
 * Gridded products are ~2-10 km resolution, so asking the backend to render
 * z9-z12 is wasted work — Mapbox overzooms above this instead.
 */
export const GRIDDED_RASTER_MAX_ZOOM = 8;

const SET_TILES_DEBOUNCE_MS = 250;

const getSourceId = (id: string | undefined) => `${id}-gridded-raster-source`;
export const getGriddedRasterLayerId = (id: string | undefined) =>
  `${id}-gridded-raster-layer`;

export interface GriddedRasterLayerProps
  extends LayerBasicType, GriddedRasterLayerControls {}

const visibilityOf = (visible: boolean) =>
  visible ? LAYER_VISIBILITY.VISIBLE : LAYER_VISIBILITY.NONE;

const GriddedRasterLayer: FC<GriddedRasterLayerProps> = ({
  products,
  layerConfig,
  onLayerChange,
  selectedDate,
  visible = false,
}) => {
  const { map } = useContext(MapContext);
  const mapContainerId = map?.getContainer().id;
  const sourceId = getSourceId(mapContainerId);
  const tileLayerId = getGriddedRasterLayerId(mapContainerId);
  const tileUrl = buildGriddedTileUrl(
    products.find((p) => p.id === layerConfig)?.template,
    selectedDate
  );
  const hasTileUrl = tileUrl !== undefined;

  // Latest values for STYLEDATA rebuilds — that effect must not depend on
  // tileUrl/visible or a date change would tear down the source.
  const visibleRef = useRef(visible);
  const tileUrlRef = useRef(tileUrl);
  useEffect(() => {
    visibleRef.current = visible;
    tileUrlRef.current = tileUrl;
  });

  useEffect(() => {
    if (!map || !hasTileUrl) return;

    const createSourceAndLayer = () => {
      const url = tileUrlRef.current;
      if (!url) return;
      if (!map.getSource(sourceId)) {
        map.addSource(sourceId, {
          type: "raster",
          tiles: [url],
          tileSize: 256,
          minzoom: MapDefaultConfig.MIN_ZOOM,
          maxzoom: GRIDDED_RASTER_MAX_ZOOM,
        });
      }
      if (!map.getLayer(tileLayerId)) {
        // addDataLayer, never map.addLayer: keeps the raster below overlays
        // and the gl-draw rectangle.
        addDataLayer(map, {
          id: tileLayerId,
          type: "raster",
          source: sourceId,
          paint: { "raster-opacity": 0.8 },
          layout: { visibility: visibilityOf(visibleRef.current) },
        });
      }
    };

    const createOnIdle = () => {
      if (map.isStyleLoaded()) createSourceAndLayer();
    };

    if (map.isStyleLoaded()) createSourceAndLayer();
    else map.once(MapEventEnum.IDLE, createOnIdle);
    map.on(MapEventEnum.STYLEDATA, createSourceAndLayer);

    return () => {
      map.off(MapEventEnum.IDLE, createOnIdle);
      map.off(MapEventEnum.STYLEDATA, createSourceAndLayer);
      if (map.isStyleLoaded()) {
        if (map.getLayer(tileLayerId)) map.removeLayer(tileLayerId);
        if (map.getSource(sourceId)) map.removeSource(sourceId);
      }
    };
    // Intentionally omit tileUrl: date swaps go through setTiles below.
  }, [hasTileUrl, map, sourceId, tileLayerId]);

  useEffect(() => {
    if (!map?.getLayer(tileLayerId)) return;
    map.setLayoutProperty(tileLayerId, "visibility", visibilityOf(visible));
  }, [map, tileLayerId, visible]);

  useEffect(() => {
    if (!map || !tileUrl) return;
    const timer = setTimeout(() => {
      (map.getSource(sourceId) as RasterTileSource | undefined)?.setTiles?.([
        tileUrl,
      ]);
    }, SET_TILES_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [map, sourceId, tileUrl]);

  return (
    <>
      {visible && (
        <MapLayerSelect
          layersOptions={toSelectItems(products)}
          selectedLayer={layerConfig}
          handleSelectLayer={onLayerChange}
          isLoading={false}
        />
      )}
      <TestHelper
        id={mapContainerId ?? ""}
        getGriddedRasterLayer={() => tileLayerId}
        isGriddedRasterVisible={() =>
          map?.getLayoutProperty(tileLayerId, "visibility") !==
          LAYER_VISIBILITY.NONE
        }
      />
    </>
  );
};

export default GriddedRasterLayer;
