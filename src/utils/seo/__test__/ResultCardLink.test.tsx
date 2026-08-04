/**
 * SEO — result card titles must be real <a href="/details/<uuid>"> links.
 *
 * Crawlers only follow <a href>, so onClick-only navigation makes detail
 * pages undiscoverable from the search page. The link's default navigation
 * is intentionally prevented: left click must keep the existing SPA handler
 * (which navigates with tab state), while the href stays available to
 * crawlers, middle click and ctrl/cmd+click.
 */

import { afterEach, describe, expect, test, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { ThemeProvider } from "@mui/material/styles";
import { ReactNode } from "react";
import AppTheme from "@/styles/theme";
import store from "@/app/store/store";
import { OGCCollection } from "@/app/store/OGCCollectionDefinitions";
import GridResultCard from "@/components/result/GridResultCard";
import ListResultCard from "@/components/result/ListResultCard";

const collection: OGCCollection = Object.assign(new OGCCollection(), {
  id: "abc-123",
  title: "Sea Surface Temperature",
  links: [],
  properties: {},
});

const renderCard = (card: ReactNode) =>
  render(
    <Provider store={store}>
      <ThemeProvider theme={AppTheme}>
        <MemoryRouter>{card}</MemoryRouter>
      </ThemeProvider>
    </Provider>
  );

const findTitleLink = (titleTestId: string) =>
  screen.getByTestId(titleTestId).closest("a");

describe.each([
  {
    cardName: "grid card",
    titleTestId: "grid-card-title",
    renderWithHandler: (onClickDetail: (uuid?: string) => void) =>
      renderCard(
        <GridResultCard content={collection} onClickDetail={onClickDetail} />
      ),
  },
  {
    cardName: "list card",
    titleTestId: "result-card-title",
    renderWithHandler: (onClickDetail: (uuid?: string) => void) =>
      renderCard(
        <ListResultCard content={collection} onClickDetail={onClickDetail} />
      ),
  },
])("$cardName title link", ({ titleTestId, renderWithHandler }) => {
  afterEach(() => cleanup());

  test("is an <a> pointing at the record's detail page", () => {
    renderWithHandler(vi.fn());

    expect(findTitleLink(titleTestId)).toHaveAttribute(
      "href",
      "/details/abc-123"
    );
  });

  test("left click runs the SPA handler instead of the browser navigation", () => {
    const onClickDetail = vi.fn();
    renderWithHandler(onClickDetail);

    // fireEvent.click returns false when the default (browser navigation)
    // was prevented — proving the click stays with the SPA handler
    const browserNavigationAllowed = fireEvent.click(
      findTitleLink(titleTestId)!
    );

    expect(browserNavigationAllowed).toBe(false);
    expect(onClickDetail).toHaveBeenCalledWith("abc-123");
  });
});
