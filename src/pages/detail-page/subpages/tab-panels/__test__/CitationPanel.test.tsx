import { afterAll, afterEach, beforeAll, expect, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import AppTheme from "../../../../../utils/AppTheme";
import { Provider } from "react-redux";
import store from "../../../../../components/common/store/store";
import { ThemeProvider } from "@mui/material/styles";
import { DetailPageProvider } from "../../../context/detail-page-provider";
import { server } from "../../../../../__mocks__/server";
import { useLocation } from "react-router-dom";
import CitationPanel from "../CitationPanel";

describe("CitationPanel", async () => {
  const theme = AppTheme;
  beforeAll(() => {
    server.listen();
  });

  beforeEach(() => {
    vi.mock("react-router-dom", () => ({
      ...vi.importActual("react-router-dom"),
      useLocation: vi.fn(),
    }));

    vi.mocked(useLocation).mockReturnValue({
      state: null,
      hash: "111",
      key: "default",
      pathname: "/details",
      search: "?uuid=5fc91100-4ade-11dc-8f56-00008a07204e",
    });
  });

  afterEach(() => {
    cleanup();
    server.resetHandlers();
    vi.restoreAllMocks();
  });
  afterAll(() => {
    server.close();
  });

  beforeEach(() => {
    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <DetailPageProvider>
            <CitationPanel />
          </DetailPageProvider>
        </ThemeProvider>
      </Provider>
    );
  });

  test("should render CitationPanel", async () => {
    // the panel is rendered
    await waitFor(() => {
      expect(screen.queryAllByText("License")).toHaveLength(2);
    });

    // the information is rendered
    await waitFor(() => {
      expect(
        screen.queryAllByText("Australian Institute of Marine Science (AIMS)")
      ).toHaveLength(2);

      expect(
        screen.queryByText("Creative Commons Attribution 3.0 Australia License")
      ).to.exist;

      expect(
        screen.queryByText("http://creativecommons.org/licenses/by/3.0/au/")
      ).to.exist;

      expect(
        screen.queryByText(
          'Attribution: Format for citation of metadata sourced from Australian Institute of Marine Science (AIMS) in a list of reference is as follows: "Australian Institute of Marine Science (AIMS). (2020). Northern Australia Automated Marine Weather and Oceanographic Stations, Sites: [Davies Reef]. https://doi.org/10.25845/5c09bf93f315d, accessed[date-of-access]".'
        )
      ).to.exist;

      expect(
        screen.queryByText(
          'Use Limitation: All AIMS data, products and services are provided "as is" and AIMS does not warrant their fitness for a particular purpose or non-infringement. While AIMS has made every reasonable effort to ensure high quality of the data, products and services, to the extent permitted by law the data, products and services are provided without any warranties of any kind, either expressed or implied, including without limitati...'
        )
      ).to.exist;
    });
  });
});
