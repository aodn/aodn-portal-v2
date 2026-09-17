/**
 * `yarn lh:gate` — the only Lighthouse result that can fail a pull request: a
 * performance score far enough below the `main` baseline that it cannot be
 * run-to-run variability (see blockingPerformanceDrop in constants.ts).
 *
 * A separate step on purpose, running after the report has been commented, so a
 * failing PR still carries the numbers that explain why. Node-only.
 */

import fs from "fs";
import { argValue, gateJsonPath, isLighthouseCli, runCli } from "./cli";

export const gate = async () => {
  const gatePath = argValue("--gate") || gateJsonPath();

  if (!fs.existsSync(gatePath)) {
    throw new Error(`no ${gatePath}: run "yarn lh:compare" before the gate`);
  }

  const { blocking } = JSON.parse(fs.readFileSync(gatePath, "utf8")) as {
    blocking?: string[];
  };

  if (!blocking || blocking.length === 0) {
    console.log("no blocking Lighthouse regression");
    return;
  }

  for (const failure of blocking) {
    // Annotates the PR's Files/Checks view, not just the log
    console.error(
      `::error title=Lighthouse performance regression::${failure}`
    );
  }
  throw new Error(
    `${blocking.length} blocking performance regression${blocking.length === 1 ? "" : "s"} — see the Lighthouse comment on the PR`
  );
};

if (isLighthouseCli("gate.ts")) runCli(gate());
