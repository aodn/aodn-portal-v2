import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { OGCCollection } from "@/app/store/OGCCollectionDefinitions";
import { useDetailPageContext } from "@/pages/detail-page/context/detail-page-context";
import LicenseStep from "@/pages/detail-page/features/download/download-dialog/LicenseStep";

vi.mock("@/pages/detail-page/context/detail-page-context", () => ({
  useDetailPageContext: vi.fn(),
}));

const createCollection = ({
  isImosOnly,
  license,
  suggestedCitation,
  useLimitations = [],
  otherConstraints = [],
}: {
  isImosOnly: boolean;
  license?: string;
  suggestedCitation?: string;
  useLimitations?: string[];
  otherConstraints?: string[];
}) =>
  ({
    id: "test-uuid",
    title: "Test Dataset",
    links: [
      {
        rel: "license",
        type: "text/html",
        href: "https://example.com/licence",
      },
      {
        rel: "license",
        type: "image/png",
        href: "https://example.com/licence.png",
      },
    ],
    getLicense: () => license,
    getCitation: () => ({
      suggestedCitation,
      useLimitations,
      otherConstraints,
    }),
    isImosOnly: () => isImosOnly,
  }) as unknown as OGCCollection;

describe("LicenseStep", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows metadata licence and constraints for an external dataset", () => {
    vi.mocked(useDetailPageContext).mockReturnValue({
      collection: createCollection({
        isImosOnly: false,
        license: "CSIRO Data Licence",
        suggestedCitation: "CSIRO, [Title]",
        useLimitations: ["CSIRO use limitation"],
        otherConstraints: ["CSIRO other constraint"],
      }),
    } as ReturnType<typeof useDetailPageContext>);

    render(<LicenseStep />);

    expect(screen.getByText("CSIRO Data Licence")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "https://example.com/licence" })
    ).toHaveAttribute("href", "https://example.com/licence");
    expect(screen.getByAltText("Licence graphic")).toHaveAttribute(
      "src",
      "https://example.com/licence.png"
    );
    expect(screen.getByText("CSIRO use limitation")).toBeInTheDocument();
    expect(screen.getByText("CSIRO other constraint")).toBeInTheDocument();
    expect(screen.getByText("CSIRO, Test Dataset")).toBeInTheDocument();
    expect(
      screen.queryByText(/Any users of IMOS data/)
    ).not.toBeInTheDocument();
  });

  it("does not add generic constraints for an IMOS-only dataset", () => {
    vi.mocked(useDetailPageContext).mockReturnValue({
      collection: createCollection({
        isImosOnly: true,
        license: "IMOS Licence",
      }),
    } as ReturnType<typeof useDetailPageContext>);

    render(<LicenseStep />);

    expect(
      screen.getByText("Suggested Citation not available")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Usage Constraints not available")
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/Any users of IMOS data/)
    ).not.toBeInTheDocument();
  });

  it("prefers IMOS metadata constraints over generic fallback text", () => {
    vi.mocked(useDetailPageContext).mockReturnValue({
      collection: createCollection({
        isImosOnly: true,
        license: "IMOS Licence",
        useLimitations: ["Dataset-specific IMOS limitation"],
      }),
    } as ReturnType<typeof useDetailPageContext>);

    render(<LicenseStep />);

    expect(
      screen.getByText("Dataset-specific IMOS limitation")
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/Any users of IMOS data/)
    ).not.toBeInTheDocument();
  });

  it("shows standard unavailable messages for incomplete metadata", () => {
    vi.mocked(useDetailPageContext).mockReturnValue({
      collection: createCollection({ isImosOnly: false }),
    } as ReturnType<typeof useDetailPageContext>);

    render(<LicenseStep />);

    expect(screen.getByText("License not available")).toBeInTheDocument();
    expect(
      screen.getByText("Usage Constraints not available")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Suggested Citation not available")
    ).toBeInTheDocument();
    expect(screen.queryByText(/IMOS \d{4}/)).not.toBeInTheDocument();
  });
});
