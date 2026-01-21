import { cleanup, render, screen, waitFor } from "@testing-library/react";
import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { Provider } from "react-redux";
import store from "../../common/store/store";
import InputWithSuggester from "../InputWithSuggester";
import { server } from "../../../__mocks__/server";
import { userEvent } from "@testing-library/user-event";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import AppTheme from "../../../utils/AppTheme";
import { http, HttpResponse } from "msw";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useLocation: () => ({ pathname: "/search" }),
  };
});

vi.mock("../../hooks/useBreakpoint", () => ({
  default: () => ({ isMobile: false }),
}));

describe("InputWithSuggester", () => {
  const mockHandleEnterPressed = vi.fn();
  const mockHandleScrollToTop = vi.fn();
  const mockSetPendingSearch = vi.fn();
  const mockSetActiveButton = vi.fn();
  const mockSetShouldExpandSearchbar = vi.fn();
  const mockSetShouldExpandAllButtons = vi.fn();

  beforeAll(() => {
    // Mock scrollIntoView
    window.HTMLElement.prototype.scrollIntoView = vi.fn();

    // Mock window.scrollTo
    window.scrollTo = vi.fn();
    server.listen();
  });

  afterEach(() => {
    cleanup();
    server.resetHandlers();
    vi.clearAllMocks();
  });

  afterAll(() => {
    server.close();
  });

  it("Suggestion options should disappear after choosing one of them", () => {
    const user = userEvent.setup();

    // Render the component with Router context and Theme
    render(
      <ThemeProvider theme={AppTheme}>
        <Router>
          <Provider store={store}>
            <InputWithSuggester
              handleEnterPressed={mockHandleEnterPressed}
              handleScrollToTop={mockHandleScrollToTop}
              setPendingSearch={mockSetPendingSearch}
              setActiveButton={mockSetActiveButton}
              setShouldExpandSearchbar={mockSetShouldExpandSearchbar}
              setShouldExpandAllButtons={mockSetShouldExpandAllButtons}
            />
          </Provider>
        </Router>
      </ThemeProvider>
    );

    // Get input field and type text
    const input = screen.getByTestId("input-with-suggester");
    user.click(input);
    user.type(input, "wave");

    // Wait for input value to be updated
    return waitFor(() => {
      expect(input).toHaveValue("wave");
    }).then(() => {
      // Wait for the suggester listbox to appear
      return waitFor(() => {
        expect(screen.queryByRole("listbox")).toBeInTheDocument();

        // Verify if the suggester has the specific option "wave buoy" which comes from the mock data
        expect(screen.queryByText("wave buoy")).toBeInTheDocument();
      }).then(() => {
        // Get the option "wave buoy" and clik
        const option = screen.getByText("wave buoy");
        user.click(option);

        // Wait for suggester listbox to be removed
        return waitFor(() =>
          expect(screen.queryByRole("listbox")).not.toBeInTheDocument()
        );
      });
    });
  });
  // Make sure when the user types "wa," then the suggested list show "wave" as the first
  // option, then press down arrow, then press enter. The value in the search will be
  // "wave" previous there is a bug where "wa" is used for search
  it("clears highlight / sets correct inputValue after selecting suggestion with Enter", () => {
    const user = userEvent.setup();
    server.use(
      http.get("/ogc/ext/autocomplete", () => {
        return HttpResponse.json({
          suggested_organisation_vocabs: [
            "Coastal Wave Buoys Facility, Integrated Marine Observing System (IMOS)",
            "Wave Buoys Sub-Facility, Integrated Marine Observing System (IMOS)",
            "Surface Waves Sub-Facility, Integrated Marine Observing System (IMOS)",
          ],
          suggested_platform_vocabs: [],
          suggested_phrases: [
            "wave parameters",
            "global validated processed wave",
            "older wave data were",
            "some older wave",
            "wave wind database",
            "wave data program dcceew",
            "wave data derived",
            "wave height can",
            "significant wave",
            "significant wave heights",
            "wave buoys developed",
            "wave height obtained from",
            "surface wave data from",
            "derived significant wave heights",
            "wave heights",
            "integral wave",
            "significant wave height",
            "waverider system bom des",
            "ocean wave climate delivering",
            "significant wave height can",
            "non directional waverider",
            "directional wave measurements",
            "observing system surface waves",
            "wave data from",
            "using non directional waverider",
            "wave data program from",
            "waverider buoys",
            "waves",
            "sensed wave data",
            "wave data derived from",
            "nsw nearshore wave",
            "derived significant wave",
            "ocean surface wave",
            "wave data program deakin",
            "wave parameters buoy",
            "swell wave number",
            "southern ocean wave climate",
            "waverider",
            "surface waves",
            "remotely sensed wave",
            "wave data were collected",
            "wave number spectra",
            "validate wave data",
            "wave data were",
            "ocean wave climate",
            "wave measurements obtained from",
            "altimeter derived significant wave",
            "wave archive",
            "wave data streams",
            "waves sub facility altimeter",
            "wave climate delivering historical",
            "some older wave data",
            "waves sub",
            "wave buoys",
            "altimeter wave",
            "buoys wave",
            "collect directional wave",
            "wave measurements",
            "wave wind",
            "waverider buoys therefore some",
            "altimeter wave wind database",
            "wind wave data",
            "wave buoy data",
            "buoys wave buoy networks",
            "surface waves sub facility",
            "satellite remotely sensed wave",
            "directional waverider buoys",
            "national wave archive",
            "facility altimeter wave",
            "global significant wave",
            "ocean swell wave",
            "swell wave number spectra",
            "wave climate",
            "surface wave",
            "southern ocean wave",
            "ocean swell wave number",
            "directional wave measurements globally",
            "older wave",
            "integral wave parameters",
            "nearshore wave data program",
            "datawell some older wave",
            "wave measurements obtained",
            "sensed wave data streams",
            "spotter wave",
            "waves sub facility",
            "wave number bins",
            "waverider system bom",
            "wave archive manly",
            "wave height obtained",
            "extreme southern ocean wave",
            "nearshore wave",
            "collect directional wave measurements",
            "buoys wave buoy",
            "system surface waves sub",
            "provide integral wave",
            "integral wave parameters buoy",
            "wave buoy networks",
            "wind wave",
            "processed wave",
            "wave height",
            "ocean surface wave data",
            "waverider system",
            "remotely sensed wave data",
            "waverider system developed",
            "directional waverider",
            "wave measurements globally",
            "processed wave data streams",
            "buoys provide integral wave",
            "national wave archive manly",
            "directional wave",
            "directional waverider buoys therefore",
            "provide integral wave parameters",
            "spotter wave buoys",
            "validate wave",
            "directional ocean swell wave",
            "validated processed wave data",
            "wave number spectra spectral",
            "facility altimeter wave wind",
            "wave parameters buoy data",
            "comes from spotter wave",
            "surface waves sub",
            "ocean wave",
            "wave",
            "wave buoy",
            "nsw nearshore wave data",
            "wave archive manly hydraulics",
            "distribute ocean surface wave",
            "processed wave data",
            "sensed wave",
            "waverider buoys therefore",
            "global significant wave height",
            "wave data from current",
            "spotter wave buoys developed",
            "wave data program",
            "from spotter wave buoys",
            "wave buoys wave",
            "surface wave data",
            "national wave",
            "older wave data",
            "non directional waverider buoys",
            "wave buoys wave buoy",
            "swell wave",
            "wind wave data derived",
            "wave number",
            "wave buoy networks were",
            "system surface waves",
            "waves sub facility part",
            "nearshore wave data",
            "wave climate delivering",
            "sub facility altimeter wave",
            "validated processed wave",
            "wave mode",
            "altimeter wave wind",
            "from spotter wave",
            "wave data",
          ],
          suggested_parameter_vocabs: ["radio wave", "wave"],
        });
      })
    );
    render(
      <ThemeProvider theme={AppTheme}>
        <Router>
          <Provider store={store}>
            <InputWithSuggester
              handleEnterPressed={mockHandleEnterPressed}
              handleScrollToTop={mockHandleScrollToTop}
              setPendingSearch={mockSetPendingSearch}
              setActiveButton={mockSetActiveButton}
              setShouldExpandSearchbar={mockSetShouldExpandSearchbar}
              setShouldExpandAllButtons={mockSetShouldExpandAllButtons}
            />
          </Provider>
        </Router>
      </ThemeProvider>
    );

    const input = screen.getByTestId("input-with-suggester");

    user.click(input);
    user.type(input, "wa");

    return waitFor(() =>
      expect(screen.getByRole("listbox")).toBeInTheDocument()
    ).then(() => {
      // Focus first option and press Enter
      user.keyboard("{ArrowDown}");
      user.keyboard("{Enter}");

      return waitFor(() => {
        expect(input).toHaveValue("wave"); // or whatever exact value your mock returns
        expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
      });
    });
  });
});
