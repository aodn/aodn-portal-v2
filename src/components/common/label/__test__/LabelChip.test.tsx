import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import LabelChip from "../LabelChip";

describe("LabelChip", () => {
  it("should render all text items as chips with capitalized first letter", () => {
    const testText = ["label one", "label two", "label three"];

    render(<LabelChip text={testText} />);

    const chips = screen.getAllByTestId(/label-chip-/);
    expect(chips).toHaveLength(3);

    // Check that all text items are rendered with capitalized first letter
    expect(screen.getByText("Label one")).toBeInTheDocument();
    expect(screen.getByText("Label two")).toBeInTheDocument();
    expect(screen.getByText("Label three")).toBeInTheDocument();
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

    expect(screen.getByText("Ocean")).toBeInTheDocument();
    expect(screen.getByText("Climate")).toBeInTheDocument();
  });

  it("should trim whitespace from items and capitalize first letter", () => {
    const testText = ["  ocean  ", "climate   ", "   temperature"];

    render(<LabelChip text={testText} />);

    const chips = screen.getAllByTestId(/label-chip-/);
    expect(chips).toHaveLength(3);

    // Check trimmed and capitalized versions are rendered
    expect(screen.getByText("Ocean")).toBeInTheDocument();
    expect(screen.getByText("Climate")).toBeInTheDocument();
    expect(screen.getByText("Temperature")).toBeInTheDocument();
  });

  it("should filter out empty strings after trimming", () => {
    const testText = ["ocean", "  ", "", "climate", "   "];

    render(<LabelChip text={testText} />);

    const chips = screen.getAllByTestId(/label-chip-/);
    expect(chips).toHaveLength(2);

    // Should only render non-empty items
    expect(screen.getByText("Ocean")).toBeInTheDocument();
    expect(screen.getByText("Climate")).toBeInTheDocument();
  });
});
