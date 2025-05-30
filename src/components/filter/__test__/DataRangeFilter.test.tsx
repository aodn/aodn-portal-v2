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
import { updateDateTimeFilterRange } from "../../common/store/componentParamReducer";
import { dateToValue } from "../../../utils/DateUtils";
import axios from "axios";
import { responseIdTemporal, responseIdProvider } from "./canned";

// Mock Redux store
const mockInitialState = {
  paramReducer: {
    dateTimeFilterRange: {
      start: dateToValue(dayjs(dateDefault.min)),
      end: dateToValue(dayjs(dateDefault.max)),
    },
  },
};

const createMockStore = (initialState = mockInitialState) =>
  configureStore({
    reducer: {
      paramReducer: (state = initialState.paramReducer) => state,
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
  let handleClosePopup: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    store = createMockStore();
    handleClosePopup = vi.fn();
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
          "temporal after 1970-01-01T00:00:00Z AND dataset_provider='IMOS'"
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
          <DateRangeFilter handleClosePopup={handleClosePopup} />
        </LocalizationProvider>
      </Provider>
    );

  it("renders correctly with initial state", async () => {
    renderComponent();

    expect(screen.getByText("Custom")).toBeInTheDocument();
    expect(screen.getByText("Last Year")).toBeInTheDocument();
    expect(screen.getByText("Last 5 Years")).toBeInTheDocument();
    expect(screen.getByText("Last 10 Years")).toBeInTheDocument();
    expect(screen.getByText("Start Date")).toBeInTheDocument();
    expect(screen.getByText("End Date")).toBeInTheDocument();

    const radioButtons = screen.getAllByRole("radio");
    expect(radioButtons).toHaveLength(4);
    expect(radioButtons[0]).toBeChecked(); // Custom option should be selected by default
  });

  it("updates radio selection and dispatches date range update for Last Year", async () => {
    renderComponent();
    const user = userEvent.setup();

    const lastYearRadio = screen.getByLabelText("Last Year");
    await user.click(lastYearRadio);

    expect(lastYearRadio).toBeChecked();
    expect(store.dispatch).toHaveBeenCalledWith(
      updateDateTimeFilterRange({
        start: expect.any(Number),
        end: expect.any(Number),
      })
    );
  });

  it("updates date range when start date is changed via date picker", async () => {
    renderComponent();
    const user = userEvent.setup();

    const startDatePicker = screen.getByLabelText(/start date/i);
    const newDate = dayjs("2020-01-01");
    await user.type(startDatePicker, newDate.format("MM/DD/YYYY"));

    expect(store.dispatch).toHaveBeenCalledWith(
      updateDateTimeFilterRange({
        start: dateToValue(newDate),
        end: mockInitialState.paramReducer.dateTimeFilterRange.end,
      })
    );
  });

  it("updates date range when end date is changed via date picker", async () => {
    renderComponent();
    const user = userEvent.setup();

    const endDatePicker = screen.getByLabelText(/end date/i);
    const newDate = dayjs("2025-01-01");
    await user.type(endDatePicker, newDate.format("MM/DD/YYYY"));

    expect(store.dispatch).toHaveBeenCalledWith(
      updateDateTimeFilterRange({
        start: mockInitialState.paramReducer.dateTimeFilterRange.start,
        end: dateToValue(newDate),
      })
    );
  });

  it("resets date range when clear button is clicked", async () => {
    renderComponent();
    const user = userEvent.setup();

    const clearButton = screen.getByTestId("ReplayIcon").closest("button");
    await user.click(clearButton!);

    expect(store.dispatch).toHaveBeenCalledWith(updateDateTimeFilterRange({}));
    expect(screen.getByLabelText("Custom")).toBeChecked();
  });

  it("calls handleClosePopup when close button is clicked", async () => {
    renderComponent();
    const user = userEvent.setup();

    const closeButton = screen.getByTestId("CloseIcon").closest("button");
    await user.click(closeButton!);

    expect(handleClosePopup).toHaveBeenCalled();
  });

  it("updates date range when slider is moved", async () => {
    renderComponent();
    const user = userEvent.setup();

    const slider = screen.getByRole("slider");
    await user.type(slider, "{arrowright}"); // Simulate slider movement

    expect(store.dispatch).toHaveBeenCalledWith(
      updateDateTimeFilterRange({
        start: expect.any(Number),
        end: expect.any(Number),
      })
    );
  });

  it("renders TimeRangeBarChart with correct props", async () => {
    renderComponent();

    await waitFor(() => {
      const barChart = screen.getByTestId("time-range-bar-chart"); // Assuming TimeRangeBarChart has a data-testid
      expect(barChart).toBeInTheDocument();
      expect(barChart).toHaveAttribute("data-start-date");
      expect(barChart).toHaveAttribute("data-end-date");
    });
  });

  it("updates selected option based on Redux state changes", async () => {
    // Create a store with a different date range (e.g., Last 5 Years)
    const fiveYearsAgo = dayjs().subtract(5, "year");
    const newState = {
      paramReducer: {
        dateTimeFilterRange: {
          start: dateToValue(fiveYearsAgo),
          end: dateToValue(dayjs()),
        },
      },
    };
    store = createMockStore(newState);
    renderComponent();

    await waitFor(() => {
      expect(screen.getByLabelText("Last 5 Years")).toBeChecked();
    });
  });

  it("handles mobile view correctly", async () => {
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
    await waitFor(() => {
      expect(
        screen.queryByTestId("time-range-bar-chart")
      ).not.toBeInTheDocument();
    });

    // Radio buttons should be in column layout
    const radioGroup = screen.getByRole("radiogroup");
    expect(radioGroup).toHaveStyle({ flexDirection: "column" });
  });
});
