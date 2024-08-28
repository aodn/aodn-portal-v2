import { SUGGESTER_OPTIONS } from "../data/SUGGESTER_OPTIONS";

const getSuggesterOptionsBy = (input: string, filter: string[]) => {
  const allCategories = SUGGESTER_OPTIONS.category_suggestions;
  const allTitles = SUGGESTER_OPTIONS.record_suggestions.titles;

  const categories = filterItemsIn(allCategories).by(input.toLowerCase());
  const titles = filterItemsIn(allTitles).by(input.toLowerCase());
  return {
    category_suggestions: categories,
    record_suggestions: {
      titles: titles,
    },
  };
};

const filterItemsIn = (array: string[]) => {
  return new ArrayToFilter(array);
};

class ArrayToFilter {
  constructor(private readonly array: string[]) {}

  public by(keyword: string) {
    return this.array.filter((item) => item.toLowerCase().includes(keyword));
  }
}

export { getSuggesterOptionsBy };
