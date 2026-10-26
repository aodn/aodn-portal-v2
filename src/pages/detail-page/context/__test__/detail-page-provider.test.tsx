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

const SelectionConsumer: FC = () => {
  const {
    selectedCoKey,
    setSelectedCoKey,
    selectionGeneration,
    isCurrentSelectionGeneration,
  } = useDetailPageContext();

  return (
    <div>
      <TestConsumer />
      {["A", "B", "C"].map((key) => (
        <button key={key} onClick={() => setSelectedCoKey(key)}>
          {`select-${key}`}
        </button>
      ))}
      <button
        onClick={() => {
          setSelectedCoKey("B");
          setSelectedCoKey("C");
        }}
      >
        rapid-B-C
      </button>
      <div data-testid="selected-key">{selectedCoKey}</div>
      <div data-testid="generation">{selectionGeneration}</div>
      <div data-testid="generation-0-current">
        {String(isCurrentSelectionGeneration(0))}
      </div>
    </div>
  );
};

const conditionTypes = () =>
  (screen.getByTestId("condition-types").textContent ?? "")
    .split(",")
    .filter(Boolean)
    .sort();

describe("setSelectedCoKey", () => {
  beforeEach(() => {
    vi.mocked(useParams).mockReturnValue({});
  });

  afterEach(() => {
    cleanup();
  });

  const renderSelection = () =>
    render(
      <Provider store={store}>
        <DetailPageProvider>
          <SelectionConsumer />
        </DetailPageProvider>
      </Provider>
    );

  const ALL_TYPES = [
    DownloadConditionType.BBOX,
    DownloadConditionType.POLYGON,
    DownloadConditionType.DATE_RANGE,
    DownloadConditionType.FORMAT,
    DownloadConditionType.KEY,
  ].sort();

  it("keeps DATE_RANGE on the initial default selection", async () => {
    const user = userEvent.setup();
    renderSelection();

    await user.click(screen.getByRole("button", { name: "seed" }));
    await user.click(screen.getByRole("button", { name: "select-A" }));

    expect(screen.getByTestId("selected-key").textContent).toBe("A");
    expect(screen.getByTestId("generation").textContent).toBe("0");
    expect(conditionTypes()).toEqual(ALL_TYPES);
  });

  it("clears only DATE_RANGE when the dataset actually changes", async () => {
    const user = userEvent.setup();
    renderSelection();

    await user.click(screen.getByRole("button", { name: "select-A" }));
    await user.click(screen.getByRole("button", { name: "seed" }));
    await user.click(screen.getByRole("button", { name: "select-B" }));

    expect(screen.getByTestId("selected-key").textContent).toBe("B");
    expect(screen.getByTestId("generation").textContent).toBe("1");
    expect(screen.getByTestId("generation-0-current").textContent).toBe(
      "false"
    );
    expect(conditionTypes()).toEqual(
      ALL_TYPES.filter((t) => t !== DownloadConditionType.DATE_RANGE)
    );
  });

  it("keeps DATE_RANGE when the same dataset is selected again", async () => {
    const user = userEvent.setup();
    renderSelection();

    await user.click(screen.getByRole("button", { name: "select-A" }));
    await user.click(screen.getByRole("button", { name: "seed" }));
    await user.click(screen.getByRole("button", { name: "select-A" }));

    expect(screen.getByTestId("generation").textContent).toBe("0");
    expect(screen.getByTestId("generation-0-current").textContent).toBe("true");
    expect(conditionTypes()).toEqual(ALL_TYPES);
  });

  it("handles rapid switches within one event", async () => {
    const user = userEvent.setup();
    renderSelection();

    await user.click(screen.getByRole("button", { name: "select-A" }));
    await user.click(screen.getByRole("button", { name: "seed" }));
    await user.click(screen.getByRole("button", { name: "rapid-B-C" }));

    expect(screen.getByTestId("selected-key").textContent).toBe("C");
    expect(screen.getByTestId("generation").textContent).toBe("2");
    expect(conditionTypes()).not.toContain(DownloadConditionType.DATE_RANGE);
  });
});
