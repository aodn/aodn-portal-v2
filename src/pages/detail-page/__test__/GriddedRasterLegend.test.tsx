import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import AppTheme from "@/styles/theme";
import { GriddedValueRange } from "@/app/store/GriddedTileDefinitions";
import GriddedRasterLegend, {
  formatLegendValue,
} from "../features/GriddedRasterLegend";

const LEGEND_URL = "/api/v1/ogc/ext/tiles/colormaps/legend?colormap=viridis";

const legend = (
  legendUrl: string | undefined,
  range?: GriddedValueRange,
  labels?: string[]
) => (
  <ThemeProvider theme={AppTheme}>
    <GriddedRasterLegend
      legendUrl={legendUrl}
      range={range}
      labels={labels}
      variable="SST"
      layerName="test product"
    />
  </ThemeProvider>
);

describe("GriddedRasterLegend", () => {
  afterEach(cleanup);

  it("renders nothing without a legend url", () => {
    const { container } = render(legend(""));
    expect(container).toBeEmptyDOMElement();
  });

  it("shows the title, the colour bar and the variable", () => {
    render(legend(LEGEND_URL));
    expect(screen.getByText("Legends")).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAttribute("src", LEGEND_URL);
    expect(screen.getByText("SST")).toBeInTheDocument();
  });

  it("labels five evenly spaced values across the range", () => {
    render(legend(LEGEND_URL, [268, 310]));
    ["268", "278.5", "289", "299.5", "310"].forEach((label) =>
      expect(screen.getByText(label)).toBeInTheDocument()
    );
  });

  it("centres one label under each categorical block", () => {
    render(
      legend(LEGEND_URL, [0, 3], ["none", "moderate", "strong", "severe"])
    );
    const positions = ["12.5%", "37.5%", "62.5%", "87.5%"];
    ["none", "moderate", "strong", "severe"].forEach((label, i) =>
      expect(screen.getByText(label)).toHaveStyle({ left: positions[i] })
    );
    // Categorical labels replace the range ticks.
    expect(screen.queryByText("1.5")).not.toBeInTheDocument();
  });

  it("draws no labels without a range", () => {
    render(legend(LEGEND_URL));
    expect(
      screen.queryByTestId("gridded-legend-range")
    ).not.toBeInTheDocument();
  });

  it("shows a fallback message when the legend image fails to load", () => {
    render(legend(LEGEND_URL));
    fireEvent.error(screen.getByRole("img"));
    expect(
      screen.getByText("No legend available for this layer")
    ).toBeInTheDocument();
  });

  it("retries the image when a failed url is replaced", () => {
    const { rerender } = render(legend(LEGEND_URL));
    fireEvent.error(screen.getByRole("img"));

    const nextUrl = LEGEND_URL.replace("viridis", "plasma");
    rerender(legend(nextUrl));
    expect(screen.getByRole("img")).toHaveAttribute("src", nextUrl);
  });
});

describe("formatLegendValue", () => {
  it("keeps at most one decimal place and drops a trailing .0", () => {
    expect(formatLegendValue(268)).toBe("268");
    expect(formatLegendValue(278.5)).toBe("278.5");
    expect(formatLegendValue(-12.34)).toBe("-12.3");
  });

  it("never shows a negative zero", () => {
    expect(formatLegendValue(-0.04)).toBe("0");
  });
});
