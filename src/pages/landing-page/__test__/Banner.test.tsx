import { afterEach, describe, expect, test } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import AppTheme from "@/styles/theme";
import Banner from "../features/banner/Banner";

describe("Banner", () => {
  afterEach(() => cleanup());

  test("renders the slogan as the page h1", () => {
    render(
      <ThemeProvider theme={AppTheme}>
        <Banner />
      </ThemeProvider>
    );

    // Both slogan lines form a single h1 with a space between the lines,
    // so crawlers and screen readers get one well-formed heading
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "IMOS Australian Ocean Data Portal",
      })
    ).to.exist;
  });
});
