import {
  describe,
  expect,
  it,
  vi,
  beforeAll,
  beforeEach,
  afterEach,
} from "vitest";
import {
  act,
  fireEvent,
  render,
  screen,
  cleanup,
  waitFor,
} from "@testing-library/react";
import { Provider } from "react-redux";
import { ThemeProvider } from "@mui/material/styles";
import { MemoryRouter } from "react-router-dom";
import AppTheme from "@/styles/theme";
import store from "@/app/store/store";
import {
  clearComponentParam,
  updateHasData,
} from "@/app/store/componentParamReducer";
import Header from "../Header";
import { SEARCHBAR_EXPANSION_WIDTH_LAPTOP } from "@/components/search/constants";

const theme = AppTheme;
const expectedLaptopWidth = `${SEARCHBAR_EXPANSION_WIDTH_LAPTOP * 100}%`;

// Mock useBreakpoint to control laptop vs mobile viewports in our test
const mockBreakpoint = { isMobile: false, isUnderLaptop: false };
vi.mock("@/hooks/useBreakpoint", () => ({
  default: () => mockBreakpoint,
}));

// Header expansion only depends on setShouldExpandSearchbar from Searchbar.
// Stub Searchbar to avoid MUI Autocomplete / FormControl / async filter chip
// updates that fire outside act() and are out of scope for this suite.
vi.mock("@/components/search/Searchbar", () => ({
  default: function MockSearchbar({
    setShouldExpandSearchbar,
  }: {
    setShouldExpandSearchbar?: (v: boolean) => void;
  }) {
    return (
      <input
        data-testid="input-with-suggester"
        placeholder="Search for open data"
        defaultValue=""
        onFocus={() => setShouldExpandSearchbar?.(true)}
        onChange={(e) => {
          setShouldExpandSearchbar?.(
            e.target.value.length > 0 || document.activeElement === e.target
          );
        }}
        onBlur={(e) => {
          setShouldExpandSearchbar?.(e.currentTarget.value.length > 0);
        }}
      />
    );
  },
}));

// Mock react-router-dom with MemoryRouter
const mockLocation = {
  pathname: "/search",
  search: "",
  hash: "",
  state: null,
  key: "default",
};
vi.mock("react-router-dom", async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    useLocation: () => mockLocation,
  };
});

const renderHeader = () =>
  render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <MemoryRouter initialEntries={["/search"]}>
          <Header />
        </MemoryRouter>
      </ThemeProvider>
    </Provider>
  );

describe("Header Searchbar Expansion", () => {
  beforeAll(() => {
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
    window.scrollTo = vi.fn();
  });

  beforeEach(() => {
    mockLocation.pathname = "/search";
    mockLocation.search = "";
    mockBreakpoint.isMobile = false;
    mockBreakpoint.isUnderLaptop = false;
    store.dispatch(clearComponentParam());
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("should expand the search bar container width when search input is focused or has text", async () => {
    renderHeader();

    // 1. Initial State: The searchbar wrapper box should have min-width: auto
    const searchWrapper = screen.getByTestId("searchbar-wrapper-box");
    expect(searchWrapper).toBeInTheDocument();
    expect(searchWrapper).toHaveStyle({ minWidth: "auto" });

    const searchInput = screen.getByPlaceholderText(
      "Search for open data"
    ) as HTMLInputElement;

    // 2. Focus expands the wrapper
    await act(async () => {
      fireEvent.focus(searchInput);
    });
    expect(searchWrapper).toHaveStyle({ minWidth: expectedLaptopWidth });

    // 3. Type + blur — still expanded while text remains
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: "satellite" } });
      fireEvent.blur(searchInput);
    });
    expect(searchWrapper).toHaveStyle({ minWidth: expectedLaptopWidth });
  });

  it("should hide the filter chips divider when there is no filter set, and show it when a filter is set", async () => {
    const { container } = renderHeader();

    // 1. Initial State: No filters are set, so there should be no horizontal divider
    const dividers = container.querySelectorAll("hr");
    expect(dividers.length).toBe(0);

    // 2. Set a filter — wrap dispatch so Header re-render (chips row + ref) is in act
    await act(async () => {
      store.dispatch(updateHasData(true));
    });

    // 3. Now the divider (<hr>) should be rendered!
    await waitFor(() => {
      const updatedDividers = container.querySelectorAll("hr");
      expect(updatedDividers.length).toBe(1);
    });
  });
});
