import { afterAll, afterEach, beforeAll, expect, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import AppTheme from "../../../../../utils/AppTheme";
import MetadataInformationPanel from "../MetadataInformationPanel";
import { Provider } from "react-redux";
import store from "../../../../../components/common/store/store";
import { ThemeProvider } from "@mui/material/styles";
import { DetailPageProvider } from "../../../context/detail-page-provider";
import { server } from "../../../../../__mocks__/server";
import { useLocation } from "react-router-dom";

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

describe("MetadataInformationPanel", async () => {
  const theme = AppTheme;

  beforeEach(() => {
    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <DetailPageProvider>
            <MetadataInformationPanel />
          </DetailPageProvider>
        </ThemeProvider>
      </Provider>
    );
  });

  test("should render MetadataInformationPanel", async () => {
    // the panel is rendered
    await waitFor(() => {
      expect(screen.queryAllByText("Metadata Contact")).toHaveLength(2);
    });

    // the contact is rendered
    await waitFor(() => {
      expect(
        screen.queryByText("Australian Institute of Marine Science (AIMS)")
      ).to.exist;
      expect(screen.queryByText("PRIVATE MAIL BAG 3")).to.exist;
      expect(screen.queryByText("TOWNSVILLE MAIL CENTRE")).to.exist;
      expect(screen.queryByText("Queensland")).to.exist;
      expect(screen.queryByText("4810")).to.exist;
      expect(screen.queryByText("Australia")).to.exist;
      expect(screen.queryByText("+61 7 4753 4444 (voice)")).to.exist;
      expect(screen.queryByText("+61 7 4772 5852 (facsimile)")).to.exist;

      // medatada identifier is rendered
      expect(screen.queryByText("5fc91100-4ade-11dc-8f56-00008a07204e")).to
        .exist;

      // metadata link is rendered
      expect(
        screen.queryByText(
          "https://apps.aims.gov.au/metadata/view/5fc91100-4ade-11dc-8f56-00008a07204e"
        )
      ).to.exist;

      // metadata dates are rendered

      const metadataDatesTitles = screen.queryAllByText("Metadata Dates");
      metadataDatesTitles.forEach((t) => {
        console.log("tag name", t.tagName);
      });
      const title = metadataDatesTitles.filter(
        (title) => title!.tagName !== "BUTTON"
      );
      const div = title[0]!.parentElement!.parentElement;

      console.log("structure", div!.innerHTML);

      expect(screen.queryByText("Tue Nov 17 2009 00:00:00 GMT+1100")).to.exist;
      expect(screen.queryByText("Thu Feb 15 2024 00:00:00 GMT+1100")).to.exist;
    });
  });
});
