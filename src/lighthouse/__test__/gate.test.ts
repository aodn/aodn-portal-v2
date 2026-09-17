// @vitest-environment node
import fs from "fs";
import os from "os";
import path from "path";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { gate } from "../gate";

const gateFile = path.join(
  fs.mkdtempSync(path.join(os.tmpdir(), "lh-gate-")),
  "gate.json"
);

const originalArgv = process.argv;

beforeEach(() => {
  process.argv = ["node", "gate.ts", "--gate", gateFile];
});

afterEach(() => {
  process.argv = originalArgv;
  fs.rmSync(gateFile, { force: true });
  vi.restoreAllMocks();
});

describe("gate", () => {
  test("passes and logs when nothing is blocking", async () => {
    fs.writeFileSync(gateFile, JSON.stringify({ blocking: [] }));
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    await expect(gate()).resolves.toBeUndefined();
    expect(logSpy).toHaveBeenCalledWith("no blocking Lighthouse regression");
  });

  test("passes when the gate file has no blocking key at all", async () => {
    fs.writeFileSync(gateFile, JSON.stringify({}));
    await expect(gate()).resolves.toBeUndefined();
  });

  test("fails and annotates when a performance drop is blocking", async () => {
    const failure =
      "❌ Performance on `/` dropped by 20 points compared with `main` — this check fails at 15 or more.";
    fs.writeFileSync(gateFile, JSON.stringify({ blocking: [failure] }));
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    await expect(gate()).rejects.toThrow(
      "1 blocking performance regression — see the Lighthouse comment on the PR"
    );
    expect(errorSpy).toHaveBeenCalledWith(
      `::error title=Lighthouse performance regression::${failure}`
    );
  });

  test("pluralises the failure count", async () => {
    fs.writeFileSync(
      gateFile,
      JSON.stringify({ blocking: ["route a regressed", "route b regressed"] })
    );
    vi.spyOn(console, "error").mockImplementation(() => {});

    await expect(gate()).rejects.toThrow("2 blocking performance regressions");
  });

  test("fails clearly when yarn lh:compare has not run yet", async () => {
    fs.rmSync(gateFile, { force: true });
    await expect(gate()).rejects.toThrow(
      `no ${gateFile}: run "yarn lh:compare" before the gate`
    );
  });
});
