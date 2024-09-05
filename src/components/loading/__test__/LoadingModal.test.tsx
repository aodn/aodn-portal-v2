import { render, screen } from "@testing-library/react";
import LoadingModal from "../LoadingModal";
import { expect } from "vitest";

describe("LoadingModal", () => {
  beforeEach(() => {
    render(<LoadingModal isLoading={true} />);
  });
  test("should render LoadingModal", () => {
    const loatingText = screen.getByText("LOADING....");
    expect(loatingText).to.exist;
  });
});
