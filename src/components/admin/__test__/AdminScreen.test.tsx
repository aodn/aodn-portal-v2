import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Mock } from "vitest";
import AdminScreen from "../AdminScreen";
import { ogcAxiosWithRetry } from "../../../app/store/searchReducer";

vi.mock("../../../app/store/searchReducer", async () => {
  const actual = await vi.importActual("../../../app/store/searchReducer");
  return {
    ...actual,
    ogcAxiosWithRetry: {
      get: vi.fn(),
    },
  };
});

describe("AdminScreen Component", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("fetches /ogc/manage/info and renders application and depService info", async () => {
    const mockInfoData = {
      application: {
        name: "ogcapi-server-java",
        description: "REST API that implements OGC API",
        version: "main-SNAPSHOT",
      },
      git: {
        commit: {
          id: "cef353e",
        },
      },
      depService: {
        "es-indexer": {
          description: "Meta data indexer for Elastic Search",
          version: "main-SNAPSHOT",
        },
        "geonetwork4-core": {
          description: "AODN customized Geonetwork Instance",
          version: "main-SNAPSHOT",
        },
        "data-access-service": {
          description: "Data Access Service",
          version: "unknown",
        },
        "data-discovery-ai": {
          description: "Data Discovery AI",
          version: "unknown",
        },
      },
    };

    (ogcAxiosWithRetry.get as Mock).mockResolvedValueOnce({
      data: mockInfoData,
    });

    render(
      <AdminScreen visible={true}>
        <div>Child Content</div>
      </AdminScreen>
    );

    expect(ogcAxiosWithRetry.get).toHaveBeenCalledWith("/ogc/manage/info");

    await waitFor(() => {
      expect(screen.getByText("ogcapi-server-java")).toBeInTheDocument();
    });

    expect(screen.getAllByText("main-SNAPSHOT").length).toBe(3);
    expect(screen.getByText("es-indexer")).toBeInTheDocument();
    expect(screen.getByText("geonetwork4-core")).toBeInTheDocument();
    expect(screen.getByText("data-access-service")).toBeInTheDocument();
    expect(screen.getByText("data-discovery-ai")).toBeInTheDocument();
    expect(screen.getByText("Commit: cef353e")).toBeInTheDocument();
  });
});
