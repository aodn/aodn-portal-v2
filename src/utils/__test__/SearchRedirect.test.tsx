import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { ThemeProvider } from "@mui/material/styles";
import SearchRedirect from "../SearchRedirect";
import AppTheme from "../AppTheme";
import store from "../../components/common/store/store";

// Mock the SearchPage component
vi.mock("../../pages/search-page/SearchPage", () => ({
  default: () => <div data-testid="search-page">Search Page</div>,
}));

// Mock react-router-dom hooks
const mockNavigate = vi.fn();
const mockLocation = {
  pathname: "/search",
  search: "",
  hash: "",
  state: null,
  key: "default",
};

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => mockLocation,
  };
});

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <Provider store={store}>
      <ThemeProvider theme={AppTheme}>
        <BrowserRouter>{component}</BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
};

describe("SearchRedirect", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset location mock
    mockLocation.search = "";
  });

  test("should render SearchPage when no uuid parameter is present", () => {
    mockLocation.search = "";

    renderWithProviders(<SearchRedirect />);

    expect(screen.getByTestId("search-page")).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test("should render SearchPage when other parameters are present but no uuid", () => {
    mockLocation.search = "?platform=Glider&organisation=IMOS";

    renderWithProviders(<SearchRedirect />);

    expect(screen.getByTestId("search-page")).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test("should redirect to details page when uuid parameter is present", () => {
    const testUuid = "test-uuid-123";
    mockLocation.search = `?uuid=${testUuid}`;

    renderWithProviders(<SearchRedirect />);

    expect(mockNavigate).toHaveBeenCalledWith(`/details/${testUuid}`, {
      replace: true,
    });
  });

  test("should redirect when uuid is present along with other parameters", () => {
    const testUuid = "another-test-uuid";
    mockLocation.search = `?uuid=${testUuid}&platform=Glider&organisation=IMOS`;

    renderWithProviders(<SearchRedirect />);

    expect(mockNavigate).toHaveBeenCalledWith(`/details/${testUuid}`, {
      replace: true,
    });
  });

  test("should handle empty uuid parameter", () => {
    mockLocation.search = "?uuid=";

    renderWithProviders(<SearchRedirect />);

    // Empty uuid should not trigger redirect
    expect(screen.getByTestId("search-page")).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
