import React, { useEffect, useMemo, useState } from "react";
import { useDetailPageContext } from "../../context/detail-page-context";
import NavigatablePanel from "../components/NavigatablePanel";
import ContactBlock from "../components/ContactBlock";

const MetadataInformationPanel = () => {
  const context = useDetailPageContext();
  const metadataContact = context.collection
    ?.getContacts()
    ?.filter((contact) => contact.roles.includes("metadata"));

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!metadataContact) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [metadataContact]);

  const blocks = useMemo(
    () => [
      {
        title: "Metadata Contact",
        component: (
          <ContactBlock contacts={metadataContact ? metadataContact : []} />
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
        component: <div>metadata dates</div>,
      },
    ],
    [metadataContact]
  );
  return <NavigatablePanel childrenList={blocks} isLoading={isLoading} />;
};

export default MetadataInformationPanel;
