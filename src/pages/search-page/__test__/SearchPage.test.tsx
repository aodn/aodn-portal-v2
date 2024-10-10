import { afterAll, beforeAll, expect, describe, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { server } from "../../../__mocks__/server";
import store from "../../../components/common/store/store";
import { ThemeProvider } from "@mui/material/styles";
import { Provider } from "react-redux";
import AppTheme from "../../../utils/AppTheme";
import SearchPage from "../SearchPage";
import { BrowserRouter as Router } from "react-router-dom";
import _ from "lodash";

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

  it("The map should be able to expand properly", async () => {
    const user = userEvent.setup();
    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Router>
            <SearchPage />
          </Router>
        </ThemeProvider>
      </Provider>
    );

    // Find and open the Select component
    const selectElement = screen.getByText("View");
    await user.click(selectElement);

    // Find and click the "Full Map View" option
    const fullMapViewOption = screen.getByText("Full Map View");
    await user.click(fullMapViewOption);

    // Should not be there if full map view clicked
    const list = screen.queryByTestId("search-page-result-list");
    expect(list).not.toBeInTheDocument();
  });

  it("The list should be able to show in list / grid view", async () => {
    const user = userEvent.setup();
    const { findByTestId, findAllByTestId } = render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Router>
            <SearchPage />
          </Router>
        </ThemeProvider>
      </Provider>
    );
    // Pretend user enter wave and press two enter in search box
    const input = (await findByTestId(
      "input-with-suggester"
    )) as HTMLInputElement;
    await userEvent.type(input, "wave");
    await userEvent.type(input, "{enter}{enter}");
    expect(input.value).toEqual("wave");

    const list = await findByTestId("search-page-result-list");
    expect(list).toBeDefined();

    // Find and open the Select component
    const selectElement = screen.getByText("View");
    await user.click(selectElement);

    // Find and click the "Grid and Map" option
    const gridAndMapOption = screen.getByText("Grid and Map");
    expect(gridAndMapOption).toBeDefined();
    await user.click(gridAndMapOption);

    const gridView = await findByTestId("resultcard-result-grid");
    expect(gridView).toBeInTheDocument();

    const gridList = await findAllByTestId("result-card-grid");
    expect(gridList.length).not.equal(0);

    // Open the Select component again
    await user.click(selectElement);

    // Find and click the "List and Map" option
    const listAndMapOption = screen.getByText("List and Map");
    expect(listAndMapOption).toBeInTheDocument();
    await user.click(listAndMapOption);

    const listList = await findAllByTestId("result-card-list");
    expect(listList.length).not.equal(0);
    // Clear after test
    userEvent.clear(input);
  }, 60000);

  it("Change sort order load correct record", async () => {
    const user = userEvent.setup();
    const { findByTestId, findAllByTestId } = render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Router>
            <SearchPage />
          </Router>
        </ThemeProvider>
      </Provider>
    );
    // Pretend user enter wave and press two enter in search box
    const input = (await findByTestId(
      "input-with-suggester"
    )) as HTMLInputElement;

    await userEvent.type(input, "imos");
    await userEvent.type(input, "{enter}{enter}");
    expect(input.value).toEqual("imos");

    const list = await findByTestId("search-page-result-list");
    expect(list).toBeDefined();
    // Find the last record in the first page
    let record = await document.getElementById(
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
  }, 60000);
});
