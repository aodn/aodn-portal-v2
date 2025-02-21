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
import DataAccessPanel from "../DataAccessPanel";

describe("LinksPanel", async () => {
  const theme = AppTheme;
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
  beforeEach(() => {
    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <DetailPageProvider>
            <DataAccessPanel />
          </DetailPageProvider>
        </ThemeProvider>
      </Provider>
    );
  });

  test("should render LinksPanel", () => {
    expect(screen.queryAllByText("Data access using R")).to.exist;
    expect(screen.queryAllByText("Marine Weather Observations for Davies Reef"))
      .to.exist;
    expect(screen.queryAllByText("Data access via AODN Portal")).to.exist;
    expect(screen.queryAllByText("Data access via Programming API")).to.exist;
  });

  test("should show COPY LINK button when on hover", () => {
    waitFor(() => screen.findByText("Data access using R"), {
      timeout: 5000,
    }).then(() => {
      const link = screen.queryByText("Data access using R");
      expect(link).to.exist;
      userEvent.hover(link!);
      const copyBtns = screen.queryAllByText("Copy Link");
      const visibleCount = copyBtns.filter(
        (btn) => getComputedStyle(btn).visibility === "visible"
      ).length;
      expect(visibleCount).toBe(1);
    });
  });
});
