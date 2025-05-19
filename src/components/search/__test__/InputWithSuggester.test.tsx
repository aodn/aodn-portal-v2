import { cleanup, render, screen, waitFor } from "@testing-library/react";
import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  test,
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

  test("Suggestion options should disappear after choosing one of them", () => {
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
});
