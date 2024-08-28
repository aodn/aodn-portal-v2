import { afterAll, afterEach, beforeAll, expect, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import AppTheme from "../../../../../utils/AppTheme";
import { Provider } from "react-redux";
import store from "../../../../../components/common/store/store";
import { ThemeProvider } from "@mui/material/styles";
import { DetailPageProvider } from "../../../context/detail-page-provider";
import { server } from "../../../../../__mocks__/server";
import { useLocation } from "react-router-dom";
import LineagePanel from "../LineagePanel";

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

describe("LineagePanel", async () => {
  const theme = AppTheme;

  beforeEach(() => {
    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <DetailPageProvider>
            <LineagePanel />
          </DetailPageProvider>
        </ThemeProvider>
      </Provider>
    );
  });

  test("should render MetadataInformationPanel", async () => {
    // the panel is rendered
    await waitFor(() => {
      expect(screen.queryAllByText("Statement")).toHaveLength(1);
    });

    await waitFor(() => {
      expect(
        screen.queryByText(
          /Data from AIMS weather stations are subjected to two quality control processes./i
        )
      ).to.exist;
    });
  });
});
