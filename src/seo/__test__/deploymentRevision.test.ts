// @vitest-environment node
import { spawnSync } from "child_process";
import { createHash } from "crypto";
import fs from "fs";
import os from "os";
import path from "path";
import vm from "vm";
import { afterEach, describe, expect, test, vi } from "vitest";

const WORKFLOW_DIR = path.resolve(__dirname, "../../../.github/workflows");
const readWorkflow = (name: string) =>
  fs.readFileSync(path.join(WORKFLOW_DIR, name), "utf8");
const SEO = readWorkflow("seo_publish_and_verify.yml");
const DEPLOY = readWorkflow("trigger_build_deploy.yml");
const WEEKLY = readWorkflow("seo.yml");

// Extract the actual indented workflow blocks, like routeByUserAgent.test.ts
// runs the deployed CloudFront source. This needs no YAML parser dependency.
const section = (source: string, marker: string) => {
  const lines = source.split("\n");
  const start = lines.findIndex((line) => line.trim() === marker);
  if (start === -1) throw new Error(`Workflow block not found: ${marker}`);
  const indent = lines[start].length - lines[start].trimStart().length;
  let end = start + 1;
  while (
    end < lines.length &&
    (!lines[end].trim() || lines[end].startsWith(" ".repeat(indent + 1)))
  ) {
    end++;
  }
  return lines.slice(start + 1, end).join("\n");
};
const step = (source: string, name: string) =>
  section(source, `- name: ${name}`);
const script = (source: string, key: "script" | "run") => {
  const line = source
    .split("\n")
    .find((line) => line.trimStart().startsWith(`${key}: `));
  if (!line) throw new Error(`Workflow script not found: ${key}`);
  return line.trim() === `${key}: |`
    ? section(source, `${key}: |`)
    : line.trim().slice(key.length + 2);
};

const PUBLISH = section(SEO, "publish:");
const VERIFY = section(SEO, "verify:");
const RESOLVE_NAME = "Resolve the deployed application revision";
const GUARD_NAME = "Confirm the deployment has not changed before publishing";
const RESOLVE = script(step(PUBLISH, RESOLVE_NAME), "script");
const GUARD = script(step(PUBLISH, GUARD_NAME), "script");
const MAIN_SHA = "f".repeat(40);
const TEMPLATE =
  '<html><div id="root"></div><script src="/assets/index-test.js"></script></html>';
const digest = (content: string) =>
  createHash("sha256").update(content).digest("hex");

const headObject = (environment = "production", sha = "a".repeat(40)) => ({
  Metadata: {
    repository: "aodn/aodn-portal-v2",
    environment,
    "commit-sha": sha,
    "index-sha256": digest(TEMPLATE),
    "deployment-id": "123-1",
  } as Record<string, string>,
  VersionId: "version-1" as string | null | undefined,
  ETag: '"etag-1"',
  LastModified: "2026-10-12T00:00:00Z",
  ContentLength: TEMPLATE.length,
});

const revisionRunner = (
  head: unknown = headObject(),
  environment = "production"
) => {
  const state = { head };
  const outputs: Record<string, string> = {};
  const env: Record<string, string> = {
    DEPLOY_ENVIRONMENT: environment,
    DEPLOY_BUCKET: `test-${environment}`,
  };
  const getExecOutput = vi.fn(async (command: string, args: string[]) => {
    // Reject any write: these scripts may only inspect the deployed shell.
    expect(command).toBe("aws");
    expect(args).toEqual([
      "s3api",
      "head-object",
      "--bucket",
      env.DEPLOY_BUCKET,
      "--key",
      "index.html",
      "--output",
      "json",
    ]);
    return { stdout: JSON.stringify(state.head) };
  });
  const getCommit = vi.fn(async ({ ref }: { ref: string }) => ({
    data: { sha: ref },
  }));
  const sandbox = {
    exec: { getExecOutput },
    github: { rest: { repos: { getCommit } } },
    context: {
      repo: { owner: "aodn", repo: "aodn-portal-v2" },
      sha: MAIN_SHA,
      ref: "refs/heads/main",
      eventName: "schedule",
    },
    core: {
      setOutput: (name: string, value: string) => (outputs[name] = value),
      info: vi.fn(),
    },
    process: { env },
  };
  const execute = (code: string): Promise<void> =>
    vm.runInNewContext(`(async () => {\n${code}\n})()`, sandbox);
  return {
    state,
    outputs,
    getCommit,
    getExecOutput,
    resolve: async () => {
      await execute(RESOLVE);
      env.DEPLOYED_INDEX_SNAPSHOT = outputs.snapshot;
    },
    guard: () => execute(GUARD),
  };
};

