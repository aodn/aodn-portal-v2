import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, test, vi } from "vitest";
import ComplexTextSearch from "../ComplexTextSearch";
import store from "../../common/store/store";

vi.mock("../../common/filters/AdvanceFilters.tsx", () => {
  const mockAdvanceFilters = () => <div>mockAdvanceFilters</div>;
  return { default: mockAdvanceFilters };
});

describe("ComplexTextSearch Component", () => {
  beforeEach(() => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ComplexTextSearch />
        </MemoryRouter>
      </Provider>
    );
  });

  test("renders ComplexTextSearch component", () => {
    expect(screen.getByText("Filters")).toBeInTheDocument();
    expect(screen.getByText("Search")).toBeInTheDocument();
  });

  test("clicks filter button and shows filters", async () => {
    const filterButton = screen.getByTestId("filtersBtn");
    await userEvent.click(filterButton);

    expect(screen.getByText("mockAdvanceFilters")).toBeInTheDocument();
  });
});
