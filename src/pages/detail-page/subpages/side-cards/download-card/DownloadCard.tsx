import { FC, useMemo } from "react";
import { useDetailPageContext } from "../../../context/detail-page-context";
import DownloadWFSCard from "./components/DownloadWFSCard";
import DownloadCloudOptimisedCard from "./components/DownloadCloudOptimisedCard";
import SideCardContainer from "../SideCardContainer";
import DownloadNotAvailableCard from "./components/DownloadNotAvailableCard";
import { DownloadServiceType } from "../../../context/DownloadDefinitions";

const DownloadCard: FC = () => {
  const {
    collection,
    downloadConditions,
    getAndSetDownloadConditions,
    removeDownloadCondition,
    selectedWmsLayer,
    downloadService,
  } = useDetailPageContext();

  const [wfsLinks, wmsLinks] = useMemo(() => {
    const wfsLinks = collection?.getWFSLinks() || [];
    const wmsLinks = collection?.getWMSLinks() || [];
    return [wfsLinks, wmsLinks, hasSummaryFeature];
  }, [collection]);

  const downloadCard = useMemo(() => {
    if (!collection) return null;
    switch (downloadService) {
      case DownloadServiceType.CloudOptimised:
        return (
          <DownloadCloudOptimisedCard
            collection={collection}
            downloadConditions={downloadConditions}
            getAndSetDownloadConditions={getAndSetDownloadConditions}
            removeDownloadCondition={removeDownloadCondition}
          />
        );
      case DownloadServiceType.WFS:
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
      case DownloadServiceType.Unavailable:
      default:
        return <DownloadNotAvailableCard />;
    }
  }, [
    collection,
    downloadConditions,
    downloadService,
    getAndSetDownloadConditions,
    removeDownloadCondition,
    selectedWmsLayer,
    wfsLinks,
    wmsLinks,
  ]);

  return (
    <SideCardContainer title="Download Service" px={0} py={0}>
      {downloadCard}
    </SideCardContainer>
  );
};

export default DownloadCard;
