export enum EventName {
  START_LOADING = "start loading",
  END_LOADING = "end loading",

  // START_LOADING event can happen multiple times simutaneously,
  // whereas START_UNIQUE_LOADING event can only happen once at a time
  START_UNIQUE_LOADING = "start unique loading",
}
