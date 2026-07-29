import { SUGGESTER_OPTIONS } from "../data/SUGGESTER_OPTIONS";

const getSuggesterOptionsBy = (input: string, _filter: string[]) => {
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

  // Semantic suggestions are matched by meaning, not substring, so they are not filtered by input.
  // The backend only runs the query once the input reaches elasticsearch.semantic.min_input_length.
  const semantic =
    input.trim().length >= 3 ? SUGGESTER_OPTIONS.suggested_semantic : [];

  // Return in the same format as the real API
  return {
    suggested_organisation_vocabs: filteredOrganisations,
    suggested_platform_vocabs: filteredPlatforms,
    suggested_phrases: filteredPhrases,
    suggested_parameter_vocabs: filteredParameters,
    suggested_semantic: semantic,
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
