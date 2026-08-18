import { FC, useContext, useEffect, useMemo, useRef } from "react";
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

interface GriddedRasterLayerProps
  extends LayerBasicType, GriddedRasterLayerControls {}

const GriddedRasterLayer: FC<GriddedRasterLayerProps> = ({
  products,
  layerConfig,
  onLayerChange,
  selectedDate,
  visible = false,
}) => {
  const { map } = useContext(MapContext);

  const mapContainerId = map?.getContainer().id;
  const sourceId = useMemo(() => getSourceId(mapContainerId), [mapContainerId]);
  const tileLayerId = useMemo(
    () => getGriddedRasterLayerId(mapContainerId),
    [mapContainerId]
  );

  const selectedProduct = useMemo(
    () => products.find((p) => p.id === layerConfig),
    [products, layerConfig]
  );

  const tileUrl = useMemo(
    () => buildGriddedTileUrl(selectedProduct?.template, selectedDate),
    [selectedProduct?.template, selectedDate]
  );
  const hasTileUrl = tileUrl !== undefined;

  const visibleRef = useRef(visible);
  const tileUrlRef = useRef(tileUrl);
  useEffect(() => {
    visibleRef.current = visible;
    tileUrlRef.current = tileUrl;
  });

  useEffect(() => {
    if (!map || !hasTileUrl) return;

    const createSourceAndLayer = (visibility: LAYER_VISIBILITY) => {
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
        // addDataLayer, never map.addLayer: this keeps the raster below the
        // reference/menu overlays and the gl-draw rectangle.
        addDataLayer(map, {
          id: tileLayerId,
          type: "raster",
          source: sourceId,
          paint: { "raster-opacity": 0.8 },
          layout: { visibility },
        });
      }
    };

    const currentVisibility = () =>
      visibleRef.current ? LAYER_VISIBILITY.VISIBLE : LAYER_VISIBILITY.NONE;

    const createOnInit = () => {
      if (map.isStyleLoaded()) createSourceAndLayer(currentVisibility());
    };

    const createOnStyleChange = () => createSourceAndLayer(currentVisibility());

    if (map.isStyleLoaded()) {
      createOnInit();
    } else {
      map.once(MapEventEnum.IDLE, createOnInit);
    }
    map.on(MapEventEnum.STYLEDATA, createOnStyleChange);

    return () => {
      map.off(MapEventEnum.IDLE, createOnInit);
      map.off(MapEventEnum.STYLEDATA, createOnStyleChange);

      if (map.isStyleLoaded()) {
        if (map.getLayer(tileLayerId)) map.removeLayer(tileLayerId);
        if (map.getSource(sourceId)) map.removeSource(sourceId);
      }
    };
  }, [hasTileUrl, map, sourceId, tileLayerId]);

  useEffect(() => {
    if (!map || !map.getLayer(tileLayerId)) return;
    map.setLayoutProperty(
      tileLayerId,
      "visibility",
      visible ? LAYER_VISIBILITY.VISIBLE : LAYER_VISIBILITY.NONE
    );
  }, [map, tileLayerId, visible]);

  useEffect(() => {
    if (!map || !tileUrl) return;

    const timer = setTimeout(() => {
      const source = map.getSource(sourceId) as RasterTileSource | undefined;
      source?.setTiles?.([tileUrl]);
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
