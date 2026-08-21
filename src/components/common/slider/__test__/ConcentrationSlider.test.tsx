import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ConcentrationSlider, createDensityGradient } from "../PlainSlider";

describe("createDensityGradient", () => {
  it("paints barcode stops from slider marks", () => {
    const gradient = createDensityGradient(
      [{ value: 25 }, { value: 75 }],
      0,
      100
    );

    expect(gradient.startsWith("linear-gradient(to right,")).toBe(true);
    expect(gradient).toContain("rgba(0,0,0,0.04) 0%");
    expect(gradient).toContain("#2E6F9E");
    expect(gradient).toContain("rgba(0,0,0,0.04) 100%");
  });

  it("keeps a bounded number of color stops for dense marks", () => {
    const marks = Array.from({ length: 5000 }, (_, i) => ({ value: i }));
    const gradient = createDensityGradient(marks, 0, 4999);
    const stopCount = gradient.split("#2E6F9E").length - 1;
    // Consecutive marks collapse into one occupied run (two color stops).
    expect(stopCount).toBe(2);
  });

  it("skips point conversion when min equals max", () => {
    const gradient = createDensityGradient([{ value: 10 }], 5, 5);
    expect(gradient).toBe(
      "linear-gradient(to right, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0.04) 100%)"
    );
  });
});

describe("ConcentrationSlider", () => {
  it("renders a slider using marks as density positions", () => {
    render(
      <ConcentrationSlider
        marks={[{ value: 10 }, { value: 50 }, { value: 90 }]}
        min={0}
        max={100}
        defaultValue={50}
        aria-label="concentration"
      />
    );

    expect(screen.getByRole("slider")).toHaveAttribute("aria-valuenow", "50");
  });
});
