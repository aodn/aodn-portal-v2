import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, waitFor } from "@testing-library/react";
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

const getControlContainers = () =>
  document.querySelectorAll<HTMLDivElement>(".mapboxgl-ctrl-group");

const getZoomInButtons = () =>
  document.querySelectorAll<HTMLButtonElement>(".mapboxgl-ctrl-zoom-in");

describe("NavigationControl hover hints", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("strips the native title mapbox sets on the icon span, so only the custom hint bubble shows", async () => {
    const map = createMockMap();
    // Real mapbox resolves this to e.g. "Zoom in" and sets it as title on
    // the button's inner icon span (not the button itself)
    (map._getUIString as ReturnType<typeof vi.fn>).mockReturnValue("Zoom in");
    renderWithMap(<NavigationControl />, map);

    await waitFor(() => {
      expect(getZoomInButtons()).toHaveLength(1);
      // No element inside the control may keep a title attribute, or the
      // browser shows its native tooltip on top of the custom hint
      expect(
        document.querySelectorAll(".mapboxgl-ctrl-group [title]")
      ).toHaveLength(0);
      expect(
        document.querySelectorAll(".mapboxgl-ctrl-group[title]")
      ).toHaveLength(0);
    });
  });

  it("shows the hint on hover and hides it on leave", async () => {
    const map = createMockMap();
    renderWithMap(<NavigationControl />, map);

    const zoomIn = await waitFor(() => {
      const buttons = getZoomInButtons();
      expect(buttons).toHaveLength(1);
      return buttons[0];
    });

    // Retry inside waitFor: the hint listeners attach in an effect that may
    // run after the button is already in the DOM
    await waitFor(() => {
      fireEvent.mouseEnter(zoomIn);
      expect(document.body.textContent).toContain("Zoom in");
    });

    fireEvent.mouseLeave(zoomIn);
    await waitFor(() => {
      expect(document.body.textContent).not.toContain("Zoom in");
    });
  });

  it("renders the hint bubble above overlays like the searchbar popup", async () => {
    const map = createMockMap();
    renderWithMap(<NavigationControl />, map);

    const zoomIn = await waitFor(() => {
      const buttons = getZoomInButtons();
      expect(buttons).toHaveLength(1);
      return buttons[0];
    });

    const tooltip = await waitFor(() => {
      fireEvent.mouseEnter(zoomIn);
      const t = document.querySelector<HTMLElement>('[role="tooltip"]');
      expect(t).not.toBeNull();
      return t as HTMLElement;
    });

    // The searchbar popup hosting the location filter map sits at z-index 99;
    // the hint must portal above it or it is invisible inside the popup
    const zIndex = Number(window.getComputedStyle(tooltip).zIndex);
    expect(zIndex).toBeGreaterThan(99);
  });

  it("binds hints to its own buttons when several maps are mounted (location filter map)", async () => {
    const mapA = createMockMap();
    const mapB = createMockMap();
    renderWithMap(<NavigationControl />, mapA);
    renderWithMap(<NavigationControl />, mapB);

    const buttons = await waitFor(() => {
      const all = getZoomInButtons();
      expect(all).toHaveLength(2);
      return all;
    });

    // The second control must react to hovers on ITS button; a document-wide
    // id lookup used to bind both instances to the first map's buttons
    await waitFor(() => {
      fireEvent.mouseEnter(buttons[1]);
      expect(document.body.textContent).toContain("Zoom in");
    });
    fireEvent.mouseLeave(buttons[1]);
    await waitFor(() => {
      expect(document.body.textContent).not.toContain("Zoom in");
    });
  });
});

describe("NavigationControl visibility", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("hides only its own container when visible turns false, other maps unaffected", async () => {
    const mapA = createMockMap();
    const mapB = createMockMap();
    renderWithMap(<NavigationControl />, mapA);
    const second = renderWithMap(<NavigationControl />, mapB);

    const containers = await waitFor(() => {
      const c = getControlContainers();
      expect(c).toHaveLength(2);
      return c;
    });

    second.rerender(
      <MapContext.Provider value={{ map: mapB }}>
        <NavigationControl visible={false} />
      </MapContext.Provider>
    );

    await waitFor(() => {
      expect(containers[1].style.display).toBe("none");
    });
    expect(containers[0].style.display).toBe("flex");
  });
});
