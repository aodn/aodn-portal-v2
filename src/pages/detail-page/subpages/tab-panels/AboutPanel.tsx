import React, { useEffect, useMemo, useState } from "react";
import { useDetailPageContext } from "../../context/detail-page-context";
import KeywordSection from "../components/KeywordSection";
import CreditSection from "../components/CreditSection";
import ContactSection from "../components/ContactSection";
import NavigatablePanel from "../components/NavigatablePanel";

const AboutPanel = () => {
  const context = useDetailPageContext();
  const credits = context.collection?.getCredits();
  const contacts = context.collection?.getContacts();
  const themes = context.collection?.getThemes();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!credits || !contacts || !themes) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [credits, contacts, themes]);

  const sections = useMemo(
    () => [
      {
        title: "Keywords",
        component: <KeywordSection themes={themes ? themes : []} />,
      },
      {
        title: "Contacts",
        component: <ContactSection contacts={contacts ? contacts : []} />,
      },
      {
        title: "Credits",
        component: <CreditSection credits={credits ? credits : []} />,
      },
    ],
    [contacts, credits, themes]
  );

  return <NavigatablePanel childrenList={sections} isLoading={isLoading} />;
};

export default AboutPanel;
