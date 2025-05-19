import {
  render,
  screen,
  cleanup,
  waitFor,
  within,
} from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { Provider } from "react-redux";
import { describe, expect, it, vi } from "vitest";
import store from "../../common/store/store";
import {
  updateHasData,
  updateImosOnly,
  updateParameterVocabs,
  updatePlatform,
  updateUpdateFreq,
} from "../../common/store/componentParamReducer";
import { server } from "../../../__mocks__/server";
import { ThemeProvider } from "@mui/material/styles";
import AppTheme from "../../../utils/AppTheme";

const theme = AppTheme;
const clearAllMock = () => {
  store.dispatch(updateParameterVocabs([]));
  store.dispatch(updateImosOnly(undefined));
  store.dispatch(updateHasData(undefined));
  store.dispatch(updatePlatform([]));
  store.dispatch(updateUpdateFreq(undefined));
};

vi.mock("../../../hooks/useBreakpoint", () => ({
  default: () => ({ isMobile: false }),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useLocation: () => ({ pathname: "/" }),
  };
});
import { BrowserRouter as Router } from "react-router-dom";
import Searchbar from "../Searchbar";
import { PARAMETER_VOCABS } from "../../../__mocks__/data/PARAMETER_VOCABS";

describe("Searchbar", () => {
  beforeAll(() => {
    // Mock scrollIntoView
    window.HTMLElement.prototype.scrollIntoView = vi.fn();

    // Mock window.scrollTo
    window.scrollTo = vi.fn();
    server.listen();
  });

  beforeEach(() =>
    // Cleanup redux before each test
    clearAllMock()
  );

  afterEach(() => {
    cleanup();
    server.resetHandlers();
  });

  afterAll(() => {
    server.close();
  });

  it("renders searchbar", () => {
    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Router>
            <Searchbar />
          </Router>
        </ThemeProvider>
      </Provider>
    );

    expect(screen.getByTestId("CloseIcon")).toBeInTheDocument();
    expect(screen.getByTestId("DateRangeIcon")).toBeInTheDocument();
    expect(screen.getByTestId("PlaceIcon")).toBeInTheDocument();
    expect(screen.getByTestId("TuneIcon")).toBeInTheDocument();
    expect(screen.getByTestId("SearchIcon")).toBeInTheDocument();
  });

  it("render filter popup when clicking filter button, and close filter popup when clicking close icon", () => {
    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Router>
            <Searchbar />
          </Router>
        </ThemeProvider>
      </Provider>
    );

    // User click on the filter button
    const filterButton = screen.getByTestId("filtersBtn");
    userEvent.click(filterButton);

    // Wait for the filter popup to appear
    return waitFor(() => screen.getByTestId("searchbar-popup")).then(
      (popup) => {
        // Check if the "reset" and "close" buttons are present in the popup
        expect(within(popup).getByTestId("CloseIcon")).toBeInTheDocument();
        expect(within(popup).getByTestId("ReplayIcon")).toBeInTheDocument();

        // Check if the first tab - "Parameters" is present in the popup
        expect(screen.getByText("Parameters")).toBeInTheDocument();

        // User click on the close button
        const closeButton = within(popup).getByTestId("CloseIcon");
        userEvent.click(closeButton);

        // Wait for the filter popup to be removed
        return waitFor(() =>
          expect(
            screen.queryByTestId("searchbar-popup")
          ).not.toBeInTheDocument()
        );
      }
    );
  });

  it("should render the filter popup - parameters correctly", () => {
    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Router>
            <Searchbar />
          </Router>
        </ThemeProvider>
      </Provider>
    );

    // User click on the filter button
    const filterButton = screen.getByTestId("filtersBtn");
    userEvent.click(filterButton);

    // Wait for the filter popup to appear
    return waitFor(() => screen.getByTestId("searchbar-popup")).then(
      (popup) => {
        // Check if the first tab - "Parameters" is present in the popup
        expect(screen.getByText("Parameters")).toBeInTheDocument();

        // By default, the first tab - "Parameters" should be selected
        // Check if the first tab - "Parameters" is selected
        const parametersTab = within(popup).getByText("Parameters");
        expect(parametersTab).toHaveAttribute("aria-selected", "true");

        // Check if there is a button with the name "Acoustics" (which comes from mock vocabs data) in the parameters tab
        const parameterPanel = screen.getByTestId("tab-panel-Parameters");
        expect(
          within(parameterPanel).getByRole("button", {
            name: "Acoustics",
          })
        ).toBeInTheDocument();
      }
    );
  });

  it("should render correct number of selected parameters", () => {
    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Router>
            <Searchbar />
          </Router>
        </ThemeProvider>
      </Provider>
    );

    // User click on the filter button
    const filterButton = screen.getByTestId("filtersBtn");
    userEvent.click(filterButton);

    // Wait for the filter popup to appear
    return waitFor(() => screen.getByTestId("searchbar-popup")).then(() => {
      const parameterPanel = screen.getByTestId("tab-panel-Parameters");

      // User click on two parameter buttons "Acoustics" and "Air-Sea Fluxes"
      const parameterButton1 = within(parameterPanel).getByRole("button", {
        name: "Acoustics",
      });
      userEvent.click(parameterButton1);

      const parameterButton2 = within(parameterPanel).getByRole("button", {
        name: "Air-Sea Fluxes",
      });
      userEvent.click(parameterButton2);

      // Wait for the parameter buttons to be selected
      return waitFor(() => {
        expect(parameterButton1).toHaveAttribute("aria-pressed", "true");
        expect(parameterButton2).toHaveAttribute("aria-pressed", "true");
      }).then(() => {
        // Check if the filter button badge is updated with the correct number of selected parameters
        const filterButtonBadge = screen.getByTestId(
          "searchbar-button-badge-Filter"
        );
        expect(filterButtonBadge).toBeInTheDocument();
        expect(filterButtonBadge).toHaveTextContent("2");
      });
    });
  });

  it("should clear the selected parameters when click 'reset' button", () => {
    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Router>
            <Searchbar />
          </Router>
        </ThemeProvider>
      </Provider>
    );

    // User click on the filter button
    const filterButton = screen.getByTestId("filtersBtn");
    userEvent.click(filterButton);

    // Wait for the filter popup to appear
    return waitFor(() => screen.getByTestId("searchbar-popup")).then(
      (popup) => {
        const resetButton = within(popup).getByTestId("ReplayIcon");
        const parameterPanel = screen.getByTestId("tab-panel-Parameters");

        // User click on two parameter buttons "Acoustics" and "Air-Sea Fluxes"
        const parameterButton = within(parameterPanel).getByRole("button", {
          name: "Acoustics",
        });
        userEvent.click(parameterButton);

        // Wait for the parameter buttons to be selected
        return waitFor(() => {
          expect(parameterButton).toHaveAttribute("aria-pressed", "true");
        }).then(() => {
          // Check if the filter button badge is updated with the correct number of selected parameters
          const filterButtonBadge = screen.getByTestId(
            "searchbar-button-badge-Filter"
          );
          const badgeContainer = within(filterButtonBadge).getByText("1");

          // User click on the reset button to clear the selected parameters
          userEvent.click(resetButton);

          return waitFor(() => {
            // Check if the parameter button is unselected
            expect(parameterButton).toHaveAttribute("aria-pressed", "false");
          }).then(() => {
            // In MUI Badge, the class "MuiBadge-invisible" is used to hide the badge when the badge content is 0
            // Check if there is still a badge after clear the filters
            expect(badgeContainer).toHaveClass("MuiBadge-invisible");
          });
        });
      }
    );
  });

  // Redux to UI flow: make sure the searchbar states are updated correctly across pages given redux states
  it("should render correct badge number and selected parameter button given redux states", () => {
    // Mock redux states
    store.dispatch(
      updateParameterVocabs([
        PARAMETER_VOCABS[0].narrower[0],
        PARAMETER_VOCABS[0].narrower[1],
      ])
    );

    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Router>
            <Searchbar />
          </Router>
        </ThemeProvider>
      </Provider>
    );

    const filterButtonBadge = screen.getByTestId(
      "searchbar-button-badge-Filter"
    );
    expect(filterButtonBadge).toBeInTheDocument();
    expect(filterButtonBadge).toHaveTextContent("2");

    screen.debug(filterButtonBadge);

    // User click on the filter button
    const filterButton = screen.getByTestId("filtersBtn");
    userEvent.click(filterButton);

    return waitFor(() => screen.getByTestId("searchbar-popup")).then(() => {
      const parameterPanel = screen.getByTestId("tab-panel-Parameters");

      // Get the parameter buttons "Air pressure" and "Visibility" which are selected
      const parameterButton1 = within(parameterPanel).getByRole("button", {
        name: "Air pressure",
      });
      const parameterButton2 = within(parameterPanel).getByRole("button", {
        name: "Visibility",
      });

      // Wait for the parameter buttons to be selected
      return waitFor(() => {
        expect(parameterButton1).toHaveAttribute("aria-pressed", "true");
        expect(parameterButton2).toHaveAttribute("aria-pressed", "true");
      });
    });
  });
});
