import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

// Tests for PolygonConditionCard:
// - adding vertices builds up a draft and emits onCreate at MIN_VERTICES
// - with an existing polygon, add/edit/remove flow through onUpdate
// - validation blocks out-of-range coordinates
// - polygon at MIN_VERTICES cannot lose a vertex

// --- Mocks -----------------------------------------------------------------

// Stub CoordInput to a plain <input>: lets us drive it with fireEvent and
// keep keyboard semantics (Enter/Escape) without MUI internals.
// forwardRef is needed because EditVertexRow attaches a ref for auto-focus.
vi.mock("../features/download/SubsetConditions/CoordInput", async () => {
  const React = await import("react");
  return {
    default: React.forwardRef<HTMLInputElement, any>(function MockCoordInput(
      { value, onChange, onSubmit, onCancel, ariaLabel, disabled },
      ref
    ) {
      return (
        <input
          ref={ref}
          aria-label={ariaLabel}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSubmit?.();
            if (e.key === "Escape") onCancel?.();
          }}
        />
      );
    }),
  };
});

// BaseConditionCard owns layout/expand state — not under test here.
vi.mock("../features/download/SubsetConditions/BaseConditionCard", () => ({
  default: ({ children, actions }: any) => (
    <div>
      {children}
      {actions}
    </div>
  ),
}));

import PolygonConditionCard from "../features/download/SubsetConditions/PolygonConditionCard";
import { PolygonCondition } from "../context/DownloadDefinitions";

// --- DOM helpers -----------------------------------------------------------

// "Latitude" / "Longitude" appear in BOTH the edit row and the add row when
// editing — index [0] is the edit row (rendered earlier), [-1] is the add row.
const addRowLat = () =>
  screen.getAllByLabelText("Latitude").at(-1) as HTMLInputElement;
const addRowLng = () =>
  screen.getAllByLabelText("Longitude").at(-1) as HTMLInputElement;

const typeAddVertex = (lat: string, lng: string) => {
  fireEvent.change(addRowLat(), { target: { value: lat } });
  fireEvent.change(addRowLng(), { target: { value: lng } });
  fireEvent.click(screen.getByRole("button", { name: "add vertex" }));
};

describe("PolygonConditionCard", () => {
  const onCreate = vi.fn();
  const onUpdate = vi.fn();

  beforeEach(() => {
    onCreate.mockClear();
    onUpdate.mockClear();
  });

  describe("creating a polygon", () => {
    it("emits onCreate with all vertices once the 3rd one is added", () => {
      render(<PolygonConditionCard onCreate={onCreate} />);

      typeAddVertex("10", "20");
      typeAddVertex("10", "30");
      expect(onCreate).not.toHaveBeenCalled();

      typeAddVertex("20", "30");
      // Coordinates are stored [lng, lat].
      expect(onCreate).toHaveBeenCalledWith([
        [20, 10],
        [30, 10],
        [30, 20],
      ]);
    });
  });

  describe("editing an existing polygon", () => {
    const polygon = new PolygonCondition("p1", [
      [10, 20],
      [10, 30],
      [20, 30],
    ]);

    it("appends a new vertex via onUpdate", () => {
      render(
        <PolygonConditionCard polygonCondition={polygon} onUpdate={onUpdate} />
      );

      typeAddVertex("40", "25");

      expect(onUpdate).toHaveBeenCalledWith([
        [10, 20],
        [10, 30],
        [20, 30],
        [25, 40],
      ]);
    });

    it("replaces a vertex via onUpdate when edit is committed", () => {
      render(
        <PolygonConditionCard polygonCondition={polygon} onUpdate={onUpdate} />
      );

      fireEvent.click(screen.getByRole("button", { name: "Edit vertex 1" }));
      fireEvent.change(screen.getAllByLabelText("Latitude")[0], {
        target: { value: "25" },
      });
      fireEvent.change(screen.getAllByLabelText("Longitude")[0], {
        target: { value: "15" },
      });
      fireEvent.click(screen.getByRole("button", { name: "save vertex" }));

      expect(onUpdate).toHaveBeenCalledWith([
        [15, 25],
        [10, 30],
        [20, 30],
      ]);
    });

    it("blocks removal when the polygon is already at the minimum 3 vertices", () => {
      render(
        <PolygonConditionCard polygonCondition={polygon} onUpdate={onUpdate} />
      );

      // The per-row remove button is only revealed on hover, so it lives in
      // the accessibility tree as hidden in jsdom. We still want to verify
      // the click is blocked at the handler level.
      const removeButtons = screen.getAllByRole("button", {
        name: "remove vertex",
        hidden: true,
      });
      fireEvent.click(removeButtons[0]);

      expect(onUpdate).not.toHaveBeenCalled();
      expect(screen.getByRole("alert")).toHaveTextContent(
        /at least 3 vertices/i
      );
    });
  });

  describe("validation", () => {
    it("rejects an out-of-range coordinate with an alert and no callback", () => {
      render(<PolygonConditionCard onCreate={onCreate} />);

      typeAddVertex("100", "20"); // lat 100 is out of [-90, 90]

      expect(onCreate).not.toHaveBeenCalled();
      expect(screen.getByRole("alert")).toHaveTextContent(
        /latitude must be -90 to 90/i
      );
    });
  });

  describe("readOnly", () => {
    it("hides the add vertex row", () => {
      const polygon = new PolygonCondition("p1", [
        [10, 20],
        [10, 30],
        [20, 30],
      ]);

      render(<PolygonConditionCard polygonCondition={polygon} readOnly />);

      expect(
        screen.queryByRole("button", { name: "add vertex" })
      ).not.toBeInTheDocument();
    });
  });
});
