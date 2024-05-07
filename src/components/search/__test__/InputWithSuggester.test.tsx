import { cleanup, render, RenderResult } from "@testing-library/react";
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
} from "vitest";
import { Provider } from "react-redux";
import store from "../../common/store/store.tsx";
import InputWithSuggester from "../InputWithSuggester.tsx";
import { server } from "../../../__mocks__/server.ts";
import userEvent from "@testing-library/user-event";
import { sleep } from "../../../__mocks__/utils.ts";

beforeAll(() => {
  server.listen();
});
afterEach(() => {
  server.resetHandlers();
  cleanup();
});
afterAll(() => {
  server.close();
});

describe("inputwithsuggester", async () => {
  let rendered: RenderResult;

  beforeEach(() => {
    rendered = render(
      <Provider store={store}>
        <InputWithSuggester />
      </Provider>
    );
  });
  afterEach(() => {
    cleanup();
  });

  test("Suggestion options should disappear after choosing one of them", async () => {
    const { getByRole, findByTestId, queryByRole, getAllByRole } = rendered;

    await findByTestId("input-with-suggester");
    const input = getByRole("combobox");
    await userEvent.type(input, "wave");
    expect((input as HTMLInputElement).value).to.equal("wave");

    // await debouncing
    await sleep(1000);

    const listbox = queryByRole("listbox");
    expect(listbox).to.exist;

    const options = getAllByRole("option");
    const textToMatch =
      "MOCK API IMOS - ACORN - Coffs Harbour HF ocean radar site (New South Wales, Australia) - Delayed mode wave";
    const optionToClick = options.find((o) => o.textContent === textToMatch);
    expect(optionToClick).to.exist;

    await userEvent.click(optionToClick);
    expect((input as HTMLInputElement).value).to.equal(textToMatch);

    // suggestion list should disappear after clicking on an option
    const listboxAfterClick = queryByRole("listbox");
    expect(listboxAfterClick).to.not.exist;

    // cleanup the input state
    await userEvent.clear(input);
  });

  test("Categories section should work properly", async () => {
    const {
      getByRole,
      findAllByText,
      findByTestId,
      queryByText,
      queryByRole,
      getAllByRole,
    } = rendered;
    const input = getByRole("combobox");
    const categoryToMatch = "Wave";
    await userEvent.type(input, categoryToMatch.toLowerCase());
    expect((input as HTMLInputElement).value).to.equal(
      categoryToMatch.toLowerCase()
    );

    // await debouncing
    await sleep(1000);

    const listbox = queryByRole("listbox");
    expect(listbox).to.exist;

    const options = getAllByRole("option");
    const optionToClick = options.find(
      (o) => o.textContent.toLowerCase() === categoryToMatch.toLowerCase()
    );
    expect(optionToClick).to.exist;

    await userEvent.click(optionToClick);
    const categorySection = await findAllByText("Categories:");

    // after clicking on a category, the category section should appear
    expect(categorySection.length).to.equal(1);

    // A chip showing wave should appear
    const chip = await findAllByText(categoryToMatch);
    expect(chip.length).to.equal(1);

    // Try to remove this category
    const removeButton = await findByTestId("CancelIcon");
    await userEvent.click(removeButton);

    // now the wave chip should disappear
    const chipAfterRemove = queryByText(categoryToMatch);
    expect(chipAfterRemove).to.not.exist;

    // check suggesters
    const listboxAfterClick = queryByRole("listbox");
    expect(listboxAfterClick).to.not.exist;
  });
});
