import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  MockInstance,
  vi,
} from "vitest";
import { server } from "../../../__mocks__/server";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import AssociatedRecordsPanel from "../features/AssociatedRecordsPanel";
import { ThemeProvider } from "@mui/material/styles";
import AppTheme from "@/styles/theme";
import { DetailPageProvider } from "../context/detail-page-provider";
import { useLocation, useParams } from "react-router-dom";
import store from "@/app/store/store";
import { Provider } from "react-redux";
import { userEvent } from "@testing-library/user-event";

describe("AssociatedRecordsPanel", async () => {
  const theme = AppTheme;
  let openSpy: MockInstance<Window["open"]>;

  beforeAll(() => {
    server.listen();
  });

  afterAll(() => {
    server.close();
  });

  afterEach(() => {
    cleanup();
    server.resetHandlers();
    vi.restoreAllMocks();
    // Restore the original implementation if needed
    openSpy.mockRestore();
  });

  beforeEach(() => {
    vi.mock("react-router-dom", () => ({
      ...vi.importActual("react-router-dom"),
      useLocation: vi.fn(),
      useParams: vi.fn(),
    }));

    openSpy = vi
      .spyOn(window, "open")
      .mockImplementation((url, target, features) => {
        console.log(`spy open window called ${url} ${target} ${features}`);
        return null;
      });
  });

  it("should render AssociatedRecordsPanel", () => {
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

    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <DetailPageProvider>
            <AssociatedRecordsPanel />
          </DetailPageProvider>
        </ThemeProvider>
      </Provider>
    );

    return waitFor(() => screen.findAllByText("Parent Records"), {
      timeout: 2000,
    }).then(() => {
      const parentRecordText = screen.queryAllByText("Parent Records");
      // one is button, another is list title
      expect(parentRecordText).toHaveLength(2);
    });
  });

  it("should expand and show description when clicking on a record title", () => {
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

    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <DetailPageProvider>
            <AssociatedRecordsPanel />
          </DetailPageProvider>
        </ThemeProvider>
      </Provider>
    );

    return waitFor(
      () =>
        screen.findAllByText(
          "Northern Australia Automated Marine Weather and Oceanographic Stations"
        ),

      { timeout: 10000 }
    ).then(() => {
      return waitFor(() =>
        screen.findByTestId(
          `link-card-${window.location.origin}/details/0887cb5b-b443-4e08-a169-038208109466`
        )
      ).then((parentTitle) => {
        expect(parentTitle).to.exist;

        userEvent.click(parentTitle);
        return waitFor(() => {
          const parentAbstract = screen.queryByText(
            /weather stations have been/i
          );
          expect(parentAbstract).to.exist;
        });
      });
    });
  });

  it("should render all parent records when a collection has more than one parent", () => {
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

    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <DetailPageProvider>
            <AssociatedRecordsPanel />
          </DetailPageProvider>
        </ThemeProvider>
      </Provider>
    );

    return waitFor(
      () => {
        expect(
          screen.getByTestId(
            `link-card-${window.location.origin}/details/0887cb5b-b443-4e08-a169-038208109466`
          )
        ).to.exist;
        expect(
          screen.getByTestId(
            `link-card-${window.location.origin}/details/c46ea3a7-1279-4e5d-8fb7-c1c2440fc5c8`
          )
        ).to.exist;
        // This record has two valid parents, so the heading is plural
        // ("Parent Records"), not singular ("Parent Record").
        expect(screen.queryAllByText("Parent Records").length).toBeGreaterThan(
          0
        );
        expect(screen.queryByText("Parent Record")).to.not.exist;
      },
      { timeout: 10000 }
    );
  });

  it("should render a child record under Sub Records for the current record", () => {
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

    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <DetailPageProvider>
            <AssociatedRecordsPanel />
          </DetailPageProvider>
        </ThemeProvider>
      </Provider>
    );

    return waitFor(
      () => {
        expect(
          screen.getByTestId(
            `link-card-${window.location.origin}/details/2e573ea5-b17b-4b5a-8462-2464009c013d`
          )
        ).to.exist;
      },
      { timeout: 10000 }
    );
  });

  it("should be able to show / hide more records", async () => {
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

    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <DetailPageProvider>
            <AssociatedRecordsPanel />
          </DetailPageProvider>
        </ThemeProvider>
      </Provider>
    );

    const lowerRecordTitle =
      "Cape Ferguson (AIMS Wharf) Automated Marine Weather And Oceanographic Station";

    await waitFor(() =>
      screen.findByTestId("show-more-detail-btn-Associated Records")
    ).then((showMoreRecordsBtn) => {
      expect(showMoreRecordsBtn).to.exist;
      expect(screen.queryByText(lowerRecordTitle)).to.not.exist;
      userEvent.click(showMoreRecordsBtn!);
    });

    await waitFor(
      () => {
        expect(screen.queryByTestId("show-less-detail-btn-Associated Records"))
          .exist;

        // final record should be shown now
        expect(screen.queryByText(lowerRecordTitle)).to.exist;
      },
      { timeout: 5000 }
    );

    await waitFor(
      () => {
        const showLessRecordsBtn = screen.queryByTestId(
          "show-less-detail-btn-Associated Records"
        );
        expect(showLessRecordsBtn).to.exist;
        userEvent.click(showLessRecordsBtn!);
      },
      { timeout: 5000 }
    );

    await waitFor(
      () => {
        expect(screen.queryByTestId("show-more-detail-btn-Associated Records"))
          .exist;

        // final record should be hidden again
        expect(screen.queryByText(lowerRecordTitle)).to.not.exist;
      },
      { timeout: 5000 }
    );
  });

  it("should render AssociatedRecordsPanel with malform associated links", () => {
    vi.mocked(useLocation).mockReturnValue({
      state: null,
      hash: "111",
      key: "default",
      pathname: "/details/0145df96-3847-474b-8b63-a66f0e03ff54",
      search: "",
    });

    vi.mocked(useParams).mockReturnValue({
      uuid: "0145df96-3847-474b-8b63-a66f0e03ff54",
    });

    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <DetailPageProvider>
            <AssociatedRecordsPanel />
          </DetailPageProvider>
        </ThemeProvider>
      </Provider>
    );

    return waitFor(() => screen.findAllByText("Parent Record"), {
      timeout: 2000,
    }).then(() => {
      // There are some malform json in the associated links, we make sure parse error will not
      // cause the whole page to die, so as long as we get Parent Record, we know we handled the error.
      // This record has exactly one valid parent, so the heading is singular ("Parent Record"),
      // not plural - see parentsTitle in AssociatedRecordsPanel.tsx
      const parentRecordText = screen.queryAllByText("Parent Record");
      expect(parentRecordText).toHaveLength(2);
    });
  });
});
