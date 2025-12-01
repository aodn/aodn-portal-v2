import { FC, useEffect, useMemo } from "react";
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
    setDownloadService,
  } = useDetailPageContext();

  const [wfsLinks, wmsLinks, hasSummaryFeature] = useMemo(() => {
    const wfsLinks = collection?.getWFSLinks() || [];
    const wmsLinks = collection?.getWMSLinks() || [];
    const hasSummaryFeature = collection?.hasSummaryFeature() || false;
    return [wfsLinks, wmsLinks, hasSummaryFeature];
  }, [collection]);

  useEffect(() => {
    if (collection) {
      if (hasSummaryFeature) {
        setDownloadService(DownloadServiceType.CloudOptimised);
      } else if (wfsLinks.length > 0 && selectedWmsLayer) {
        setDownloadService(DownloadServiceType.WFS);
      } else {
        setDownloadService(DownloadServiceType.Unavailable);
      }
    }
  }, [
    collection,
    hasSummaryFeature,
    selectedWmsLayer,
    setDownloadService,
    wfsLinks,
  ]);

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
