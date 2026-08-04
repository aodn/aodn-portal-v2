import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
  vi,
} from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import AppTheme from "@/styles/theme";
import { Provider } from "react-redux";
import store from "@/app/store/store";
import { ThemeProvider } from "@mui/material/styles";
import { DetailPageProvider } from "../context/detail-page-provider";
import { server } from "../../../__mocks__/server";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import HeaderSection from "../layout/HeaderSection";

describe("HeaderSection", async () => {
  const theme = AppTheme;

  beforeAll(() => {
    server.listen();
  });

  beforeEach(() => {
    vi.mock("react-router-dom", () => ({
      ...vi.importActual("react-router-dom"),
      useLocation: vi.fn(),
      useParams: vi.fn(),
      useNavigate: vi.fn(),
    }));

    vi.mocked(useLocation).mockReturnValue({
      state: null,
      hash: "",
      key: "default",
      pathname: "/details/5fc91100-4ade-11dc-8f56-00008a07204e",
      search: "",
    });

    vi.mocked(useParams).mockReturnValue({
      uuid: "5fc91100-4ade-11dc-8f56-00008a07204e",
    });

    vi.mocked(useNavigate).mockReturnValue(vi.fn());

    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <DetailPageProvider>
            <HeaderSection />
          </DetailPageProvider>
        </ThemeProvider>
      </Provider>
    );
  });

  afterEach(() => {
    cleanup();
    server.resetHandlers();
    vi.restoreAllMocks();
  });

  afterAll(() => {
    server.close();
  });

  test("renders the collection title as the page h1", async () => {
    await waitFor(() => {
      expect(
        screen.getByRole("heading", {
          level: 1,
          name: "Davies Reef Automated Marine Weather And Oceanographic Station",
        })
      ).to.exist;
    });
  });
});
