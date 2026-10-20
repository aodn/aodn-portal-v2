// @vitest-environment node
import { spawnSync } from "child_process";
import fs from "fs";
import os from "os";
import path from "path";
import vm from "vm";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { parseSeoEnvironmentReport } from "@/seo/workflowReport";

const workflow = (name: string) =>
  fs.readFileSync(
    path.resolve(__dirname, `../../../.github/workflows/${name}`),
    "utf8"
  );
const SEO = workflow("seo_publish_and_verify.yml");
const WEEKLY = workflow("seo.yml");
const LIGHTHOUSE = workflow("lighthouse_release.yml");
const section = (source: string, marker: string) => {
  const lines = source.split("\n");
  const start = lines.findIndex((line) => line.trim() === marker);
  if (start < 0) throw new Error(`Missing workflow block: ${marker}`);
  const indent = lines[start].length - lines[start].trimStart().length;
  let end = start + 1;
  while (
    end < lines.length &&
    (!lines[end].trim() || lines[end].startsWith(" ".repeat(indent + 1)))
  )
    end++;
  return lines.slice(start + 1, end).join("\n");
};
const step = (source: string, name: string) =>
  section(source, `- name: ${name}`);
const script = (source: string, name: string, key = "script") => {
  const block = section(step(source, name), `${key}: |`);
  const indent = block
    .split("\n")
    .find((line) => line.trim())!
    .match(/^ */)![0].length;
  return block
    .split("\n")
    .map((line) => line.slice(indent))
    .join("\n");
};
const PUBLISH = section(SEO, "publish:");
const VERIFY = section(SEO, "verify:");
const REPORT = section(SEO, "report:");
const SUMMARY = section(WEEKLY, "summary:");
const NOTIFY = section(WEEKLY, "notify:");
let directory: string;
beforeEach(() => {
  directory = fs.mkdtempSync(path.join(os.tmpdir(), "seo-workflow-"));
});
afterEach(() => {
  fs.rmSync(directory, { recursive: true, force: true });
  vi.restoreAllMocks();
});
const execute = async (
  source: string,
  name: string,
  env: Record<string, string>,
  extra = {}
) => {
  const outputs: Record<string, string> = {};
  const core = {
    setOutput: (name: string, value: string) => {
      outputs[name] = value;
    },
    warning: vi.fn(),
    summary: {
      addHeading: vi.fn().mockReturnThis(),
      addCodeBlock: vi.fn().mockReturnThis(),
      write: vi.fn(),
    },
  };
  const sandbox = {
    require: (name: string) =>
      name === "node:fs"
        ? {
            ...fs,
            readFileSync: (file: string, encoding: "utf8") =>
              fs.readFileSync(path.resolve(directory, file), encoding),
            readdirSync: (file: string, options: { withFileTypes: true }) =>
              fs.readdirSync(path.resolve(directory, file), options),
            statSync: (file: string, options: { throwIfNoEntry: false }) =>
              fs.statSync(path.resolve(directory, file), options),
            mkdirSync: (file: string, options: { recursive: true }) =>
              fs.mkdirSync(path.resolve(directory, file), options),
            writeFileSync: (file: string, data: string) =>
              fs.writeFileSync(path.resolve(directory, file), data),
          }
        : path,
    process: {
      env: {
        GITHUB_SERVER_URL: "https://github.com",
        GITHUB_RUN_ATTEMPT: "2",
        RUNNER_TEMP: directory,
        ...env,
      },
    },
    context: { repo: { owner: "aodn", repo: "aodn-portal-v2" }, runId: 123 },
    core,
    ...extra,
  };
  await vm.runInNewContext(
    `(async () => {${script(source, name)}})()`,
    sandbox
  );
  return { outputs, core };
};
const collect = async (
  source: string,
  name: string,
  file: string,
  steps: unknown,
  environment = "edge"
) => {
  const { outputs } = await execute(source, name, {
    SEO_STEPS: JSON.stringify(steps),
    SEO_ENVIRONMENT: environment,
  });
  expect(outputs).not.toHaveProperty("report");
  return JSON.parse(fs.readFileSync(path.join(directory, file), "utf8"));
};
const publication = (steps: unknown, environment = "edge") =>
  collect(
    PUBLISH,
    "Collect publication results",
    "publication.json",
    steps,
    environment
  );
const verification = (steps: unknown) =>
  collect(VERIFY, "Collect verification results", "verification.json", steps);
