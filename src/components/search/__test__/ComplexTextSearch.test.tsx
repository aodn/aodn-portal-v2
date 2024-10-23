import { render, screen, cleanup } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ComplexTextSearch from "../ComplexTextSearch";
import store from "../../common/store/store";
import { server } from "../../../__mocks__/server";

vi.mock("../../common/filters/AdvanceFilters.tsx", () => {
  const mockAdvanceFilters = () => (
    <div data-testid="mockAdvanceFilters">mockAdvanceFilters</div>
  );
  return { default: mockAdvanceFilters };
});

describe("ComplexTextSearch Component", () => {
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
  beforeEach(() => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ComplexTextSearch />
        </MemoryRouter>
      </Provider>
    );
  });

  it("renders ComplexTextSearch", () => {
    expect(screen.getByTestId("CloseIcon")).toBeInTheDocument();
    expect(screen.getByTestId("TuneIcon")).toBeInTheDocument();
    expect(screen.getByTestId("SearchIcon")).toBeInTheDocument();
  });

  // The visibility of Filter is tested in AdvanceFilters unit test
  it("renders Filters when it exists", () => {
    const advanceFilters = screen.getByTestId("mockAdvanceFilters");
    expect(advanceFilters).toBeInTheDocument();
  });
});
