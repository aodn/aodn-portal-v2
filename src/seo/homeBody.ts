/**
 * Static home page body baked into index.html at build time: the h1, a line
 * of text and dataset links crawlers can follow. React replaces it on mount.
 */

import { escapeEntities } from "./constants";
import { SITE_DESCRIPTION } from "./headTags";

// The records the landing page features in its news cards; keep in sync
const FEATURED_DATASETS = [
  {
    id: "78d588ed-79dd-47e2-b806-d39025194e7e",
    title:
      "IMOS - Satellite Remote Sensing - Satellite Altimetry Calibration and Validation Sub-Facility",
  },
  {
    id: "b299cdcd-3dee-48aa-abdd-e0fcdbb9cadc",
    title: "Wave buoys Observations - Australia - near real-time",
  },
  {
    id: "d810b8cb-2af9-412c-8d21-aa1e9a78edc2",
    title:
      "IMOS - Fishing Vessels as Ships of Opportunity Sub-Facility - Real-time Quality Assurance and Quality Control Best Practice Manual",
  },
];

// No <div> in here: prerender.ts swaps the whole #root content with a match
// that stops at the first </div>
export const buildHomeBody = (datasets = FEATURED_DATASETS) => {
  const links = datasets
    .map(
      ({ id, title }) =>
        `<li><a href="/details/${id}">${escapeEntities(title)}</a></li>`
    )
    .join("");
  return `<main>
    <h1>IMOS Australian Ocean Data Portal</h1>
    <p>${SITE_DESCRIPTION}</p>
    <nav aria-label="Featured datasets"><h2>Featured datasets</h2><ul>${links}</ul></nav>
  </main>`;
};
