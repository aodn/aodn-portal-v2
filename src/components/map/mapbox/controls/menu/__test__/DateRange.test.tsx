import { FC, useState } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import { Provider } from "react-redux";
import { useParams } from "react-router-dom";
import type { Map } from "mapbox-gl";
import store from "@/app/store/store";
import { DetailPageProvider } from "@/pages/detail-page/context/detail-page-provider";
import { useDetailPageContext } from "@/pages/detail-page/context/detail-page-context";
import {
  BBoxCondition,
  DateRangeCondition,
  DownloadConditionType,
} from "@/pages/detail-page/context/DownloadDefinitions";
import { dateDefault } from "@/components/common/constants";
import { dayjsToUnixMs, formatDate, toAppDayjs } from "@/utils/DateUtils";
import DateRange from "../DateRange";

vi.mock("react-router-dom", async () => ({
  ...(await vi.importActual("react-router-dom")),
  useParams: vi.fn(),
}));

const DEBOUNCE_FLUSH_MS = 600;

// Bounds from the reported collection: dive dataset vs metadata dataset.
const DIVE = { key: "dive.parquet", min: "2025-06-01", max: "2026-10-26" };
const META = { key: "metadata.parquet", min: "2025-12-16", max: "2026-05-28" };
const OTHER = { key: "other.parquet", min: "2025-06-01", max: "2026-10-26" };

const toMin = (d: string) =>
  dayjsToUnixMs(toAppDayjs(d, dateDefault.DATE_FORMAT));
const toMax = (d: string) =>
  dayjsToUnixMs(toAppDayjs(d, dateDefault.DATE_FORMAT), true);

/**
 * Renders DateRange with props sourced from the real detail-page context.
 *
 * MenuControl renders DateRange in its own React root and forwards new props
 * from an effect, so DateRange can lag behind the provider. `sync` mirrors
 * that: when false, DateRange keeps the props it had until "deliver" is
 * clicked, so a debounced commit runs with its original (stale) closure.
 */
const Harness: FC<{ sync: boolean }> = ({ sync }) => {
  const {
    downloadConditions,
    getAndSetDownloadConditions,
    selectedCoKey,
    setSelectedCoKey,
    selectionGeneration,
    isCurrentSelectionGeneration,
  } = useDetailPageContext();
  const [mapContainer] = useState(() => {
    const div = document.createElement("div");
    document.body.appendChild(div);
    return div;
  });
  const map = { getContainer: () => mapContainer } as unknown as Map;

  const datasets = [DIVE, META, OTHER];
  const current = datasets.find((d) => d.key === selectedCoKey) ?? DIVE;
  const liveProps = {
    minDate: current.min,
    maxDate: current.max,
    downloadConditions,
    selectionGeneration,
  };
  const [deliveredProps, setDeliveredProps] = useState(liveProps);
  const props = sync ? liveProps : deliveredProps;

  return (
    <>
      {datasets.map((d) => (
        <button key={d.key} onClick={() => setSelectedCoKey(d.key)}>
          {`select-${d.key}`}
        </button>
      ))}
      <button
        onClick={() => {
          setSelectedCoKey(META.key);
          setSelectedCoKey(OTHER.key);
        }}
      >
        rapid
      </button>
      <button
        onClick={() =>
          getAndSetDownloadConditions(DownloadConditionType.BBOX, [
            new BBoxCondition("bbox-1", [110, -40, 150, -10]),
          ])
        }
      >
        seed-bbox
      </button>
      <button
        onClick={() =>
          getAndSetDownloadConditions(DownloadConditionType.DATE_RANGE, [
            new DateRangeCondition("date-1", "2026-09-01", "2026-10-01"),
          ])
        }
      >
        seed-range
      </button>
      <button onClick={() => setDeliveredProps(liveProps)}>deliver</button>
      <div data-testid="condition-types">
        {downloadConditions.map((c) => c.type).join(",")}
      </div>
      <div data-testid="date-range">
        {downloadConditions
          .filter((c) => c.type === DownloadConditionType.DATE_RANGE)
          .map((c) => {
            const r = c as DateRangeCondition;
            return `${r.start}/${r.end}`;
          })
          .join(",")}
      </div>
      <DateRange
        {...props}
        getAndSetDownloadConditions={getAndSetDownloadConditions}
        isCurrentSelectionGeneration={isCurrentSelectionGeneration}
        map={map}
      />
    </>
  );
};

