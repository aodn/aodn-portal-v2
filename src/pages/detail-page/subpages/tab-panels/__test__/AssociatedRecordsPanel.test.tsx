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

describe("AssociatedRecordsPanel", async () => {
  const theme = AppTheme;

  beforeEach(() => {
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

  test("should render AssociatedRecordsPanel", async () => {
    await waitFor(() => {
      const parentRecordText = screen.queryAllByText("Parent Record");

      // one is button, another is list title
      expect(parentRecordText).toHaveLength(2);
    });
  });

  test("should open a new tab when clicking on a record abstract", async () => {
    const openSpy = vi.spyOn(window, "open").mockImplementation(() => null);
    await waitFor(() => {
      const parentTitle = screen.queryByText(
        "Northern Australia Automated Marine Weather and Oceanographic Stations"
      );
      expect(parentTitle).to.exist;

      userEvent.click(parentTitle!);
      const parentAbstract = screen.queryByText(/weather stations have been/i);
      expect(parentAbstract).to.exist;

      userEvent.click(parentAbstract!);
      expect(openSpy).toHaveBeenCalledWith(
        "/details?uuid=0887cb5b-b443-4e08-a169-038208109466",
        "_blank",
        "noopener,noreferrer"
      );
    });
  });

  test("should be able to show / hide more records", async () => {
    const lowerRecordTitle =
      "Cape Ferguson (AIMS Wharf) Automated Marine Weather And Oceanographic Station";

    await waitFor(() => {
      const showMoreRecordsBtn = screen.queryByText(
        "Show More Sibling Records"
      );
      expect(showMoreRecordsBtn).to.exist;

      // final record should be hiddren first
      expect(screen.queryByText(lowerRecordTitle)).to.not.exist;
      userEvent.click(showMoreRecordsBtn!);
    });

    await waitFor(() => {
      expect(screen.queryByText("Show Less Sibling Records")).to.exist;

      // final record should be shown now
      expect(screen.queryByText(lowerRecordTitle)).to.exist;
    });

    await waitFor(() => {
      const showLessRecordsBtn = screen.queryByText(
        "Show Less Sibling Records"
      );
      expect(showLessRecordsBtn).to.exist;
      userEvent.click(showLessRecordsBtn!);
    });

    await waitFor(() => {
      expect(screen.queryByText("Show More Sibling Records")).to.exist;

      // final record should be hiddren again
      expect(screen.queryByText(lowerRecordTitle)).to.not.exist;
    });
  });
});
