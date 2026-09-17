/**
 * Paths and argv helpers shared by the Lighthouse CI scripts, mirroring
 * src/seo/cli.ts. Node-only — never import in app code.
 */

import path from "path";
import { fileURLToPath } from "url";

const here = () => path.dirname(fileURLToPath(import.meta.url));

export const repoRoot = () => path.resolve(here(), "../..");

export const distDir = () => path.join(repoRoot(), "dist");

/** Everything this tool writes lives here; gitignored. */
export const workDir = () => path.join(repoRoot(), ".lighthouse");

export const reportJsonPath = () => path.join(workDir(), "report.json");

export const reportMarkdownPath = () => path.join(workDir(), "report.md");

/** What the gate step reads: the regressions that must fail the job, if any. */
export const gateJsonPath = () => path.join(workDir(), "gate.json");

/** Where the downloaded `lighthouse-baseline` artifact is unpacked. */
export const baselineJsonPath = () =>
  path.join(workDir(), "baseline", "report.json");

/**
 * The mocked OGC API: committed responses the measured runs replay, refreshed
 * with `yarn lh:record`. Not under workDir(), which is gitignored.
 */
export const apiFixturesDir = () => path.join(here(), "fixtures", "api");

/** Full Lighthouse results, kept for the run artifact. */
export const lhrDir = () => path.join(workDir(), "lhr");

/** `--flag value` or `--flag=value`; returns undefined when absent. */
export const argValue = (flag: string, argv = process.argv.slice(2)) => {
  const withEquals = argv.find((arg) => arg.startsWith(`${flag}=`));
  if (withEquals) return withEquals.slice(flag.length + 1);

  const index = argv.indexOf(flag);
  if (index >= 0 && index + 1 < argv.length) {
    const next = argv[index + 1];
    if (!next.startsWith("--")) return next;
  }
  return undefined;
};

export const hasFlag = (flag: string, argv = process.argv.slice(2)) =>
  argv.includes(flag);

/** True when this file is the script node was asked to run. */
export const isLighthouseCli = (scriptFile: string) =>
  process.argv.some((arg) =>
    arg.replace(/\\/g, "/").endsWith(`/${scriptFile}`)
  );

/**
 * Surfaces the reason and exits non-zero. Only real failures reach this — a
 * score regression is reported, never thrown.
 */
export const runCli = (work: Promise<unknown>) => {
  work.catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
};
