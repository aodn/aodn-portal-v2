// @vitest-environment node
import { expect, test, vi } from "vitest";
import {
  buildReleaseComparison,
  findPreviousRelease,
  parseReleaseHistory,
  selectPreviousArtifacts,
} from "@/lighthouse/compareRelease";
import type {
  ReleaseArtifact,
  ReleaseHistory,
} from "@/lighthouse/compareRelease";

const report = (score = 80, environment = "staging"): ReleaseHistory => ({
  environment,
  ref: "v1.2.3",
  commit: "abc123",
  executionStatus: "SUCCESS",
  performanceStatus: score >= 75 ? "PASS" : "FAIL",
  pages: [
    {
      id: "landing",
      url: "https://example.org/",
      formFactor: "mobile",
      performance: score,
    },
    {
      id: "landing",
      url: "https://example.org/",
      formFactor: "desktop",
      performance: 90,
    },
  ],
});
const currentReport = (environment = "staging"): ReleaseHistory => ({
  ...report(80, environment),
  ref: "v1.2.4",
  commit: "def456",
});
const artifact = (
  runId: number,
  environment = "staging",
  attempt = 1
): ReleaseArtifact => ({
  id: runId * 10 + attempt,
  name: `lighthouse-${environment}-abc123-${runId}-${attempt}`,
  expired: false,
  created_at: `2026-10-${String(attempt).padStart(2, "0")}T00:00:00Z`,
  workflow_run: { id: runId },
});

test.each([
  { current: 85, previous: 80, difference: "+5", status: "PASS" },
  { current: 70, previous: 80, difference: "-10", status: "FAIL" },
  { current: 75, previous: 80, difference: "-5", status: "PASS" },
  { current: 80, previous: 80, difference: "0", status: "PASS" },
])(
  "reports signed difference $difference and retains minimum 75",
  ({ current, previous, difference, status }) => {
    const markdown = buildReleaseComparison(
      report(current),
      report(previous),
      "https://github.com/example/actions/runs/10"
    );
    expect(markdown).toContain(
      `| mobile | ${previous} | ${current} | ${difference} | 75 | **${status}** |`
    );
    expect(markdown).toContain("| desktop | 90 | 90 | 0 | 75 | **PASS** |");
    expect(markdown).toContain("[Actions report]");
  }
);

test("first release works without a baseline", async () => {
  const read = vi.fn();
  const previous = await findPreviousRelease([], currentReport(), 30, read);
  expect(read).not.toHaveBeenCalled();
  const markdown = buildReleaseComparison(report(), previous?.report);
  expect(markdown).toContain("No previous release available");
  expect(markdown).toContain(
    "| mobile | Unavailable | 80 | — | 75 | **PASS** |"
  );
});

test("failed performance thresholds with valid measurements are accepted", async () => {
  const read = vi.fn().mockResolvedValue(report(65));
  const previous = await findPreviousRelease(
    [artifact(20)],
    currentReport(),
    30,
    read
  );
  expect(previous?.report.performanceStatus).toBe("FAIL");
  expect(buildReleaseComparison(report(80), previous?.report)).toContain(
    "| mobile | 65 | 80 | +15 | 75 | **PASS** |"
  );
});

test.each(["staging", "production"])(
  "%s has a separate history and downloads only its newest eligible archive",
  async (environment) => {
    const read = vi.fn().mockResolvedValue(report(80, environment));
    const other = environment === "staging" ? "production" : "staging";
    const previous = await findPreviousRelease(
      [
        artifact(10, environment),
        artifact(25, other),
        artifact(20, environment),
      ],
      currentReport(environment),
      30,
      read
    );
    expect(previous?.artifact.workflow_run?.id).toBe(20);
    expect(read).toHaveBeenCalledTimes(1);
    expect(read).toHaveBeenCalledWith(artifact(20, environment));
  }
);

