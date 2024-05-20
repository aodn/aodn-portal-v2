import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import ComplexTextSearch from "./../ComplexTextSearch";
import store from "./../../../components/common/store/store";
import { vi } from "vitest";

describe("ComplexTextSearch Component", () => {
  test("renders ComplexTextSearch component", () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ComplexTextSearch />
        </BrowserRouter>
      </Provider>
    );

    // Check if all main components are rendered
    expect(screen.getByLabelText(/search/i)).toBeInTheDocument();
    expect(screen.getByText(/filters/i)).toBeInTheDocument();
    expect(screen.getByText(/search/i)).toBeInTheDocument();
  });

  test("clicks search button and executes search", () => {
    const mockDispatch = vi.fn();
    render(
      <Provider store={{ ...store, dispatch: mockDispatch }}>
        <BrowserRouter>
          <ComplexTextSearch />
        </BrowserRouter>
      </Provider>
    );

    const searchButton = screen.getByText(/search/i);
    userEvent.click(searchButton);

    expect(mockDispatch).toHaveBeenCalled();
  });

  test("presses Enter and executes search", () => {
    const mockDispatch = vi.fn();
    render(
      <Provider store={{ ...store, dispatch: mockDispatch }}>
        <BrowserRouter>
          <ComplexTextSearch />
        </BrowserRouter>
      </Provider>
    );

    const inputElement = screen.getByRole("textbox");
    fireEvent.keyDown(inputElement, { key: "Enter", code: "Enter" });

    expect(mockDispatch).toHaveBeenCalled();
  });

  test("clicks filter button and shows filters", () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ComplexTextSearch />
        </BrowserRouter>
      </Provider>
    );

    const filterButton = screen.getByText(/filters/i);
    userEvent.click(filterButton);

    expect(screen.getByText(/advance filters/i)).toBeInTheDocument();
  });
});
