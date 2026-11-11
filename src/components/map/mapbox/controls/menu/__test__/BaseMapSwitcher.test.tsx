import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import type { Map as MapboxMap } from "mapbox-gl";
import { beforeEach, describe, expect, it, vi } from "vitest";
import BaseMapSwitcher from "../BaseMapSwitcher";
import { DataTestId } from "../../../constants";

const KEY = "test_base_map_id";
const baseMap = { storageKey: KEY, defaultStyleId: "1" };

const createMockMap = () =>
  ({
    setStyle: vi.fn(),
    addControl: vi.fn(),
    removeControl: vi.fn(),
  }) as unknown as MapboxMap;

const pickTopographic = async () => {
  const user = userEvent.setup();
  await user.click(screen.getByTestId(DataTestId.BaseMapSwitcher.MenuId));
  await user.click(screen.getByRole("radio", { name: "Topographic Map" }));
};

describe("BaseMapSwitcher", () => {
  beforeEach(() => localStorage.clear());

  it("does not save the base map on mount", () => {
    render(<BaseMapSwitcher map={createMockMap()} baseMap={baseMap} />);

    expect(localStorage.getItem(KEY)).toBeNull();
  });

  it("applies the saved base map on mount", () => {
    localStorage.setItem(KEY, "2");
    const map = createMockMap();

    render(<BaseMapSwitcher map={map} baseMap={baseMap} />);

    expect(map.setStyle).toHaveBeenCalledWith(
      "mapbox://styles/mapbox/outdoors-v12"
    );
  });

  it("saves the base map the user picks", async () => {
    render(<BaseMapSwitcher map={createMockMap()} baseMap={baseMap} />);

    await pickTopographic();

    expect(localStorage.getItem(KEY)).toBe("2");
  });

  it("saves nothing when the page gives no preference", async () => {
    render(<BaseMapSwitcher map={createMockMap()} />);

    await pickTopographic();

    expect(localStorage.length).toBe(0);
  });
});
