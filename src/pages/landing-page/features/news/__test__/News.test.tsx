import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { portalTheme } from "@/styles";
import store from "@/app/store/store";
import { SearchKeys } from "@/components/search/constants";
import { getNewsCards } from "@/pages/landing-page/features/news/constants";
import News from "@/pages/landing-page/features/news/News";

const renderNews = (url = "/") =>
  render(
    <Provider store={store}>
      <ThemeProvider theme={portalTheme}>
        <MemoryRouter initialEntries={[url]}>
          <News />
        </MemoryRouter>
      </ThemeProvider>
    </Provider>
  );

beforeEach(() => {
  Element.prototype.scrollIntoView = vi.fn();
});
afterEach(() => {
  cleanup();
});

describe("News", () => {
  it.each(["IMOS", "AAD", "AIMS", "CSIRO", "IMAS"])(
    "selects the %s tab on click without leaving the page",
    async (label) => {
      renderNews("/?featured=IMAS");
      await userEvent
        .setup()
        .click(screen.getByRole("button", { name: new RegExp(`^${label}$`) }));
      expect(
        screen.getByRole("button", { name: new RegExp(`^${label}$`) })
      ).toHaveAttribute("aria-current", "true");
      expect(screen.getAllByRole("button", { current: true })).toHaveLength(1);
    }
  );

  it.each([
    ["/?featured=AAD", "AAD"],
    ["/?featured=aad", "AAD"],
    ["/?featured=unknown", "IMOS"],
    ["/", "IMOS"],
  ])("opens %s with the %s tab selected", (url, label) => {
    renderNews(url);
    expect(
      screen.getByRole("button", { name: new RegExp(`^${label}$`) })
    ).toHaveAttribute("aria-current", "true");
    expect(screen.getAllByRole("button", { current: true })).toHaveLength(1);
  });

  it("shows the cards of the selected tab", () => {
    renderNews("/?featured=AAD");
    getNewsCards(SearchKeys.AAD).forEach((card) => {
      expect(screen.getAllByText(card.title.trim())).not.toHaveLength(0);
    });
  });

  it("scrolls to the section when featured is set", () => {
    renderNews("/?featured=AAD");
    expect(Element.prototype.scrollIntoView).toHaveBeenCalledOnce();
  });

  it("shows no dataset counts or more datasets button", () => {
    renderNews();
    expect(screen.getByRole("button", { name: "AAD" })).toHaveTextContent(
      /^AAD$/
    );
    expect(
      screen.queryByRole("button", { name: "More datasets" })
    ).not.toBeInTheDocument();
  });
});
