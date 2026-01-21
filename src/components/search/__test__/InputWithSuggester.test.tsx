import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
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

  beforeEach(() => {
    cleanup();
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
  });

  afterAll(() => {
    vi.clearAllMocks();
    server.close();
  });

  it("Suggestion options should disappear after choosing one of them", () => {
    // Get input field and type text
    const user = userEvent.setup();
    const input = screen.getByTestId("input-with-suggester");
    user.click(input);
    user.clear(input);
    user.type(input, "wave");

    // Wait for the input value to be updated
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

        // Wait for the suggester listbox to be removed
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
    const input = screen.getByTestId("input-with-suggester");
    user.click(input);
    user.clear(input);
    user.type(input, "imo");

    // Wait for the input value to be updated
    return waitFor(() => {
      expect(input).toHaveValue("imo");
    }).then(() => {
      return waitFor(() =>
        expect(screen.queryByRole("listbox")).toBeInTheDocument()
      ).then(() => {
        // Focus first option and press Enter
        user.keyboard("{ArrowDown}");
        user.keyboard("{Enter}");

        return waitFor(() => {
          expect(input).toHaveValue("imos sst"); // or whatever exact value your mock returns
        });
      });
    });
  });
});
