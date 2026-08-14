import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import MapFooter from "../MapFooter";
import { openInNewTab } from "@/utils/LinkUtils";
import { pageDefault } from "@/components/common/constants";

vi.mock("@/utils/LinkUtils", () => ({
  openInNewTab: vi.fn(),
}));

describe("MapFooter", () => {
  it("renders copyright and legal links", () => {
    render(<MapFooter />);

    expect(
      screen.getByText(/Copyright © \d{4}\. All rights reserved\./)
    ).toBeInTheDocument();
    expect(screen.getByText("Contact Us")).toBeInTheDocument();
    expect(screen.getByText("Terms of Use")).toBeInTheDocument();
    expect(screen.getByText("Conditions of Use")).toBeInTheDocument();
    expect(screen.getByText("Acknowledging Us")).toBeInTheDocument();
  });

  it("opens IMOS legal pages in a new tab", () => {
    render(<MapFooter />);

    fireEvent.click(screen.getByText("Terms of Use"));
    expect(openInNewTab).toHaveBeenCalledWith(
      `${pageDefault.url.IMOS}/terms-of-use`
    );

    fireEvent.click(screen.getByText("Conditions of Use"));
    expect(openInNewTab).toHaveBeenCalledWith(
      `${pageDefault.url.IMOS}/conditions-of-use`
    );

    fireEvent.click(screen.getByText("Acknowledging Us"));
    expect(openInNewTab).toHaveBeenCalledWith(
      `${pageDefault.url.IMOS}/resources/acknowledging-us`
    );
  });
});
