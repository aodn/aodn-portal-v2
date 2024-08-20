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
  test("should render AssociatedRecordsPanel", async () => {
    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <DetailPageProvider>
            <AssociatedRecordsPanel />
          </DetailPageProvider>
        </ThemeProvider>
      </Provider>
    );

    await waitFor(() => {
      const parentRecordText = screen.queryAllByText("Parent Record");

      // one is button, another is list title
      expect(parentRecordText).toHaveLength(2);
    });

    await waitFor(() => {
      const parentTitle = screen.queryByText(
        "Northern Australia Automated Marine Weather and Oceanographic Stations"
      );
      expect(parentTitle).to.exist;

      userEvent.click(parentTitle!);
      const parentAbstract = screen.queryByText(/weather stations have been/i);
      expect(parentAbstract).to.exist;

      const openSpy = vi.spyOn(window, "open").mockImplementation(() => null);
      userEvent.click(parentAbstract!);
      expect(openSpy).toHaveBeenCalledWith("dsf", "_blank");
    });
  });
});
