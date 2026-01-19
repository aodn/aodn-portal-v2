import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import LabelChip from "../LabelChip";

describe("LabelChip", () => {
  it("should render all text items as chips with capitalized first letter", () => {
    const testText = ["label one", "label two", "label three"];

    render(<LabelChip text={testText} />);

    // Check that all text items are rendered with capitalized first letter
    expect(screen.getByTestId("label-chip-Label one")).toBeInTheDocument();
    expect(screen.getByTestId("label-chip-Label one")).toHaveTextContent(
      "Label one"
    );
    expect(screen.getByTestId("label-chip-Label two")).toBeInTheDocument();
    expect(screen.getByTestId("label-chip-Label two")).toHaveTextContent(
      "Label two"
    );
    expect(screen.getByTestId("label-chip-Label three")).toBeInTheDocument();
    expect(screen.getByTestId("label-chip-Label three")).toHaveTextContent(
      "Label three"
    );
  });

  it("should return null when text array is empty or contains only whitespace", () => {
    const { container: emptyContainer } = render(<LabelChip text={[]} />);
    expect(emptyContainer.firstChild).toBeNull();

    const { container: whitespaceContainer } = render(
      <LabelChip text={["  ", ""]} />
    );
    expect(whitespaceContainer.firstChild).toBeNull();
  });

  it("should remove duplicate items", () => {
    const testText = ["ocean", "climate", "ocean", "OCEAN", "climate"];

    render(<LabelChip text={testText} />);

    // Should only render unique items (2 unique after deduplication)
    const chips = screen.getAllByTestId(/label-chip-/);
    expect(chips).toHaveLength(2);

    expect(screen.getByTestId("label-chip-Ocean")).toBeInTheDocument();
    expect(screen.getByTestId("label-chip-Ocean")).toHaveTextContent("Ocean");
    expect(screen.getByTestId("label-chip-Climate")).toBeInTheDocument();
    expect(screen.getByTestId("label-chip-Climate")).toHaveTextContent(
      "Climate"
    );
  });

  it("should trim whitespace from items and capitalize first letter", () => {
    const testText = ["  ocean  ", "climate   ", "   temperature"];

    render(<LabelChip text={testText} />);

    // Check trimmed and capitalized versions are rendered
    expect(screen.getByTestId("label-chip-Ocean")).toBeInTheDocument();
    expect(screen.getByTestId("label-chip-Ocean")).toHaveTextContent("Ocean");
    expect(screen.getByTestId("label-chip-Climate")).toBeInTheDocument();
    expect(screen.getByTestId("label-chip-Climate")).toHaveTextContent(
      "Climate"
    );
    expect(screen.getByTestId("label-chip-Temperature")).toBeInTheDocument();
    expect(screen.getByTestId("label-chip-Temperature")).toHaveTextContent(
      "Temperature"
    );
  });

  it("should filter out empty strings after trimming", () => {
    const testText = ["ocean", "  ", "", "climate", "   "];

    render(<LabelChip text={testText} />);

    // Should only render non-empty items
    const chips = screen.getAllByTestId(/label-chip-/);
    expect(chips).toHaveLength(2);

    expect(screen.getByTestId("label-chip-Ocean")).toBeInTheDocument();
    expect(screen.getByTestId("label-chip-Climate")).toBeInTheDocument();
  });
});
