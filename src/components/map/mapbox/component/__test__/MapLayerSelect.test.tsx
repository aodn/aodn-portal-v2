import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import MapLayerSelect, { MAP_DATASET_SELECT_SLOT_ID } from "../MapLayerSelect";

const items = [
  { value: "a", label: "Dataset A" },
  { value: "b", label: "Dataset B" },
];

describe("MapLayerSelect", () => {
  it("renders inline when the map slot is missing", () => {
    render(
      <MapLayerSelect
        layersOptions={items}
        selectedLayer="a"
        handleSelectLayer={vi.fn()}
        isLoading={false}
      />
    );

    expect(screen.getByText("Dataset Selection")).toBeInTheDocument();
    expect(screen.getByTestId("layer-select-dropdown")).toBeInTheDocument();
  });

  it("portals into the slot above the map when it exists", () => {
    const slot = document.createElement("div");
    slot.id = MAP_DATASET_SELECT_SLOT_ID;
    document.body.appendChild(slot);

    const { container } = render(
      <MapLayerSelect
        layersOptions={items}
        selectedLayer="a"
        handleSelectLayer={vi.fn()}
        isLoading={false}
      />
    );

    expect(container).toBeEmptyDOMElement();
    expect(
      slot.querySelector('[data-testid="layer-select-dropdown"]')
    ).not.toBe(null);

    slot.remove();
  });
});
