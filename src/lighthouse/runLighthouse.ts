/**
 * Runs Lighthouse against a URL in a freshly launched Chrome. Node-only —
 * never import in app code.
 */

import * as chromeLauncher from "chrome-launcher";
import lighthouse, { desktopConfig } from "lighthouse";
import type { FormFactor, Lhr } from "./types";

/**
 * A fresh profile per run, so nothing carries over between runs, plus the
 * flags a CI container needs. --no-sandbox is required on GitHub-hosted
 * runners; keeping it locally too means both environments launch Chrome the
 * same way.
 */
const CHROME_FLAGS = [
  "--headless=new",
  "--no-sandbox",
  "--disable-dev-shm-usage",
  "--disable-gpu",
  "--disable-extensions",
  "--disable-background-networking",
  "--no-first-run",
  "--mute-audio",
];

export interface LighthouseRunOptions {
  url: string;
  formFactor: FormFactor;
  /**
   * Discarded run whose only job is to fill the API cache. Unthrottled and
   * performance-only, so it costs a fraction of a measured run.
   */
  warmup?: boolean;
}

export const runLighthouse = async ({
  url,
  formFactor,
  warmup = false,
}: LighthouseRunOptions): Promise<Lhr> => {
  const chrome = await chromeLauncher.launch({
    chromeFlags: CHROME_FLAGS,
    chromePath: process.env.CHROME_PATH,
  });

  try {
    const result = await lighthouse(
      url,
      {
        port: chrome.port,
        output: "json",
        logLevel: "error",
        ...(warmup
          ? {
              throttlingMethod: "provided" as const,
              onlyCategories: ["performance"],
              disableFullPageScreenshot: true,
            }
          : {
              onlyCategories: [
                "performance",
                "accessibility",
                "best-practices",
                "seo",
              ],
            }),
      },
      // Mobile is Lighthouse's default config (slow 4G, 4x CPU); desktop needs
      // the config that ships with it.
      formFactor === "desktop" ? desktopConfig : undefined
    );

    if (!result?.lhr)
      throw new Error(`Lighthouse returned no result for ${url}`);
    return result.lhr as unknown as Lhr;
  } finally {
    await chrome.kill();
  }
};
