import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, test } from "vitest";
import { OGCCollection } from "@/app/store/OGCCollectionDefinitions";
import ListResultCard from "../ListResultCard";

const baseContent: {
  id: string;
  title: string;
  description: string;
  findIcon: () => string | undefined;
  findThumbnail: () => string;
  getScope: () => string | undefined;
  getAiUpdateFrequency: () => string | undefined;
  getDatasetProvider: () => string | undefined;
  hasCloudOptimisedData: () => boolean;
  getWFSLinks: () => { href: string; rel: string }[] | undefined;
} = {
  id: "test-uuid",
  title: "Test Dataset",
  description: "Test description",
  findIcon: () => undefined,
  findThumbnail: () => "",
  getScope: () => undefined,
  getAiUpdateFrequency: () => undefined,
  getDatasetProvider: () => undefined,
  hasCloudOptimisedData: () => false,
  getWFSLinks: () => [],
};

const renderCard = (overrides: Partial<typeof baseContent> = {}) => {
  const content = { ...baseContent, ...overrides } as unknown as OGCCollection;
  return render(
    <MemoryRouter>
      <ListResultCard content={content} />
    </MemoryRouter>
  );
};

describe("ListResultCard service badges", () => {
  test("shows none of the service badges by default", () => {
    renderCard();

    expect(screen.queryByTestId("label-chip-IMOS Data")).to.be.null;
    expect(screen.queryByTestId("label-chip-Cloud-optimised")).to.be.null;
    expect(screen.queryByTestId("label-chip-WFS Service Available")).to.be.null;
  });

  test("shows the IMOS Data, Cloud-optimised and WFS badges together, independently", () => {
    renderCard({
      getDatasetProvider: () => "IMOS",
      hasCloudOptimisedData: () => true,
      getWFSLinks: () => [{ href: "https://example.com", rel: "wfs" }],
    });

    expect(screen.getByTestId("label-chip-IMOS Data")).to.exist;
    expect(screen.getByTestId("label-chip-Cloud-optimised")).to.exist;
    expect(screen.getByTestId("label-chip-WFS Service Available")).to.exist;
  });

  test("shows only the WFS badge when only WFS links are present", () => {
    renderCard({
      getWFSLinks: () => [{ href: "https://example.com", rel: "wfs" }],
    });

    expect(screen.queryByTestId("label-chip-IMOS Data")).to.be.null;
    expect(screen.queryByTestId("label-chip-Cloud-optimised")).to.be.null;
    expect(screen.getByTestId("label-chip-WFS Service Available")).to.exist;
  });
});
