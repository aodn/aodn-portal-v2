import {
  cleanup,
  render,
  RenderResult,
  act,
  waitFor,
} from "@testing-library/react";
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
  vi,
} from "vitest";
import { Provider } from "react-redux";
import store from "../../common/store/store";
import InputWithSuggester from "../InputWithSuggester";
import { server } from "../../../__mocks__/server";
import { userEvent } from "@testing-library/user-event";

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

describe("inputwithsuggester", async () => {
  let rendered: RenderResult;

  beforeEach(() => {
    rendered = render(
      <Provider store={store}>
        <InputWithSuggester />
      </Provider>
    );
  });

  test("Suggestion options should disappear after choosing one of them", async () => {
    let input: HTMLInputElement;
    const { getByRole, findByTestId, findByRole, queryByRole, getAllByRole } =
      rendered;
    waitFor(
      () =>
        expect(getByRole("input-with-suggester")) &&
        expect(getByRole("combobox"))
    )
      .then(() => {
        input = getByRole("combobox") as HTMLInputElement;
        userEvent.type(input, "wave");
        waitFor(() =>
          expect((input as HTMLInputElement).value).to.equal("wave")
        );
      })
      .then(() => {
        waitFor(() => expect(expect(queryByRole("listbox")).to.exist)).then(
          () => {
            const options = getAllByRole("option");
            const textToMatch =
              "MOCK API IMOS - ACORN - Coffs Harbour HF ocean radar site (New South Wales, Australia) - Delayed mode wave";
            const optionToClick = options.find(
              (o) => o.textContent === textToMatch
            );
            expect(optionToClick).to.exist;

            if (optionToClick) {
              userEvent.click(optionToClick);
              expect(input.value).to.equal(textToMatch);

              // suggestion list should disappear after clicking on an option
              const listboxAfterClick = queryByRole("listbox");
              expect(listboxAfterClick).to.not.exist;

              // cleanup the input state
              userEvent.clear(input);
            }
          }
        );
      });
  });

  test("Categories section should work properly", async () => {
    async () => {
      const categoryToMatch = "Wave";
      const {
        getByRole,
        findAllByText,
        findByTestId,
        queryByText,
        queryByRole,
        getAllByRole,
      } = rendered;

      waitFor(() => {
        const input = getByRole("combobox");

        userEvent.type(input, categoryToMatch.toLowerCase());
        expect((input as HTMLInputElement).value).to.equal(
          categoryToMatch.toLowerCase()
        );
      }).then(() => {
        waitFor(() => expect(queryByRole("listbox")).to.exist).then(() => {
          const options = getAllByRole("option");
          const optionToClick = options.find(
            (o) =>
              o.textContent?.toLowerCase() === categoryToMatch.toLowerCase()
          );
          expect(optionToClick).to.exist;

          if (optionToClick) {
            userEvent.click(optionToClick);
            waitFor(async () => {
              const categorySection = await findAllByText("Categories:");
              // after clicking on a category, the category section should appear
              expect(categorySection.length).to.equal(1);

              // A chip showing wave should appear
              const chip = await findAllByText(categoryToMatch);
              expect(chip.length).to.equal(1);
              // Try to remove this category
              const removeButton = await findByTestId("CancelIcon");
              userEvent.click(removeButton);

              // now the wave chip should disappear
              const chipAfterRemove = queryByText(categoryToMatch);
              expect(chipAfterRemove).to.not.exist;
            });
          }

          // check suggesters
          const listboxAfterClick = queryByRole("listbox");
          expect(listboxAfterClick).to.not.exist;
        });
      });
    };
  });
});
