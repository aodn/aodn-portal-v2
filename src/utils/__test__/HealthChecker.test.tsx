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
    mockDispatch.mockReturnValueOnce({
      unwrap: () => Promise.resolve(healthy),
    });

    render(
      <HealthChecker>
        <div>CHILDREN</div>
      </HealthChecker>
    );

    // Assert that children appear (HealthChecker will call the thunk once)
    await waitFor(() =>
      expect(screen.getByText("CHILDREN")).toBeInTheDocument()
    );
  });

  test("shows degraded page when health is not UP", async () => {
    const unhealthy = {
      status: "DOWN",
      components: { ogcApiHealth: { status: "DOWN" } },
    };

    mockDispatch.mockReturnValueOnce({
      unwrap: () => Promise.resolve(unhealthy),
    });

    render(
      <HealthChecker>
        <div>CHILDREN</div>
      </HealthChecker>
    );

    // Expect degraded placeholder
    await waitFor(() =>
      expect(screen.getByText("DEGRADED_PAGE")).toBeInTheDocument()
    );
  });

  test("shows degraded page when dispatch throws", async () => {
    mockDispatch.mockReturnValueOnce({
      unwrap: () => Promise.reject(new Error("fail")),
    });

    render(
      <HealthChecker>
        <div>CHILDREN</div>
      </HealthChecker>
    );

    await waitFor(() =>
      expect(screen.getByText("DEGRADED_PAGE")).toBeInTheDocument()
    );
  });
});
