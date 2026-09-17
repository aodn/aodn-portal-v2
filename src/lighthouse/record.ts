/**
 * `yarn lh:record` — refreshes the mocked OGC API the Lighthouse runs replay.
 *
 * Loads every measured route, on mobile and desktop, against the production
 * build in dist/ with /api proxied to a real environment (portal-edge by
 * default), records every API response and rewrites fixtures/api/. Commit the
 * result with the PR.
 *
 * Nothing is written unless every page rendered and every request reached the
 * upstream, so a flaky environment cannot leave half a set of fixtures behind.
 * Node-only.
 */

import { createApiRecorder } from "./apiFixtures";
import { startAppServer } from "./appServer";
import {
  ALL_FORM_FACTORS,
  DEFAULT_PORT,
  apiHost,
  detailsUuid,
  lighthouseRoutes,
} from "./constants";
import {
  apiFixturesDir,
  argValue,
  distDir,
  isLighthouseCli,
  runCli,
} from "./cli";
import { checkRendered } from "./metrics";
import { runLighthouse } from "./runLighthouse";

export const record = async () => {
  const upstream = (argValue("--api-host") || apiHost()).replace(/\/$/, "");
  const uuid = argValue("--uuid") || detailsUuid();
  const port = Number(
    argValue("--port") ?? process.env.LH_PORT ?? DEFAULT_PORT
  );
  const fixturesDir = argValue("--fixtures") || apiFixturesDir();

  const api = createApiRecorder({ upstream });
  const server = await startAppServer({ distDir: distDir(), port, api });
  console.log(
    `serving ${distDir()} on ${server.url}, recording /api from ${upstream}`
  );

  try {
    for (const route of lighthouseRoutes(uuid)) {
      // The form factors request different things (mobile forces the list
      // layout and loads a second page of results), so record both.
      for (const formFactor of ALL_FORM_FACTORS) {
        console.log(`[${route.id}] ${formFactor}`);
        const lhr = await runLighthouse({
          url: `${server.url}${route.path}`,
          formFactor,
          warmup: true,
        });
        const problems = checkRendered(lhr, route, server.url);
        if (problems.length > 0) {
          throw new Error(
            `${route.path} (${formFactor}) did not render while recording, ` +
              "so no fixtures were written:\n" +
              problems.map((problem) => `  - ${problem}`).join("\n")
          );
        }
      }
    }
  } finally {
    await server.close();
  }

  const { errors, failures } = api.stats();
  if (failures.length > 0) {
    throw new Error(
      `${upstream} could not be reached for some requests, so no fixtures ` +
        `were written. Try again:\n${failures.map((failure) => `  - ${failure}`).join("\n")}`
    );
  }
  if (errors.length > 0) {
    // The pages rendered anyway, so these are calls they tolerate. Recorded
    // as-is so the replay behaves exactly like the recording did.
    console.warn(`recorded error responses: ${errors.join(", ")}`);
  }

  const manifest = api.save(fixturesDir);
  console.log(
    `wrote ${manifest.fixtures.length} fixtures to ${fixturesDir} — commit them with your PR`
  );
  return manifest;
};

if (isLighthouseCli("record.ts")) runCli(record());
