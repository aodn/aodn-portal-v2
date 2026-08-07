import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
  vi,
} from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import AppTheme from "@/styles/theme";
import { Provider } from "react-redux";
import store from "@/app/store/store";
import { ThemeProvider } from "@mui/material/styles";
import { DetailPageProvider } from "../context/detail-page-provider";
import { server } from "@/__mocks__/server";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import HeaderSection from "../layout/HeaderSection";
import { pageReferer } from "@/components/common/constants";
import { DataTestId } from "@/components/map/mapbox/constants";
import useRedirectSearch from "@/hooks/useRedirectSearch";
import useRedirectHome from "@/hooks/useRedirectHome";

vi.mock("@/hooks/useRedirectSearch", () => ({
  default: vi.fn(),
}));

vi.mock("@/hooks/useRedirectHome", () => ({
  default: vi.fn(),
}));

describe("HeaderSection", async () => {
  const theme = AppTheme;
  const redirectSearch = vi.fn();
  const redirectHome = vi.fn();

  const renderHeader = (locationState: { referer?: string } | null) => {
    vi.mocked(useLocation).mockReturnValue({
      state: locationState,
      hash: "",
      key: "default",
      pathname: "/details/5fc91100-4ade-11dc-8f56-00008a07204e",
      search: "",
    });

    return render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <DetailPageProvider>
            <HeaderSection />
          </DetailPageProvider>
        </ThemeProvider>
      </Provider>
    );
  };

  beforeAll(() => {
    server.listen();
  });

  beforeEach(() => {
    vi.mock("react-router-dom", () => ({
      ...vi.importActual("react-router-dom"),
      useLocation: vi.fn(),
      useParams: vi.fn(),
      useNavigate: vi.fn(),
    }));

    vi.mocked(useParams).mockReturnValue({
      uuid: "5fc91100-4ade-11dc-8f56-00008a07204e",
    });

    vi.mocked(useNavigate).mockReturnValue(vi.fn());
    vi.mocked(useRedirectSearch).mockReturnValue(redirectSearch);
    vi.mocked(useRedirectHome).mockReturnValue(redirectHome);
    redirectSearch.mockClear();
    redirectHome.mockClear();
  });

  afterEach(() => {
    cleanup();
    server.resetHandlers();
    vi.restoreAllMocks();
  });

  afterAll(() => {
    server.close();
  });

  test("renders the collection title as the page h1", async () => {
    renderHeader(null);

    await waitFor(() => {
      expect(
        screen.getByRole("heading", {
          level: 1,
          name: "Davies Reef Automated Marine Weather And Oceanographic Station",
        })
      ).to.exist;
    });
  });

  test("return button goes to search when opened from search, even after side-card navigation overwrites location.state", async () => {
    const { rerender } = renderHeader({
      referer: pageReferer.SEARCH_PAGE_REFERER,
    });

    // Simulate side-card / tab navigation replacing location.state with
    // DETAIL_PAGE_REFERER (what Citation and Data Access arrows pass).
    vi.mocked(useLocation).mockReturnValue({
      state: { referer: pageReferer.DETAIL_PAGE_REFERER },
      hash: "",
      key: "side-card",
      pathname: "/details/5fc91100-4ade-11dc-8f56-00008a07204e",
      search: "?tab=citation",
    });

    rerender(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <DetailPageProvider>
            <HeaderSection />
          </DetailPageProvider>
        </ThemeProvider>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId(DataTestId.HeaderSection.ReturnButton)).to
        .exist;
    });

    fireEvent.click(screen.getByTestId(DataTestId.HeaderSection.ReturnButton));

    expect(redirectSearch).toHaveBeenCalledWith(
      pageReferer.DETAIL_PAGE_REFERER,
      true,
      false
    );
    expect(redirectHome).not.toHaveBeenCalled();
  });

  test("return button goes home when detail was not opened from search", async () => {
    renderHeader({ referer: pageReferer.LANDING_PAGE_REFERER });

    await waitFor(() => {
      expect(screen.getByTestId(DataTestId.HeaderSection.ReturnButton)).to
        .exist;
    });

    fireEvent.click(screen.getByTestId(DataTestId.HeaderSection.ReturnButton));

    expect(redirectHome).toHaveBeenCalledWith(
      pageReferer.DETAIL_PAGE_REFERER,
      true
    );
    expect(redirectSearch).not.toHaveBeenCalled();
  });
});
