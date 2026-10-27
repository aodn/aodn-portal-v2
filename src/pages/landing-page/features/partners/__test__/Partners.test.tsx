import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { Provider } from "react-redux";
import { ThemeProvider } from "@mui/material/styles";
import AppTheme from "@/styles/theme";
import store, { getComponentState } from "@/app/store/store";
import { updateSearchText } from "@/app/store/componentParamReducer";
import useRedirectSearch from "@/hooks/useRedirectSearch";
import { SearchKeys } from "@/components/search/constants";
import Partners from "../Partners";
import { CONTRIBUTORS } from "../constants";

vi.mock("@/hooks/useRedirectSearch", () => ({
  default: vi.fn(),
}));

const redirectSearch = vi.fn();

const renderPartners = () =>
  render(
    <Provider store={store}>
      <ThemeProvider theme={AppTheme}>
        <Partners />
      </ThemeProvider>
    </Provider>
  );

describe("Partners", () => {
  beforeEach(() => {
    vi.mocked(useRedirectSearch).mockReturnValue(redirectSearch);
    // jsdom has no canvas, so the waves draw nothing
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("renders the IMOS card, every contributor and the NCRIS card", () => {
    renderPartners();

    expect(screen.getByTestId("imos-data-card")).toBeInTheDocument();
    expect(screen.getByTestId("ncris-card")).toBeInTheDocument();
    expect(screen.getByTestId("contributor-list").children).toHaveLength(
      CONTRIBUTORS.length
    );
    CONTRIBUTORS.forEach(({ datasetGroup }) => {
      expect(
        screen.getByTestId(`contributor-card-${datasetGroup}`)
      ).toBeInTheDocument();
    });
  });

  it("searches IMOS data and clears old filters on explore", () => {
    store.dispatch(updateSearchText("old search"));
    renderPartners();

    userEvent.click(screen.getByTestId("explore-imos-datasets"));

    return waitFor(() => {
      expect(redirectSearch).toHaveBeenCalledWith("Partners");
    }).then(() => {
      const params = getComponentState(store.getState());
      expect(params.datasetGroup).toBe(SearchKeys.IMOS);
      expect(params.searchText).toBeFalsy();
    });
  });

  it("searches one contributor's data on view datasets", () => {
    renderPartners();

    userEvent.click(
      screen.getByTestId(`contributor-view-datasets-${SearchKeys.CSIRO}`)
    );

    return waitFor(() => {
      expect(redirectSearch).toHaveBeenCalledWith("Partners");
    }).then(() => {
      expect(getComponentState(store.getState()).datasetGroup).toBe(
        SearchKeys.CSIRO
      );
    });
  });

  it("opens the contributor website in a new tab", () => {
    renderPartners();

    const link = screen.getByTestId(`contributor-website-${SearchKeys.AIMS}`);
    expect(link).toHaveAttribute("href", "https://www.aims.gov.au");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });
});

describe("isPartnersSectionEnabled", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("is on when the build is not production", async () => {
    vi.stubEnv("MODE", "staging");
    vi.resetModules();
    const { isPartnersSectionEnabled } = await import("../constants");
    expect(isPartnersSectionEnabled).toBe(true);
  });

  it("is off in the production build", async () => {
    vi.stubEnv("MODE", "prod");
    vi.resetModules();
    const { isPartnersSectionEnabled } = await import("../constants");
    expect(isPartnersSectionEnabled).toBe(false);
  });
});
