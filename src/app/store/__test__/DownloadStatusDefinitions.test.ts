import { describe, expect, it } from "vitest";
import {
  getSubmittedDownloadJobID,
  isDownloadStatusInfo,
} from "../DownloadStatusDefinitions";

describe("DownloadStatusDefinitions", () => {
  it("returns the pure jobID for a logically successful submission", () => {
    const jobID = "123e4567-e89b-12d3-a456-426614174000";

    expect(
      getSubmittedDownloadJobID({
        message: {
          type: "InlineValue",
          message: `Job submitted with ID: ${jobID}`,
        },
        status: { type: "InlineValue", message: "200" },
        jobID,
      })
    ).toBe(jobID);
  });

  it("does not extract an ID from the message for a logical error", () => {
    expect(
      getSubmittedDownloadJobID({
        message: {
          message:
            "Job submitted with ID: 123e4567-e89b-12d3-a456-426614174000",
        },
        status: { message: "400" },
      })
    ).toBeUndefined();
  });

  it("requires a non-empty jobID even when the logical status is 200", () => {
    expect(
      getSubmittedDownloadJobID({
        message: { message: "Job submitted" },
        status: { message: "200" },
      })
    ).toBeUndefined();
  });

  it("accepts optional descriptive fields in a valid status response", () => {
    expect(
      isDownloadStatusInfo({
        processID: "download-dataset",
        type: "process",
        jobID: "job-1",
        status: "running",
        message: "Download job is running",
        collection: "Test Ocean Data Collection",
        dataSelection: "imos-data/dataset.zarr",
        format: "netcdf",
        metadataUrl: "https://example.com/details/job-1",
        progress: 25,
      })
    ).toBe(true);
  });

  it("rejects malformed optional descriptive fields", () => {
    expect(
      isDownloadStatusInfo({
        type: "process",
        jobID: "job-1",
        status: "running",
        collection: 123,
      })
    ).toBe(false);
  });

  it("accepts older jobs without process ID or message", () => {
    expect(
      isDownloadStatusInfo({
        type: "process",
        jobID: "job-1",
        status: "successful",
        updated: "2026-08-25T01:21:10Z",
      })
    ).toBe(true);
  });
});