const artifacts = () => {
  fs.mkdirSync(path.join(directory, "dist/prerender/details/a"), {
    recursive: true,
  });
  fs.mkdirSync(path.join(directory, "dist/prerender/details/b"), {
    recursive: true,
  });
  fs.mkdirSync(path.join(directory, "dist/prerender/details/missing"), {
    recursive: true,
  });
  fs.writeFileSync(
    path.join(directory, "dist/sitemap.xml"),
    "<urlset><loc>home</loc><loc>a</loc><loc>b</loc></urlset>"
  );
  fs.writeFileSync(
    path.join(directory, "dist/prerender/details/a/index.html"),
    "a"
  );
  fs.writeFileSync(
    path.join(directory, "dist/prerender/details/b/index.html"),
    "b"
  );
  fs.writeFileSync(
    path.join(directory, "dist/prerender/details/b/extra.txt"),
    "not a page"
  );
};
const generated = {
  outcome: "success",
  outputs: { generation: "success", local_verification: "success" },
};

test("counts actual sitemap entries and index.html pages, ignoring unrelated files", async () => {
  artifacts();
  const result = await publication({
    generate: generated,
    upload: {
      outcome: "success",
      outputs: { sitemap_uploaded: "true", pages_uploaded: "true" },
    },
  });
  expect(result.generated).toEqual({ sitemapUrls: 3, pages: 2 });
  expect(result.published).toEqual(result.generated);
  expect(result.generation).toBe("success");
  expect(result.errors).toEqual([]);
});

test("partial S3 failure preserves the completed sitemap upload and unknown page count", async () => {
  artifacts();
  const result = await publication({
    generate: generated,
    upload: { outcome: "failure", outputs: { sitemap_uploaded: "true" } },
  });
  expect(result.publishing).toBe("failure");
  expect(result.published).toEqual({ sitemapUrls: 3, pages: null });
  expect(result.errors).toContain(
    "upload: failure; see the publication job logs"
  );
});

test.each(["credentials", "revision", "checkout", "install", "template"])(
  "early %s failure yields unavailable counts and skipped generation",
  async (name) => {
    const result = await publication({
      [name]: { outcome: "failure" },
      generate: { outcome: "skipped", outputs: {} },
    });
    expect(result.generated).toEqual({ sitemapUrls: null, pages: null });
    expect(result.published).toEqual({ sitemapUrls: null, pages: null });
    expect(result.generation).toBe("skipped");
    expect(result.errors[0]).toContain(`${name}: failure`);
  }
);

test("local validation failure preserves generation counts without permitting publication", async () => {
  artifacts();
  const result = await publication({
    generate: { outcome: "failure", outputs: { generation: "success" } },
    upload: { outcome: "skipped" },
  });
  expect(result.generation).toBe("success");
  expect(result.localVerification).toBe("failure");
  expect(result.generated.pages).toBe(2);
  expect(result.published.pages).toBeNull();
});

test("generation failure has no completed batch count even if partial files exist", async () => {
  artifacts();
  const result = await publication({
    generate: { outcome: "failure", outputs: {} },
  });
  expect(result.generation).toBe("failure");
  expect(result.localVerification).toBe("skipped");
  expect(result.generated.pages).toBeNull();
});

test("live verification reports the actual sitemap total and sampled page count", async () => {
  fs.writeFileSync(
    path.join(directory, "seo-live-verification.log"),
    "OK: https://example.org (non-prod) — home, robots.txt, 12346 sitemap URLs and 3 sampled detail pages all valid\n"
  );
  expect(
    (await verification({ smoke: { outcome: "success" } })).verified
  ).toEqual({ sitemapUrls: 12346, pages: 3 });
});

test.each(["failure", "skipped"])(
  "%s live verification does not infer verified counts from generated pages",
  async (outcome) => {
    expect((await verification({ smoke: { outcome } })).verified).toEqual({
      sitemapUrls: null,
      pages: null,
    });
  }
);

test("older verifier summary formats retain the actual status with N/A counts", async () => {
  fs.writeFileSync(
    path.join(directory, "seo-live-verification.log"),
    "OK: older summary\n"
  );
  const result = await verification({ smoke: { outcome: "success" } });
  expect(result.verification).toBe("success");
  expect(result.verified).toEqual({ sitemapUrls: null, pages: null });
});

test("environment report uses authoritative job conclusions and tolerates missing outputs", async () => {
  await execute(REPORT, "Prepare environment report", {
    SEO_ENVIRONMENT: "edge",
    SEO_NEEDS: JSON.stringify({
      publish: { result: "failure", outputs: {} },
      verify: { result: "skipped", outputs: {} },
    }),
  });
  const value = JSON.parse(
    fs.readFileSync(path.join(directory, ".seo-reports/edge.json"), "utf8")
  );
  const result = parseSeoEnvironmentReport(value, "edge", "123", "2");
  expect(result.publishJob).toBe("failure");
  expect(result.verifyJob).toBe("skipped");
  expect(result.generation).toBe("unknown");
  expect(result.verified.pages).toBeNull();
  expect(result.logsUrl).toContain("/attempts/2");
});

