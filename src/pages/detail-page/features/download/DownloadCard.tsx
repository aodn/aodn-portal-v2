import { FC, useCallback, useEffect, useMemo } from "react";
import { useDetailPageContext } from "@/pages/detail-page/context/detail-page-context";
import DownloadWFSCard from "./DownloadWFSCard";
import DownloadCloudOptimisedCard from "./DownloadCloudOptimisedCard";
import DownloadOriginalNetcdfsCard from "./DownloadOriginalNetcdfsCard";
import SideCardContainer from "../../layout/SideCardContainer";
import { DownloadServiceType } from "../../context/DownloadDefinitions";

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

  const [
    wfsLinks,
    hasCloudOptimisedData,
    hasOriginalNetcdfs,
    isImosOnly,
    isIntegrated,
  ] = useMemo(() => {
    const wfsLinks = collection?.getWFSLinks() || [];
    const hasCloudOptimisedData = collection?.hasCloudOptimisedData() || false;
    const hasOriginalNetcdfs = collection?.hasOriginalNetcdfs() || false;
    const isImosOnly = collection?.isImosOnly() ?? false;
    const isIntegrated = collection?.isIntegrated() ?? false;
    return [
      wfsLinks,
      hasCloudOptimisedData,
      hasOriginalNetcdfs,
      isImosOnly,
      isIntegrated,
    ];
  }, [collection]);

  const onWFSAvailabilityChange = useCallback(
    (isWFSAvailable: boolean) => {
      // Cloud optimised data and original netcdfs come before WFS. If the
      // collection has either, keep it regardless of what WFS told us.
      setDownloadService((type) => {
        if (
          type !== DownloadServiceType.CloudOptimised &&
          type !== DownloadServiceType.OriginalNetcdfs
        ) {
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
    // may change by callback if more info available.
    // Priority: cloud optimised > original netcdfs > WFS
    if (hasCloudOptimisedData) {
      setDownloadService(DownloadServiceType.CloudOptimised);
    } else if (hasOriginalNetcdfs) {
      setDownloadService(DownloadServiceType.OriginalNetcdfs);
    } else if (wfsLinks.length > 0) {
      setDownloadService(DownloadServiceType.WFS);
    } else {
      setDownloadService(DownloadServiceType.Unavailable);
    }
  }, [
    hasCloudOptimisedData,
    hasOriginalNetcdfs,
    setDownloadService,
    wfsLinks.length,
  ]);

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
            isImosOnly={isImosOnly}
            isIntegrated={isIntegrated}
          />
        );
      case DownloadServiceType.OriginalNetcdfs:
        return (
          <DownloadOriginalNetcdfsCard
            collection={collection}
            downloadConditions={downloadConditions}
            getAndSetDownloadConditions={getAndSetDownloadConditions}
            removeDownloadCondition={removeDownloadCondition}
            isImosOnly={isImosOnly}
            isIntegrated={isIntegrated}
          />
        );
      case DownloadServiceType.WFS:
        return (
          <DownloadWFSCard
            uuid={collection?.id}
            collectionTitle={collection?.title}
            downloadConditions={downloadConditions}
            getAndSetDownloadConditions={getAndSetDownloadConditions}
            removeDownloadCondition={removeDownloadCondition}
            onWFSAvailabilityChange={onWFSAvailabilityChange}
            isImosOnly={isImosOnly}
            isIntegrated={isIntegrated}
          />
        );
      // hide download card if no CO, original netcdfs or WFS download
      default:
        return null;
    }
  }, [
    collection,
    downloadConditions,
    downloadService,
    getAndSetDownloadConditions,
    isImosOnly,
    isIntegrated,
    onWFSAvailabilityChange,
    removeDownloadCondition,
    selectedCoKey,
    setSelectedCoKey,
  ]);

  return (
    // Return null when download service is unavailable, removing the card entirely
    downloadService === DownloadServiceType.Unavailable ? null : (
      <SideCardContainer title="Download Service" px={0} py={0}>
        {downloadCard}
      </SideCardContainer>
    )
  );
};

export default DownloadCard;
