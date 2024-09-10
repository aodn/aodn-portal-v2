import { render, screen } from "@testing-library/react";
import LoadingManager from "../LoadingManager";
import { expect } from "vitest";

describe.skip("LoadingModal", () => {
  beforeEach(() => {
    render(<LoadingManager />);
  });
  test("should render LoadingModal", () => {
    // const loatingText = screen.getByTestId("loading-progress");
    // expect(loatingText).to.exist;
  });
});
