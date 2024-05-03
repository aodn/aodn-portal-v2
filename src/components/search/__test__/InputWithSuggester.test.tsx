import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Provider } from "react-redux";
import store from "../../common/store/store.tsx";
import InputWithSuggester from "../InputWithSuggester.tsx";

describe("inputwithsuggester", () => {
  it("should render", async () => {
    const { findByTestId } = render(
      <Provider store={store}>
        <InputWithSuggester />
      </Provider>
    );
    // await sleep(4000);
    const inputWithSuggester = await findByTestId("input-with-suggester");
    expect(inputWithSuggester).toBeTruthy();
  });
});

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
