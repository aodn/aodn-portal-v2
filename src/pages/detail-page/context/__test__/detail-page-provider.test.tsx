import { FC } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { Provider } from "react-redux";
import { useParams } from "react-router-dom";
import store from "@/app/store/store";
import { DetailPageProvider } from "../detail-page-provider";
import { useDetailPageContext } from "../detail-page-context";
import {
  BBoxCondition,
  DateRangeCondition,
  DownloadConditionType,
  FormatCondition,
  KeyCondition,
  PolygonCondition,
} from "../DownloadDefinitions";

vi.mock("react-router-dom", async () => ({
  ...(await vi.importActual("react-router-dom")),
  useParams: vi.fn(),
}));

const TestConsumer: FC = () => {
  const {
    downloadConditions,
    getAndSetDownloadConditions,
    clearDownloadConditions,
  } = useDetailPageContext();

  return (
    <div>
      <button
        onClick={() => {
          getAndSetDownloadConditions(DownloadConditionType.BBOX, [
            new BBoxCondition("bbox-1", [0, 0, 1, 1]),
          ]);
          getAndSetDownloadConditions(DownloadConditionType.POLYGON, [
            new PolygonCondition("polygon-1", [
              [0, 0],
              [1, 0],
              [1, 1],
            ]),
          ]);
          getAndSetDownloadConditions(DownloadConditionType.DATE_RANGE, [
            new DateRangeCondition("date-1", "2020-01-01", "2020-01-02"),
          ]);
          getAndSetDownloadConditions(DownloadConditionType.FORMAT, [
            new FormatCondition("format-1", "csv"),
          ]);
          getAndSetDownloadConditions(DownloadConditionType.KEY, [
            new KeyCondition("key-1", "some-key"),
          ]);
        }}
      >
        seed
      </button>
      <button
        onClick={() =>
          clearDownloadConditions([
            DownloadConditionType.BBOX,
            DownloadConditionType.POLYGON,
            DownloadConditionType.DATE_RANGE,
          ])
        }
      >
        clear
      </button>
      <div data-testid="condition-types">
        {downloadConditions.map((c) => c.type).join(",")}
      </div>
    </div>
  );
};

describe("clearDownloadConditions", () => {
  beforeEach(() => {
    vi.mocked(useParams).mockReturnValue({});
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("removes exactly BBOX/POLYGON/DATE_RANGE, leaves FORMAT/KEY intact", async () => {
    const user = userEvent.setup();
    render(
      <Provider store={store}>
        <DetailPageProvider>
          <TestConsumer />
        </DetailPageProvider>
      </Provider>
    );

    await user.click(screen.getByRole("button", { name: "seed" }));

    await waitFor(() => {
      const types = screen.getByTestId("condition-types").textContent;
      expect(types?.split(",")).toEqual(
        expect.arrayContaining([
          DownloadConditionType.BBOX,
          DownloadConditionType.POLYGON,
          DownloadConditionType.DATE_RANGE,
          DownloadConditionType.FORMAT,
          DownloadConditionType.KEY,
        ])
      );
    });

    await user.click(screen.getByRole("button", { name: "clear" }));

    await waitFor(() => {
      const types = screen.getByTestId("condition-types").textContent;
      expect(types?.split(",").sort()).toEqual(
        [DownloadConditionType.FORMAT, DownloadConditionType.KEY].sort()
      );
    });
  });
});
