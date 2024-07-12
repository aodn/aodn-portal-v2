import React, { useEffect, useMemo, useState } from "react";
import { useDetailPageContext } from "../../context/detail-page-context";
import ContactBlock from "../components/ContactBlock";
import NavigatablePanel from "../components/NavigatablePanel";

const CitationPanel = () => {
  const context = useDetailPageContext();
  const citationContacts = useMemo(
    () =>
      context.collection
        ?.getContacts()
        ?.filter((contact) => contact.roles.includes("citation")),
    [context.collection]
  );

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
        title: "Cited Responsible Parties",
        component: (
          <ContactBlock
            title="Cited Responsible Parties"
            contacts={citationContacts ? citationContacts : []}
          />
        ),
      },
      {
        title: "License",
        component: <div>License</div>,
      },
      {
        title: "Suggested Citation",
        component: <div>Suggested Citation</div>,
      },
      {
        title: "Constraints",
        component: <div>Constraints</div>,
      },
    ],
    [citationContacts]
  );

  return <NavigatablePanel childrenList={blocks} isLoading={isLoading} />;
};

export default CitationPanel;
