import { describe, it, expect, vi, beforeEach } from "vitest";
import { trackCustomEvent } from "../customEventTracker";
import { onLCP, onINP, onCLS } from "web-vitals";
import { trackWebVitals } from "../webVitalsEvents";

// Mock dependencies
vi.mock("../customEventTracker");
vi.mock("../analyticsEvents", () => ({
  AnalyticsEvent: {
    WEB_VITALS_LCP: "web_vitals_lcp",
    WEB_VITALS_INP: "web_vitals_inp",
    WEB_VITALS_CLS: "web_vitals_cls",
  },
}));
vi.mock("web-vitals", () => ({
  onLCP: vi.fn(),
  onINP: vi.fn(),
  onCLS: vi.fn(),
}));

const mockTrack = trackCustomEvent as ReturnType<typeof vi.fn>;
const mockOnLCP = onLCP as ReturnType<typeof vi.fn>;
const mockOnINP = onINP as ReturnType<typeof vi.fn>;
const mockOnCLS = onCLS as ReturnType<typeof vi.fn>;

Object.defineProperty(global, "window", {
  value: { location: { href: "https://example.com/test" } },
  writable: true,
});

describe("Web Vitals Tracking", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("registers all web vitals callbacks", () => {
    trackWebVitals();

    expect(mockOnLCP).toHaveBeenCalled();
    expect(mockOnINP).toHaveBeenCalled();
    expect(mockOnCLS).toHaveBeenCalled();
  });

  it("tracks LCP metric", () => {
    trackWebVitals();
    const lcpCallback = mockOnLCP.mock.calls[0][0];

    lcpCallback({ value: 2500.5, rating: "good" });

    expect(mockTrack).toHaveBeenCalledWith("web_vitals_lcp", {
      lcp_value_ms: 2501,
      lcp_rating: "good",
      url: "https://example.com/test",
    });
  });

  it("tracks INP metric", () => {
    trackWebVitals();
    const inpCallback = mockOnINP.mock.calls[0][0];

    inpCallback({ value: 150.7, rating: "good" });

    expect(mockTrack).toHaveBeenCalledWith("web_vitals_inp", {
      inp_value_ms: 151,
      inp_rating: "good",
      url: "https://example.com/test",
    });
  });

  it("tracks CLS metric", () => {
    trackWebVitals();
    const clsCallback = mockOnCLS.mock.calls[0][0];

    clsCallback({ value: 0.05432, rating: "good" });

    expect(mockTrack).toHaveBeenCalledWith("web_vitals_cls", {
      cls_value: 0.054,
      cls_rating: "good",
      url: "https://example.com/test",
    });
  });
});
