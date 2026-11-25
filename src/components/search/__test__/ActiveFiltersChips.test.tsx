import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import AppTheme from "@/styles/theme";
import store from "@/app/store/store";
import {
  clearComponentParam,
  updateDatasetGroup,
} from "@/app/store/componentParamReducer";
import { SearchKeys } from "@/components/search/constants";
import ActiveFiltersChips from "@/components/search/ActiveFiltersChips";

const renderChips = () =>
  render(
    <Provider store={store}>
      <MemoryRouter>
        <ThemeProvider theme={AppTheme}>
          <ActiveFiltersChips />
        </ThemeProvider>
      </MemoryRouter>
    </Provider>
  );

describe("ActiveFiltersChips", () => {
  afterEach(() => {
    cleanup();
    store.dispatch(clearComponentParam());
  });

  it.each([
    [SearchKeys.EATLAS, "eAtlas"],
    [SearchKeys.CSIRO, "CSIRO"],
  ])("shows the %s organisation label", (key, label) => {
    store.dispatch(updateDatasetGroup(key));
    renderChips();

    expect(screen.getByText(`Organisation: ${label}`)).toBeInTheDocument();
  });

  it("shows the raw value for an unknown organisation", () => {
    store.dispatch(updateDatasetGroup("other"));
    renderChips();

    expect(screen.getByText("Organisation: other")).toBeInTheDocument();
  });
});
