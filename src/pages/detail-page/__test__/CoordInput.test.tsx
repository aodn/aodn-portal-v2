import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

// Tests for CoordInput:
// - Enter calls onSubmit and stops native form submission
// - Escape calls onCancel
// - error wires aria-invalid + aria-errormessage for screen readers

import CoordInput from "../features/download/SubsetConditions/CoordInput";

const getInput = () => screen.getByRole("textbox") as HTMLInputElement;

describe("CoordInput", () => {
  describe("keyboard", () => {
    it("calls onSubmit and prevents default form submission on Enter", () => {
      const onSubmit = vi.fn();
      render(<CoordInput value="10" onChange={() => {}} onSubmit={onSubmit} />);

      const event = fireEvent.keyDown(getInput(), { key: "Enter" });

      expect(onSubmit).toHaveBeenCalledTimes(1);
      // fireEvent returns false when the default was prevented.
      expect(event).toBe(false);
    });

    it("calls onCancel on Escape", () => {
      const onCancel = vi.fn();
      render(<CoordInput value="10" onChange={() => {}} onCancel={onCancel} />);

      fireEvent.keyDown(getInput(), { key: "Escape" });

      expect(onCancel).toHaveBeenCalledTimes(1);
    });
  });

  describe("error state", () => {
    it("marks the input invalid and links the error message id", () => {
      render(
        <CoordInput
          value=""
          onChange={() => {}}
          error="Enter a value"
          errorMessageId="err-1"
        />
      );

      const input = getInput();
      expect(input).toHaveAttribute("aria-invalid", "true");
      expect(input).toHaveAttribute("aria-errormessage", "err-1");
    });

    it("is not marked invalid when no error is provided", () => {
      render(<CoordInput value="10" onChange={() => {}} />);

      expect(getInput()).toHaveAttribute("aria-invalid", "false");
    });
  });
});
