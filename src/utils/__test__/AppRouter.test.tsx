import { describe, expect, test, vi } from "vitest";
import { redirect } from "react-router-dom";
import { searchLoader } from "../AppRouter";

// Mock the redirect function
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    redirect: vi.fn(),
  };
});

describe("AppRouter Search Loader", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("should redirect when uuid parameter is present", () => {
    const mockRequest = new Request(
      "http://localhost:5173/search?uuid=test-uuid-123"
    );

    const result = searchLoader({ request: mockRequest });

    expect(redirect).toHaveBeenCalledWith("/details/test-uuid-123");
    expect(result).toBe(redirect("/details/test-uuid-123"));
  });

  test("should return null when no uuid parameter", () => {
    const mockRequest = new Request("http://localhost:5173/search");

    const result = searchLoader({ request: mockRequest });

    expect(redirect).not.toHaveBeenCalled();
    expect(result).toBeNull();
  });

  test("should return null when uuid parameter is empty", () => {
    const mockRequest = new Request("http://localhost:5173/search?uuid=");

    const result = searchLoader({ request: mockRequest });

    expect(redirect).not.toHaveBeenCalled();
    expect(result).toBeNull();
  });

  test("should redirect when uuid is present with other parameters", () => {
    const mockRequest = new Request(
      "http://localhost:5173/search?platform=Glider&uuid=another-test-uuid&organisation=IMOS"
    );

    const result = searchLoader({ request: mockRequest });

    expect(redirect).toHaveBeenCalledWith("/details/another-test-uuid");
    expect(result).toBe(redirect("/details/another-test-uuid"));
  });
});
