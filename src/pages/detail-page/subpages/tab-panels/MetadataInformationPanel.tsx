import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDetailPageContext } from "../../context/detail-page-context";
import NavigatablePanel from "../components/NavigatablePanel";
import ContactBlock from "../components/ContactBlock";
import PlainTextBlock from "../components/PlainTextBlock";
import { convertDateFormat } from "../../../../utils/DateFormatUtils";

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
          <ContactBlock
            title="Metadata Contact"
            contacts={metadataContact ? metadataContact : []}
          />
        ),
      },
      {
        title: "Metadata Identifier",
        component: (
          <PlainTextBlock
            title="Metadata Identifier"
            texts={metadataId ? [metadataId] : []}
          />
        ),
      },
      {
        title: "Full Metadata Link",
        component: <div>full metadata link</div>,
      },
      {
        title: "Metadata Dates",
        component: (
          <PlainTextBlock
            title="Metadata Dates"
            texts={dates ? [dates] : [""]}
          />
        ),
      },
    ],
    [dates, metadataContact, metadataId]
  );
  return <NavigatablePanel childrenList={blocks} isLoading={isLoading} />;
};

export default MetadataInformationPanel;
