import { useCallback } from "react";
import { processCoEstimateSize } from "../components/common/store/searchReducer";
import { IDownloadCondition } from "../pages/detail-page/context/DownloadDefinitions";
import useEstimateSize, { EstimateStatus } from "./useEstimateSize";

// The CO `estimate-complete` payload reports the size of the actual download
// output in `estimated_output_bytes` (vs `estimated_uncompressed_bytes`)
const getCoEstimatedBytes = (data: {
  estimated_output_bytes?: number;
}): number | undefined => data.estimated_output_bytes;

const useCoEstimateSize = () => {
  const { estimateSize: estimate, ...rest } = useEstimateSize(
    processCoEstimateSize,
    getCoEstimatedBytes
  );

  const estimateSize = useCallback(
    async (uuid: string, downloadConditions: IDownloadCondition[]) => {
      if (!uuid) return;
      await estimate({ uuid, downloadConditions });
    },
    [estimate]
  );

  return { ...rest, estimateSize };
};

export default useCoEstimateSize;
export { EstimateStatus };