test("environment report combines artifacts without any job outputs", async () => {
  artifacts();
  const publish = await publication({
    generate: generated,
    upload: {
      outcome: "success",
      outputs: { sitemap_uploaded: "true", pages_uploaded: "true" },
    },
  });
  const verify = {
    environment: "production",
    runId: "123",
    runAttempt: "2",
    verification: "success",
    verified: { sitemapUrls: 3, pages: 2 },
    errors: [],
  };
  fs.mkdirSync(path.join(directory, ".seo-job-reports"));
  fs.writeFileSync(
    path.join(directory, ".seo-job-reports/publication.json"),
    JSON.stringify({ ...publish, environment: "production" })
  );
  fs.writeFileSync(
    path.join(directory, ".seo-job-reports/verification.json"),
    JSON.stringify(verify)
  );
  await execute(REPORT, "Prepare environment report", {
    SEO_ENVIRONMENT: "production",
    SEO_NEEDS: JSON.stringify({
      publish: {
        result: "success",
        outputs: {},
      },
      verify: {
        result: "success",
        outputs: {},
      },
    }),
  });
  const result = parseSeoEnvironmentReport(
    JSON.parse(
      fs.readFileSync(
        path.join(directory, ".seo-reports/production.json"),
        "utf8"
      )
    ),
    "production",
    "123",
    "2"
  );
  expect(result.generated.pages).toBe(2);
  expect(result.verified.pages).toBe(2);
});

test("live command logging preserves the verifier's failing exit code", () => {
  const bin = path.join(directory, "bin");
  fs.mkdirSync(bin);
  fs.writeFileSync(
    path.join(bin, "yarn"),
    '#!/bin/bash\necho "FAIL missing canonical"\nexit 7\n',
    { mode: 0o755 }
  );
  const result = spawnSync(
    "bash",
    [
      "--noprofile",
      "--norc",
      "-eo",
      "pipefail",
      "-c",
      script(
        VERIFY,
        "Smoke check the SEO pages are live on CloudFront",
        "run"
      ).replace("${{ inputs.site }}", "https://example.org"),
    ],
    {
      cwd: directory,
      env: {
        ...process.env,
        PATH: `${bin}:${process.env.PATH}`,
        RUNNER_TEMP: directory,
      },
      encoding: "utf8",
    }
  );
  expect(result.status).toBe(7);
  expect(
    fs.readFileSync(path.join(directory, "seo-live-verification.log"), "utf8")
  ).toContain("FAIL missing canonical");
});

test("notification uses one job, original SES settings and non-blocking failures", () => {
  expect(NOTIFY).toContain("needs: [seo, summary]");
  expect(NOTIFY).toContain("if: ${{ always() }}");
  expect(NOTIFY).toContain("continue-on-error: true");
  expect(NOTIFY).toContain("environment: edge");
  expect(NOTIFY).toContain("id-token: write");
  expect(NOTIFY).toContain("actions: read");
  expect(NOTIFY).not.toContain("matrix:");
  expect(WEEKLY.match(/aws ses send-email/g)).toHaveLength(1);
  for (const name of [
    "LH_EMAIL_ENABLED",
    "LH_EMAIL_FROM",
    "LH_EMAIL_RECIPIENTS",
    "LH_EMAIL_AWS_REGION",
    "LH_EMAIL_AWS_ROLE_ARN",
  ]) {
    expect(NOTIFY).toContain(`vars.${name}`);
    expect(LIGHTHOUSE).toContain(`vars.${name}`);
  }
  expect(step(NOTIFY, "Download SEO reports")).toContain(
    "continue-on-error: true"
  );
  expect(step(NOTIFY, "Download SEO reports")).toContain(
    "${{ github.run_attempt }}"
  );
  expect(step(NOTIFY, "Prepare the SES email")).toContain("needs.seo.result");
  expect(REPORT).toContain("needs: [publish, verify]");
  expect(REPORT).toContain("if: always()");
  expect(REPORT).toContain("continue-on-error: true");
  for (const source of [PUBLISH, VERIFY]) {
    expect(source).not.toMatch(/^ {4}continue-on-error:/m);
    expect(
      step(
        source,
        source === PUBLISH
          ? "Collect publication results"
          : "Collect verification results"
      )
    ).toContain("if: always()");
  }
});

