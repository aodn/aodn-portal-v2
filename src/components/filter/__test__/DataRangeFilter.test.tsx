import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import DateRangeFilter from "../DateRangeFilter";
import { dateDefault } from "../../common/constants";
import { updateDateTimeFilterRange } from "@/app/store/searchParamsReducer";
import { dateToValue } from "../../../utils/DateUtils";
import axios from "axios";
import { responseIdTemporal, responseIdProvider } from "./canned";

const initialMinDate: Dayjs = dayjs(dateDefault.min);
const initialMaxDate: Dayjs = dayjs(dateDefault.max);

// Mock Redux store
const mockInitialState = {
  searchParams: {
    dateTimeFilterRange: {
      start: dateToValue(dayjs(dateDefault.min)),
      end: dateToValue(dayjs(dateDefault.max)),
    },
  },
};

const createMockStore = (initialState = mockInitialState) =>
  configureStore({
    reducer: {
      searchParams: (state = initialState.searchParams) => state,
    },
  });

// Mock useBreakpoint hook
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

// Mock date utilities
vi.mock("../../utils/DateUtils", () => ({
  dateToValue: vi.fn((date: Dayjs) => date.valueOf()),
  valueToDate: vi.fn((value: number) => dayjs(value)),
}));

describe("DateRangeFilter", () => {
  let store: ReturnType<typeof createMockStore>;

  beforeEach(() => {
    store = createMockStore();
    vi.spyOn(store, "dispatch");

    // Mock axios.get using vi.spyOn
    vi.spyOn(axios, "get").mockImplementation((url, config) => {
      if (
        url === "/api/v1/ogc/collections" &&
        config?.params?.properties === "id,temporal" &&
        config?.params?.filter === "temporal after 1970-01-01T00:00:00Z"
      ) {
        return Promise.resolve({ data: responseIdTemporal });
      } else if (
        url === "/api/v1/ogc/collections" &&
        config?.params?.properties === "id,providers" &&
        config?.params?.filter ===
          "temporal after 1970-01-01T00:00:00Z AND dataset_group='imos'"
      ) {
        return Promise.resolve({ data: responseIdProvider });
      }
      return Promise.reject(new Error("Unexpected API call"));
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      <Provider store={store}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
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
    expect(radioButtons[0]).toBeChecked(); // Custom option should be selected by default
  });

  it("updates radio selection and dispatches date range update for Last year", () => {
    renderComponent();
    const user = userEvent.setup();

    const lastYearRadio = screen.getByLabelText("Last year");
    user.click(lastYearRadio);

    return waitFor(() => expect(lastYearRadio).toBeChecked()).then(() =>
      expect(store.dispatch).toHaveBeenCalledWith(
        updateDateTimeFilterRange({
          start: expect.any(Number),
          end: expect.any(Number),
        })
      )
    );
  });

  it("updates date range when start date is changed via date picker", () => {
    renderComponent();
    const user = userEvent.setup();
    const minDate = initialMinDate.format(dateDefault.DISPLAY_FORMAT);

    return waitFor(() => screen.findByDisplayValue(minDate)).then(() => {
      const startDatePicker = screen.getByDisplayValue(minDate);
      user.click(startDatePicker);

      const newDate = dayjs("2020-01-01");
      const newStringDate = newDate.format(dateDefault.DISPLAY_FORMAT);
      user.type(startDatePicker, newStringDate);

      return waitFor(() => screen.findByDisplayValue(newStringDate), {
        timeout: 2000,
      }).then(() =>
        expect(store.dispatch).toHaveBeenCalledWith(
          updateDateTimeFilterRange({
            start: dateToValue(newDate),
            end: mockInitialState.searchParams.dateTimeFilterRange.end,
          })
        )
      );
    });
  });

  it("updates date range when end date is changed via date picker", () => {
    renderComponent();
    const user = userEvent.setup();
    const maxDate = initialMaxDate.format(dateDefault.DISPLAY_FORMAT);

    return waitFor(() => screen.findByDisplayValue(maxDate)).then(() => {
      const endDatePicker = screen.getByDisplayValue(maxDate);
      user.click(endDatePicker);

      const newDate = dayjs("2025-01-01");
      const newStringDate = newDate.format(dateDefault.DISPLAY_FORMAT);
      user.type(endDatePicker, newStringDate);

      return waitFor(() => screen.findByDisplayValue(newStringDate), {
        timeout: 2000,
      }).then(() =>
        expect(store.dispatch).toHaveBeenCalledWith(
          updateDateTimeFilterRange({
            start: mockInitialState.searchParams.dateTimeFilterRange.start,
            end: dateToValue(
              newDate
                .set("hour", 23)
                .set("minute", 59)
                .set("second", 59)
                .set("millisecond", 0)
            ),
          })
        )
      );
    });
  });

  it.skip("updates date range when slider is moved", () => {
    renderComponent();
    const user = userEvent.setup();

    return waitFor(() => screen.findByRole("slider")).then(() => {
      const slider = screen.getByRole("slider");
      user.type(slider, "{arrowright}"); // Simulate slider movement

      expect(store.dispatch).toHaveBeenCalledWith(
        updateDateTimeFilterRange({
          start: expect.any(Number),
          end: expect.any(Number),
        })
      );
    });
  });

  it.skip("renders TimeRangeBarChart with correct props", async () => {
    renderComponent();

    await waitFor(() => {
      const barChart = screen.getByTestId("time-range-bar-chart"); // Assuming TimeRangeBarChart has a data-testid
      expect(barChart).toBeInTheDocument();
      expect(barChart).toHaveAttribute("data-start-date");
      expect(barChart).toHaveAttribute("data-end-date");
    });
  });

  it("updates selected option based on Redux state changes", () => {
    // Create a store with a different date range (e.g., Last 5 years)
    const fiveYearsAgo = dayjs().subtract(5, "year");
    const newState = {
      searchParams: {
        dateTimeFilterRange: {
          start: dateToValue(fiveYearsAgo),
          end: dateToValue(dayjs()),
        },
      },
    };
    store = createMockStore(newState);
    renderComponent();

    return waitFor(() => {
      expect(screen.getByLabelText("Last 5 years")).toBeChecked();
    });
  });

  it("handles mobile view correctly", () => {
    vi.mock("../../../hooks/useBreakpoint", () => ({
      default: () => ({
        isMobile: true,
        isTablet: false,
        isLaptop: false,
        isDesktop: false,
        is4K: false,
        isAboveDesktop: false,
        isUnderLaptop: false,
      }),
    }));

    renderComponent();

    // TimeRangeBarChart should not render in mobile view
    return waitFor(() => {
      expect(
        screen.queryByTestId("time-range-bar-chart")
      ).not.toBeInTheDocument();
    }).then(() => {
      // Radio buttons should be in column layout
      const radioGroup = screen.getByRole("radiogroup");
      expect(radioGroup).toHaveStyle({ flexDirection: "column" });
    });
  });
});
