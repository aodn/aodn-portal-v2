import React, { useEffect, useMemo, useState } from "react";
import { useDetailPageContext } from "../../context/detail-page-context";
import NavigatablePanel from "./NavigatablePanel";
import TextList from "../../../../components/list/TextList";
import { convertDateFormat } from "../../../../utils/DateUtils";
import MetadataUrlList from "../../../../components/list/MetadataUrlList";
import MetadataContactList from "../../../../components/list/MetadataContactList";
import MetadataDateList from "../../../../components/list/MetadataDateList";

const MetadataInformationPanel = () => {
  const context = useDetailPageContext();
  const metadataId = useMemo(
    () => context.collection?.id,
    [context.collection?.id]
  );
  const metadataContact = useMemo(
    () =>
      context.collection
        ?.getContacts()
        ?.filter((contact) => contact.roles.includes("metadata")),
    [context.collection]
  );
  const creation = useMemo(() => {
    const creation = context.collection?.getCreation();
    if (creation) {
      return convertDateFormat(creation);
    }
    return "";
  }, [context.collection]);

  const revision = useMemo(() => {
    const revision = context.collection?.getRevision();
    if (revision) {
      return convertDateFormat(revision);
    }
    return "";
  }, [context.collection]);

  const metadataUrl = useMemo(() => {
    if (context.collection) {
      const metadataLink = context.collection.getMetadataUrl();
      if (metadataLink) {
        return metadataLink;
      }
      return "";
    }
  }, [context.collection]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!context.collection) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [context.collection]);

  const blocks = useMemo(
    () => [
      {
        title: "Metadata Contact",
        component: (
          <MetadataContactList
            contacts={metadataContact ? metadataContact : []}
          />
        ),
      },
      {
        title: "Metadata Identifier",
        component: (
          <TextList
            title="Metadata Identifier"
            texts={metadataId ? [metadataId] : []}
          />
        ),
      },
      {
        title: "Full Metadata Link",
        component: <MetadataUrlList url={metadataUrl ? metadataUrl : ""} />,
      },
      {
        title: "Metadata Dates",
        component: <MetadataDateList creation={creation} revision={revision} />,
      },
    ],
    [creation, metadataContact, metadataId, metadataUrl, revision]
  );
  return <NavigatablePanel childrenList={blocks} isLoading={isLoading} />;
};

export default MetadataInformationPanel;
