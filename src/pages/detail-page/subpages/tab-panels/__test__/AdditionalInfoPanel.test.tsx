import { afterAll, afterEach, beforeAll, expect, vi } from "vitest";
import { server } from "../../../../../__mocks__/server";
import { useLocation } from "react-router-dom";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import AppTheme from "../../../../../utils/AppTheme";
import store from "../../../../../components/common/store/store";
import { ThemeProvider } from "@mui/material/styles";
import { DetailPageProvider } from "../../../context/detail-page-provider";
import { Provider } from "react-redux";
import AdditionalInfoPanel from "../AdditionalInfoPanel";

describe("Additional Info", async () => {
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
            <AdditionalInfoPanel />
          </DetailPageProvider>
        </ThemeProvider>
      </Provider>
    );
  });

  test("should render Additional Info Panel", async () => {
    // the panel is rendered
    await waitFor(() => {
      // infomation is rendered
      expect(screen.queryByText("AODN Discovery Parameter Vocabulary")).to
        .exist;

      expect(
        screen.queryByText(
          "Australian Institute of Marine Science (AIMS) - Data Manager, AIMS Data Centre"
        )
      );
      // Lineage
      expect(
        screen.queryByText(
          /Data from AIMS weather stations are subjected to two quality control processes./i
        )
      ).to.exist;

      // Metadata Contact rendered
      expect(screen.queryByText("PRIVATE MAIL BAG 3")).to.exist;
      expect(screen.queryByText("TOWNSVILLE MAIL CENTRE")).to.exist;
      expect(screen.queryAllByText("Queensland")).to.exist;
      expect(screen.queryAllByText("4810")).to.exist;
      expect(screen.queryAllByText("Australia")).to.exist;
      expect(screen.queryAllByText("+61 7 4753 4444 (voice)")).to.exist;
      expect(screen.queryAllByText("+61 7 4772 5852 (facsimile)")).to.exist;
    });
  });
});