test("expired artifacts are not downloaded and an older retained artifact is usable", async () => {
  const expired = { ...artifact(25), expired: true };
  const expiredByDate = { ...artifact(24), expires_at: "2020-01-01T00:00:00Z" };
  const read = vi.fn().mockResolvedValue(report());
  const previous = await findPreviousRelease(
    [expired, expiredByDate, artifact(20)],
    currentReport(),
    30,
    read
  );
  expect(previous?.artifact.workflow_run?.id).toBe(20);
  expect(
    await findPreviousRelease([expired], currentReport(), 30, read)
  ).toBeUndefined();
  expect(read).toHaveBeenCalledTimes(1);
});

test("missing or expired archive at download time is non-fatal", async () => {
  const read = vi.fn().mockRejectedValue(new Error("HTTP 410"));
  await expect(
    findPreviousRelease([artifact(20)], currentReport(), 30, read)
  ).resolves.toBeUndefined();
});

test.each([
  undefined,
  {},
  { ...report(), environment: "production" },
  { ...report(), executionStatus: "ERROR" },
  { ...report(), performanceStatus: "INCOMPLETE" },
  { ...report(), pages: [] },
  { ...report(), pages: [{ ...report().pages[0], performance: NaN }] },
  { ...report(), pages: [{ ...report().pages[0], performance: 101 }] },
  { ...report(), pages: [{ ...report().pages[0], url: "invalid" }] },
])(
  "missing/invalid/incomplete historical result %# is non-fatal",
  async (value) => {
    const previous = await findPreviousRelease(
      [artifact(20)],
      currentReport(),
      30,
      vi.fn().mockResolvedValue(value)
    );
    expect(previous).toBeUndefined();
    expect(buildReleaseComparison(report(), previous?.report)).toContain(
      "No previous release available"
    );
  }
);

test("a missing previous page or device is indicated per measurement", () => {
  const previous = report();
  previous.pages = [previous.pages[1]];
  const current = report();
  current.pages.push({
    id: "search",
    url: "https://example.org/search",
    formFactor: "mobile",
    performance: 70,
  });
  const markdown = buildReleaseComparison(current, previous);
  expect(markdown).toContain(
    "| mobile | Unavailable | 80 | — | 75 | **PASS** |"
  );
  expect(markdown).toContain("| desktop | 90 | 90 | 0 | 75 | **PASS** |");
  expect(markdown).toContain(
    "| mobile | Unavailable | 70 | — | 75 | **FAIL** |"
  );
});

test("changed detail dataset or query state is not equivalent", () => {
  const current = report();
  current.pages = [
    {
      ...current.pages[0],
      id: "details",
      url: "https://example.org/details/new?tab=summary",
    },
  ];
  const previous = report();
  previous.pages = [
    { ...current.pages[0], url: "https://example.org/details/old?tab=summary" },
  ];
  expect(buildReleaseComparison(current, previous)).toContain(
    "| mobile | Unavailable | 80 | — | 75 | **PASS** |"
  );
  previous.pages[0].url = "https://example.org/details/new?tab=data";
  expect(buildReleaseComparison(current, previous)).toContain(
    "| mobile | Unavailable | 80 | — | 75 | **PASS** |"
  );
});

test("origin changes and equivalent reordered query parameters can match", () => {
  const current = report();
  current.pages[0].url = "https://new.example.org/?a=1&b=2";
  const previous = report(75);
  previous.pages[0].url = "https://old.example.org/?b=2&a=1";
  expect(buildReleaseComparison(current, previous)).toContain(
    "| mobile | 75 | 80 | +5 | 75 | **PASS** |"
  );
});

test("mismatched environments cannot be compared even by direct callers", () => {
  expect(buildReleaseComparison(report(), report(75, "production"))).toContain(
    "No previous release available"
  );
});

test("reruns exclude all attempts of the current run and later runs", () => {
  const artifacts = [
    artifact(30),
    artifact(30, "staging", 2),
    artifact(31),
    artifact(20),
    artifact(20, "staging", 2),
  ];
  expect(
    selectPreviousArtifacts(artifacts, "staging", 30, "def456")[0]?.id
  ).toBe(202);
});

