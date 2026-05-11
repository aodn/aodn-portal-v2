import { describe, it, expect, vi, beforeEach } from "vitest";
import { trackSearchResultParameters } from "../searchParamsEvent";
import { trackCustomEvent } from "../customEventTracker";
import { SearchParameters } from "../../components/common/store/searchReducer";

// Mock external dependencies
vi.mock("../customEventTracker");
vi.mock("../analyticsEvents", () => ({
  AnalyticsEvent: { SEARCH_RESULT_PARAMS: "search_result_params" },
}));

const mockTrack = trackCustomEvent as ReturnType<typeof vi.fn>;

// Mock sessionStorage
const mockStorage = (() => {
  let data: Record<string, string> = {};
  return {
    getItem: (key: string) => data[key] || null,
    setItem: (key: string, value: string) => {
      data[key] = value;
    },
    removeItem: (key: string) => {
      delete data[key];
    },
    clear: () => {
      data = {};
    },
  };
})();
Object.defineProperty(global, "sessionStorage", { value: mockStorage });

describe("Search Analytics Tracking", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockStorage.clear();
  });

  describe("Input Guards", () => {
    // Tests: if (searchParams.properties !== "id,centroid") return;
    it("skips when properties is not 'id,centroid'", () => {
      trackSearchResultParameters({
        properties: "id,title,description",
        text: "test",
      } as SearchParameters);

      expect(mockTrack).not.toHaveBeenCalled();
    });
  });

  describe("Output Data Extraction", () => {
    // Tests: if (searchParams.text) analyticsData.search_text = String(searchParams.text);
    it("extracts search text", () => {
      trackSearchResultParameters({
        properties: "id,centroid",
        text: "ocean data",
        filter: "page_size=1500",
      } as SearchParameters);

      expect(mockTrack).toHaveBeenCalledWith("search_result_params", {
        search_text: "ocean data",
        has_co_data: "false",
      });
    });

    // Tests: const bboxMatch = searchParams.filter.match(/BBOX\(geometry,([\d.-]+,[\d.-]+,[\d.-]+,[\d.-]+)\)/)
    it("extracts bbox coordinates", () => {
      trackSearchResultParameters({
        properties: "id,centroid",
        text: "test",
        filter: "BBOX(geometry,143.5,-39.3,144.0,-38.9)",
      } as SearchParameters);

      expect(mockTrack).toHaveBeenCalledWith("search_result_params", {
        search_text: "test",
        bbox: "143.5,-39.3,144.0,-38.9",
        has_co_data: "false",
      });
    });

    // Tests: const temporalMatch = searchParams.filter.match(/temporal DURING ([^Z]+Z)\/([^Z]+Z)/)
    it("extracts temporal range", () => {
      trackSearchResultParameters({
        properties: "id,centroid",
        text: "test",
        filter: "temporal DURING 1984-06-08T00:00:00Z/2010-05-13T00:00:00Z",
      } as SearchParameters);

      expect(mockTrack).toHaveBeenCalledWith("search_result_params", {
        search_text: "test",
        temporal_start: "1984-06-08T00:00:00Z",
        temporal_end: "2010-05-13T00:00:00Z",
        has_co_data: "false",
      });
    });

    // Tests: const polygonMatch = searchParams.filter.match(/INTERSECTS\(geometry,POLYGON \(\(([^)]+)\)\)\)/)
    it("extracts polygon coordinates", () => {
      trackSearchResultParameters({
        properties: "id,centroid",
        text: "test",
        filter:
          "INTERSECTS(geometry,POLYGON ((143.6 -39.1, 143.6 -38.9, 143.5 -38.9)))",
      } as SearchParameters);

      expect(mockTrack).toHaveBeenCalledWith("search_result_params", {
        search_text: "test",
        polygon: "143.6 -39.1, 143.6 -38.9, 143.5 -38.9",
        has_co_data: "false",
      });
    });

    // Tests: const paramMatches = searchParams.filter.match(/parameter_vocabs='([^']+)'/g)
    it("extracts parameter vocabularies", () => {
      trackSearchResultParameters({
        properties: "id,centroid",
        text: "test",
        filter:
          "(parameter_vocabs='temperature' or parameter_vocabs='salinity')",
      } as SearchParameters);

      expect(mockTrack).toHaveBeenCalledWith("search_result_params", {
        search_text: "test",
        parameter_vocabs: "temperature,salinity",
        has_co_data: "false",
      });
    });

    // Tests: const platformMatches = searchParams.filter.match(/platform_vocabs='([^']+)'/g)
    it("extracts platform vocabularies", () => {
      trackSearchResultParameters({
        properties: "id,centroid",
        text: "test",
        filter: "(platform_vocabs='vessel' or platform_vocabs='satellite')",
      } as SearchParameters);

      expect(mockTrack).toHaveBeenCalledWith("search_result_params", {
        search_text: "test",
        platform_vocabs: "vessel,satellite",
        has_co_data: "false",
      });
    });

    // Tests: const datasetGroupMatch = searchParams.filter.match(/dataset_group='([^']+)'/)
    it("extracts dataset group", () => {
      trackSearchResultParameters({
        properties: "id,centroid",
        text: "test",
        filter: "dataset_group='imas'",
      } as SearchParameters);

      expect(mockTrack).toHaveBeenCalledWith("search_result_params", {
        search_text: "test",
        dataset_group: "imas",
        has_co_data: "false",
      });
    });

    // Tests: const updateFreqMatch = searchParams.filter.match(/update_frequency='([^']+)'/)
    it("extracts update frequency", () => {
      trackSearchResultParameters({
        properties: "id,centroid",
        text: "test",
        filter: "update_frequency='real-time'",
      } as SearchParameters);

      expect(mockTrack).toHaveBeenCalledWith("search_result_params", {
        search_text: "test",
        update_frequency: "real-time",
        has_co_data: "false",
      });
    });

    // Tests: analyticsData.has_co_data = searchParams.filter.includes("assets_summary IS NOT NULL") ? "true" : "false"
    it("sets has_co_data to true when assets_summary exists", () => {
      trackSearchResultParameters({
        properties: "id,centroid",
        text: "test",
        filter: "(assets_summary IS NOT NULL)",
      } as SearchParameters);

      expect(mockTrack).toHaveBeenCalledWith("search_result_params", {
        search_text: "test",
        has_co_data: "true",
      });
    });

    // Tests: analyticsData.has_co_data = searchParams.filter.includes("assets_summary IS NOT NULL") ? "true" : "false"
    it("sets has_co_data to false when assets_summary does not exist", () => {
      trackSearchResultParameters({
        properties: "id,centroid",
        text: "test",
        filter: "dataset_group='test'",
      } as SearchParameters);

      expect(mockTrack).toHaveBeenCalledWith("search_result_params", {
        search_text: "test",
        dataset_group: "test",
        has_co_data: "false",
      });
    });

    // Tests: All extraction logic together
    it("extracts all parameters together", () => {
      trackSearchResultParameters({
        properties: "id,centroid",
        text: "comprehensive test",
        filter:
          "page_size=1500 AND dataset_group='imas' AND (assets_summary IS NOT NULL) AND update_frequency='real-time' AND temporal DURING 1984-06-08T00:00:00Z/2010-05-13T00:00:00Z AND BBOX(geometry,143.5,-39.3,144.0,-38.9) AND INTERSECTS(geometry,POLYGON ((143.6 -39.1, 143.6 -38.9))) AND (parameter_vocabs='temperature') AND (platform_vocabs='vessel')",
      } as SearchParameters);

      expect(mockTrack).toHaveBeenCalledWith("search_result_params", {
        search_text: "comprehensive test",
        bbox: "143.5,-39.3,144.0,-38.9",
        temporal_start: "1984-06-08T00:00:00Z",
        temporal_end: "2010-05-13T00:00:00Z",
        polygon: "143.6 -39.1, 143.6 -38.9",
        parameter_vocabs: "temperature",
        platform_vocabs: "vessel",
        dataset_group: "imas",
        update_frequency: "real-time",
        has_co_data: "true",
      });
    });
  });

  describe("Session-Based Deduplication", () => {
    // Tests: sessionStorage.setItem("lastSearch", searchKey)
    it("tracks first search", () => {
      trackSearchResultParameters({
        properties: "id,centroid",
        text: "test",
        filter: "dataset_group='imas'", // Use a filter that won't be removed
      } as SearchParameters);

      expect(mockTrack).toHaveBeenCalledTimes(1);
      expect(mockStorage.getItem("lastSearch")).toBe(
        "test__dataset_group='imas'"
      );
    });

    // Tests: if (searchKey === lastTracked) return;
    it("skips duplicate search within session", () => {
      const params = {
        properties: "id,centroid",
        text: "test",
        filter: "dataset_group='test'",
      } as SearchParameters;

      // First call should track
      trackSearchResultParameters(params);
      expect(mockTrack).toHaveBeenCalledTimes(1);

      // Second call should be skipped
      trackSearchResultParameters(params);
      expect(mockTrack).toHaveBeenCalledTimes(1);
    });

    // Tests: Different searchKey should track
    it("tracks different searches", () => {
      trackSearchResultParameters({
        properties: "id,centroid",
        text: "first search",
        filter: "dataset_group='test'",
      } as SearchParameters);

      trackSearchResultParameters({
        properties: "id,centroid",
        text: "second search",
        filter: "dataset_group='test'",
      } as SearchParameters);

      expect(mockTrack).toHaveBeenCalledTimes(2);
    });

    // Tests: extractUserFilters() removes BBOX, INTERSECTS, page_size
    it("ignores technical parameters in deduplication key", () => {
      const params1 = {
        properties: "id,centroid",
        text: "test",
        filter:
          "page_size=1500 AND BBOX(geometry,1,2,3,4) AND dataset_group='test'",
      } as SearchParameters;

      const params2 = {
        properties: "id,centroid",
        text: "test",
        filter:
          "page_size=2000 AND BBOX(geometry,5,6,7,8) AND dataset_group='test'",
      } as SearchParameters;

      // Both should have same deduplication key (ignoring page_size and BBOX)
      trackSearchResultParameters(params1);
      trackSearchResultParameters(params2);

      expect(mockTrack).toHaveBeenCalledTimes(1); // Second call skipped
    });

    // Tests: setTimeout(() => { if (currentSearch === searchKey) sessionStorage.removeItem("lastSearch"); }, 2000)
    it("clears storage after timeout", () => {
      vi.useFakeTimers();

      trackSearchResultParameters({
        properties: "id,centroid",
        text: "test",
        filter: "dataset_group='test'",
      } as SearchParameters);

      expect(mockStorage.getItem("lastSearch")).toBe(
        "test__dataset_group='test'"
      );

      // Fast-forward 2 seconds
      vi.advanceTimersByTime(2000);

      expect(mockStorage.getItem("lastSearch")).toBeNull();

      vi.useRealTimers();
    });

    // Tests: setTimeout checks if currentSearch === searchKey before clearing
    it("does not clear storage if different search was tracked", () => {
      vi.useFakeTimers();

      // Track first search
      trackSearchResultParameters({
        properties: "id,centroid",
        text: "first",
        filter: "dataset_group='test'",
      } as SearchParameters);

      expect(mockStorage.getItem("lastSearch")).toBe(
        "first__dataset_group='test'"
      );

      // Track second search after 1 second (before first timeout)
      vi.advanceTimersByTime(1000);
      trackSearchResultParameters({
        properties: "id,centroid",
        text: "second",
        filter: "dataset_group='test'",
      } as SearchParameters);

      expect(mockStorage.getItem("lastSearch")).toBe(
        "second__dataset_group='test'"
      );

      // Fast-forward another 1.5 seconds (total 2.5 seconds)
      // The first search's timeout should not clear because storage has different value
      vi.advanceTimersByTime(1500);

      expect(mockStorage.getItem("lastSearch")).toBe(
        "second__dataset_group='test'"
      );

      vi.useRealTimers();
    });
  });
});
