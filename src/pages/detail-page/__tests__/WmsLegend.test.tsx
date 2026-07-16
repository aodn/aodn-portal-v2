import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import AppTheme from "../../../utils/AppTheme";
import WmsLegend from "../features/WmsLegend";

const renderLegend = (layerName = "test-layer") =>
  render(
    <ThemeProvider theme={AppTheme}>
      <WmsLegend uuid="test-uuid" layerName={layerName} />
    </ThemeProvider>
  );

describe("WmsLegend", () => {
  afterEach(cleanup);

  it("renders nothing without a layer name", () => {
    const { container } = renderLegend("");
    expect(container).toBeEmptyDOMElement();
  });

  it("shows the legend image expanded by default, without the title", () => {
    renderLegend();
    expect(screen.getByRole("img")).toBeInTheDocument();
    expect(screen.queryByText("Legend")).not.toBeInTheDocument();
  });

  it("shows the title bar when collapsed and hides it when expanded again", () => {
    renderLegend();
    fireEvent.click(screen.getByRole("button", { name: "Collapse legend" }));
    expect(screen.getByText("Legend")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Legend"));
    expect(screen.queryByText("Legend")).not.toBeInTheDocument();
  });

  it("shows a fallback message when the legend image fails to load", () => {
    renderLegend();
    fireEvent.error(screen.getByRole("img"));
    expect(
      screen.getByText("No legend available for this layer")
    ).toBeInTheDocument();
  });
});
