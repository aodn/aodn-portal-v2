/**
 * WFS download checks shared by every place that shows a Download button, so
 * the same collection is checked once until the page is reloaded. The detail
 * page always checks again and its answer replaces the shared one.
 */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { MapFeatureRequest } from "./GeoserverDefinitions";
import { fetchGeoServerDownloadLayers } from "./searchReducer";

type WfsCheck =
  | { status: "checking"; requestId: string }
  | { status: "available" | "unavailable"; requestId?: string };

interface DownloadAvailabilityState {
  // By toWfsCheckKey. Failed checks are not kept, so they are tried again.
  wfsChecks: Record<string, WfsCheck>;
}

// Not RootState, which would import the store and make a cycle
interface DownloadAvailabilityRootState {
  downloadAvailability: DownloadAvailabilityState;
}

const initialState: DownloadAvailabilityState = { wfsChecks: {} };

// Ids are case-sensitive and not always uuids, use them exactly as given.
// The allow list setting defaults to true, as in useDownloadAvailability.
const toWfsCheckKey = (
  id: string,
  enableGeoServerWhiteList: boolean = true
): string => `${enableGeoServerWhiteList}:${id}`;

const keyOf = ({ uuid, enableGeoServerWhiteList }: MapFeatureRequest) =>
  toWfsCheckKey(uuid, enableGeoServerWhiteList);

const downloadAvailabilitySlice = createSlice({
  name: "downloadAvailability",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGeoServerDownloadLayers.pending, (state, action) => {
        const key = keyOf(action.meta.arg);
        // Keep a known answer while it is checked again, e.g. by the detail page
        state.wfsChecks[key] = {
          status: state.wfsChecks[key]?.status ?? "checking",
          requestId: action.meta.requestId,
        };
      })
      .addCase(fetchGeoServerDownloadLayers.fulfilled, (state, action) => {
        const key = keyOf(action.meta.arg);
        const check = state.wfsChecks[key];
        const status = action.payload.length > 0 ? "available" : "unavailable";
        if (check?.requestId === action.meta.requestId) {
          state.wfsChecks[key] = { status };
        } else if (check?.status === "checking") {
          // An older check answered first, use it until the newer one answers
          state.wfsChecks[key] = { status, requestId: check.requestId };
        }
      })
      .addCase(fetchGeoServerDownloadLayers.rejected, (state, action) => {
        const key = keyOf(action.meta.arg);
        const check = state.wfsChecks[key];
        if (check?.requestId !== action.meta.requestId) return;
        if (check.status === "checking") {
          delete state.wfsChecks[key];
        } else {
          delete check.requestId;
        }
      });
  },
});

/**
 * Checks if a collection can be downloaded by WFS, unless it is already
 * checked or being checked. Read the answer with isWfsDownloadable.
 *
 * Never retried or aborted. The answer is kept for every place showing the
 * collection, and a slow GeoServer must not hold the background checks.
 */
const checkWfsDownload = createAsyncThunk<
  void,
  MapFeatureRequest,
  { state: DownloadAvailabilityRootState }
>(
  "downloadAvailability/checkWfsDownload",
  async (request, { dispatch }) => {
    await dispatch(
      fetchGeoServerDownloadLayers({ ...request, skipRetries: true })
    )
      .unwrap()
      // Already logged by the axios interceptor, and not kept
      .catch(() => {});
  },
  {
    condition: (request, { getState }) =>
      !getState().downloadAvailability.wfsChecks[keyOf(request)],
  }
);

const isWfsDownloadable = (
  state: DownloadAvailabilityRootState,
  id: string,
  enableGeoServerWhiteList?: boolean
): boolean =>
  state.downloadAvailability.wfsChecks[
    toWfsCheckKey(id, enableGeoServerWhiteList)
  ]?.status === "available";

export { checkWfsDownload, isWfsDownloadable };

export default downloadAvailabilitySlice.reducer;
