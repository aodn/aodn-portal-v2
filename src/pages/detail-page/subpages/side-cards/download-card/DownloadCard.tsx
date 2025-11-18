import { FC, useMemo } from "react";
import { useDetailPageContext } from "../../../context/detail-page-context";
import DownloadWFSCard from "./components/DownloadWFSCard";
import DownloadCloudOptimisedCard from "./components/DownloadCloudOptimisedCard";
import SideCardContainer from "../SideCardContainer";
import DownloadNotAvailableCard from "./components/DownloadNotAvailableCard";

const DownloadCard: FC = () => {
  const {
    collection,
    downloadConditions,
    getAndSetDownloadConditions,
    removeDownloadCondition,
    selectedWmsLayer,
  } = useDetailPageContext();

  const [wfsLinks, wmsLinks] = useMemo(
    () => [collection?.getWFSLinks(), collection?.getWMSLinks()],
    [collection]
  );

  const getContent = () => {
    if (collection?.hasSummaryFeature()) {
      return (
        <DownloadCloudOptimisedCard
          collection={collection}
          downloadConditions={downloadConditions}
          getAndSetDownloadConditions={getAndSetDownloadConditions}
          removeDownloadCondition={removeDownloadCondition}
        />
      );
    } else if (wfsLinks && wfsLinks.length > 0 && selectedWmsLayer) {
      return (
        <DownloadWFSCard
          WFSLinks={wfsLinks}
          WMSLinks={wmsLinks}
          selectedWmsLayerName={selectedWmsLayer}
          uuid={collection?.id}
          downloadConditions={downloadConditions}
          getAndSetDownloadConditions={getAndSetDownloadConditions}
          removeDownloadCondition={removeDownloadCondition}
        />
      );
    }
    return <DownloadNotAvailableCard />;
  };

  return (
    <SideCardContainer title="Download Service" px={0} py={0}>
      {getContent()}
    </SideCardContainer>
  );
};

export default DownloadCard;