const directories: string[] = [];
const shellFixture = () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "seo-deployment-"));
  directories.push(directory);
  const executable = (name: string, body: string) =>
    fs.writeFileSync(path.join(directory, name), `#!/bin/bash\n${body}\n`, {
      mode: 0o755,
    });
  const write = (name: string, body: string) =>
    fs.writeFileSync(path.join(directory, name), body);
  const read = (name: string) =>
    fs.readFileSync(path.join(directory, name), "utf8");
  const run = (code: string, env: Record<string, string> = {}) => {
    // Values are controlled test fixtures; quote them as shell arguments.
    const values: Record<string, string> = {
      "env.DIST": "dist",
      "vars.BUCKET": "test-bucket",
      "vars.AWS_REGION": "ap-southeast-2",
    };
    const rendered = code.replace(
      /\$\{\{\s*(.*?)\s*\}\}/g,
      (_, key: string) => {
        if (!(key in values)) throw new Error(`Unknown workflow input: ${key}`);
        return `'${values[key].replace(/'/g, "'\\''")}'`;
      }
    );
    return spawnSync("bash", ["-e", "-o", "pipefail", "-c", rendered], {
      cwd: directory,
      encoding: "utf8",
      env: {
        ...process.env,
        PATH: `${directory}${path.delimiter}${process.env.PATH}`,
        TEST_DIRECTORY: directory,
        ...env,
      },
    });
  };
  return { directory, executable, write, read, run };
};

