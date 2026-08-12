import { FC, useContext, useEffect, useMemo, useRef } from "react";
import { Button, Stack, Typography } from "@mui/material";
import { RasterTileSource } from "mapbox-gl";
import MapContext from "../../MapContext";
import { LayerBasicType } from "../Layers";
import { MapDefaultConfig, MapEventEnum } from "../../constants";
import { addDataLayer } from "../../layerOrder";
import MapLayerSelect from "../../component/MapLayerSelect";
import { TestHelper } from "../../../../common/test/helper";
import { borderRadius, zIndex } from "@/styles/constants";
import { portalTheme } from "@/styles";
import { GriddedRasterProduct } from "@/app/store/GriddedTileDefinitions";
import { buildGriddedTileUrl, toSelectItems } from "./Common";

enum LAYER_VISIBILITY {
  VISIBLE = "visible",
  NONE = "none",
}

/**
 * Gridded products are ~2-10 km resolution, so asking the backend to render
 * z9-z12 is wasted work — Mapbox overzooms above this instead. A guess pending
 * real per-product resolutions from the DAS team; deliberately a single named
 * constant so it is one edit when that answer arrives.
 */
export const GRIDDED_RASTER_MAX_ZOOM = 8;

/**
 * `DateSliderPoint`'s keyboard handler fires on every arrow keypress, and each
 * `setTiles` invalidates the whole tile cache into live backend renders.
 */
const SET_TILES_DEBOUNCE_MS = 250;

const getSourceId = (id: string | undefined) => `${id}-gridded-raster-source`;
export const getGriddedRasterLayerId = (id: string | undefined) =>
  `${id}-gridded-raster-layer`;

interface GriddedRasterLayerProps extends LayerBasicType {
  products: GriddedRasterProduct[];
  selectedProductId: string;
  onSelectProduct: (id: string) => void;
  /** YYYY-MM-DD, round-tripped from the listing — never derived from a Date. */
  selectedDate?: string;
  /** A refetch failed while this layer was selected. */
  error?: boolean;
  onRetry?: () => void;
}

/**
 * Renders one gridded raster tile product as a Mapbox raster layer, plus the
 * product dropdown. Controlled: the selected product and day are owned by
 * MapPanel, which also feeds the date slider from the same source.
 */
const GriddedRasterLayer: FC<GriddedRasterLayerProps> = ({
  products,
  selectedProductId,
  onSelectProduct,
  selectedDate,
  error,
  onRetry,
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
    () => products.find((p) => p.id === selectedProductId),
    [products, selectedProductId]
  );

  // 1. The tile URL. Pure substitution — see Common.buildGriddedTileUrl for why
  //    this must never go through URL/URLSearchParams/formatToUrl.
  const tileUrl = useMemo(
    () => buildGriddedTileUrl(selectedProduct?.template, selectedDate),
    [selectedProduct?.template, selectedDate]
  );
  const hasTileUrl = tileUrl !== undefined;

  // The create/re-create effect below and its map event handlers must see the
  // current visibility and URL *without* re-running when either changes — a
  // re-run tears the source down, and rebuilding is exactly what effects 3 and 4
  // exist to avoid. Declared before those effects so it commits first.
  const visibleRef = useRef(visible);
  const tileUrlRef = useRef(tileUrl);
  useEffect(() => {
    visibleRef.current = visible;
    tileUrlRef.current = tileUrl;
  });

  // 2. Create on init, re-create when the style reloads. Deliberately keyed on
  //    *whether* there is a URL, not on the URL itself, so a date or product
  //    change is handled by effect 4's setTiles rather than a rebuild.
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

    // A style reload drops every source and layer, so put ours back with the
    // visibility it had.
    const createOnStyleChange = () => createSourceAndLayer(currentVisibility());

    // Must be `once(IDLE)`: the map is already loaded when this layer is not
    // the one the page opened on.
    map.once(MapEventEnum.IDLE, createOnInit);
    map.on(MapEventEnum.STYLEDATA, createOnStyleChange);

    return () => {
      map.off(MapEventEnum.IDLE, createOnInit);
      map.off(MapEventEnum.STYLEDATA, createOnStyleChange);
      // The style is undefined while the map unloads, so getLayer/getSource
      // would throw.
      if (map.isStyleLoaded()) {
        if (map.getLayer(tileLayerId)) map.removeLayer(tileLayerId);
        if (map.getSource(sourceId)) map.removeSource(sourceId);
      }
    };
  }, [hasTileUrl, map, sourceId, tileLayerId]);

  // 3. Visibility. Never remove/re-add the layer on toggle — that discards the
  //    tile cache and re-requests every tile.
  useEffect(() => {
    if (!map || !map.getLayer(tileLayerId)) return;
    map.setLayoutProperty(
      tileLayerId,
      "visibility",
      visible ? LAYER_VISIBILITY.VISIBLE : LAYER_VISIBILITY.NONE
    );
  }, [map, tileLayerId, visible]);

  // 4. URL change: swap the tiles on the existing source rather than rebuilding
  //    it, debounced so arrowing through days does not fan out to the backend.
  useEffect(() => {
    if (!map || !tileUrl) return;

    const timer = setTimeout(() => {
      const source = map.getSource(sourceId) as RasterTileSource | undefined;
      source?.setTiles?.([tileUrl]);
    }, SET_TILES_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [map, sourceId, tileUrl]);

  if (!visible) return null;

  return (
    <>
      <MapLayerSelect
        mapLayersOptions={toSelectItems(products)}
        selectedItem={selectedProductId}
        handleSelectItem={onSelectProduct}
        isLoading={false}
      />
      {error && (
        // Additive and non-blocking: a backend outage must leave the rest of the
        // detail page fully interactive.
        <Stack
          direction="row"
          alignItems="center"
          gap={1}
          data-testid="gridded-raster-error"
          sx={{
            position: "absolute",
            top: "60px",
            left: "10px",
            zIndex: zIndex.MAP_BASE,
            backgroundColor: "#fff",
            borderRadius: borderRadius.small,
            boxShadow: portalTheme.shadows[5],
            padding: "8px 12px",
          }}
        >
          <Typography sx={{ ...portalTheme.typography.body1Medium }}>
            Gridded Data is temporarily unavailable
          </Typography>
          <Button size="small" onClick={onRetry}>
            Retry
          </Button>
        </Stack>
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
