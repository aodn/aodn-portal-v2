export const emptyAboutInfo = (json: any) => {
  const jsonToResponse = structuredClone(json);
  try {
    jsonToResponse.properties.themes = [];
    jsonToResponse.properties.contacts = [];
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
    jsonToResponse.properties.credits = [];
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

export const imosProviderWithCloudOptimisedInfo = (json: any) => {
  const jsonToResponse = structuredClone(json);
  try {
    jsonToResponse.properties.dataset_provider = "IMOS";
    jsonToResponse.links.push({
      href: "https://example.com/data.zarr",
      rel: "summary",
      type: "application/vnd+zarr",
      title: "data.zarr",
    });
    return jsonToResponse;
  } catch (e) {
    console.error(e);
  }
};

export const noWfsLinksInfo = (json: any) => {
  const jsonToResponse = structuredClone(json);
  try {
    jsonToResponse.links = jsonToResponse.links.filter(
      (link: any) => link.rel !== "wfs"
    );
    return jsonToResponse;
  } catch (e) {
    console.error(e);
  }
};
