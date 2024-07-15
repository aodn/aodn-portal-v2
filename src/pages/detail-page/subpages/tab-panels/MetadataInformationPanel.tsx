import React, { useEffect, useMemo, useState } from "react";
import { useDetailPageContext } from "../../context/detail-page-context";
import NavigatablePanel from "../components/NavigatablePanel";
import ContactBlock from "../components/ContactBlock";
import PlainTextBlock from "../components/PlainTextBlock";
import { convertDateFormat } from "../../../../utils/DateFormatUtils";

const MetadataInformationPanel = () => {
  const context = useDetailPageContext();
  const metadataContact = useMemo(
    () =>
      context.collection
        ?.getContacts()
        ?.filter((contact) => contact.roles.includes("metadata")),
    [context.collection]
  );
  const generateMedatataDateText = () => {
    let dateText = "";
    const temporals = context.collection?.getTemporal();
    if (!temporals) {
      return "";
    }
    const temporal = temporals[0];

    if (temporal.creation) {
      dateText = dateText + `Creation: ${convertDateFormat(temporal.creation)}`;
    }
    if (temporal.revision) {
      if (dateText) {
        dateText += "\n";
      }
      dateText = dateText + `Revision: ${convertDateFormat(temporal.revision)}`;
    }
    return dateText;
  };

  const dates = useMemo(generateMedatataDateText, [context.collection]);

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
        component: <div>metadata identifier</div>,
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
    [dates, metadataContact]
  );
  return <NavigatablePanel childrenList={blocks} isLoading={isLoading} />;
};

export default MetadataInformationPanel;
