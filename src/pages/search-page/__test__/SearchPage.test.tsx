import { afterAll, beforeAll, describe, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { server } from "../../../__mocks__/server";
import store from "../../../components/common/store/store";
import { ThemeProvider } from "@mui/material/styles";
import { Provider } from "react-redux";
import AppTheme from "../../../utils/AppTheme";
import SearchPage from "../SearchPage";
import { BrowserRouter as Router } from "react-router-dom";

const theme = AppTheme;

vi.mock("../../../components/map/mapbox/Map", () => {
  return {
    default: function DummyMap() {
      return <div data-testid="mockMap"></div>;
    },
  };
});

describe("SearchPage", () => {
  beforeAll(() => {
    // With use of AutoSizer component in ResultCard, it will fail in non-UI env like vitest
    // here we mock it so to give some screen size to let the test work.
    vi.mock("react-virtualized-auto-sizer", () => {
      return {
        __esModule: true,
        default: ({
          children,
        }: {
          children: (size: { width: number; height: number }) => JSX.Element;
        }) => children({ width: 800, height: 600 }), // Provide fixed dimensions
      };
    });
    server.listen();
  });

  afterAll(() => {
    server.close();
  });
  it("The map should be able to expand properly", () => {
    const user = userEvent.setup();
    const { queryByText, queryByTestId, findByTestId } = render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Router>
            <SearchPage />
          </Router>
        </ThemeProvider>
      </Provider>
    );

    waitFor(() => findByTestId("result-layout-button")).then(() => {
      // Find and open the Select component
      const selectElement = queryByTestId(
        "result-layout-button"
      ) as HTMLButtonElement;
      user.click(selectElement);

      // Find and click the "Full Map View" option
      const fullMapViewOption = queryByText(
        "Full Map View"
      ) as HTMLButtonElement;
      user.click(fullMapViewOption);

      // Should not be there if full map view clicked
      const list = queryByTestId("search-page-result-list");
      expect(list).not.toBeInTheDocument();
    });
  });

  it("The list should be able to show in list / grid view", () => {
    const user = userEvent.setup();
    const { getAllByTestId, getByTestId } = render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Router>
            <SearchPage />
          </Router>
        </ThemeProvider>
      </Provider>
    );

    // Pretend user enter wave and press two enter in search box
    waitFor(() => getByTestId("input-with-suggester"), { timeout: 5000 }).then(
      () => {
        const input = getByTestId("input-with-suggester") as any;

        userEvent.type(input, "wave");
        userEvent.type(input, "{enter}{enter}");
        expect(input.value).toEqual("wave");

        const list = getByTestId("search-page-result-list");
        expect(list).toBeDefined();

        // Find and open the Select component
        const selectElement = screen.getByText("View");
        user.click(selectElement);

        // Find and click the "Grid and Map" option
        const gridAndMapOption = screen.getByText("Grid and Map");
        expect(gridAndMapOption).toBeDefined();
        user.click(gridAndMapOption);

        const gridView = getByTestId("resultcard-result-grid");
        expect(gridView).toBeInTheDocument();

        const gridList = getAllByTestId("result-card-grid");
        expect(gridList.length).not.equal(0);

        // Open the Select component again
        user.click(selectElement);

        // Find and click the "List and Map" option
        const listAndMapOption = screen.getByText("List and Map");
        expect(listAndMapOption).toBeInTheDocument();
        user.click(listAndMapOption);

        const listList = getAllByTestId("result-card-list");
        expect(listList.length).not.equal(0);
        // Clear after test
        userEvent.clear(input);
      }
    );
  }, 60000);

  it("Change sort order load correct record", () => {
    const user = userEvent.setup();
    const { findByTestId } = render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Router>
            <SearchPage />
          </Router>
        </ThemeProvider>
      </Provider>
    );
    // Pretend user enter wave and press two enter in search box
    waitFor(() => findByTestId("input-with-suggester")).then(async () => {
      const input = (await findByTestId(
        "input-with-suggester"
      )) as HTMLInputElement;
      userEvent.type(input, "imos");
      userEvent.type(input, "{enter}{enter}");

      waitFor(() => expect(input.value).toEqual("imos")).then(async () => {
        const list = await findByTestId("search-page-result-list");
        expect(list).toBeDefined();

        // Find the last record in the first page
        let record = document.getElementById(
          "result-card-c1344979-f701-0916-e044-00144f7bc0f4"
        );
        expect(record).toBeDefined();
        const loadMore = (await document.getElementById(
          "result-card-load-more-btn"
        )) as HTMLButtonElement;

        expect(loadMore).toBeDefined();
        await user.click(loadMore);
        // Find the last record on second page
        record = await document.getElementById(
          "result-card-ae70eb18-b1f0-4012-8d62-b03daf99f7f2"
        );
        expect(record).toBeDefined();

        // Clear after test
        userEvent.clear(input);
      });
    });
  }, 60000);
});
