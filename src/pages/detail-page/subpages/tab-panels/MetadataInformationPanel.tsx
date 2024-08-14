import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDetailPageContext } from "../../context/detail-page-context";
import NavigatablePanel from "./NavigatablePanel";
import TextList from "../../../../components/list/TextList";
import { convertDateFormat } from "../../../../utils/DateUtils";
import MetadataUrlList from "../../../../components/list/MetadataUrlList";
import MetadataContactList from "../../../../components/list/MetadataContactList";

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
  const generateMedatataDateText = useCallback(() => {
    let dateText = "";

    const creation = context.collection?.getCreation();
    const revision = context.collection?.getRevision();

    if (creation) {
      dateText = dateText + `Creation: ${convertDateFormat(creation)}`;
    }
    if (revision) {
      if (dateText) {
        dateText += "\n";
      }
      dateText = dateText + `Revision: ${convertDateFormat(revision)}`;
    }
    return dateText;
  }, [context.collection]);

  const dates = useMemo(generateMedatataDateText, [generateMedatataDateText]);

  const metadataLink = useMemo(() => {
    if (context.collection) {
      const links = context.collection.links;
      if (links) {
        const metadataLink = links.find(
          (link) =>
            link.title?.trim().toLowerCase() === "full metadata link" &&
            link.type === "text/html" &&
            link.rel === "self"
        );
        if (metadataLink) {
          return metadataLink.href;
        }
      }
    }
    return "";
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
            title="Metadata Contact"
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
        component: <MetadataUrlList url={metadataLink} />,
      },
      {
        title: "Metadata Dates",
        component: (
          <TextList title="Metadata Dates" texts={dates ? [dates] : [""]} />
        ),
      },
    ],
    [dates, metadataContact, metadataId, metadataLink]
  );
  return <NavigatablePanel childrenList={blocks} isLoading={isLoading} />;
};

export default MetadataInformationPanel;
