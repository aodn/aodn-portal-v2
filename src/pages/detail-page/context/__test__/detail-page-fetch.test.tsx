import { FC } from "react";
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, useParams } from "react-router-dom";
import { http, HttpResponse } from "msw";
import { server } from "@/__mocks__/server";
import store from "@/app/store/store";
import { ogcAxiosWithRetry } from "@/app/store/searchReducer";
import { DetailPageProvider } from "@/pages/detail-page/context/detail-page-provider";
import { useDetailPageContext } from "@/pages/detail-page/context/detail-page-context";
import DetailPageSeo from "@/pages/detail-page/features/DetailPageSeo";
import DetailsPage from "@/pages/detail-page/DetailsPage";

vi.mock("react-router-dom", async () => ({
  ...(await vi.importActual("react-router-dom")),
  useParams: vi.fn(),
}));

const ENDPOINT = "/api/v1/ogc/collections/:uuid";
const robotsMeta = () =>
  document.head.querySelector('meta[name="robots"][content="noindex"]');

const Consumer: FC = () => {
  const { collection, isCollectionNotFound, isTemporaryError } =
    useDetailPageContext();
  if (isTemporaryError) return <div role="alert">Temporary error</div>;
  return (
    <div>
      {isCollectionNotFound
        ? "Record not found"
        : collection?.title || "Loading"}
    </div>
  );
};

const page = (withSeo = true) => (
  <Provider store={store}>
    <DetailPageProvider>
      {withSeo && <DetailPageSeo />}
      <Consumer />
    </DetailPageProvider>
  </Provider>
);

const navigate = (uuid: string) => {
  vi.mocked(useParams).mockReturnValue({ uuid });
};

describe("dataset fetch errors and robots", () => {
  const originalRetry = ogcAxiosWithRetry.defaults["axios-retry"];
  const originalAdapter = ogcAxiosWithRetry.defaults.adapter;
  const originalTimeout = ogcAxiosWithRetry.defaults.timeout;

  beforeAll(() => {
    server.listen({ onUnhandledRequest: "error" });
    // Exercise final failures without the production exponential retry delay.
    ogcAxiosWithRetry.defaults["axios-retry"] = { retries: 0 };
  });

  beforeEach(() => {
    navigate("first");
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    cleanup();
    server.resetHandlers();
    vi.restoreAllMocks();
    ogcAxiosWithRetry.defaults.timeout = originalTimeout;
    ogcAxiosWithRetry.defaults.adapter = originalAdapter;
  });

  afterAll(() => {
    server.close();
    ogcAxiosWithRetry.defaults["axios-retry"] = originalRetry;
  });

  it.each([undefined, "malformed-group"])(
    "loads a successful response with dataset_group %s without noindex",
    async (datasetGroup) => {
      server.use(
        http.get(ENDPOINT, () =>
          HttpResponse.json({
            id: "first",
            title: "Dataset",
            properties: { dataset_group: datasetGroup },
          })
        )
      );
      render(page());
      await screen.findByText("Dataset");
      expect(document.title).toBe("Dataset | AODN Portal");
      expect(robotsMeta()).toBeNull();
    }
  );

  it("marks only a confirmed 404 as missing and noindex", async () => {
    server.use(
      http.get(ENDPOINT, () => HttpResponse.json({}, { status: 404 }))
    );
    render(page());
    await screen.findByText("Record not found");
    expect(document.title).toBe("Record not found | AODN Portal");
    expect(robotsMeta()).not.toBeNull();
  });

  it("keeps provider error classification independent of SEO", async () => {
    server.use(
      http.get(ENDPOINT, () => HttpResponse.json({}, { status: 404 }))
    );
    const previousTitle = document.title;
    render(page(false));
    await screen.findByText("Record not found");
    expect(document.title).toBe(previousTitle);
    expect(robotsMeta()).toBeNull();
  });

  it("keeps page SEO mounted alongside the temporary-error UI", async () => {
    server.use(
      http.get(ENDPOINT, () => HttpResponse.json({}, { status: 503 }))
    );
    render(
      <Provider store={store}>
        <MemoryRouter>
          <DetailsPage />
        </MemoryRouter>
      </Provider>
    );
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Unable to load this dataset at the moment. Please try again later."
    );
    expect(document.title).toBe("Service unavailable | AODN Portal");
    expect(robotsMeta()).toBeNull();
  });

  it.each([429, 500, 503])(
    "keeps HTTP %i failures indexable",
    async (status) => {
      server.use(http.get(ENDPOINT, () => HttpResponse.json({}, { status })));
      render(page());
      await screen.findByRole("alert");
      expect(screen.queryByText("Record not found")).toBeNull();
      expect(document.title).toBe("Service unavailable | AODN Portal");
      expect(robotsMeta()).toBeNull();
    }
  );

  it.each(["network", "timeout"])(
    "keeps %s failures indexable",
    async (failure) => {
      let release: () => void = () => {};
      const pending = new Promise<void>((resolve) => {
        release = resolve;
      });
      if (failure === "timeout") {
        ogcAxiosWithRetry.defaults.adapter = "fetch";
        ogcAxiosWithRetry.defaults.timeout = 20;
      }
      server.use(
        http.get(ENDPOINT, async () => {
          if (failure === "network") return HttpResponse.error();
          await pending;
          return HttpResponse.json({ id: "first", title: "Late dataset" });
        })
      );
      render(page());
      try {
        await screen.findByRole("alert");
        expect(screen.queryByText("Record not found")).toBeNull();
        expect(robotsMeta()).toBeNull();
      } finally {
        release();
      }
    }
  );

  it.each([404, 503])(
    "resets HTTP %i error state when navigating",
    async (status) => {
      let release: () => void = () => {};
      const pending = new Promise<void>((resolve) => {
        release = resolve;
      });
      server.use(
        http.get(ENDPOINT, async ({ params }) => {
          if (params.uuid === "first") return HttpResponse.json({}, { status });
          await pending;
          return HttpResponse.json({ id: "second", title: "Next dataset" });
        })
      );
      const { rerender } = render(page());
      if (status === 404) await screen.findByText("Record not found");
      else await screen.findByRole("alert");
      navigate("second");
      rerender(page());
      expect(screen.getByText("Loading")).toBeInTheDocument();
      expect(robotsMeta()).toBeNull();
      expect(screen.queryByRole("alert")).toBeNull();
      release();
      await screen.findByText("Next dataset");
      expect(robotsMeta()).toBeNull();
    }
  );

  it.each([200, 404, 503])(
    "ignores a stale HTTP %i response after navigation",
    async (status) => {
      let release: () => void = () => {};
      const pending = new Promise<void>((resolve) => {
        release = resolve;
      });
      let started = false;
      server.use(
        http.get(ENDPOINT, async ({ params }) => {
          if (params.uuid === "first") {
            started = true;
            await pending;
            return HttpResponse.json(
              { id: "first", title: "Old dataset" },
              { status }
            );
          }
          return HttpResponse.json({ id: "second", title: "Next dataset" });
        })
      );
      const dispatch = vi.spyOn(store, "dispatch");
      const { rerender } = render(page());
      await waitFor(() => expect(started).toBe(true));
      const oldRequest = dispatch.mock.results[0].value;
      navigate("second");
      rerender(page());
      await screen.findByText("Next dataset");
      await act(async () => {
        release();
        await oldRequest;
      });
      expect(screen.getByText("Next dataset")).toBeInTheDocument();
      expect(document.title).toBe("Next dataset | AODN Portal");
      expect(robotsMeta()).toBeNull();
      expect(screen.queryByRole("alert")).toBeNull();
    }
  );
});
