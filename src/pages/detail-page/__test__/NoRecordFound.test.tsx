import {
  vi,
  describe,
  beforeAll,
  beforeEach,
  afterEach,
  afterAll,
  test,
  expect,
} from "vitest";
import { server } from "../../../__mocks__/server";
import AppTheme from "../../../utils/AppTheme";
import { useLocation, useParams } from "react-router-dom";
import { cleanup, render, waitFor, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import store from "../../../components/common/store/store";
import { ThemeProvider } from "@mui/material/styles";
import { DetailPageProvider } from "../context/detail-page-provider";
import DetailsPage from "../DetailsPage";
import { DataTestId } from "../../../components/map/mapbox/constants";

vi.mock("react-router-dom", () => ({
  ...vi.importActual("react-router-dom"),
  useLocation: vi.fn(),
  useParams: vi.fn(),
  useNavigate: vi.fn(),
}));

describe("No Record Found", () => {
  beforeAll(() => {
    server.listen();
  });

  beforeEach(() => {
    // Setup router mocks
    vi.mocked(useLocation).mockReturnValue({
      state: null,
      hash: "111",
      key: "default",
      pathname: "/details/test-not-found-uuid",
      search: "",
    });

    vi.mocked(useParams).mockReturnValue({
      uuid: "test-not-found-uuid",
    });
  });

  afterEach(() => {
    cleanup();
    server.resetHandlers();
    vi.clearAllMocks();
  });

  afterAll(() => {
    server.close();
  });

  test("should render No Record Found", async () => {
    // Render the component
    render(
      <Provider store={store}>
        <ThemeProvider theme={AppTheme}>
          <DetailPageProvider>
            <DetailsPage />
          </DetailPageProvider>
        </ThemeProvider>
      </Provider>
    );

    await waitFor(() => {
      // Verify information is rendered
      expect(
        screen.getByText(
          "There is no matching record. Please return to the search page."
        )
      ).toBeInTheDocument();
    }).then(() => {
      // Verify return button is rendered
      expect(
        screen.getByTestId(DataTestId.HeaderSection.ReturnButton)
      ).toBeInTheDocument();

      // Verify not found image is rendered
      expect(
        screen.getByRole("img", { name: "not found image" })
      ).toBeInTheDocument();
    });
  });
});
