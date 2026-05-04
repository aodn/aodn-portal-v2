import { afterAll, afterEach, beforeAll, beforeEach, expect, vi } from "vitest";
import { server } from "../../../../../__mocks__/server";
import { useLocation, useParams } from "react-router-dom";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import AppTheme from "../../../../../utils/AppTheme";
import store from "../../../../../components/common/store/store";
import { ThemeProvider } from "@mui/material/styles";
import { DetailPageProvider } from "../../../context/detail-page-provider";
import { Provider } from "react-redux";
import AdditionalInfoPanel from "../AdditionalInfoPanel";
import {
  DetailPageContext,
  DetailPageContextDefault,
} from "../../../context/detail-page-context";
import {
  OGCCollection,
  ITheme,
} from "../../../../../components/common/store/OGCCollectionDefinitions";

describe("Additional Info", async () => {
  const theme = AppTheme;
  beforeAll(() => {
    server.listen();
  });

  beforeEach(() => {
    vi.mock("react-router-dom", () => ({
      ...vi.importActual("react-router-dom"),
      useLocation: vi.fn(),
      useParams: vi.fn(),
    }));

    vi.mocked(useLocation).mockReturnValue({
      state: null,
      hash: "111",
      key: "default",
      pathname: "/details/5fc91100-4ade-11dc-8f56-00008a07204e",
      search: "",
    });

    vi.mocked(useParams).mockReturnValue({
      uuid: "5fc91100-4ade-11dc-8f56-00008a07204e",
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

const mockContextWithThemes = (themes: ITheme[]) => ({
  ...DetailPageContextDefault,
  collection: {
    id: "test-uuid",
    getThemes: () => themes,
    getContacts: () => [],
    getStatement: () => "",
    getMetadataUrl: () => "",
    getRevision: () => undefined,
    getCreation: () => undefined,
  } as unknown as OGCCollection,
});

describe("Descriptive Keyword grouping", () => {
  const renderPanel = (themes: ITheme[]) =>
    render(
      <ThemeProvider theme={AppTheme}>
        <DetailPageContext.Provider value={mockContextWithThemes(themes)}>
          <AdditionalInfoPanel />
        </DetailPageContext.Provider>
      </ThemeProvider>
    );

  afterEach(() => {
    cleanup();
  });

  it("merges multiple Descriptive Keyword themes into a single accordion item", () => {
    renderPanel([
      {
        scheme: "",
        concepts: [
          {
            id: "keyword-a",
            title: "Descriptive Keyword",
            description: "",
            url: "",
          },
        ],
        description: "",
        title: "",
      },
      {
        scheme: "",
        concepts: [
          {
            id: "keyword-b",
            title: "Descriptive Keyword",
            description: "",
            url: "",
          },
        ],
        description: "",
        title: "",
      },
    ]);

    expect(
      screen.queryAllByTestId("collapse-btn-Descriptive Keyword")
    ).toHaveLength(1);
  });

  it("keeps non-Descriptive-Keyword themes as separate accordion items", () => {
    renderPanel([
      {
        scheme: "theme",
        concepts: [
          {
            id: "Param A",
            title: "AODN Discovery Parameter Vocabulary",
            description: "",
            url: "",
          },
        ],
        description: "",
        title: "",
      },
      {
        scheme: "theme",
        concepts: [
          {
            id: "Keyword B",
            title: "GCMD Science Keywords",
            description: "",
            url: "",
          },
        ],
        description: "",
        title: "",
      },
    ]);

    expect(
      screen.queryAllByTestId(
        "collapse-btn-AODN Discovery Parameter Vocabulary"
      )
    ).toHaveLength(1);
    expect(
      screen.queryAllByTestId("collapse-btn-GCMD Science Keywords")
    ).toHaveLength(1);
  });

  it("renders a single Descriptive Keyword theme as one accordion item", () => {
    renderPanel([
      {
        scheme: "",
        concepts: [
          {
            id: "only-keyword",
            title: "Descriptive Keyword",
            description: "",
            url: "",
          },
        ],
        description: "",
        title: "",
      },
    ]);

    expect(
      screen.queryAllByTestId("collapse-btn-Descriptive Keyword")
    ).toHaveLength(1);
  });
});
