import { cleanup, render, screen } from "@testing-library/react";
import { afterAll, afterEach, beforeAll, describe, expect, test } from "vitest";

import { server } from "../../../../__mocks__/server";
import { Provider } from "react-redux";
import store from "../../store/store";
import DynamicResultCardButton from "../DynamicResultCardButton";
import { rgbToHex } from "@mui/material";
import AppTheme from "../../../../utils/AppTheme";
import { ThemeProvider } from "@mui/material/styles";

describe("DynamicResultCardButton", async () => {
  beforeAll(() => {
    server.listen();
  });
  afterEach(() => {
    cleanup();
    server.resetHandlers();
  });
  afterAll(() => {
    server.close();
  });
  const theme = AppTheme;
  test("Button color and text should be shown properly when status is ongoing", async () => {
    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <DynamicResultCardButton status={"onGoing"} onClick={() => {}} />
        </ThemeProvider>
      </Provider>
    );
    const statusButton = screen.getByRole("button");
    const color = rgbToHex(getComputedStyle(statusButton).color);
    expect(color).to.equal(theme.palette.success.main.toLowerCase());
    expect(statusButton.textContent).to.equal("On Going");
  });

  test("Button color and text should be shown properly when status is completed", async () => {
    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <DynamicResultCardButton status={"completed"} onClick={() => {}} />
        </ThemeProvider>
      </Provider>
    );
    const statusButton = screen.getByRole("button");
    const color = rgbToHex(getComputedStyle(statusButton).color);
    expect(color).to.equal(theme.palette.primary.light.toLowerCase());
    expect(statusButton.textContent).to.equal("Completed");
  });
});
