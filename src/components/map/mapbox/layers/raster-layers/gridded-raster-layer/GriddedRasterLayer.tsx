import { FC, useContext, useEffect, useRef } from "react";
import { MapMouseEvent, Popup, RasterTileSource } from "mapbox-gl";
import { useAppDispatch } from "@/app/store/hooks";
import { fetchGriddedTilePointValue } from "@/app/store/searchReducer";
import { playwrightTestIds } from "@/components/common/constants";
import { isMapDrawModeActive } from "@/utils/MapUtils";
import MapContext from "../../../MapContext";
import { LayerBasicType } from "../../Layers";
import { MapDefaultConfig, MapEventEnum } from "../../../constants";
import { addDataLayer } from "../../../layerOrder";
import MapLayerSelect from "../../../component/MapLayerSelect";
import { TestHelper } from "../../../../../common/test/helper";
import {
  buildGriddedPointUrl,
  buildGriddedTileUrl,
  buildPointValueMessageHtml,
  buildPointValuePopupHtml,
  GriddedRasterLayerControls,
  toSelectItems,
  wrapLongitude,
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

const visibilityOf = (visible: boolean) =>
  visible ? LAYER_VISIBILITY.VISIBLE : LAYER_VISIBILITY.NONE;

const GriddedRasterLayer: FC<GriddedRasterLayerProps> = ({
  products,
  layerConfig,
  onLayerChange,
  selectedDate,
  visible = false,
}) => {
  const dispatch = useAppDispatch();
  const { map } = useContext(MapContext);
  const mapContainerId = map?.getContainer().id;
  const sourceId = getSourceId(mapContainerId);
  const tileLayerId = getGriddedRasterLayerId(mapContainerId);
  const selectedProduct = products.find((p) => p.id === layerConfig);
  const tileUrl = buildGriddedTileUrl(
    selectedProduct?.tileTemplate,
    selectedDate
  );
  const pointTemplate = selectedProduct?.pointTemplate;
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
          paint: { "raster-opacity": 1 },
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

  // Click anywhere on the visible raster -> look up that grid cell's value.
  // Re-subscribes (and closes any open popup) when the product or date
  // changes, so a popup never shows a value from a different layer state.
  useEffect(() => {
    if (!map || !visible || !pointTemplate || !selectedDate) return;

    let popup: Popup | null = null;
    let request: { abort: () => void } | null = null;

    const onClick = (e: MapMouseEvent) => {
      if (isMapDrawModeActive(map)) return;

      request?.abort();
      const lat = e.lngLat.lat;
      const lon = wrapLongitude(e.lngLat.lng);
      const url = buildGriddedPointUrl(pointTemplate, selectedDate, lat, lon);
      if (!url) return;

      if (!popup) popup = new Popup(MapDefaultConfig.DEFAULT_POPUP);
      const current = popup;
      current
        .setLngLat(e.lngLat)
        .setHTML(buildPointValueMessageHtml("Loading..."));
      if (!current.isOpen()) current.addTo(map);
      const element = current.getElement();
      if (element) element.dataset.testid = playwrightTestIds.DETAIL_MAP_POPUP;

      const pending = dispatch(fetchGriddedTilePointValue({ url }));
      request = pending;
      pending
        .unwrap()
        .then((response) =>
          current.setHTML(buildPointValuePopupHtml(response, { lat, lon }))
        )
        .catch((error) => {
          if (error?.name === "AbortError") return;
          // Out-of-bounds clicks come back as 404 — expected, not an outage.
          current.setHTML(
            buildPointValueMessageHtml("No data available at this location")
          );
        });
    };

    map.on("click", onClick);
    return () => {
      map.off("click", onClick);
      request?.abort();
      popup?.remove();
    };
  }, [dispatch, map, pointTemplate, selectedDate, visible]);

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
