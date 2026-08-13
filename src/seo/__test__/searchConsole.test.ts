/**
 * SEO — the JWT assertion is hand-signed (no googleapis dependency), so its
 * shape and signature must match what Google's token endpoint verifies.
 */

import { createVerify, generateKeyPairSync } from "crypto";
import { mkdtemp, writeFile } from "fs/promises";
import { tmpdir } from "os";
import path from "path";
import { afterEach, describe, expect, test, vi } from "vitest";
import {
  buildJwtAssertion,
  fetchSitemapUrls,
  loadServiceAccountKey,
  sampleEvenly,
} from "../searchConsole";

describe("buildJwtAssertion", () => {
  const { publicKey, privateKey } = generateKeyPairSync("rsa", {
    modulusLength: 2048,
  });
  const key = {
    client_email: "seo@project.iam.gserviceaccount.com",
    private_key: privateKey.export({ type: "pkcs8", format: "pem" }) as string,
  };

  test("claims carry the service account, webmasters scope and a 1h expiry", () => {
    const jwt = buildJwtAssertion(key, 1700000000);
    const [header, claims] = jwt.split(".");

    expect(JSON.parse(Buffer.from(header, "base64url").toString())).toEqual({
      alg: "RS256",
      typ: "JWT",
    });
    expect(JSON.parse(Buffer.from(claims, "base64url").toString())).toEqual({
      iss: "seo@project.iam.gserviceaccount.com",
      scope: "https://www.googleapis.com/auth/webmasters",
      aud: "https://oauth2.googleapis.com/token",
      iat: 1700000000,
      exp: 1700003600,
    });
  });

  test("signature verifies as RS256 over header.claims", () => {
    const jwt = buildJwtAssertion(key, 1700000000);
    const [header, claims, signature] = jwt.split(".");

    const verified = createVerify("RSA-SHA256")
      .update(`${header}.${claims}`)
      .verify(publicKey, signature, "base64url");
    expect(verified).toBe(true);
  });
});

describe("loadServiceAccountKey", () => {
  afterEach(() => vi.unstubAllEnvs());

  test("rejects when the env var is not set", async () => {
    vi.stubEnv("GSC_SERVICE_ACCOUNT_KEY", "");
    await expect(loadServiceAccountKey()).rejects.toThrow(
      "Set GSC_SERVICE_ACCOUNT_KEY"
    );
  });

  test("accepts the key as inline JSON (how CI passes the secret)", async () => {
    vi.stubEnv(
      "GSC_SERVICE_ACCOUNT_KEY",
      '{"client_email":"seo@project.iam.gserviceaccount.com","private_key":"pem"}'
    );
    await expect(loadServiceAccountKey()).resolves.toEqual({
      client_email: "seo@project.iam.gserviceaccount.com",
      private_key: "pem",
    });
  });

  test("accepts the key as a file path (how it is used locally)", async () => {
    const dir = await mkdtemp(path.join(tmpdir(), "gsc-key-"));
    const file = path.join(dir, "key.json");
    await writeFile(
      file,
      '{"client_email":"seo@project.iam.gserviceaccount.com","private_key":"pem"}'
    );
    vi.stubEnv("GSC_SERVICE_ACCOUNT_KEY", file);

    await expect(loadServiceAccountKey()).resolves.toEqual({
      client_email: "seo@project.iam.gserviceaccount.com",
      private_key: "pem",
    });
  });

  test("rejects JSON that is not a service account key", async () => {
    vi.stubEnv("GSC_SERVICE_ACCOUNT_KEY", '{"type":"authorized_user"}');
    await expect(loadServiceAccountKey()).rejects.toThrow(
      "missing client_email/private_key"
    );
  });
});

describe("fetchSitemapUrls", () => {
  afterEach(() => vi.unstubAllGlobals());

  test("extracts every <loc> from the live sitemap", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        status: 200,
        text: async () =>
          '<?xml version="1.0" encoding="UTF-8"?>\n' +
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
          "  <url><loc>https://portal-beta.aodn.org.au/</loc></url>\n" +
          "  <url><loc>https://portal-beta.aodn.org.au/details/abc-123</loc></url>\n" +
          "</urlset>",
      })
    );

    await expect(fetchSitemapUrls()).resolves.toEqual([
      "https://portal-beta.aodn.org.au/",
      "https://portal-beta.aodn.org.au/details/abc-123",
    ]);
  });

  test("rejects when the SPA shell answers instead of the sitemap", async () => {
    // CloudFront serves index.html for missing files, so this is the real
    // failure mode of an unpublished sitemap — not a 404
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        status: 200,
        text: async () => '<!doctype html><html><div id="root"></div></html>',
      })
    );

    await expect(fetchSitemapUrls()).rejects.toThrow(
      "is the sitemap published?"
    );
  });
});

describe("sampleEvenly", () => {
  test("spreads the sample across the whole list instead of taking the head", () => {
    const items = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];
    expect(sampleEvenly(items, 3)).toEqual(["a", "d", "g"]);
  });

  test("returns everything when the sample size covers the list", () => {
    expect(sampleEvenly(["a", "b"], 5)).toEqual(["a", "b"]);
  });
});
