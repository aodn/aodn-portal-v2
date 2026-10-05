// @vitest-environment node
import { describe, expect, test } from "vitest";
import { lighthouseRoutes } from "@/lighthouse/constants";
import { selectMeasurements } from "@/lighthouse/measure";

describe("selectMeasurements", () => {
  const routes = lighthouseRoutes();

  test("defaults to every route and requested form factor", () => {
    expect(selectMeasurements(routes, ["mobile", "desktop"])).toHaveLength(6);
    expect(selectMeasurements(routes, ["desktop"])).toHaveLength(3);
  });

  test("confirmation measures only the failing pairs", () => {
    expect(
      selectMeasurements(
        routes,
        ["mobile", "desktop"],
        [
          { path: routes[2].path, formFactor: "mobile" },
          { path: routes[1].path, formFactor: "desktop" },
        ]
      )
    ).toEqual([
      { route: routes[1], formFactor: "desktop" },
      { route: routes[2], formFactor: "mobile" },
    ]);
  });

  test("rejects empty, unknown or excluded targets", () => {
    expect(() => selectMeasurements(routes, ["mobile"], [])).toThrow(
      "must not be empty"
    );
    expect(() =>
      selectMeasurements(
        routes,
        ["mobile"],
        [{ path: "/unknown", formFactor: "mobile" }]
      )
    ).toThrow("unknown measurement target");
    expect(() =>
      selectMeasurements(
        routes,
        ["mobile"],
        [{ path: routes[0].path, formFactor: "desktop" }]
      )
    ).toThrow("unknown measurement target");
  });
});
