import { afterAll, afterEach, beforeAll, describe, expect, vi } from "vitest";
import { server } from "../../../../../__mocks__/server";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import AssociatedRecordsPanel from "../AssociatedRecordsPanel";
import { ThemeProvider } from "@mui/material/styles";
import AppTheme from "../../../../../utils/AppTheme";
import { DetailPageProvider } from "../../../context/detail-page-provider";
import { useLocation } from "react-router-dom";
import store from "../../../../../components/common/store/store";
import { Provider } from "react-redux";
import { userEvent } from "@testing-library/user-event";

describe("AssociatedRecordsPanel", async () => {
  const theme = AppTheme;
  let openSpy: any;

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
    }));

    vi.mocked(useLocation).mockReturnValue({
      state: null,
      hash: "111",
      key: "default",
      pathname: "/details",
      search: "?uuid=5fc91100-4ade-11dc-8f56-00008a07204e",
    });

    openSpy = vi
      .spyOn(window, "open")
      .mockImplementation((url, target, features) => {
        console.log(`spy open window called ${url} ${target} ${features}`);
        return null;
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
  });

  it("should render AssociatedRecordsPanel", () => {
    return waitFor(() => screen.findAllByText("Parent Record"), {
      timeout: 2000,
    }).then(() => {
      const parentRecordText = screen.queryAllByText("Parent Record");
      // one is button, another is list title
      expect(parentRecordText).toHaveLength(2);
    });
  });

  it("should open a new tab when clicking on a record abstract", async () => {
    waitFor(
      async () =>
        await screen.findAllByText(
          "Northern Australia Automated Marine Weather and Oceanographic Stations"
        ),
      { timeout: 10000 }
    ).then(async () => {
      const parentTitle = await screen.findByTestId(
        "collapse-item-Northern Australia Automated Marine Weather and Oceanographic Stations"
      );
      expect(parentTitle).to.exist;

      parentTitle && (await userEvent.click(parentTitle));
      const parentAbstract = screen.queryByText(/weather stations have been/i);
      expect(parentAbstract).to.exist;

      parentAbstract &&
        userEvent.click(parentAbstract).then(() => {
          expect(openSpy).toHaveBeenCalledWith(
            "/details?uuid=0887cb5b-b443-4e08-a169-038208109466",
            "_blank",
            "noopener,noreferrer"
          );
        });
    });
  });

  it("should be able to show / hide more records", () => {
    const lowerRecordTitle =
      "Cape Ferguson (AIMS Wharf) Automated Marine Weather And Oceanographic Station";

    waitFor(
      () => {
        const showMoreRecordsBtn = screen.queryByTestId(
          "show-more-detail-btn-Sibling Records"
        );
        expect(showMoreRecordsBtn).to.exist;
        // final record should be hiddren first
        expect(screen.queryByText(lowerRecordTitle)).to.not.exist;
        userEvent.click(showMoreRecordsBtn!);
      },
      { timeout: 5000 }
    );

    waitFor(
      () => {
        expect(screen.queryByTestId("show-less-detail-btn-Sibling Records")).to
          .exist;

        // final record should be shown now
        expect(screen.queryByText(lowerRecordTitle)).to.exist;
      },
      { timeout: 5000 }
    );

    waitFor(
      () => {
        const showLessRecordsBtn = screen.queryByTestId(
          "show-less-detail-btn-Sibling Records"
        );
        expect(showLessRecordsBtn).to.exist;
        userEvent.click(showLessRecordsBtn!);
      },
      { timeout: 5000 }
    );

    waitFor(
      () => {
        expect(screen.queryByTestId("show-more-detail-btn-Sibling Records")).to
          .exist;

        // final record should be hidden again
        expect(screen.queryByText(lowerRecordTitle)).to.not.exist;
      },
      { timeout: 5000 }
    );
  });
});
