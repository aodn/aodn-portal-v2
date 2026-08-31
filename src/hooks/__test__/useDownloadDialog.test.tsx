import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { FormEvent, ReactNode } from "react";
import store from "@/app/store/store";
import { ogcAxiosWithRetry } from "@/app/store/searchReducer";
import { useDownloadDialog } from "../useDownloadDialog";

vi.mock("react-router-dom", () => ({
  useParams: () => ({ uuid: "test-uuid" }),
}));

vi.mock("@/pages/detail-page/context/detail-page-context", () => ({
  useDetailPageContext: () => ({
    downloadConditions: [],
    collection: undefined,
  }),
}));

const wrapper = ({ children }: { children: ReactNode }) => (
  <Provider store={store}>{children}</Provider>
);

// The hook reads the email out of the submitted form, so drive it with a real
// form element rather than reaching into the hook internals.
const submitWithEmail = (handler: (event: FormEvent) => void) => {
  const form = document.createElement("form");
  const input = document.createElement("input");
  input.name = "email";
  input.value = "user@example.com";
  form.appendChild(input);

  act(() =>
    handler({
      preventDefault: vi.fn(),
      currentTarget: form,
    } as unknown as FormEvent)
  );
};

const executionResponse = (extra: Record<string, unknown>) => ({
  data: {
    message: { message: "Job submitted" },
    status: { message: "200" },
    jobID: "123e4567-e89b-12d3-a456-426614174000",
    ...extra,
  },
});

describe("useDownloadDialog queued downloads", () => {
  beforeEach(() => {
    vi.spyOn(ogcAxiosWithRetry, "post");
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("reports a download that ogcapi sent straight to AWS as not queued", async () => {
    vi.mocked(ogcAxiosWithRetry.post).mockResolvedValue(
      executionResponse({ queued: false })
    );

    const { result } = renderHook(() => useDownloadDialog(true, vi.fn()), {
      wrapper,
    });

    submitWithEmail(result.current.handleFormSubmit);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.isQueued).toBe(false);
    expect(result.current.queuePosition).toBeNull();
    expect(result.current.getProcessStatusText()).toBe(
      "Download email will be sent shortly."
    );
  });

  it("reports a held download as queued and keeps its position", async () => {
    vi.mocked(ogcAxiosWithRetry.post).mockResolvedValue(
      executionResponse({ queued: true, queuePosition: 3 })
    );

    const { result } = renderHook(() => useDownloadDialog(true, vi.fn()), {
      wrapper,
    });

    submitWithEmail(result.current.handleFormSubmit);

    await waitFor(() => expect(result.current.isQueued).toBe(true));
    expect(result.current.isSuccess).toBe(true);
    expect(result.current.queuePosition).toBe(3);
    expect(result.current.getProcessStatusText()).toBe("Download queued");
  });

  it("counts positions excluding the download itself and never promises a time", async () => {
    vi.mocked(ogcAxiosWithRetry.post).mockResolvedValue(
      executionResponse({ queued: true, queuePosition: 3 })
    );

    const { result } = renderHook(() => useDownloadDialog(true, vi.fn()), {
      wrapper,
    });

    submitWithEmail(result.current.handleFormSubmit);
    await waitFor(() => expect(result.current.isQueued).toBe(true));

    const text = result.current.getQueuedInfoText();
    // queuePosition 3 includes this download, so 2 sit ahead of it.
    expect(text).toContain("2 of your own downloads ahead of it");
    expect(text).toContain("we will email you then");
    expect(text).not.toMatch(/minute|hour|estimat/i);
  });

  it("says a download at position 1 is next to start", async () => {
    vi.mocked(ogcAxiosWithRetry.post).mockResolvedValue(
      executionResponse({ queued: true, queuePosition: 1 })
    );

    const { result } = renderHook(() => useDownloadDialog(true, vi.fn()), {
      wrapper,
    });

    submitWithEmail(result.current.handleFormSubmit);
    await waitFor(() => expect(result.current.isQueued).toBe(true));

    expect(result.current.getQueuedInfoText()).toContain("next to start");
  });

  it("treats a response without the queue fields as not queued", async () => {
    vi.mocked(ogcAxiosWithRetry.post).mockResolvedValue(executionResponse({}));

    const { result } = renderHook(() => useDownloadDialog(true, vi.fn()), {
      wrapper,
    });

    submitWithEmail(result.current.handleFormSubmit);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.isQueued).toBe(false);
  });

  it("does not mark a rejected request as queued", async () => {
    vi.mocked(ogcAxiosWithRetry.post).mockResolvedValue({
      data: {
        message: { message: "Error while getting dataset" },
        status: { message: "400" },
      },
    });

    const { result } = renderHook(() => useDownloadDialog(true, vi.fn()), {
      wrapper,
    });

    submitWithEmail(result.current.handleFormSubmit);

    await waitFor(() => expect(result.current.processingStatus).toBe("400"));
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.isQueued).toBe(false);
  });
});