test.each(["success", "failure", "skipped"])(
  "notification delivery %s is reported without failing the summary step",
  (outcome) => {
    const summary = path.join(directory, "summary");
    const result = spawnSync(
      "bash",
      [
        "-eo",
        "pipefail",
        "-c",
        script(NOTIFY, "Report email delivery status", "run"),
      ],
      {
        env: {
          ...process.env,
          LH_EMAIL_ENABLED: "true",
          DELIVERY_STATUS: outcome,
          GITHUB_STEP_SUMMARY: summary,
        },
        encoding: "utf8",
      }
    );
    expect(result.status).toBe(0);
    expect(fs.readFileSync(summary, "utf8")).toContain(
      outcome === "success" ? "ACCEPTED" : "ERROR"
    );
  }
);

test("execution date comes from the current run attempt", async () => {
  const getWorkflowRunAttempt = vi.fn(async () => ({
    data: { run_started_at: "2026-10-14T00:00:00Z" },
  }));
  const result = await execute(
    SUMMARY,
    "Read workflow execution date",
    {},
    { github: { rest: { actions: { getWorkflowRunAttempt } } } }
  );
  expect(getWorkflowRunAttempt).toHaveBeenCalledWith({
    owner: "aodn",
    repo: "aodn-portal-v2",
    run_id: 123,
    attempt_number: 2,
  });
  expect(result.outputs.date).toBe("2026-10-14T00:00:00Z");
});

test("metadata API failure does not prevent email preparation", async () => {
  const result = await execute(
    SUMMARY,
    "Read workflow execution date",
    {},
    {
      github: {
        rest: {
          actions: {
            getWorkflowRunAttempt: vi
              .fn()
              .mockRejectedValue(new Error("Unavailable")),
          },
        },
      },
    }
  );
  expect(result.outputs.date).toContain("N/A");
  expect(result.core.warning).toHaveBeenCalled();
});

test.each([0, 7])(
  "log capture failure preserves verifier exit code %s",
  (exitCode) => {
    const bin = path.join(directory, "bin");
    fs.mkdirSync(bin);
    fs.writeFileSync(
      path.join(bin, "yarn"),
      `#!/bin/bash\necho 'verification result'\nexit ${exitCode}\n`,
      { mode: 0o755 }
    );
    fs.writeFileSync(
      path.join(bin, "tee"),
      "#!/bin/bash\ncat >/dev/null\nexit 9\n",
      { mode: 0o755 }
    );
    const result = spawnSync(
      "bash",
      [
        "--noprofile",
        "--norc",
        "-eo",
        "pipefail",
        "-c",
        script(
          VERIFY,
          "Smoke check the SEO pages are live on CloudFront",
          "run"
        ).replace("${{ inputs.site }}", "https://example.org"),
      ],
      {
        cwd: directory,
        env: {
          ...process.env,
          PATH: `${bin}:${process.env.PATH}`,
          RUNNER_TEMP: directory,
        },
        encoding: "utf8",
      }
    );
    expect(result.status).toBe(exitCode);
  }
);

test.each(["success", "sitemap", "pages"])(
  "actual S3 command %s records only completed uploads and preserves failures",
  (failure) => {
    artifacts();
    const bin = path.join(directory, "bin");
    fs.mkdirSync(bin);
    fs.writeFileSync(
      path.join(bin, "aws"),
      '#!/bin/bash\nif [ "$2" = "cp" ] && [ "$FAIL_UPLOAD" = "sitemap" ]; then exit 7; fi\nif [ "$2" = "sync" ] && [ "$FAIL_UPLOAD" = "pages" ]; then exit 8; fi\n',
      { mode: 0o755 }
    );
    const output = path.join(directory, "output");
    fs.writeFileSync(output, "");
    const command = script(PUBLISH, "Copy the artifacts to S3", "run")
      .split("${{ vars.BUCKET }}")
      .join("mock-bucket")
      .split("${{ vars.AWS_REGION }}")
      .join("mock-region");
    const result = spawnSync("bash", ["-eo", "pipefail", "-c", command], {
      cwd: directory,
      env: {
        ...process.env,
        PATH: `${bin}:${process.env.PATH}`,
        GITHUB_OUTPUT: output,
        FAIL_UPLOAD: failure,
      },
      encoding: "utf8",
    });
    expect(result.status).toBe(
      failure === "success" ? 0 : failure === "sitemap" ? 7 : 8
    );
    expect(fs.readFileSync(output, "utf8")).toBe(
      failure === "success"
        ? "sitemap_uploaded=true\npages_uploaded=true\n"
        : failure === "pages"
          ? "sitemap_uploaded=true\n"
          : ""
    );
  }
);

