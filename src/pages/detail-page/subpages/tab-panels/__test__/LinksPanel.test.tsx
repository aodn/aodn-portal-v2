import { afterAll, afterEach, beforeAll, describe, expect, vi } from "vitest";
import { server } from "../../../../../__mocks__/server";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import AppTheme from "../../../../../utils/AppTheme";
import { DetailPageProvider } from "../../../context/detail-page-provider";
import { useLocation } from "react-router-dom";
import store from "../../../../../components/common/store/store";
import { Provider } from "react-redux";
import { userEvent } from "@testing-library/user-event";
import LinksPanel from "../LinksPanel";

beforeAll(() => {
  server.listen();
});

beforeEach(() => {
  vi.mock("react-router-dom", () => ({
    ...vi.importActual("react-router-dom"),
    useLocation: vi.fn(),
  }));

  vi.mocked(useLocation).mockReturnValue({
    state: null,
    hash: "111",
    key: "default",
    pathname: "/details",
    search: "?uuid=5fc91100-4ade-11dc-8f56-00008a07204e",
  });
});

afterEach(() => {
  cleanup();
  server.resetHandlers();
  vi.restoreAllMocks();
});
afterAll(() => {
  server.close();
});

describe("LinksPanel", async () => {
  const theme = AppTheme;

  beforeEach(() => {
    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <DetailPageProvider>
            <LinksPanel />
          </DetailPageProvider>
        </ThemeProvider>
      </Provider>
    );
  });

  test("should render LinksPanel", async () => {
    await waitFor(() => {
      expect(screen.queryAllByText("Data access using R")).to.exist;
      expect(
        screen.queryAllByText("Marine Weather Observations for Davies Reef")
      ).to.exist;
      expect(screen.queryAllByText("Data access via AODN Portal")).to.exist;
      expect(screen.queryAllByText("Data access via Programming API")).to.exist;
    });
  });

  test("should show COPY LINK button when on hover", async () => {
    await waitFor(() => {
      const link = screen.queryByText("Data access using R");
      expect(link).to.exist;
      userEvent.hover(link!);
      const copyBtn = screen.queryByText("Copy Link");
      expect(copyBtn).to.exist;
    });
  });
});