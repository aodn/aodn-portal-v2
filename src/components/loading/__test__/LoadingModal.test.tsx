import { render, screen } from "@testing-library/react";
import LoadingModal from "../LoadingModal";
import { expect } from "vitest";

describe("LoadingModal", () => {
  beforeEach(() => {
    render(<LoadingModal isLoading={true} />);
  });
  test("should render LoadingModal", () => {
    const loatingText = screen.getByTestId("loading-progress");
    expect(loatingText).to.exist;
  });
});
