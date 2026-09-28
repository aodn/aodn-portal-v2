import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

// Tests for CoordInput:
// - Enter calls onSubmit and stops native form submission
// - Escape calls onCancel
// - pasted zero-width spaces are removed from the value
// - error wires aria-invalid + aria-errormessage for screen readers

import CoordInput from "../features/download/subset-conditions/CoordInput";

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

  describe("paste", () => {
    it("removes zero-width spaces from the value", () => {
      const onChange = vi.fn();
      render(<CoordInput value="" onChange={onChange} />);

      fireEvent.change(getInput(), { target: { value: "-35.66843\u200B" } });

      expect(onChange).toHaveBeenCalledWith("-35.66843");
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
