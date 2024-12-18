import { render, screen, cleanup } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ComplexTextSearch from "../ComplexTextSearch";
import store from "../../common/store/store";
import { server } from "../../../__mocks__/server";

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
    expect(screen.getByTestId("DateRangeIcon")).toBeInTheDocument();
    expect(screen.getByTestId("PlaceIcon")).toBeInTheDocument();
    expect(screen.getByTestId("TuneIcon")).toBeInTheDocument();
    expect(screen.getByTestId("SearchIcon")).toBeInTheDocument();
  });
});