afterEach(() => {
  for (const directory of directories.splice(0)) {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

describe("deployed source resolution", () => {
  test.each([
    ["edge", "a"],
    ["staging", "b"],
    ["production", "c"],
  ])(
    "a scheduled main run resolves %s's own deployed SHA",
    async (environment, letter) => {
      const sha = letter.repeat(40);
      const runner = revisionRunner(headObject(environment, sha), environment);
      await runner.resolve();
      expect(runner.outputs.sha).toBe(sha);
      expect(runner.outputs.sha).not.toBe(MAIN_SHA);
      expect(runner.outputs.index_sha256).toBe(digest(TEMPLATE));
      expect(runner.getCommit).toHaveBeenCalledWith({
        owner: "aodn",
        repo: "aodn-portal-v2",
        ref: sha,
      });
    }
  );

  test.each([
    ["repository", "other/repo"],
    ["environment", "staging"],
    ["commit-sha", "main"],
    ["commit-sha", "v1.2.3"],
    ["commit-sha", "a".repeat(39)],
    ["commit-sha", "a".repeat(41)],
    ["commit-sha", "A".repeat(40)],
    ["commit-sha", "g".repeat(40)],
    ["index-sha256", "invalid"],
    ["deployment-id", "123-0"],
    ["deployment-id", ""],
  ])(
    "invalid %s (%s) blocks Production before checkout",
    async (key, value) => {
      const head = headObject();
      head.Metadata[key] = value;
      const runner = revisionRunner(head);
      await expect(runner.resolve()).rejects.toThrow(
        "Missing or invalid deployment metadata"
      );
      expect(runner.getCommit).not.toHaveBeenCalled();
      expect(runner.outputs).toEqual({});
    }
  );

  test.each([
    "repository",
    "environment",
    "commit-sha",
    "index-sha256",
    "deployment-id",
  ])("missing %s blocks Production", async (key) => {
    const head = headObject();
    delete head.Metadata[key];
    const runner = revisionRunner(head);
    await expect(runner.resolve()).rejects.toThrow(
      "Missing or invalid deployment metadata"
    );
    expect(runner.outputs).toEqual({});
  });

  test("a shell without deployment metadata has no fallback revision", async () => {
    const runner = revisionRunner({});
    await expect(runner.resolve()).rejects.toThrow(
      "deploy through the updated portal workflow"
    );
    expect(runner.outputs).toEqual({});
  });

  test("unknown commits fail clearly and produce no checkout output", async () => {
    const runner = revisionRunner();
    runner.getCommit.mockRejectedValueOnce(new Error("404 Not Found"));
    await expect(runner.resolve()).rejects.toThrow(
      /Cannot resolve deployed commit.*404 Not Found/
    );
    expect(runner.outputs).toEqual({});
  });

  test("a different GitHub commit cannot replace the deployed SHA", async () => {
    const runner = revisionRunner();
    runner.getCommit.mockResolvedValueOnce({ data: { sha: MAIN_SHA } });
    await expect(runner.resolve()).rejects.toThrow(
      "GitHub returned a different commit"
    );
    expect(runner.outputs).toEqual({});
  });

  test.each(["access denied", "malformed response"])(
    "%s fails before checkout",
    async (failure) => {
      const runner = revisionRunner();
      if (failure === "access denied") {
        runner.getExecOutput.mockRejectedValueOnce(new Error("AccessDenied"));
      } else {
        runner.getExecOutput.mockResolvedValueOnce({ stdout: "not JSON" });
      }
      await expect(runner.resolve()).rejects.toThrow(
        "Cannot read the deployed index.html metadata"
      );
      expect(runner.outputs).toEqual({});
    }
  );

  test("unsupported environments fail before contacting AWS", async () => {
    const runner = revisionRunner(headObject(), "development");
    await expect(runner.resolve()).rejects.toThrow(
      "Unsupported deployment environment"
    );
    expect(runner.getExecOutput).not.toHaveBeenCalled();
  });
});

describe("the final publication guard", () => {
  test.each([undefined, null, "null", "version-1"])(
    "an unchanged deployment passes with VersionId %s",
    async (versionId) => {
      const head = headObject();
      head.VersionId = versionId;
      const runner = revisionRunner(head);
      await runner.resolve();
      await expect(runner.guard()).resolves.toBeUndefined();
      expect(runner.getExecOutput).toHaveBeenCalledTimes(2);
    }
  );

  test.each([undefined, "null", "version-1"])(
    "a same-SHA redeploy is detected with VersionId %s",
    async (versionId) => {
      const head = headObject();
      head.VersionId = versionId;
      const runner = revisionRunner(head);
      await runner.resolve();
      head.Metadata["deployment-id"] = "123-2";
      await expect(runner.guard()).rejects.toThrow(
        "changed during SEO generation"
      );
    }
  );

  test.each(["repository", "environment", "commit-sha", "index-sha256"])(
    "changed %s prevents publishing",
    async (key) => {
      const head = headObject();
      const runner = revisionRunner(head);
      await runner.resolve();
      head.Metadata[key] = "changed";
      await expect(runner.guard()).rejects.toThrow(
        "no SEO artifacts will be published"
      );
    }
  );

  test.each(["VersionId", "ETag", "LastModified", "ContentLength"] as const)(
    "changed object %s prevents publishing",
    async (key) => {
      const head = headObject();
      const runner = revisionRunner(head);
      await runner.resolve();
      runner.state.head = {
        ...head,
        [key]: key === "ContentLength" ? 999 : "changed",
      };
      await expect(runner.guard()).rejects.toThrow(
        "no SEO artifacts will be published"
      );
    }
  );

  test("a deleted shell prevents publishing", async () => {
    const runner = revisionRunner();
    await runner.resolve();
    runner.getExecOutput.mockRejectedValueOnce(new Error("NoSuchKey"));
    await expect(runner.guard()).rejects.toThrow("NoSuchKey");
  });
});

describe("deployment writes", () => {
  test("the source record uses checked-out HEAD rather than the triggering SHA", () => {
    const fixture = shellFixture();
    const sha = "a".repeat(40);
    fixture.executable(
      "git",
      `[ "$*" = "rev-parse HEAD" ] || exit 1\nprintf '%s\\n' '${sha}'`
    );
    const result = fixture.run(
      script(step(DEPLOY, "Record the application source revision"), "run"),
      {
        GITHUB_OUTPUT: path.join(fixture.directory, "output"),
        GITHUB_SHA: MAIN_SHA,
      }
    );
    expect(result.status, result.stderr).toBe(0);
    expect(fixture.read("output")).toBe(`sha=${sha}\n`);
  });

  test.each(["success", "assets", "shell"])(
    "%s upload keeps revision metadata tied to the shell",
    (failure) => {
      const fixture = shellFixture();
      fs.mkdirSync(path.join(fixture.directory, "dist/assets"), {
        recursive: true,
      });
      fixture.write("dist/index.html", TEMPLATE);
      fixture.write("live.html", "previous shell");
      fixture.write("live-metadata", "previous metadata");
      fixture.executable(
        "aws",
        `
printf '%s\\n' "$*" >> "$TEST_DIRECTORY/aws-calls"
if [ "$1" = "s3api" ]; then exit 0; fi
if [ "$2" = "cp" ] && [ "$3" = "dist/assets" ] && [ "$FAIL_UPLOAD" = "assets" ]; then exit 1; fi
if [ "$2" = "cp" ] && [ "$3" = "dist/index.html" ]; then
  [ "$FAIL_UPLOAD" != "shell" ] || exit 1
  cp "$3" "$TEST_DIRECTORY/live.html"
  printf '%s\\n' "$*" > "$TEST_DIRECTORY/live-metadata"
fi`
      );
      const result = fixture.run(
        script(step(DEPLOY, "Deploy Website to S3"), "run"),
        {
          DEPLOY_REPOSITORY: "aodn/aodn-portal-v2",
          DEPLOY_ENVIRONMENT: "production",
          SOURCE_SHA: "a".repeat(40),
          GITHUB_RUN_ID: "123",
          GITHUB_RUN_ATTEMPT: "2",
          FAIL_UPLOAD: failure,
        }
      );
      const calls = fixture.read("aws-calls").trim().split("\n");
      expect(calls[0]).toContain("sync --delete dist");
      for (const excluded of [
        "index.html",
        "assets/*",
        "sitemap.xml",
        "prerender/*",
      ]) {
        expect(calls[0]).toContain(`--exclude ${excluded}`);
      }
      expect(calls[1]).toContain("cp dist/assets");
      if (failure === "success") {
        expect(result.status, result.stderr).toBe(0);
        expect(calls[2]).toContain("cp dist/index.html");
        expect(fixture.read("live.html")).toBe(TEMPLATE);
        expect(fixture.read("live-metadata")).toContain(
          `--metadata repository=aodn/aodn-portal-v2,environment=production,commit-sha=${"a".repeat(40)},index-sha256=${digest(TEMPLATE)},deployment-id=123-2`
        );
        expect(calls[2]).toContain(
          "--cache-control no-cache --content-type text/html"
        );
      } else {
        expect(result.status).not.toBe(0);
        expect(fixture.read("live.html")).toBe("previous shell");
        expect(fixture.read("live-metadata")).toBe("previous metadata");
        expect(calls.some((call) => call.startsWith("s3api"))).toBe(false);
      }
    }
  );
});

describe("the public pre-render template", () => {
  test.each(["matching", "stale", "not a shell"])(
    "%s template is checked before generation",
    (kind) => {
      const fixture = shellFixture();
      fixture.write(
        "template.html",
        kind === "not a shell" ? "<html>Error</html>" : TEMPLATE
      );
      fixture.executable(
        "curl",
        `printf '%s\\n' "$2" > "$TEST_DIRECTORY/template-url"
cp "$TEST_DIRECTORY/template.html" "$4"`
      );
      const result = fixture.run(
        script(
          step(
            PUBLISH,
            "Fetch the deployed index.html as the pre-render template"
          ),
          "run"
        ),
        {
          SITE_URL: "https://example.org",
          DEPLOYED_INDEX_SHA256:
            kind === "stale" ? "0".repeat(64) : digest(TEMPLATE),
        }
      );
      expect(fixture.read("template-url")).toBe(
        "https://example.org/index.html\n"
      );
      if (kind === "matching") {
        expect(result.status, result.stderr).toBe(0);
        expect(fixture.read("dist/index.html")).toBe(TEMPLATE);
      } else {
        expect(result.status).not.toBe(0);
        expect(result.stdout).toContain(
          kind === "stale" ? "deployed template changed" : "unusable template"
        );
      }
    }
  );
});

test("workflow wiring pins both checkouts and stops publishing on failed checks", () => {
  expect(step(PUBLISH, "Checkout")).toContain(
    "ref: ${{ steps.revision.outputs.sha }}"
  );
  expect(step(VERIFY, "Checkout")).toContain(
    "ref: ${{ needs.publish.outputs.commit_sha }}"
  );
  expect(PUBLISH).toContain("commit_sha: ${{ steps.revision.outputs.sha }}");
  expect(VERIFY).toContain("needs: publish");
  expect(PUBLISH.indexOf("- name: Configure AWS credentials")).toBeLessThan(
    PUBLISH.indexOf(`- name: ${RESOLVE_NAME}`)
  );
  expect(PUBLISH.indexOf(`- name: ${RESOLVE_NAME}`)).toBeLessThan(
    PUBLISH.indexOf("- name: Checkout")
  );
  expect(PUBLISH.indexOf("- name: Fetch the deployed index.html")).toBeLessThan(
    PUBLISH.indexOf("- name: Generate sitemap.xml")
  );
  expect(
    step(PUBLISH, "Generate sitemap.xml and pre-rendered detail pages")
  ).toContain("yarn seo:verify");
  expect(PUBLISH.indexOf("yarn seo:verify")).toBeLessThan(
    PUBLISH.indexOf("- name: Copy the artifacts to S3")
  );
  expect(
    step(PUBLISH, "Generate sitemap.xml and pre-rendered detail pages")
  ).not.toMatch(/continue-on-error:/);
  expect(PUBLISH.indexOf(`- name: ${GUARD_NAME}`)).toBeLessThan(
    PUBLISH.indexOf("- name: Copy the artifacts to S3")
  );
  for (const name of [
    "Copy the artifacts to S3",
    "Clear cloudfront cache for the SEO paths",
  ]) {
    // Without an explicit if, GitHub applies success() to the step.
    expect(step(PUBLISH, name)).not.toMatch(/^\s*if:/m);
  }
  expect(
    step(PUBLISH, "Submit sitemap and report index coverage in Search Console")
  ).toContain("if: inputs.environment == 'production'");
  expect(PUBLISH).toContain("VITE_API_HOST: ${{ inputs.site }}");
  expect(step(PUBLISH, "Clear cloudfront cache for the SEO paths")).toContain(
    '--paths "/sitemap.xml" "/prerender/*"'
  );
});

test("application uploads and SEO share a queue without removing approval protections", () => {
  for (const job of [PUBLISH, section(DEPLOY, "trigger_deploy:")]) {
    expect(section(job, "concurrency:")).toContain(
      "group: portal-site-${{ inputs.environment }}"
    );
    expect(section(job, "concurrency:")).toContain("cancel-in-progress: false");
    expect(section(job, "concurrency:")).toContain("queue: max");
    expect(job).toContain("environment: ${{ inputs.environment }}");
  }
  expect(section(WEEKLY, "concurrency:")).toContain(
    "cancel-in-progress: false"
  );
  for (const environment of ["edge", "staging", "production"]) {
    expect(WEEKLY).toContain(`environment: ${environment}`);
  }
});
