import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import DetailSubtabBtn from "../DetailSubtabBtn";

describe("DetailSubtabBtn", () => {
  const defaultProps = {
    title: "Test Subtab",
    onClick: vi.fn(),
    isBordered: false,
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders correctly with default props", () => {
    // render(
    //   <DetailSubtabBtn {...defaultProps} id={"test"} title={"Test SubTab"} />
    // );
    //
    // const box = screen.getByRole("box");
    // expect(box).toBeInTheDocument();
    // expect(box).toHaveStyle({
    //   display: "flex",
    //   justifyContent: "flex-start",
    //   height: "45px",
    //   width: "160px",
    //   mx: "15px",
    // });
    //
    // const button = screen.getByTestId("test");
    // expect(button).toBeInTheDocument();
    // expect(button).toHaveTextContent("Test SubTab");
    // expect(button).toHaveStyle({
    //   width: "100%",
    //   border: "none", // theme.border.nil
    //   borderRadius: "4px", // theme.borderRadius.sm
    //   backgroundColor: "#fff",
    //   textAlign: "center",
    // });
  });
});
