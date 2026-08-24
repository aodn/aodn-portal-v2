export type SuggesterParameters = {
  input?: string;
  filter?: string;
};

export type SearchParameters = {
  text?: string;
  filter?: string;
  properties?: string;
  sortby?: string;
};

export type SearchControl = {
  pagesize?: number;
  searchafter?: Array<string>;
  score?: number;
};
