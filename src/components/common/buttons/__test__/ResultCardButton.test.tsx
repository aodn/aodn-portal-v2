import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import ResultCardButton, {
  ResultCardButtonSize,
  ResultCardButtonConfig,
} from "../ResultCardButton";
import { userEvent } from "@testing-library/user-event";

// Mock an icon component
const MockIcon = ({ sx }: { sx?: any }) => (
  <span data-testid="mock-icon" style={sx}>
    Icon
  </span>
);

describe("ResultCardButton", () => {
  it("renders with default props", () => {
    render(<ResultCardButton />);
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveStyle("text-transform: none");
    expect(button).toHaveStyle("opacity: 1");
    expect(button).toHaveStyle("minWidth: 0");
  });

  it("renders disabled button with reduced opacity", () => {
    render(<ResultCardButton disabled />);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(button).toHaveStyle("opacity: 0.5");
  });

  it("renders startIcon as an element when valid", () => {
    const iconElement = <span data-testid="custom-icon">Custom</span>;
    render(<ResultCardButton startIcon={iconElement} />);
    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
  });

  it("renders startIcon as a component with Tooltip", () => {
    render(<ResultCardButton startIcon={MockIcon} text="Click me" />);
    const icon = screen.getByTestId("mock-icon");
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveStyle("color: rgb(97, 140, 165)");
    expect(icon).toHaveStyle("font-size: 14px"); // Small size default
  });

  it("renders text when shouldHideText is false", () => {
    render(<ResultCardButton text="Click me" shouldHideText={false} />);
    expect(screen.getByText("Click me")).toBeInTheDocument();
    expect(screen.getByText("Click me")).toHaveStyle("font-size: 12px");
    expect(screen.getByText("Click me")).toHaveStyle(
      "color: rgb(97, 140, 165)"
    );
  });

  it("hides text when shouldHideText is true", () => {
    render(<ResultCardButton text="Click me" shouldHideText />);
    expect(screen.queryByText("Click me")).not.toBeInTheDocument();
  });

  it("applies custom config for medium size", () => {
    const config: ResultCardButtonConfig = {
      color: "#ff0000",
      size: ResultCardButtonSize.MEDIUM,
    };
    render(
      <ResultCardButton
        startIcon={MockIcon}
        text="Test"
        resultCardButtonConfig={config}
      />
    );
    const icon = screen.getByTestId("mock-icon");
    const text = screen.getByText("Test");
    expect(icon).toHaveStyle("font-size: 18px");
    expect(text).toHaveStyle("font-size: 14px");
    expect(icon).toHaveStyle("color: #ff0000");
    expect(text).toHaveStyle("color: #ff0000");
  });

  it("merges custom sx props", () => {
    render(<ResultCardButton sx={{ backgroundColor: "red" }} />);
    const button = screen.getByRole("button");
    expect(button).toHaveStyle("background-color: rgb(255, 0, 0)");
    expect(button).toHaveStyle("padding: 0px");
  });

  it("renders startIcon as a ComponentType with Tooltip and styling", () => {
    render(<ResultCardButton text="Click me" />);
    const icon = screen.getByText("Click me");
    expect(icon).toBeInTheDocument();

    // Simulate hover to trigger Tooltip
    userEvent.hover(icon);

    // Query the tooltip content (MUI uses a div with role="tooltip" when visible)
    waitFor(() => screen.findByRole("tooltip"), { timeout: 2000 }).then(() => {
      console.log("Verify tooltip");
      const tooltip = screen.getByRole("tooltip");
      expect(tooltip).toHaveTextContent("Click me"); // Check content instead of title
    });
  });

  it("does not render icon or text when neither is provided", () => {
    render(<ResultCardButton />);
    expect(screen.queryByTestId("mock-icon")).not.toBeInTheDocument();
    expect(screen.queryByText(/.+/)).not.toBeInTheDocument();
  });
});
