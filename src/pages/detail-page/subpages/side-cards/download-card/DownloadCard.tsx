import { FC, useCallback, useEffect, useMemo } from "react";
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
    downloadService,
    setDownloadService,
    selectedCoKey,
    setSelectedCoKey,
  } = useDetailPageContext();

  const [wfsLinks, hasSummaryFeature] = useMemo(() => {
    const wfsLinks = collection?.getWFSLinks() || [];
    const hasSummaryFeature = collection?.hasSummaryFeature() || false;
    return [wfsLinks, hasSummaryFeature];
  }, [collection]);

  const onWFSAvailabilityChange = useCallback(
    (isWFSAvailable: boolean) => {
      // Strong preference on cloud optimized data, if collection have it
      // then always use it regardless of what WFS told us.
      setDownloadService((type) => {
        if (type !== DownloadServiceType.CloudOptimised) {
          return isWFSAvailable
            ? DownloadServiceType.WFS
            : DownloadServiceType.Unavailable;
        } else {
          return type;
        }
      });
    },
    [setDownloadService]
  );

  useEffect(() => {
    // Set the type of download based on simple  in collection, the value
    // may change by callback if more info available
    if (hasSummaryFeature) {
      setDownloadService(DownloadServiceType.CloudOptimised);
    } else if (wfsLinks.length > 0) {
      setDownloadService(DownloadServiceType.WFS);
    } else {
      setDownloadService(DownloadServiceType.Unavailable);
    }
  }, [hasSummaryFeature, setDownloadService, wfsLinks.length]);

  const downloadCard = useMemo(() => {
    if (!collection) return null;
    switch (downloadService) {
      case DownloadServiceType.CloudOptimised:
        return (
          <DownloadCloudOptimisedCard
            collection={collection}
            selectedCoKey={selectedCoKey}
            setSelectedCoKey={setSelectedCoKey}
            downloadConditions={downloadConditions}
            getAndSetDownloadConditions={getAndSetDownloadConditions}
            removeDownloadCondition={removeDownloadCondition}
          />
        );
      case DownloadServiceType.WFS:
        return (
          <DownloadWFSCard
            uuid={collection?.id}
            downloadConditions={downloadConditions}
            getAndSetDownloadConditions={getAndSetDownloadConditions}
            removeDownloadCondition={removeDownloadCondition}
            onWFSAvailabilityChange={onWFSAvailabilityChange}
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
    onWFSAvailabilityChange,
    removeDownloadCondition,
    selectedCoKey,
    setSelectedCoKey,
  ]);

  return (
    <SideCardContainer title="Download Service" px={0} py={0}>
      {downloadCard}
    </SideCardContainer>
  );
};

export default DownloadCard;
