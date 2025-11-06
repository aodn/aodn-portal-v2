import { FC } from "react";
import { useDetailPageContext } from "../../../context/detail-page-context";
import { ILink } from "../../../../../components/common/store/OGCCollectionDefinitions";
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

  const WFSLinks: ILink[] | undefined = collection?.getWFSLinks();
  const WMSLinks: ILink[] | undefined = collection?.getWMSLinks();

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
    }
    if (
      (WFSLinks && WFSLinks.length > 0) ||
      (WMSLinks && WMSLinks.length > 0)
    ) {
      return (
        <DownloadWFSCard
          WFSLinks={WFSLinks}
          WMSLinks={WMSLinks}
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
