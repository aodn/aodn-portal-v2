import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { portalTheme } from "@/styles";
import store from "@/app/store/store";
import { SearchKeys } from "@/components/search/constants";
import {
  NEWS_CARDS_DATA,
  NewsCardData,
} from "@/pages/landing-page/features/news/constants";
import News from "@/pages/landing-page/features/news/News";

const imosCard: NewsCardData = {
  ...NEWS_CARDS_DATA[0],
  id: 1,
  tab: SearchKeys.IMOS,
  title: "IMOS test card",
};
const aadCard: NewsCardData = {
  ...NEWS_CARDS_DATA[0],
  id: 2,
  tab: SearchKeys.AAD,
  title: "AAD test card",
};

const renderNews = (url = "/", cards?: NewsCardData[]) =>
  render(
    <Provider store={store}>
      <ThemeProvider theme={portalTheme}>
        <MemoryRouter initialEntries={[url]}>
          <News cards={cards} />
        </MemoryRouter>
      </ThemeProvider>
    </Provider>
  );

const getPill = (label: string) =>
  screen.getByRole("button", { name: new RegExp(`^${label}$`) });

beforeEach(() => {
  Element.prototype.scrollIntoView = vi.fn();
});
afterEach(() => {
  cleanup();
});

describe("News", () => {
  it("shows a pill for IMOS and every contributor", () => {
    renderNews();
    ["IMOS", "AAD", "AIMS", "CSIRO", "GA", "IMAS", "NCI", "eAtlas", "WAMSI"]
      .map(getPill)
      .forEach((pill) => expect(pill).toBeInTheDocument());
  });

  it("disables only the pills without cards", () => {
    renderNews("/", [imosCard, aadCard]);
    expect(getPill("IMOS")).toBeEnabled();
    expect(getPill("AAD")).toBeEnabled();
    expect(getPill("AIMS")).toBeDisabled();
    expect(getPill("WAMSI")).toBeDisabled();
  });

  it("switches the cards when a pill is clicked", async () => {
    renderNews("/", [imosCard, aadCard]);
    expect(screen.getByText("IMOS test card")).toBeInTheDocument();
    await userEvent.setup().click(getPill("AAD"));
    expect(getPill("AAD")).toHaveAttribute("aria-current", "true");
    expect(screen.getAllByRole("button", { current: true })).toHaveLength(1);
    expect(screen.getAllByText("AAD test card")).not.toHaveLength(0);
    expect(screen.queryByText("IMOS test card")).not.toBeInTheDocument();
  });

  it.each([
    ["/?featured=AAD", "AAD"],
    ["/?featured=aad", "AAD"],
    ["/?featured=AIMS", "IMOS"],
    ["/?featured=unknown", "IMOS"],
    ["/", "IMOS"],
  ])("opens %s with the %s pill selected", (url, label) => {
    renderNews(url, [imosCard, aadCard]);
    expect(getPill(label)).toHaveAttribute("aria-current", "true");
    expect(screen.getAllByRole("button", { current: true })).toHaveLength(1);
  });

  it("scrolls to the section only for a featured tab with cards", () => {
    renderNews("/?featured=AIMS", [imosCard, aadCard]);
    expect(Element.prototype.scrollIntoView).not.toHaveBeenCalled();
    cleanup();
    renderNews("/?featured=AAD", [imosCard, aadCard]);
    expect(Element.prototype.scrollIntoView).toHaveBeenCalledOnce();
  });

  it("does not show the select organisation prompt", () => {
    renderNews();
    expect(
      screen.queryByText(/Select a contributing organisation/)
    ).not.toBeInTheDocument();
  });

  it("shows no dataset counts or more datasets button", () => {
    renderNews();
    expect(getPill("IMOS")).toHaveTextContent(/^IMOS$/);
    expect(
      screen.queryByRole("button", { name: "More datasets" })
    ).not.toBeInTheDocument();
  });
});
