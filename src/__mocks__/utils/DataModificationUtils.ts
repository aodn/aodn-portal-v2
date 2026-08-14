// Minimal shape of the collection json these helpers modify
type CollectionJson = {
  id?: unknown;
  links?: unknown[];
  properties: Record<string, unknown>;
};

export const emptyAboutInfo = (json: unknown) => {
  const jsonToResponse = structuredClone(json) as CollectionJson;
  try {
    jsonToResponse.properties.themes = [];
    jsonToResponse.properties.contacts = [];
    return jsonToResponse;
  } catch (e) {
    console.error(e);
  }
};

export const emptyMetadataInfo = (json: unknown) => {
  const jsonToResponse = structuredClone(json) as CollectionJson;
  try {
    jsonToResponse.properties.contacts = [];
    jsonToResponse.id = null;
    jsonToResponse.links = [];
    jsonToResponse.properties.creation = null;
    jsonToResponse.properties.revision = null;
    return jsonToResponse;
  } catch (e) {
    console.error(e);
  }
};

export const emptyCitationInfo = (json: unknown) => {
  const jsonToResponse = structuredClone(json) as CollectionJson;
  try {
    jsonToResponse.properties.license = null;
    jsonToResponse.properties.citation = null;
    jsonToResponse.properties.contacts = [];
    jsonToResponse.properties.credits = [];
    jsonToResponse.links = [];
    return jsonToResponse;
  } catch (e) {
    console.error(e);
  }
};

export const emptyLineageInfo = (json: unknown) => {
  const jsonToResponse = structuredClone(json) as CollectionJson;
  try {
    jsonToResponse.properties.statement = null;
    return jsonToResponse;
  } catch (e) {
    console.error(e);
  }
};

export const emptyAssociatedRecordInfo = (json: unknown) => {
  const jsonToResponse = structuredClone(json) as CollectionJson;
  try {
    jsonToResponse.links = [];
    return jsonToResponse;
  } catch (e) {
    console.error(e);
  }
};
