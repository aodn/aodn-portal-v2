import React, { useEffect, useMemo, useState } from "react";
import { useDetailPageContext } from "../../context/detail-page-context";
import KeywordBlock from "../components/KeywordBlock";
import ContactBlock from "../components/ContactBlock";
import NavigatablePanel from "../components/NavigatablePanel";
import CreditBlock from "../components/CreditBlock";

const AboutPanel = () => {
  const context = useDetailPageContext();
  const credits = context.collection?.getCredits();
  const aboutContacts = context.collection
    ?.getContacts()
    ?.filter((contact) => contact.roles.includes("about"));
  const themes = context.collection?.getThemes();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!credits || !aboutContacts || !themes) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [credits, aboutContacts, themes]);

  const blocks = useMemo(
    () => [
      {
        title: "Keywords",
        component: <KeywordBlock themes={themes ? themes : []} />,
      },
      {
        title: "Contacts",
        component: (
          <ContactBlock
            title="Contacts"
            contacts={aboutContacts ? aboutContacts : []}
          />
        ),
      },
      {
        title: "Credits",
        component: <CreditBlock credits={credits ? credits : []} />,
      },
    ],
    [aboutContacts, credits, themes]
  );

  return <NavigatablePanel childrenList={blocks} isLoading={isLoading} />;
};

export default AboutPanel;
