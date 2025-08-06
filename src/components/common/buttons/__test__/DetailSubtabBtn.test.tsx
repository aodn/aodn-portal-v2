import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import DetailSubtabBtn from "../DetailSubtabBtn";
import AppTheme from "../../../../utils/AppTheme";
import { ThemeProvider } from "@mui/material/styles";

describe("DetailSubTabBtn", () => {
  const defaultProps = {
    id: "test",
    title: "Test SubTab",
    onClick: vi.fn(),
    isBordered: false,
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders correctly with default props", () => {
    render(
      <ThemeProvider theme={AppTheme}>
        <DetailSubtabBtn {...defaultProps} />
      </ThemeProvider>
    );

    const button = screen.getByTestId("test");
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("Test SubTab");
    expect(button).toHaveStyle({
      width: "100%",
      backgroundColor: "#fff",
    });
  });
});
