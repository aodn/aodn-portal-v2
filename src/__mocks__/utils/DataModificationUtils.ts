export const emptyAboutInfo = (json: any) => {
  const jsonToResponse = structuredClone(json);
  try {
    jsonToResponse.properties.themes = [];
    jsonToResponse.properties.contacts = [];
    jsonToResponse.properties.credits = [];
    return jsonToResponse;
  } catch (e) {
    console.error(e);
  }
};

export const emptyMetadataInfo = (json: any) => {
  const jsonToResponse = structuredClone(json);
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

export const emptyCitationInfo = (json: any) => {
  const jsonToResponse = structuredClone(json);
  try {
    jsonToResponse.properties.license = null;
    jsonToResponse.properties.citation = null;
    jsonToResponse.properties.contacts = [];
    jsonToResponse.links = [];
    return jsonToResponse;
  } catch (e) {
    console.error(e);
  }
};

export const emptyLineageInfo = (json: any) => {
  const jsonToResponse = structuredClone(json);
  try {
    jsonToResponse.properties.statement = null;
    return jsonToResponse;
  } catch (e) {
    console.error(e);
  }
};

export const emptyAssociatedRecordInfo = (json: any) => {
  const jsonToResponse = structuredClone(json);
  try {
    jsonToResponse.links = [];
    return jsonToResponse;
  } catch (e) {
    console.error(e);
  }
};
