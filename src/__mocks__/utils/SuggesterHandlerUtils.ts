import { SUGGESTER_OPTIONS } from "../data/SUGGESTER_OPTIONS";

const getSuggesterOptionsBy = (input: string, filter: string[]) => {
  // Filter each category based on input
  const filteredOrganisations = filterItemsIn(
    SUGGESTER_OPTIONS.suggested_organisation_vocabs
  ).by(input.toLowerCase());
  const filteredPlatforms = filterItemsIn(
    SUGGESTER_OPTIONS.suggested_platform_vocabs
  ).by(input.toLowerCase());
  const filteredPhrases = filterItemsIn(SUGGESTER_OPTIONS.suggested_phrases).by(
    input.toLowerCase()
  );
  const filteredParameters = filterItemsIn(
    SUGGESTER_OPTIONS.suggested_parameter_vocabs
  ).by(input.toLowerCase());

  // Return in the same format as the real API
  return {
    suggested_organisation_vocabs: filteredOrganisations,
    suggested_platform_vocabs: filteredPlatforms,
    suggested_phrases: filteredPhrases,
    suggested_parameter_vocabs: filteredParameters,
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
