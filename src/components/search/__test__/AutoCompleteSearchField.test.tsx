import { fireEvent, render } from "@testing-library/react";
import { test, expect } from "vitest";
import { Provider } from "react-redux";
import store from "../../common/store/store.tsx"; // adjust the import path as needed
import InputWithSuggester from "../InputWithSuggester.tsx"; // adjust the import path as needed

test("renders InputWithSuggester component", () => {
  const { getByTestId } = render(
    <Provider store={store}>
      <InputWithSuggester />
    </Provider>
  );

  const inputElement = getByTestId("input-with-suggester");

  expect(inputElement).to.exist;

  fireEvent.change(inputElement, { target: { value: "wave" } });
  expect(inputElement).toHaveValue("wave");
});
