import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { Provider } from "react-redux";
import { ThemeProvider } from "@mui/material/styles";
import AppTheme from "@/styles/theme";
import store, { getComponentState } from "@/app/store/store";
import { clearComponentParam } from "@/app/store/componentParamReducer";
import { SearchKeys } from "@/components/search/constants";
import { FilterValues } from "@/components/filter/FilterDefinition";
import OrganisationFilter from "@/components/filter/tab-filters/OrganisationFilter";

const renderFilter = (filters: FilterValues = {}) =>
  render(
    <Provider store={store}>
      <ThemeProvider theme={AppTheme}>
        <OrganisationFilter filters={filters} setFilters={vi.fn()} />
      </ThemeProvider>
    </Provider>
  );

describe("OrganisationFilter", () => {
  afterEach(() => {
    cleanup();
    store.dispatch(clearComponentParam());
  });

  it("shows a button for each organisation", () => {
    renderFilter();

    [
      SearchKeys.IMOS,
      SearchKeys.AAD,
      SearchKeys.AIMS,
      SearchKeys.CSIRO,
      SearchKeys.EATLAS,
      SearchKeys.GA,
      SearchKeys.IMAS,
      SearchKeys.NCI,
    ].forEach((key) => {
      expect(
        screen.getByTestId(`organisation-filter-${key}`)
      ).toBeInTheDocument();
    });
  });

  it.each([SearchKeys.EATLAS, SearchKeys.GA, SearchKeys.NCI])(
    "filters by %s when its button is clicked",
    async (key) => {
      const user = userEvent.setup();
      renderFilter();

      await user.click(screen.getByTestId(`organisation-filter-${key}`));

      expect(getComponentState(store.getState()).datasetGroup).toBe(key);
    }
  );
});
