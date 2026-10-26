import { FC } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { Provider } from "react-redux";
import { useParams } from "react-router-dom";
import store from "@/app/store/store";
import { OGCCollection } from "@/app/store/OGCCollectionDefinitions";
import MapContext from "@/components/map/mapbox/MapContext";
import { DetailPageProvider } from "@/pages/detail-page/context/detail-page-provider";
import { useDetailPageContext } from "@/pages/detail-page/context/detail-page-context";
import {
  BBoxCondition,
  DateRangeCondition,
  DownloadConditionType,
} from "@/pages/detail-page/context/DownloadDefinitions";
import PMTilesHexLayer from "../PMTilesLayer";

vi.mock("mapbox-gl", () => ({}));

vi.mock("react-router-dom", async () => ({
  ...(await vi.importActual("react-router-dom")),
  useParams: vi.fn(),
}));

// No S3 sidecar in unit tests; the selection path does not depend on it.
vi.mock("../Common", async (importOriginal) => ({
  ...((await importOriginal()) as object),
  probePmtilesMetadata: vi.fn(() => Promise.resolve(null)),
}));

const DIVE = "animal_dive_satellite_relay_tagging_location_qc_realtime_qc";
const METADATA =
  "animal_metadata_satellite_relay_tagging_location_qc_realtime_qc";

const collection = {
  id: "b2548767-514f-4a31-b65e-36bb894382d5",
  getAllCOKeys: () => [`${DIVE}.parquet`, `${METADATA}.parquet`],
  getAllParquetKeys: () => [`${DIVE}.parquet`, `${METADATA}.parquet`],
} as unknown as OGCCollection;

// Wires the layer exactly as MapPanel does: layerConfig/onLayerChange come
// straight from the detail-page context.
const Harness: FC = () => {
  const {
    downloadConditions,
    getAndSetDownloadConditions,
    selectedCoKey,
    setSelectedCoKey,
  } = useDetailPageContext();
  return (
    <>
      <button onClick={() => setSelectedCoKey(`${DIVE}.parquet`)}>init</button>
      <button
        onClick={() => {
          getAndSetDownloadConditions(DownloadConditionType.DATE_RANGE, [
            new DateRangeCondition("date-1", "2026-09-01", "2026-10-01"),
          ]);
          getAndSetDownloadConditions(DownloadConditionType.BBOX, [
            new BBoxCondition("bbox-1", [110, -40, 150, -10]),
          ]);
        }}
      >
        seed
      </button>
      <div data-testid="selected-key">{selectedCoKey}</div>
      <div data-testid="condition-types">
        {downloadConditions.map((c) => c.type).join(",")}
      </div>
      <MapContext.Provider value={{ map: undefined } as never}>
        <PMTilesHexLayer
          collection={collection}
          visible
          layerConfig={selectedCoKey}
          onLayerChange={setSelectedCoKey}
        />
      </MapContext.Provider>
    </>
  );
};

const conditionTypes = () =>
  (screen.getByTestId("condition-types").textContent ?? "").split(",");

const chooseDataset = async (
  user: ReturnType<typeof userEvent.setup>,
  label: string
) => {
  await user.click(screen.getByRole("combobox"));
  await user.click(await screen.findByRole("option", { name: label }));
};

describe("PMTilesHexLayer dataset selection", () => {
  beforeEach(() => {
    window.scrollTo = vi.fn();
    vi.mocked(useParams).mockReturnValue({});
  });

  afterEach(() => {
    cleanup();
  });

  const setup = async () => {
    const user = userEvent.setup();
    render(
      <Provider store={store}>
        <DetailPageProvider>
          <Harness />
        </DetailPageProvider>
      </Provider>
    );
    await user.click(screen.getByRole("button", { name: "init" }));
    await user.click(screen.getByRole("button", { name: "seed" }));
    return user;
  };

  it("clears DATE_RANGE and keeps BBOX when switching dataset on the map", async () => {
    const user = await setup();

    await chooseDataset(user, METADATA);

    await waitFor(() => {
      expect(screen.getByTestId("selected-key").textContent).toBe(
        `${METADATA}.parquet`
      );
    });
    expect(conditionTypes()).not.toContain(DownloadConditionType.DATE_RANGE);
    expect(conditionTypes()).toContain(DownloadConditionType.BBOX);
  });

  it("keeps DATE_RANGE when the already-selected dataset is chosen", async () => {
    const user = await setup();

    await chooseDataset(user, DIVE);

    expect(screen.getByTestId("selected-key").textContent).toBe(
      `${DIVE}.parquet`
    );
    expect(conditionTypes()).toEqual(
      expect.arrayContaining([
        DownloadConditionType.DATE_RANGE,
        DownloadConditionType.BBOX,
      ])
    );
  });
});
