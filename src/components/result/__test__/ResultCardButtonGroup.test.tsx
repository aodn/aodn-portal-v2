import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { OGCCollection } from "@/app/store/OGCCollectionDefinitions";
import ResultCardButtonGroup from "../ResultCardButtonGroup";

describe("ResultCardButtonGroup", () => {
  it("uses the default cursor for the non-interactive status", () => {
    const content = {
      getAllAIGroupedLinks: () => [],
      getStatus: () => "completed",
    } as unknown as OGCCollection;

    render(<ResultCardButtonGroup content={content} />);

    expect(screen.getByText("Completed").closest("button")).toHaveStyle(
      "cursor: default"
    );
  });
});
