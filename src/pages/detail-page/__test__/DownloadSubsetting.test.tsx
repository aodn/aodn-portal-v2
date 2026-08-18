import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  DateRangeCondition,
  defaultMapSubsettingCapabilities,
  DownloadConditionType,
  SubsettingType,
} from "../context/DownloadDefinitions";
import {
  DetailPageContext,
  DetailPageContextDefault,
} from "../context/detail-page-context";
import DownloadSubsetting from "../features/download/DownloadSubsetting";

vi.mock(
  "../features/download/subset-conditions/DateRangeConditionCard",
  () => ({
    default: ({ dateRangeCondition, minDate, maxDate, onChange }: any) => (
      <div data-testid="date-range-card">
        <span data-testid="from-date">{dateRangeCondition.start}</span>
        <span data-testid="to-date">{dateRangeCondition.end}</span>
        <span data-testid="minimum-date">{minDate?.format("YYYY-MM-DD")}</span>
        <span data-testid="maximum-date">{maxDate?.format("YYYY-MM-DD")}</span>
        <button onClick={() => onChange("2008-03-03", dateRangeCondition.end)}>
          Change from date
        </button>
      </div>
    ),
  })
);

describe("DownloadSubsetting time range", () => {
  const getAndSetDownloadConditions = vi.fn(() => []);
  const removeDownloadCondition = vi.fn();

  const renderComponent = (downloadConditions: DateRangeCondition[] = []) =>
    render(
      <DetailPageContext.Provider
        value={{
          ...DetailPageContextDefault,
          downloadConditions,
          getAndSetDownloadConditions,
          removeDownloadCondition,
          mapSubsettingCapabilities: {
            ...defaultMapSubsettingCapabilities,
            selectedLayerId: "PMTiles",
            hasCloudOptimisedData: true,
            timeRangeBounds: {
              min: "2006-10-01",
              max: "2024-12-31",
            },
          },
          isSubsettingSupported: (type) => type === SubsettingType.TimeSlider,
        }}
      >
        <DownloadSubsetting
          downloadConditions={downloadConditions}
          getAndSetDownloadConditions={getAndSetDownloadConditions}
          removeDownloadCondition={removeDownloadCondition}
        />
      </DetailPageContext.Provider>
    );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("initializes the card and picker limits from the map slider bounds", () => {
    renderComponent();

    expect(screen.getByTestId("from-date")).toHaveTextContent("2006-10-01");
    expect(screen.getByTestId("to-date")).toHaveTextContent("2024-12-31");
    expect(screen.getByTestId("minimum-date")).toHaveTextContent("2006-10-01");
    expect(screen.getByTestId("maximum-date")).toHaveTextContent("2024-12-31");
  });

  it("allows an earlier valid date and stores it as the shared condition", () => {
    renderComponent();

    fireEvent.click(screen.getByRole("button", { name: "Download Selection" }));
    fireEvent.click(screen.getByRole("button", { name: "Change from date" }));

    expect(getAndSetDownloadConditions).toHaveBeenCalledWith(
      DownloadConditionType.DATE_RANGE,
      [
        expect.objectContaining({
          start: "2008-03-03",
          end: "2024-12-31",
        }),
      ]
    );
  });

  it("shows an existing slider selection while retaining the full bounds", () => {
    renderComponent([
      new DateRangeCondition("slider-selection", "2008-03-03", "2020-06-30"),
    ]);

    expect(screen.getByTestId("from-date")).toHaveTextContent("2008-03-03");
    expect(screen.getByTestId("to-date")).toHaveTextContent("2020-06-30");
    expect(screen.getByTestId("minimum-date")).toHaveTextContent("2006-10-01");
    expect(screen.getByTestId("maximum-date")).toHaveTextContent("2024-12-31");
  });
});
