import { describe, it, expect } from "vitest";
import {
  defaultMapSubsettingCapabilities,
  evaluateSubsettingSupport,
  MapSubsettingCapabilities,
  SubsettingType,
} from "../DownloadDefinitions";
import { LayerName } from "@/components/map/mapbox/controls/menu/MapLayerSwitcher";

const layers = {
  PMTiles: LayerName.PMTiles,
  GeoServer: LayerName.GeoServer,
};

const base = (
  overrides: Partial<MapSubsettingCapabilities>
): MapSubsettingCapabilities => ({
  ...defaultMapSubsettingCapabilities,
  downloadServiceAvailable: true,
  isSupportPMTiles: true,
  ...overrides,
});

describe("evaluateSubsettingSupport", () => {
  describe("TimeSlider", () => {
    it("shows for GeoServer when geoServerHasTime is true", () => {
      expect(
        evaluateSubsettingSupport(
          SubsettingType.TimeSlider,
          base({
            selectedLayerId: LayerName.GeoServer,
            geoServerHasTime: true,
            pmtilesHasTime: false,
          }),
          layers
        )
      ).toBe(true);
    });

    it("hides for GeoServer when geoServerHasTime is false", () => {
      expect(
        evaluateSubsettingSupport(
          SubsettingType.TimeSlider,
          base({
            selectedLayerId: LayerName.GeoServer,
            geoServerHasTime: false,
            pmtilesHasTime: true,
          }),
          layers
        )
      ).toBe(false);
    });

    it("shows for PMTiles when hasTime is true", () => {
      expect(
        evaluateSubsettingSupport(
          SubsettingType.TimeSlider,
          base({
            selectedLayerId: LayerName.PMTiles,
            pmtilesHasTime: true,
            geoServerHasTime: false,
          }),
          layers
        )
      ).toBe(true);
    });

    it("hides for PMTiles when hasTime is false (timeless)", () => {
      expect(
        evaluateSubsettingSupport(
          SubsettingType.TimeSlider,
          base({
            selectedLayerId: LayerName.PMTiles,
            pmtilesHasTime: false,
            geoServerHasTime: true,
          }),
          layers
        )
      ).toBe(false);
    });

    it("treats null pmtilesHasTime as allowed until metadata loads", () => {
      expect(
        evaluateSubsettingSupport(
          SubsettingType.TimeSlider,
          base({
            selectedLayerId: LayerName.PMTiles,
            pmtilesHasTime: null,
          }),
          layers
        )
      ).toBe(true);
    });

    it("does not use GeoServer time when PMTiles is selected", () => {
      expect(
        evaluateSubsettingSupport(
          SubsettingType.TimeSlider,
          base({
            selectedLayerId: LayerName.PMTiles,
            pmtilesHasTime: false,
            geoServerHasTime: true,
          }),
          layers
        )
      ).toBe(false);
    });
  });

  describe("DrawRect", () => {
    it("shows for PMTiles when download service available", () => {
      expect(
        evaluateSubsettingSupport(
          SubsettingType.DrawRect,
          base({ selectedLayerId: LayerName.PMTiles }),
          layers
        )
      ).toBe(true);
    });

    it("hides when download service unavailable", () => {
      expect(
        evaluateSubsettingSupport(
          SubsettingType.DrawRect,
          base({
            selectedLayerId: LayerName.PMTiles,
            downloadServiceAvailable: false,
          }),
          layers
        )
      ).toBe(false);
    });

    it("shows for GeoServer only when draw rect supported", () => {
      expect(
        evaluateSubsettingSupport(
          SubsettingType.DrawRect,
          base({
            selectedLayerId: LayerName.GeoServer,
            geoServerDrawRect: false,
          }),
          layers
        )
      ).toBe(false);
      expect(
        evaluateSubsettingSupport(
          SubsettingType.DrawRect,
          base({
            selectedLayerId: LayerName.GeoServer,
            geoServerDrawRect: true,
          }),
          layers
        )
      ).toBe(true);
    });
  });

  describe("GriddedRaster", () => {
    // The real provider passes all three names; `layers` above deliberately
    // stays two-name to prove the widened signature did not break call sites.
    const layersWithGridded = {
      ...layers,
      GriddedRaster: LayerName.GriddedRaster,
    };

    it("shows the time slider when the selected product has days", () => {
      expect(
        evaluateSubsettingSupport(
          SubsettingType.TimeSlider,
          base({
            selectedLayerId: LayerName.GriddedRaster,
            hasCloudOptimisedData: false,
            griddedRasterHasDates: true,
          }),
          layersWithGridded
        )
      ).toBe(true);
    });

    it("hides it when the selected product has no days", () => {
      expect(
        evaluateSubsettingSupport(
          SubsettingType.TimeSlider,
          base({
            selectedLayerId: LayerName.GriddedRaster,
            hasCloudOptimisedData: false,
            griddedRasterHasDates: false,
          }),
          layersWithGridded
        )
      ).toBe(false);
    });

    // The term is an OR only — it must never be able to hide the clock icon for
    // a record that shows it today.
    it("cannot suppress cloud optimised time support", () => {
      expect(
        evaluateSubsettingSupport(
          SubsettingType.TimeSlider,
          base({
            selectedLayerId: LayerName.GriddedRaster,
            hasCloudOptimisedData: true,
            griddedRasterHasDates: false,
          }),
          layersWithGridded
        )
      ).toBe(true);
    });
  });
});
