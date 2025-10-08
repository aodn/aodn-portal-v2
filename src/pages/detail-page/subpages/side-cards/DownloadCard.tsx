import { useDetailPageContext } from "../../context/detail-page-context";
import {
  DownloadConditionType,
  IDownloadCondition,
} from "../../context/DownloadDefinitions";
import { ILink } from "../../../../components/common/store/OGCCollectionDefinitions";
import DownloadWFSCard from "./DownloadWFSCard";
import DownloadCloudOptimisedCard from "./DownloadCloudOptimisedCard";
import DownloadNOtAvailableCard from "./DownloadNOtAvailableCard";
import SideCardContainer from "./SideCardContainer";

export type DownloadCondition = {
  downloadConditions: IDownloadCondition[];
  getAndSetDownloadConditions: (
    type: DownloadConditionType,
    conditions: IDownloadCondition[]
  ) => IDownloadCondition[];
};

const DownloadCard = () => {
  const { collection, downloadConditions, getAndSetDownloadConditions } =
    useDetailPageContext();

  const WFSLinks: ILink[] | undefined = collection?.getWFSLinks();
  const WMSLinks: ILink[] | undefined = collection?.getWMSLinks();

  const getContent = () => {
    if (collection?.hasSummaryFeature()) {
      return (
        <DownloadCloudOptimisedCard
          collection={collection}
          downloadConditions={downloadConditions}
          getAndSetDownloadConditions={getAndSetDownloadConditions}
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
          uuid={collection?.id}
          downloadConditions={downloadConditions}
          getAndSetDownloadConditions={getAndSetDownloadConditions}
        />
      );
    }
    return <DownloadNOtAvailableCard />;
  };

  return (
    <SideCardContainer title="Download Service" px={0} py={0}>
      {getContent()}
    </SideCardContainer>
  );
};

export default DownloadCard;
