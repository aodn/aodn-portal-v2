import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, waitFor } from "@testing-library/react";
import { IControl, Map as Mapbox } from "mapbox-gl";
import MapContext from "../../MapContext";
import NavigationControl from "../NavigationControl";
import { fitToDefaultExtent } from "../../../../../utils/MapUtils";
import { OGCCollection } from "@/app/store/OGCCollectionDefinitions";

// Enough of a mapbox Map for the real NavigationControl to mount in jsdom
const createMockMap = () =>
  ({
    on: vi.fn(),
    off: vi.fn(),
    getZoom: vi.fn().mockReturnValue(3),
    getMinZoom: vi.fn().mockReturnValue(1),
    getMaxZoom: vi.fn().mockReturnValue(12),
    _getUIString: vi.fn().mockReturnValue(""),
    zoomTo: vi.fn(),
    resize: vi.fn(),
    cameraForBounds: vi.fn().mockReturnValue({ center: [0, 0], zoom: 5 }),
    flyTo: vi.fn(),
    addControl: vi.fn(),
  }) as unknown as Mapbox;

// Mimic mapbox: addControl mounts the control's DOM into the page
const renderWithMap = (ui: React.ReactElement, map: Mapbox) => {
  (map.addControl as ReturnType<typeof vi.fn>).mockImplementation(
    (control: IControl) => document.body.appendChild(control.onAdd(map))
  );
  return render(
    <MapContext.Provider value={{ map }}>{ui}</MapContext.Provider>
  );
};

const clickResetButton = async () => {
  const button = await waitFor(() => {
    const b = document.getElementById("map-zoom-reset");
    expect(b).not.toBeNull();
    return b as HTMLButtonElement;
  });
  button.click();
};

describe("NavigationControl reset button", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("zooms to the default zoom when no onReset is given", async () => {
    const map = createMockMap();
    renderWithMap(<NavigationControl />, map);

    await clickResetButton();

    // default zoom written out by hand on purpose
    expect(map.zoomTo).toHaveBeenCalledWith(3.5);
  });

  it("calls onReset with the map instead of the default zoom reset", async () => {
    const map = createMockMap();
    const onReset = vi.fn();
    renderWithMap(<NavigationControl onReset={onReset} />, map);

    await clickResetButton();

    expect(onReset).toHaveBeenCalledWith(map);
    expect(map.zoomTo).not.toHaveBeenCalled();
  });

  it("detail page reset flies back to the collection's extent, animated", async () => {
    const map = createMockMap();
    const collection: OGCCollection = Object.assign(new OGCCollection(), {
      // 78d588ed-79dd-47e2-b806-d39025194e7e (tasmania)
      extent: { spatial: { bbox: [[145, -44, 147.5, -40]] } },
    });
    renderWithMap(
      <NavigationControl onReset={(m) => fitToDefaultExtent(m, collection)} />,
      map
    );

    await clickResetButton();

    expect(map.cameraForBounds).toHaveBeenCalledWith(
      [
        [145, -44],
        [147.5, -40],
      ],
      expect.objectContaining({ padding: 20 })
    );
    expect(map.flyTo).toHaveBeenCalledWith(
      expect.objectContaining({ animate: true })
    );
    expect(map.zoomTo).not.toHaveBeenCalled();
  });
});
