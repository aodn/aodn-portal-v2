import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

// Tests for BBoxConditionCard:
// - the form toggles between "draw on map" and "add bbox" depending on dirtiness
// - valid N/W/E/S input submits [W, S, E, N] and clears the form
// - validation errors block submission and surface as an alert
// - existing conditions render with a remove button

// --- Mocks -----------------------------------------------------------------

// Stub CoordInput to a plain <input> so we can drive it with fireEvent and
// read back values by aria-label, without dragging in MUI's InputBase.
vi.mock("../features/download/SubsetConditions/CoordInput", () => ({
  default: ({ value, onChange, onSubmit, ariaLabel, id, disabled }: any) => (
    <input
      id={id}
      aria-label={ariaLabel}
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") onSubmit?.();
      }}
    />
  ),
}));

// BaseConditionCard owns layout/expand state — not under test here.
vi.mock("../features/download/SubsetConditions/BaseConditionCard", () => ({
  default: ({ children, actions }: any) => (
    <div>
      {children}
      {actions}
    </div>
  ),
}));

import BBoxConditionCard from "../features/download/SubsetConditions/BBoxConditionCard";
import { BBoxCondition } from "../context/DownloadDefinitions";

// --- DOM helpers -----------------------------------------------------------

const fillCoord = (label: "N" | "S" | "E" | "W", value: string) =>
  fireEvent.change(screen.getByLabelText(`${label} coordinate`), {
    target: { value },
  });

const fillAll = (N: string, S: string, E: string, W: string) => {
  fillCoord("N", N);
  fillCoord("S", S);
  fillCoord("E", E);
  fillCoord("W", W);
};

const clickActionButton = () =>
  fireEvent.click(screen.getByRole("button", { name: /bounding box/i }));

describe("BBoxConditionCard", () => {
  const onAddBBox = vi.fn();
  const onDrawOnMap = vi.fn();
  const onRemove = vi.fn();

  beforeEach(() => {
    onAddBBox.mockClear();
    onDrawOnMap.mockClear();
    onRemove.mockClear();
  });

  describe("button mode", () => {
    it("calls onDrawOnMap when the form is empty", () => {
      render(
        <BBoxConditionCard
          bboxConditions={[]}
          onAddBBox={onAddBBox}
          onDrawOnMap={onDrawOnMap}
        />
      );

      clickActionButton();

      expect(onDrawOnMap).toHaveBeenCalledTimes(1);
      expect(onAddBBox).not.toHaveBeenCalled();
    });
  });

  describe("submit", () => {
    it("calls onAddBBox with [W, S, E, N] and clears the form on valid input", () => {
      render(<BBoxConditionCard bboxConditions={[]} onAddBBox={onAddBBox} />);

      fillAll("10", "-10", "20", "-20");
      clickActionButton();

      expect(onAddBBox).toHaveBeenCalledWith([-20, -10, 20, 10]);
      expect(screen.getByLabelText("N coordinate")).toHaveValue("");
    });

    it("rejects N <= S with an alert and does not submit", () => {
      render(<BBoxConditionCard bboxConditions={[]} onAddBBox={onAddBBox} />);

      fillAll("0", "10", "20", "-20");
      clickActionButton();

      expect(onAddBBox).not.toHaveBeenCalled();
      expect(screen.getByRole("alert")).toHaveTextContent(
        /north must be above south/i
      );
    });

    it("rejects an empty field with an alert and does not submit", () => {
      render(<BBoxConditionCard bboxConditions={[]} onAddBBox={onAddBBox} />);

      fillCoord("N", "10");
      // S/E/W left blank
      clickActionButton();

      expect(onAddBBox).not.toHaveBeenCalled();
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
  });

  describe("existing conditions", () => {
    it("calls onRemove with the matching condition when its remove button is clicked", () => {
      const c1 = new BBoxCondition("c1", [-20, -10, 20, 10]);
      const c2 = new BBoxCondition("c2", [0, 0, 5, 5]);

      render(
        <BBoxConditionCard
          bboxConditions={[c1, c2]}
          onAddBBox={onAddBBox}
          onRemove={onRemove}
        />
      );

      fireEvent.click(screen.getByRole("button", { name: /remove bbox 1/i }));
      expect(onRemove).toHaveBeenCalledWith(c1);
    });
  });

  describe("readOnly", () => {
    it("hides the input form and the action button", () => {
      const c1 = new BBoxCondition("c1", [-20, -10, 20, 10]);

      render(<BBoxConditionCard bboxConditions={[c1]} readOnly />);

      expect(screen.queryByLabelText("N coordinate")).not.toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: /bounding box/i })
      ).not.toBeInTheDocument();
    });
  });
});
