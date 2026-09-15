import { describe, expect, test } from "vitest";
import { buildHomeBody } from "../homeBody";

describe("buildHomeBody", () => {
  test("gives crawlers the h1, the site description and dataset links", () => {
    const body = buildHomeBody();

    expect(body).toContain("<h1>IMOS Australian Ocean Data Portal</h1>");
    expect(body).toContain(
      "<p>Open access to Australian marine and climate science data.</p>"
    );
    expect(body).toContain('<nav aria-label="Featured datasets">');
  });

  test("links every featured dataset by its details URL", () => {
    const body = buildHomeBody();

    for (const id of [
      "78d588ed-79dd-47e2-b806-d39025194e7e",
      "b299cdcd-3dee-48aa-abdd-e0fcdbb9cadc",
      "d810b8cb-2af9-412c-8d21-aa1e9a78edc2",
    ]) {
      expect(body).toContain(`<li><a href="/details/${id}">`);
    }
    expect(body.match(/<li>/g)).toHaveLength(3);
  });

  test("escapes HTML in a dataset title", () => {
    const body = buildHomeBody([
      { id: "abc-123", title: 'Temp <"salinity" & more>' },
    ]);

    expect(body).toContain(
      '<a href="/details/abc-123">Temp &#60;&#34;salinity&#34; &#38; more&#62;</a>'
    );
    expect(body).not.toContain('<"salinity');
  });

  test("has no nested div, so prerender can swap the whole #root content", () => {
    expect(buildHomeBody()).not.toContain("<div");
  });
});
