import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "@/utils/DayjsUtils";
import DateRangeFilter from "../DateRangeFilter";
import { dateDefault } from "../../common/constants";
import { updateDateTimeFilterRange } from "@/app/store/componentParamReducer";
import { dayjsToUnixMs, toAppDayjs, unixMsToAppDayjs } from "@/utils/DateUtils";
import axios from "axios";

vi.mock("../../common/charts/TimeRangeBarChart", () => ({
  default: () => <div data-testid="time-range-bar-chart" />,
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

const mockInitialState = {
  paramReducer: {
    dateTimeFilterRange: {
      start: dayjsToUnixMs(dateDefault.min),
      end: dayjsToUnixMs(dateDefault.max),
    },
  },
};

const createMockStore = (initialState = mockInitialState) =>
  configureStore({
    reducer: {
      paramReducer: (state = initialState.paramReducer) => state,
    },
  });

describe("DateRangeFilter", () => {
  let store: ReturnType<typeof createMockStore>;

  beforeEach(() => {
    store = createMockStore();
    vi.spyOn(store, "dispatch");
    vi.spyOn(axios, "get").mockResolvedValue({ data: { collections: [] } });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const renderComponent = () =>
    render(
      <Provider store={store}>
        <LocalizationProvider
          dateAdapter={AdapterDayjs}
          dateLibInstance={dayjs}
        >
          <DateRangeFilter />
        </LocalizationProvider>
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
    const minDate = dateDefault.min.format(dateDefault.DISPLAY_FORMAT);
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
});
