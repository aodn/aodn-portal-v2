import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

// The component under test
import HealthChecker from "../HealthChecker";

// Mock the DegradedPage so we can assert on a string
vi.mock("../../pages/error-page/DegradedPage", () => ({
  default: () => <div>DEGRADED_PAGE</div>,
}));

// Mock the RTK Query hook — each test sets the state it needs
const mockUseGetHealthQuery = vi.fn();
vi.mock("@/app/store/ogcApi", () => ({
  useGetHealthQuery: (...args: unknown[]) => mockUseGetHealthQuery(...args),
}));

describe("HealthChecker", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test("renders children while the first check is still loading", () => {
    mockUseGetHealthQuery.mockReturnValue({ data: undefined, isError: false });

    render(
      <HealthChecker>
        <div>CHILDREN</div>
      </HealthChecker>
    );

    // Optimistic rendering: children visible before any result arrives
    expect(screen.getByText("CHILDREN")).toBeInTheDocument();
  });

  test("renders children when health is UP", () => {
    mockUseGetHealthQuery.mockReturnValue({
      data: { status: "UP", components: { ogcApiHealth: { status: "UP" } } },
      isError: false,
    });

    render(
      <HealthChecker>
        <div>CHILDREN</div>
      </HealthChecker>
    );

    expect(screen.getByText("CHILDREN")).toBeInTheDocument();
  });

  test("shows degraded page when health is not UP", () => {
    mockUseGetHealthQuery.mockReturnValue({
      data: {
        status: "DOWN",
        components: { ogcApiHealth: { status: "DOWN" } },
      },
      isError: false,
    });

    render(
      <HealthChecker>
        <div>CHILDREN</div>
      </HealthChecker>
    );

    expect(screen.getByText("DEGRADED_PAGE")).toBeInTheDocument();
  });

  test("shows degraded page when the request fails", () => {
    mockUseGetHealthQuery.mockReturnValue({ data: undefined, isError: true });

    render(
      <HealthChecker>
        <div>CHILDREN</div>
      </HealthChecker>
    );

    expect(screen.getByText("DEGRADED_PAGE")).toBeInTheDocument();
  });

  test("skips the health check in playwright-local mode", () => {
    vi.stubEnv("MODE", "playwright-local");
    mockUseGetHealthQuery.mockReturnValue({ data: undefined, isError: false });

    render(
      <HealthChecker>
        <div>CHILDREN</div>
      </HealthChecker>
    );

    expect(screen.getByText("CHILDREN")).toBeInTheDocument();
    // The hook must be told to skip so no request is fired
    expect(mockUseGetHealthQuery).toHaveBeenCalledWith(
      undefined,
      expect.objectContaining({ skip: true })
    );

    vi.unstubAllEnvs();
  });
});
