import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  expect,
  describe,
  test,
  vi,
} from "vitest";
import { server } from "../../../__mocks__/server";
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import store from "../../../components/common/store/store";
import { ThemeProvider } from "@mui/material/styles";
import { Provider } from "react-redux";
import AppTheme from "../../../utils/AppTheme";
import SearchPage from "../SearchPage";
import { userEvent } from "@testing-library/user-event";
import { BrowserRouter as Router } from "react-router-dom";
const theme = AppTheme;

beforeEach(() => {
  render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Router>
          <SearchPage />
        </Router>
      </ThemeProvider>
    </Provider>
  );
});
beforeAll(() => {
  server.listen();
});
afterEach(() => {
  cleanup();
  server.resetHandlers();
  vi.restoreAllMocks();
});
afterAll(() => {
  server.close();
});

vi.mock("../../../components/map/mapbox/Map", () => {
  return {
    default: function DummyMap() {
      return <div data-testid="mockMap"></div>;
    },
  };
});

describe("SearchPage", async () => {
  test("The map should be able to expand properly", async () => {
    const mapListToggleButton = screen.getByTestId("map-list-toggle-button");
    await act(async () => {
      await userEvent.click(mapListToggleButton);
    });

    const fullMapViewOption: HTMLElement = screen.getByTestId(
      "maplist-toggle-menu-mapview"
    );
    expect(fullMapViewOption).to.exist;

    await act(async () => {
      await userEvent.click(fullMapViewOption);
    });
    //
    const list = screen.queryByTestId("search-page-result-list");
  });

  test("The list should be able to show in list / grid view", async () => {
    const input = screen.getByTestId("input-with-suggester");
    await userEvent.type(input, "wave{enter}{enter}");

    await waitFor(
      () => {
        const list = screen.queryByTestId("search-page-result-list");
        expect(list).to.exist;
      },
      { timeout: 300 }
    );

    const mapListToggleButton = screen.getByTestId("map-list-toggle-button");
    await userEvent.click(mapListToggleButton);

    const gridAndMapOption: HTMLElement = screen.getByTestId(
      "maplist-toggle-menu-gridandmap"
    );
    expect(gridAndMapOption).to.exist;

    await userEvent.click(gridAndMapOption);

    await waitFor(
      () => {
        const gridList = screen.queryAllByTestId("result-card-grid");
        expect(gridList.length).not.equal(0);
      },
      { timeout: 300 }
    );

    await userEvent.click(mapListToggleButton);

    let listAndMapOption: HTMLElement;
    await waitFor(
      () => {
        listAndMapOption = screen.getByTestId("maplist-toggle-menu-listandmap");
        expect(listAndMapOption).to.exist;
      },
      { timeout: 300 }
    ).then(() => userEvent.click(listAndMapOption));

    await waitFor(
      () => {
        const listList = screen.queryAllByTestId("result-card-list");
        expect(listList.length).not.equal(0);
      },
      { timeout: 300 }
    );
  }, 60000);
});
