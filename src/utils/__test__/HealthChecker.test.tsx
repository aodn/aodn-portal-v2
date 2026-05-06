import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";

// The component under test
import HealthChecker from "../HealthChecker";

// Mock the DegradedPage so we can assert on a string
vi.mock("../../pages/error-page/DegradedPage", () => ({
  default: () => <div>DEGRADED_PAGE</div>,
}));

// Mock the app dispatch hook by directly exporting a function that returns our mock dispatch
const mockDispatch = vi.fn();
vi.mock("../../components/common/store/hooks", () => ({
  useAppDispatch: () => mockDispatch,
}));

describe("HealthChecker", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test("renders children when health is UP", async () => {
    // Arrange: dispatch(...).unwrap() should resolve to a healthy payload
    const healthy = {
      status: "UP",
      components: { ogcApiHealth: { status: "UP" } },
    };

    // mockDispatch should return an object having unwrap() that resolves to healthy
    mockDispatch.mockReturnValue({
      unwrap: () => Promise.resolve(healthy),
      abort: vi.fn(),
    });

    render(
      <HealthChecker>
        <div>CHILDREN</div>
      </HealthChecker>
    );

    // Children should be visible initially (optimistic rendering)
    expect(screen.getByText("CHILDREN")).toBeInTheDocument();

    // After health check completes, children should still be visible
    await waitFor(() =>
      expect(screen.getByText("CHILDREN")).toBeInTheDocument()
    );
  });

  test("shows degraded page when health is not UP", async () => {
    const unhealthy = {
      status: "DOWN",
      components: { ogcApiHealth: { status: "DOWN" } },
    };

    mockDispatch.mockReturnValue({
      unwrap: () => Promise.resolve(unhealthy),
      abort: vi.fn(),
    });

    render(
      <HealthChecker>
        <div>CHILDREN</div>
      </HealthChecker>
    );

    // Initially children are shown (optimistic)
    expect(screen.getByText("CHILDREN")).toBeInTheDocument();

    // After health check completes, degraded page should be shown
    await waitFor(() =>
      expect(screen.getByText("DEGRADED_PAGE")).toBeInTheDocument()
    );
  });

  test("shows degraded page when dispatch throws", async () => {
    mockDispatch.mockReturnValue({
      unwrap: () => Promise.reject(new Error("fail")),
      abort: vi.fn(),
    });

    render(
      <HealthChecker>
        <div>CHILDREN</div>
      </HealthChecker>
    );

    // Initially children are shown (optimistic)
    expect(screen.getByText("CHILDREN")).toBeInTheDocument();

    // After health check fails, degraded page should be shown
    await waitFor(() =>
      expect(screen.getByText("DEGRADED_PAGE")).toBeInTheDocument()
    );
  });
  test("skips health check in playwright-local mode", async () => {
    // Mock import.meta.env.MODE
    vi.stubEnv("MODE", "playwright-local");

    render(
      <HealthChecker>
        <div>CHILDREN</div>
      </HealthChecker>
    );

    // Children should be visible
    expect(screen.getByText("CHILDREN")).toBeInTheDocument();

    // Dispatch should NOT have been called
    expect(mockDispatch).not.toHaveBeenCalled();

    vi.unstubAllEnvs();
  });
});