test("output recording failures do not interrupt generation or validation", () => {
  const bin = path.join(directory, "bin");
  fs.mkdirSync(bin);
  fs.writeFileSync(
    path.join(bin, "yarn"),
    '#!/bin/bash\nprintf "%s\\n" "$*" >> "$RUNNER_TEMP/commands"\n',
    { mode: 0o755 }
  );
  const result = spawnSync(
    "bash",
    [
      "-eo",
      "pipefail",
      "-c",
      script(
        PUBLISH,
        "Generate sitemap.xml and pre-rendered detail pages",
        "run"
      ),
    ],
    {
      cwd: directory,
      env: {
        ...process.env,
        PATH: `${bin}:${process.env.PATH}`,
        GITHUB_OUTPUT: directory,
        RUNNER_TEMP: directory,
      },
      encoding: "utf8",
    }
  );
  expect(result.status).toBe(0);
  expect(fs.readFileSync(path.join(directory, "commands"), "utf8")).toBe(
    "seo:artifacts\nseo:verify\n"
  );
});

test("summary runs independently of SES and environment approval", () => {
  expect(SUMMARY).toContain("needs: seo");
  expect(SUMMARY).toContain("if: ${{ always() }}");
  expect(SUMMARY).not.toContain("LH_EMAIL");
  expect(SUMMARY).not.toContain("environment:");
  expect(SUMMARY).toContain("src/seo/prepareWorkflowSummary.ts");
  expect(step(SUMMARY, "Write consolidated Actions summary")).toContain(
    "if: always()"
  );
  expect(SEO).not.toContain("steps.report.outputs.report");
  expect(REPORT).not.toContain("job.outputs.report");
  expect(REPORT).not.toContain("addCodeBlock");
  expect(step(REPORT, "Download job reports")).toContain(
    "${{ github.run_attempt }}"
  );
  for (const stage of ["publication", "verification"]) {
    expect(step(SEO, `Upload ${stage} results`)).toContain("if: always()");
    expect(step(SEO, `Upload ${stage} results`)).toContain(
      "continue-on-error: true"
    );
  }
});

test("indexing counts come only from a completed GSC sample; logs and credentials are excluded", async () => {
  fs.writeFileSync(
    path.join(directory, "seo-index-coverage.log"),
    "Coverage of 50 sampled URLs from https://example.org/sitemap.xml:\n  40  Submitted and indexed\n  8  Crawled - currently not indexed\n  2  arbitrary-secret-state\nNot indexed:\n  sensitive URL\n"
  );
  const steps = {
    search_console: { outcome: "success" },
    credentials: { outcome: "success", outputs: { token: "sensitive-token" } },
  };
  const result = await publication(steps, "production");
  expect(result.indexing).toEqual({
    sampledUrls: 50,
    coverage: {
      "Submitted and indexed": 40,
      "Crawled - currently not indexed": 8,
      "Other coverage states": 2,
    },
  });
  expect(JSON.stringify(result)).not.toMatch(/sensitive|arbitrary-secret/);
  expect(
    (
      await publication(
        { search_console: { outcome: "failure" } },
        "production"
      )
    ).indexing
  ).toBeNull();
  expect((await publication(steps, "edge")).indexing).toBeNull();
});

test.each([
  "not JSON",
  JSON.stringify({ environment: "edge", runId: "123", runAttempt: "1" }),
])(
  "malformed or stale internal artifact %s cannot produce PASS",
  async (content) => {
    fs.mkdirSync(path.join(directory, ".seo-job-reports"));
    fs.writeFileSync(
      path.join(directory, ".seo-job-reports/publication.json"),
      content
    );
    await execute(REPORT, "Prepare environment report", {
      SEO_ENVIRONMENT: "edge",
      SEO_NEEDS: JSON.stringify({
        publish: { result: "success" },
        verify: { result: "success" },
      }),
    });
    const result = JSON.parse(
      fs.readFileSync(path.join(directory, ".seo-reports/edge.json"), "utf8")
    );
    expect(result.generation).toBe("unknown");
    expect(result.generated.pages).toBeNull();
  }
);

test("disabled email is reported without SEO failure", () => {
  const summary = path.join(directory, "summary");
  const result = spawnSync(
    "bash",
    [
      "-eo",
      "pipefail",
      "-c",
      script(NOTIFY, "Report email delivery status", "run"),
    ],
    {
      env: {
        ...process.env,
        LH_EMAIL_ENABLED: "false",
        GITHUB_STEP_SUMMARY: summary,
      },
      encoding: "utf8",
    }
  );
  expect(result.status).toBe(0);
  expect(fs.readFileSync(summary, "utf8")).toContain("DISABLED");
});
