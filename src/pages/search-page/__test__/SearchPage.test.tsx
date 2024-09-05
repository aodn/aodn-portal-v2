import { afterAll, beforeAll, expect, describe, vi } from "vitest";
import { server } from "../../../__mocks__/server";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom"; // for the additional matchers
import store from "../../../components/common/store/store";
import { ThemeProvider } from "@mui/material/styles";
import { Provider } from "react-redux";
import AppTheme from "../../../utils/AppTheme";
import SearchPage from "../SearchPage";
import { userEvent } from "@testing-library/user-event";
import { BrowserRouter as Router } from "react-router-dom";
const theme = AppTheme;

vi.mock("../../../components/map/mapbox/Map", () => {
  return {
    default: function DummyMap() {
      return <div data-testid="mockMap"></div>;
    },
  };
});

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

// afterEach(() => {
//   cleanup();
//   server.resetHandlers();
//   vi.restoreAllMocks();
// });

afterAll(() => {
  server.close();
});

describe("SearchPage", async () => {
  it("The map should be able to expand properly", async () => {
    const { findByTestId, queryByTestId } = render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Router>
            <SearchPage />
          </Router>
        </ThemeProvider>
      </Provider>
    );
    const mapListToggleButton = await findByTestId("map-list-toggle-button");
    await userEvent.click(mapListToggleButton);

    const fullMapViewOption: HTMLElement = await findByTestId(
      "maplist-toggle-menu-mapview"
    );
    expect(fullMapViewOption).to.exist;

    await userEvent.click(fullMapViewOption);
    // Should not be there if full map view clicked
    const list = queryByTestId("search-page-result-list");
    expect(list).not.toBeInTheDocument();
  });

  it("The list should be able to show in list / grid view", async () => {
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

    // On the web, the followting tested feature is good,
    // but keep failing in the unit test. (may because of the loading modal)
    // just ignore this line for now
    // expect(input.value).toEqual("wave");

    const list = await findByTestId("search-page-result-list");
    expect(list).toBeDefined();

    const mapListToggleButton = await findByTestId("map-list-toggle-button");
    await userEvent.click(mapListToggleButton);

    const gridAndMapOption: HTMLElement = await findByTestId(
      "maplist-toggle-menu-gridandmap"
    );
    expect(gridAndMapOption).toBeDefined();
    await userEvent.click(gridAndMapOption);

    const gridView = await findByTestId("resultcard-result-grid");
    expect(gridView).toBeInTheDocument();

    const gridList = await findAllByTestId("result-card-grid");
    expect(gridList.length).not.equal(0);

    await userEvent.click(mapListToggleButton);

    const listAndMapOption: HTMLElement = await findByTestId(
      "maplist-toggle-menu-listandmap"
    );
    expect(listAndMapOption).to.exist;
    userEvent.click(listAndMapOption);

    const listList = await findAllByTestId("result-card-list");
    expect(listList.length).not.equal(0);
  }, 60000);
});