test("PR artifacts and malformed release names or mismatched run identities are excluded", () => {
  expect(
    selectPreviousArtifacts(
      [
        { ...artifact(20), name: "lighthouse-baseline" },
        { ...artifact(20), name: "lighthouse-run-1" },
        { ...artifact(20), name: "lighthouse-staging-abc123-19-1" },
      ],
      "staging",
      30,
      "def456"
    )
  ).toEqual([]);
});

test("invalid scores/URLs and duplicate page identities are rejected", () => {
  const duplicate = report();
  duplicate.pages.push(duplicate.pages[0]);
  expect(parseReleaseHistory(duplicate, "staging")).toBeUndefined();
  const invalid = report();
  invalid.pages[0].url = "javascript:alert(1)";
  expect(parseReleaseHistory(invalid, "staging")).toBeUndefined();
});

test("same SHA metadata excludes multiple runs without downloading", async () => {
  const sameName = {
    ...artifact(28),
    name: "lighthouse-staging-def456-28-1",
  };
  const sameMetadata = {
    ...artifact(27),
    workflow_run: { id: 27, head_sha: "def456" },
  };
  const read = vi.fn().mockResolvedValue(report());
  const previous = await findPreviousRelease(
    [sameName, sameMetadata, artifact(20)],
    currentReport(),
    30,
    read
  );
  expect(previous?.artifact.id).toBe(201);
  expect(read).toHaveBeenCalledTimes(1);
});

test("different run IDs with identical refs or report SHAs are skipped", async () => {
  const read = vi
    .fn()
    .mockResolvedValueOnce({ ...report(), ref: currentReport().ref })
    .mockResolvedValueOnce({ ...report(), commit: currentReport().commit })
    .mockResolvedValueOnce(report());
  const previous = await findPreviousRelease(
    [artifact(28), artifact(27), artifact(20)],
    currentReport(),
    30,
    read
  );
  expect(previous?.artifact.id).toBe(201);
  expect(read).toHaveBeenCalledTimes(3);
});

test.each([
  undefined,
  { ...report(), executionStatus: "ERROR" },
  { ...report(), performanceStatus: "INCOMPLETE" },
])(
  "invalid newest artifact falls back to a valid older FAIL report %#",
  async (value) => {
    const read = vi
      .fn()
      .mockResolvedValueOnce(value)
      .mockResolvedValueOnce(report(65));
    const previous = await findPreviousRelease(
      [artifact(28), artifact(20)],
      currentReport(),
      30,
      read
    );
    expect(previous?.artifact.id).toBe(201);
    expect(previous?.report.performanceStatus).toBe("FAIL");
    expect(read).toHaveBeenCalledTimes(2);
  }
);

test("archive download errors fall back to the next candidate", async () => {
  const read = vi
    .fn()
    .mockRejectedValueOnce(new Error("HTTP 410"))
    .mockResolvedValueOnce(report());
  const previous = await findPreviousRelease(
    [artifact(28), artifact(20)],
    currentReport(),
    30,
    read
  );
  expect(previous?.artifact.id).toBe(201);
});

test("no valid history stops after five downloads and retains current threshold results", async () => {
  const read = vi.fn().mockResolvedValue({});
  const previous = await findPreviousRelease(
    [28, 27, 26, 25, 24, 23].map((id) => artifact(id)),
    currentReport(),
    30,
    read
  );
  expect(previous).toBeUndefined();
  expect(read).toHaveBeenCalledTimes(5);
  for (const [score, status] of [
    [75, "PASS"],
    [74, "FAIL"],
  ] as const) {
    const markdown = buildReleaseComparison(report(score), previous?.report);
    expect(markdown).toContain("No previous release available");
    expect(markdown).toContain(
      `| mobile | Unavailable | ${score} | — | 75 | **${status}** |`
    );
  }
});