const click = (name: string) =>
  fireEvent.click(screen.getByRole("button", { name }));

const dateRange = () => screen.getByTestId("date-range").textContent;
const conditionTypes = () =>
  (screen.getByTestId("condition-types").textContent ?? "").split(",");

const openMenu = () =>
  fireEvent.click(screen.getByTestId("daterange-show-hide-menu-button"));

/** Move the start thumb one day: DateSlider schedules a debounced commit. */
const nudgeStartThumb = () => {
  const [startThumb] = screen.getAllByRole("slider");
  fireEvent.keyDown(startThumb, { key: "ArrowRight" });
};

const flushDebounce = () =>
  act(() => {
    vi.advanceTimersByTime(DEBOUNCE_FLUSH_MS);
  });

describe("DateRange dataset selection guard", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.mocked(useParams).mockReturnValue({});
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    document.body.innerHTML = "";
  });

  const start = (sync: boolean) => {
    render(
      <Provider store={store}>
        <DetailPageProvider>
          <Harness sync={sync} />
        </DetailPageProvider>
      </Provider>
    );
    click(`select-${DIVE.key}`); // initial default selection ("" → dive)
    click("deliver");
    openMenu();
  };

  it("commits a slider change when the dataset has not changed", () => {
    start(false);

    nudgeStartThumb();
    flushDebounce();

    expect(dateRange()).toBe("2025-06-02/2026-10-26");
  });

  it("rejects a pending commit scheduled before a dataset switch", () => {
    start(false);
    click("seed-bbox");

    nudgeStartThumb();
    // Switch while the commit is pending. DateRange still holds the old
    // props (and the same bounds), so the debounce is not cancelled by a
    // callback identity change; only the generation guard can stop it.
    click(`select-${OTHER.key}`);
    flushDebounce();

    expect(dateRange()).toBe("");
    expect(conditionTypes()).toContain(DownloadConditionType.BBOX);
  });

  it("rejects a pending commit across rapid switches", () => {
    start(false);

    nudgeStartThumb();
    click("rapid");
    flushDebounce();
    click("deliver");
    flushDebounce();

    expect(dateRange()).toBe("");
  });

  it("still commits when the same dataset is reselected mid-debounce", () => {
    start(false);

    nudgeStartThumb();
    click(`select-${DIVE.key}`);
    flushDebounce();

    expect(dateRange()).toBe("2025-06-02/2026-10-26");
  });

  it("accepts new slider changes once the new generation is delivered", () => {
    start(true);

    click(`select-${OTHER.key}`);
    nudgeStartThumb();
    flushDebounce();

    expect(dateRange()).toBe("2025-06-02/2026-10-26");
  });

  it("resets the slider to the new dataset's full range on switch", () => {
    start(true);
    click("seed-range");
    click("seed-bbox");

    // The previous subset (Sep–Oct 2026) is restored into the slider.
    let [startThumb, endThumb] = screen.getAllByRole("slider");
    expect(Number(startThumb.getAttribute("aria-valuenow"))).toBe(
      toMin("2026-09-01")
    );

    click(`select-${META.key}`);
    act(() => {
      vi.runOnlyPendingTimers();
    });

    expect(dateRange()).toBe("");
    expect(conditionTypes()).toContain(DownloadConditionType.BBOX);

    [startThumb, endThumb] = screen.getAllByRole("slider");
    expect(Number(startThumb.getAttribute("aria-valuenow"))).toBe(
      toMin(META.min)
    );
    expect(Number(endThumb.getAttribute("aria-valuenow"))).toBe(
      toMax(META.max)
    );
    // Rail captions (MUI value labels repeat the same text, hence getAll).
    const slider = within(
      screen.getByTestId("dateslider-daterange-menu-button")
    );
    expect(
      slider.getAllByText(
        formatDate(toAppDayjs(META.min, dateDefault.DATE_FORMAT))
      ).length
    ).toBeGreaterThan(0);
    expect(
      slider.getAllByText(
        formatDate(toAppDayjs(META.max, dateDefault.DATE_FORMAT))
      ).length
    ).toBeGreaterThan(0);
  });
});
