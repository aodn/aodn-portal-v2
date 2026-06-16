import { useCallback } from "react";
import { processWFSEstimateSize } from "../components/common/store/searchReducer";
import { IDownloadCondition } from "../pages/detail-page/context/DownloadDefinitions";
import useEstimateSize, { EstimateStatus } from "./useEstimateSize";

const useWFSEstimateSize = () => {
  const { estimateSize: estimate, ...rest } = useEstimateSize(
    processWFSEstimateSize
  );

  const estimateSize = useCallback(
    async (
      uuid: string,
      layerName: string,
      downloadConditions: IDownloadCondition[]
    ) => {
      if (!uuid || !layerName) return;
      await estimate({ uuid, layerName, downloadConditions });
    },
    [estimate]
  );

  return { ...rest, estimateSize };
};

export default useWFSEstimateSize;
export { EstimateStatus };
