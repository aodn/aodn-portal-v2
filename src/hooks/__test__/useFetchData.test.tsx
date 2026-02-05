import { describe, it, expect, vi, beforeEach } from "vitest";
import useFetchData from "../useFetchData";
import { useAppDispatch } from "../../components/common/store/hooks";
import { updateSearchText } from "../../components/common/store/componentParamReducer";
import { renderHook } from "@testing-library/react";
import { Provider } from "react-redux";
import store from "../../components/common/store/store";
import { ReactNode } from "react";
import * as searchReducer from "../../components/common/store/searchReducer";
import {
  fetchResultWithStore,
  fetchResultAppendStore,
  ogcAxiosWithRetry,
} from "../../components/common/store/searchReducer";
import { response1 } from "./data";

// Wrapper to provide Redux store to renderHook
const wrapper = ({ children }: { children: ReactNode }) => (
  <Provider store={store}>{children}</Provider>
);

describe("useFetchData", () => {
  beforeEach(() => {
    vi.spyOn(ogcAxiosWithRetry, "get");
    vi.spyOn(searchReducer, "fetchResultWithStore");
    vi.spyOn(searchReducer, "fetchResultAppendStore");
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should dispatch fetchResultWithStore when restart is true", () => {
    // We do some action before calling the useFetchData() hook
    const { result } = renderHook(
      () => {
        const dispatch = useAppDispatch();
        dispatch(updateSearchText("testing")); // Dispatch real action
        return useFetchData();
      },
      { wrapper }
    );

    result.current.fetchRecord(true);

    // We should expect a call to
    expect(ogcAxiosWithRetry.get).toHaveBeenCalledWith("/ogc/collections", {
      params: {
        filter:
          "page_size=11 AND (BBOX(geometry,104,-43,163,-8) OR geometry IS NULL)",
        properties:
          "id,title,description,status,scope,links,assets_summary,bbox",
        q: "testing",
      },
      signal: expect.any(AbortSignal),
      timeout: 60000,
    });
    expect(fetchResultWithStore).toBeCalledTimes(1);
    expect(fetchResultAppendStore).not.toHaveBeenCalled();
  });
  /*
    This is use to make sure we have appended the correct search_after value in the fetchData call
    where we want to load next batch of data
   */
  it("should dispatch fetchResultAppendStore when restart is false", async () => {
    // We do some action before calling the useFetchData() hook
    const { result } = renderHook(
      () => {
        const dispatch = useAppDispatch();
        dispatch(updateSearchText("testing")); // Dispatch real action
        return useFetchData();
      },
      { wrapper }
    );

    // mock return for first call
    (ogcAxiosWithRetry.get as any).mockImplementation(() =>
      Promise.resolve({ data: response1 })
    );

    await result.current.fetchRecord(true);

    // Now if we fetch more record it should call with something like this
    await result.current.fetchRecord(false);

    expect(ogcAxiosWithRetry.get).toHaveBeenCalledWith("/ogc/collections", {
      params: {
        filter:
          "page_size=11 AND search_after='1.0||88||str:ffe8f19c-de4a-4362-89be-7605b2dd6b8c' AND (BBOX(geometry,104,-43,163,-8) OR geometry IS NULL)",
        properties:
          "id,title,description,status,scope,links,assets_summary,bbox",
        q: "testing",
      },
      signal: expect.any(AbortSignal),
      timeout: 60000,
    });
    // We should expect a call to
    expect(fetchResultWithStore).toBeCalledTimes(1);
    expect(fetchResultAppendStore).toBeCalledTimes(1);
  });
});
