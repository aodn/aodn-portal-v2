import {
  describe,
  it,
  expect,
  vi,
  beforeAll,
  beforeEach,
  afterEach,
  afterAll,
} from "vitest";
import {
  act,
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import { Provider } from "react-redux";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { http, HttpResponse } from "msw";
import { AppLocalizationProvider } from "@/app/providers/AppLocalizationProvider";
import dayjs, { Dayjs } from "@/utils/DayjsUtils";
import DateRangeFilter from "../DateRangeFilter";
import { dateDefault } from "../../common/constants";
import paramReducer, {
  clearComponentParam,
  DateTimeFilterRange,
  ParameterState,
  updateDateTimeFilterRange,
  updateParameterStates,
} from "@/app/store/componentParamReducer";
import { dayjsToUnixMs, toAppDayjs, unixMsToAppDayjs } from "@/utils/DateUtils";
import { server } from "@/__mocks__/server";

let capturedImosDataIds: string[] | undefined;
let capturedChartStart: Dayjs | undefined;

vi.mock("../../common/charts/TimeRangeBarChart", () => ({
  default: (props: { imosDataIds: string[]; selectedStartDate: Dayjs }) => {
    capturedImosDataIds = props.imosDataIds;
    capturedChartStart = props.selectedStartDate;
    return <div data-testid="time-range-bar-chart" />;
  },
}));

vi.mock("../../../hooks/useBreakpoint", () => ({
  default: () => ({
    isMobile: false,
    isTablet: false,
    isLaptop: false,
    isDesktop: true,
    is4K: false,
    isAboveDesktop: false,
    isUnderLaptop: false,
  }),
}));

const mockInitialState: { paramReducer: ParameterState } = {
  paramReducer: {
    dateTimeFilterRange: {},
  },
};

const createMockStore = (initialState = mockInitialState) => {
  const store = configureStore({
    reducer: combineReducers({
      paramReducer,
    }),
  });
  store.dispatch(updateParameterStates(initialState.paramReducer));
  return store;
};

describe("DateRangeFilter", () => {
  let store: ReturnType<typeof createMockStore>;

  beforeAll(() => {
    server.listen();
  });

  beforeEach(() => {
    store = createMockStore();
    vi.spyOn(store, "dispatch");
    server.use(
      http.get("/api/v1/ogc/collections", () =>
        HttpResponse.json({ collections: [] })
      )
    );
    capturedImosDataIds = undefined;
    capturedChartStart = undefined;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    server.resetHandlers();
  });

  afterAll(() => {
    server.close();
  });

  const renderComponent = () =>
    render(
      <Provider store={store}>
        <AppLocalizationProvider>
          <DateRangeFilter />
        </AppLocalizationProvider>
      </Provider>
    );

  it("renders correctly with initial state", () => {
    renderComponent();

    expect(screen.getByText("Custom")).toBeInTheDocument();
    expect(screen.getByText("Last year")).toBeInTheDocument();
    expect(screen.getByText("Last 5 years")).toBeInTheDocument();
    expect(screen.getByText("Last 10 years")).toBeInTheDocument();
    expect(screen.getByText("Start Date")).toBeInTheDocument();
    expect(screen.getByText("End Date")).toBeInTheDocument();

    const radioButtons = screen.getAllByRole("radio");
    expect(radioButtons).toHaveLength(4);
    expect(radioButtons[0]).toBeChecked();
    expect(screen.getByDisplayValue("01 Jan 1970")).toBeInTheDocument();
    expect(screen.getAllByRole("slider")[0]).toHaveAttribute(
      "aria-valuemin",
      dateDefault.min.valueOf().toString()
    );
    expect(screen.getAllByRole("slider")[0]).toHaveAttribute(
      "aria-valuenow",
      "0"
    );
    expect(capturedChartStart?.valueOf()).toBe(0);
    expect(dispatchedDateRanges()).toHaveLength(0);
  });

  it.each<DateTimeFilterRange>([
    {
      start: dayjs.utc("1900-01-01").valueOf(),
      end: dayjs.utc("1950-01-01").valueOf(),
    },
    {
      start: dayjs.utc("1820-01-01").valueOf(),
      end: dayjs.utc("1950-01-01").valueOf(),
    },
    { end: dayjs.utc("1950-01-01").valueOf() },
  ])("preserves historical search bounds without dispatching: %j", (range) => {
    store = createMockStore({ paramReducer: { dateTimeFilterRange: range } });
    vi.spyOn(store, "dispatch");
    renderComponent();

    const expectedFloor = Math.min(
      dateDefault.min.valueOf(),
      range.start ?? Infinity,
      range.end ?? Infinity
    );
    const expectedStart = range.start ?? expectedFloor;
    const sliders = screen.getAllByRole("slider");
    expect(Number(sliders[0].getAttribute("aria-valuemin"))).toBe(
      expectedFloor
    );
    expect(Number(sliders[0].getAttribute("aria-valuenow"))).toBe(
      expectedStart
    );
    expect(Number(sliders[1].getAttribute("aria-valuenow"))).toBe(range.end);
    expect(capturedChartStart?.valueOf()).toBe(expectedStart);
    expect(
      screen.getByDisplayValue(
        unixMsToAppDayjs(expectedStart).format(dateDefault.DISPLAY_FORMAT)
      )
    ).toBeInTheDocument();
    expect(store.getState().paramReducer.dateTimeFilterRange).toEqual(range);
    expect(dispatchedDateRanges()).toHaveLength(0);
  });

  it("returns to 1970 when a historical search is cleared", () => {
    store = createMockStore({
      paramReducer: {
        dateTimeFilterRange: {
          start: dayjs.utc("1900-01-01").valueOf(),
          end: dayjs.utc("1950-01-01").valueOf(),
        },
      },
    });
    renderComponent();

    act(() => {
      store.dispatch(clearComponentParam());
    });

    expect(screen.getByDisplayValue("01 Jan 1970")).toBeInTheDocument();
    expect(screen.getAllByRole("slider")[0]).toHaveAttribute(
      "aria-valuemin",
      dateDefault.min.valueOf().toString()
    );
    expect(capturedChartStart?.valueOf()).toBe(0);
    expect(store.getState().paramReducer.dateTimeFilterRange).toEqual({});
  });

  it.each(["1830-01-01", "1850-01-01", "1969-12-31"])(
    "accepts a historical start date without changing the slider scale: %s",
    (date) => {
      renderComponent();
      const selectedDate = toAppDayjs(date, dateDefault.DATE_FORMAT);
      fireEvent.change(screen.getByDisplayValue("01 Jan 1970"), {
        target: { value: selectedDate.format(dateDefault.DISPLAY_FORMAT) },
      });

      expect(store.getState().paramReducer.dateTimeFilterRange?.start).toBe(
        selectedDate.valueOf()
      );
      expect(capturedChartStart?.valueOf()).toBe(selectedDate.valueOf());
      expect(
        Number(screen.getAllByRole("slider")[0].getAttribute("aria-valuemin"))
      ).toBe(dateDefault.min.valueOf());
      expect(
        Number(screen.getAllByRole("slider")[0].getAttribute("aria-valuenow"))
      ).toBe(selectedDate.valueOf());

      fireEvent.change(
        screen.getByDisplayValue(
          selectedDate.format(dateDefault.DISPLAY_FORMAT)
        ),
        {
          target: { value: "01 Jan 1970" },
        }
      );

      expect(store.getState().paramReducer.dateTimeFilterRange?.start).toBe(0);
      expect(capturedChartStart?.valueOf()).toBe(0);
      expect(screen.getAllByRole("slider")[0]).toHaveAttribute(
        "aria-valuemin",
        dateDefault.min.valueOf().toString()
      );
    }
  );

  it.each(["1830-01-01", "1960-01-01"])(
    "lets the start thumb reach %s on the historical scale",
    (date) => {
      renderComponent();
      const startThumb = screen.getAllByRole("slider")[0];
      const historicalStart = dayjs.utc(date).valueOf();

      fireEvent.change(startThumb, { target: { value: historicalStart } });

      expect(store.getState().paramReducer.dateTimeFilterRange?.start).toBe(
        historicalStart
      );
      expect(capturedChartStart?.valueOf()).toBe(historicalStart);
      expect(startThumb).toHaveAttribute(
        "aria-valuemin",
        dateDefault.min.valueOf().toString()
      );
    }
  );

  it("rejects dates before 1830 for a new search", () => {
    renderComponent();
    fireEvent.change(screen.getByDisplayValue("01 Jan 1970"), {
      target: { value: "31 Dec 1829" },
    });

    expect(screen.getByDisplayValue("01 Jan 1970")).toBeInTheDocument();
    expect(dispatchedDateRanges()).toHaveLength(0);
  });

  it("updates radio selection and dispatches date range update for Last year", () => {
    renderComponent();
    fireEvent.click(screen.getByLabelText("Last year"));

    expect(screen.getByLabelText("Last year")).toBeChecked();
    expect(store.dispatch).toHaveBeenCalledWith(
      updateDateTimeFilterRange({
        start: expect.any(Number),
        end: expect.any(Number),
      })
    );
  });

  it("updates date range when start date is changed via date picker", () => {
    renderComponent();
    const minDate = "01 Jan 1970";
    const startDatePicker = screen.getByDisplayValue(minDate);
    const newDate = toAppDayjs("2020-01-01", dateDefault.DATE_FORMAT);
    fireEvent.change(startDatePicker, {
      target: { value: newDate.format(dateDefault.DISPLAY_FORMAT) },
    });

    const lastRange = vi
      .mocked(store.dispatch)
      .mock.calls.map(([action]) => action as { type?: string; payload?: any })
      .filter((action) => action?.type === "UPDATE_DATETIME_FILTER_VARIABLE")
      .at(-1);
    expect(
      unixMsToAppDayjs(lastRange?.payload?.dateTimeFilterRange?.start).format(
        dateDefault.DATE_FORMAT
      )
    ).toBe("2020-01-01");
  });

  const dispatchedDateRanges = () =>
    vi
      .mocked(store.dispatch)
      .mock.calls.map(([action]) => action as { type?: string; payload?: any })
      .filter((action) => action?.type === "UPDATE_DATETIME_FILTER_VARIABLE");

  it("resets start date when a date after the end date is typed", () => {
    const rangeStart = toAppDayjs("2020-01-01", dateDefault.DATE_FORMAT);
    const rangeEnd = toAppDayjs("2020-12-31", dateDefault.DATE_FORMAT);
    store = createMockStore({
      paramReducer: {
        dateTimeFilterRange: {
          start: dayjsToUnixMs(rangeStart),
          end: dayjsToUnixMs(rangeEnd),
        },
      },
    });
    vi.spyOn(store, "dispatch");
    renderComponent();

    const startDisplay = rangeStart.format(dateDefault.DISPLAY_FORMAT);
    const startDatePicker = screen.getByDisplayValue(startDisplay);
    fireEvent.change(startDatePicker, {
      target: {
        value: toAppDayjs("2021-01-01", dateDefault.DATE_FORMAT).format(
          dateDefault.DISPLAY_FORMAT
        ),
      },
    });

    expect(screen.getByDisplayValue(startDisplay)).toBeInTheDocument();
    expect(
      dispatchedDateRanges().some(
        (action) =>
          unixMsToAppDayjs(action?.payload?.dateTimeFilterRange?.start).format(
            dateDefault.DATE_FORMAT
          ) === "2021-01-01"
      )
    ).toBe(false);
  });

  it("resets start date when a year before the filter min is typed", () => {
    const rangeStart = toAppDayjs("2020-01-01", dateDefault.DATE_FORMAT);
    const rangeEnd = toAppDayjs("2020-12-31", dateDefault.DATE_FORMAT);
    store = createMockStore({
      paramReducer: {
        dateTimeFilterRange: {
          start: dayjsToUnixMs(rangeStart),
          end: dayjsToUnixMs(rangeEnd),
        },
      },
    });
    vi.spyOn(store, "dispatch");
    renderComponent();

    const startDisplay = rangeStart.format(dateDefault.DISPLAY_FORMAT);
    fireEvent.change(screen.getByDisplayValue(startDisplay), {
      target: { value: "01 Aug 0202" },
    });

    expect(screen.getByDisplayValue(startDisplay)).toBeInTheDocument();
    expect(screen.queryByDisplayValue("DD MMM YYYY")).not.toBeInTheDocument();
    expect(
      dispatchedDateRanges().some(
        (action) =>
          !Number.isFinite(action?.payload?.dateTimeFilterRange?.start) ||
          unixMsToAppDayjs(
            action?.payload?.dateTimeFilterRange?.start
          ).year() === 202
      )
    ).toBe(false);
  });

  it("resets end date when a date before the start date is typed", () => {
    const rangeStart = toAppDayjs("2020-01-01", dateDefault.DATE_FORMAT);
    const rangeEnd = toAppDayjs("2020-12-31", dateDefault.DATE_FORMAT);
    store = createMockStore({
      paramReducer: {
        dateTimeFilterRange: {
          start: dayjsToUnixMs(rangeStart),
          end: dayjsToUnixMs(rangeEnd),
        },
      },
    });
    vi.spyOn(store, "dispatch");
    renderComponent();

    const endDisplay = rangeEnd.format(dateDefault.DISPLAY_FORMAT);
    const endDatePicker = screen.getByDisplayValue(endDisplay);
    fireEvent.change(endDatePicker, {
      target: {
        value: toAppDayjs("2019-12-31", dateDefault.DATE_FORMAT).format(
          dateDefault.DISPLAY_FORMAT
        ),
      },
    });

    expect(screen.getByDisplayValue(endDisplay)).toBeInTheDocument();
    expect(
      dispatchedDateRanges().some(
        (action) =>
          unixMsToAppDayjs(action?.payload?.dateTimeFilterRange?.end).format(
            dateDefault.DATE_FORMAT
          ) === "2019-12-31"
      )
    ).toBe(false);
  });

  it("updates date range when end date is changed via date picker", () => {
    renderComponent();
    const maxDate = dateDefault.max.format(dateDefault.DISPLAY_FORMAT);
    const endDatePicker = screen.getByDisplayValue(maxDate);
    const newDate = toAppDayjs("2025-01-01", dateDefault.DATE_FORMAT);
    fireEvent.change(endDatePicker, {
      target: { value: newDate.format(dateDefault.DISPLAY_FORMAT) },
    });

    const lastRange = vi
      .mocked(store.dispatch)
      .mock.calls.map(([action]) => action as { type?: string; payload?: any })
      .filter((action) => action?.type === "UPDATE_DATETIME_FILTER_VARIABLE")
      .at(-1);
    expect(
      unixMsToAppDayjs(lastRange?.payload?.dateTimeFilterRange?.end).format(
        dateDefault.DATE_FORMAT
      )
    ).toBe("2025-01-01");
  });

  it("updates selected option based on Redux state changes", () => {
    const fiveYearsAgo = dayjs.tz().subtract(5, "year");
    store = createMockStore({
      paramReducer: {
        dateTimeFilterRange: {
          start: dayjsToUnixMs(fiveYearsAgo),
          end: dayjsToUnixMs(dayjs.tz()),
        },
      },
    });
    renderComponent();

    expect(screen.getByLabelText("Last 5 years")).toBeChecked();
  });

  it("keeps only dataset_group exactly ['imos'] from the single collections fetch", async () => {
    const requests: URL[] = [];
    server.use(
      http.get("/api/v1/ogc/collections", ({ request }) => {
        const url = new URL(request.url);
        requests.push(url);
        return HttpResponse.json({
          collections: [
            { id: "imos-only", properties: { dataset_group: ["imos"] } },
            {
              id: "imos-and-aims",
              properties: { dataset_group: ["imos", "aims"] },
            },
            { id: "aims-only", properties: { dataset_group: ["aims"] } },
          ],
        });
      })
    );

    renderComponent();

    await waitFor(() => {
      expect(capturedImosDataIds).toEqual(["imos-only"]);
    });
    expect(requests).toHaveLength(1);
    expect(requests[0].searchParams.get("properties")).toBe(
      "id,temporal,dataset_group"
    );
    expect(requests[0].searchParams.get("filter")).toBe(
      `temporal after ${dateDefault.min.toISOString()}`
    );
    expect(capturedChartStart?.valueOf()).toBe(0);
  });
});
