import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { Provider } from "react-redux";
import { ThemeProvider } from "@mui/material/styles";
import AppTheme from "@/styles/theme";
import store, { getComponentState } from "@/app/store/store";
import {
  updateDatasetGroup,
  updateSearchText,
} from "@/app/store/componentParamReducer";
import useRedirectSearch from "@/hooks/useRedirectSearch";
import { SearchKeys } from "@/components/search/constants";
import { pageDefault } from "@/components/common/constants";
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

  it("shows the updated WAMSI name and description", () => {
    const wamsi = CONTRIBUTORS.find(
      ({ datasetGroup }) => datasetGroup === SearchKeys.WAMSI
    );
    expect(wamsi?.fullName).toBe(
      "Western Australian Marine Research Institution"
    );
    expect(wamsi?.description).toBe(
      "A collaboration of state and federal government and academic science organisations, working together to deliver independent marine research for Western Australia."
    );
  });

  it("links IMOS in the funding sentence to the IMOS website", () => {
    renderPartners();

    const link = screen.getByTestId("imos-website-link");
    expect(link).toHaveAttribute("href", pageDefault.url.IMOS);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(link).toHaveTextContent("Integrated Marine Observing System (IMOS)");
    expect(link.parentElement).toHaveTextContent(
      "The AODN is funded and operated by the Integrated Marine Observing System (IMOS), an unincorporated joint venture of institutions led by the University of Tasmania."
    );
  });

  it("searches IMOS data and clears old filters on explore", async () => {
    const user = userEvent.setup();
    store.dispatch(updateSearchText("old search"));
    renderPartners();

    await user.click(screen.getByTestId("explore-imos-datasets"));

    await waitFor(() => {
      expect(redirectSearch).toHaveBeenCalledWith("Partners");
    });
    const params = getComponentState(store.getState());
    expect(params.datasetGroup).toBe(SearchKeys.IMOS);
    expect(params.searchText).toBeFalsy();
  });

  it.each([SearchKeys.CSIRO, SearchKeys.GA, SearchKeys.NCI, SearchKeys.EATLAS])(
    "searches %s data by organisation on view datasets",
    async (datasetGroup) => {
      const user = userEvent.setup();
      store.dispatch(updateSearchText("old search"));
      renderPartners();

      await user.click(
        screen.getByTestId(`contributor-view-datasets-${datasetGroup}`)
      );

      await waitFor(() => {
        expect(redirectSearch).toHaveBeenCalledWith("Partners");
      });
      // The old search text is cleared
      const params = getComponentState(store.getState());
      expect(params.datasetGroup).toBe(datasetGroup);
      expect(params.searchText).toBeFalsy();
    }
  );

  it("runs a text search for WAMSI on view datasets", async () => {
    const user = userEvent.setup();
    store.dispatch(updateDatasetGroup(SearchKeys.IMOS));
    renderPartners();

    await user.click(
      screen.getByTestId(`contributor-view-datasets-${SearchKeys.WAMSI}`)
    );

    await waitFor(() => {
      expect(redirectSearch).toHaveBeenCalledWith("Partners");
    });
    // The old filter is cleared and no dataset group is set
    const params = getComponentState(store.getState());
    expect(params.searchText).toBe("WAMSI");
    expect(params.datasetGroup).toBeUndefined();
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
