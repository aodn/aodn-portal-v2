import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import LabelChip from "../LabelChip";

describe("LabelChip", () => {
  it("should render all text items as chips", () => {
    const testText = ["label one", "label two", "label three"];

    render(<LabelChip text={testText} />);

    // Check that all text items are rendered using data-testid
    testText.forEach((item) => {
      const chip = screen.getByTestId(`label-chip-${item}`);
      expect(chip).toBeInTheDocument();
      expect(chip).toHaveTextContent(item);
    });
  });

  it("should return null when text array is empty or contains only whitespace", () => {
    const { container: emptyContainer } = render(<LabelChip text={[]} />);
    expect(emptyContainer.firstChild).toBeNull();

    const { container: whitespaceContainer } = render(
      <LabelChip text={["  ", ""]} />
    );
    expect(whitespaceContainer.firstChild).toBeNull();
  });
});
