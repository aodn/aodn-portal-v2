import {
  describe,
  expect,
  it,
  vi,
  beforeAll,
  beforeEach,
  afterEach,
} from "vitest";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { ThemeProvider } from "@mui/material/styles";
import { MemoryRouter } from "react-router-dom";
import AppTheme from "../../../utils/AppTheme";
import store from "../../common/store/store";
import { clearComponentParam } from "../../common/store/componentParamReducer";
import Header from "../components/Header";

const theme = AppTheme;

// Mock useBreakpoint to control laptop vs mobile viewports in our test
const mockBreakpoint = { isMobile: false, isUnderLaptop: false };
vi.mock("../../../hooks/useBreakpoint", () => ({
  default: () => mockBreakpoint,
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

describe("Header Searchbar Expansion", () => {
  beforeAll(() => {
    // Mock scrollIntoView
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
    // Mock window.scrollTo
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
    const user = userEvent.setup();

    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <MemoryRouter initialEntries={["/search"]}>
            <Header />
          </MemoryRouter>
        </ThemeProvider>
      </Provider>
    );

    // 1. Initial State: The searchbar wrapper box should have min-width: auto
    const searchWrapper = screen.getByTestId("searchbar-wrapper-box");
    expect(searchWrapper).toBeInTheDocument();
    expect(searchWrapper).toHaveStyle({ minWidth: "auto" });

    // 2. Click/Focus the input textbox to active searchbar
    const searchInput = screen.getByPlaceholderText("Search for open data");
    await user.click(searchInput);

    // 3. The search wrapper should expand (min-width becomes 0.7 which resolves to 70% in MUI)
    await waitFor(() => {
      expect(searchWrapper).toHaveStyle({ minWidth: "70%" });
    });

    // 4. Type text in the input
    await user.type(searchInput, "satellite");

    // 5. Blur the input - because there is text, the searchbar should STAY expanded!
    searchInput.blur();

    expect(searchWrapper).toHaveStyle({ minWidth: "70%" });
  });
});
