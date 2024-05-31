import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  expect,
  describe,
  test,
} from "vitest";
import { server } from "../../__mocks__/server";
import { cleanup, render, screen } from "@testing-library/react";
import store from "../../components/common/store/store";
import { ThemeProvider } from "@mui/material/styles";
import DynamicResultCardButton from "../../components/common/buttons/DynamicResultCardButton";
import { Provider } from "react-redux";
import AppTheme from "../../utils/AppTheme";
import SearchPage from "../SearchPage/SearchPage";
import { userEvent } from "@testing-library/user-event";
import { BrowserRouter as Router } from "react-router-dom";

beforeAll(() => {
  server.listen();
});
afterEach(() => {
  cleanup();
  server.resetHandlers();
});
afterAll(() => {
  server.close();
});

describe("SearchPage", async () => {
  // const theme = AppTheme;
  //
  // beforeEach(() => {
  //   render(
  //     <Provider store={store}>
  //       <ThemeProvider theme={theme}>
  //         <Router>
  //           <SearchPage />
  //         </Router>
  //       </ThemeProvider>
  //     </Provider>
  //   );
  // });
  test("The SearchPage layout should be able to changed properly", async () => {
    // const mapListToggleButton = screen.getByTestId("map-list-toggle-button");
    // await userEvent.click(mapListToggleButton);
    // const fullMapViewOption = screen.queryByText("Full Map View");
    // expect(fullMapViewOption).to.exist;
    // await userEvent.click(fullMapViewOption);
    //
    // const list = screen.queryByTestId("search-page-result-list");
    // await sleep(300);
    // expect(list).to.not.exist;
    // now is full map view. List should not be shown
    // TODO:
  });
});
