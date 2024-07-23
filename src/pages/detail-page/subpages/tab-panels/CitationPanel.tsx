import React, { useEffect, useMemo, useState } from "react";
import { useDetailPageContext } from "../../context/detail-page-context";
import ContactBlock from "../components/ContactBlock";
import NavigatablePanel from "../components/NavigatablePanel";
import PlainTextBlock from "../components/PlainTextBlock";
import PlainCollapseBlock from "../components/PlainCollapseBlock";
import LicenseBlock from "../components/LicenseBlock";

const CitationPanel = () => {
  const context = useDetailPageContext();

  const license = useMemo(
    () => context.collection?.getLicense(),
    [context.collection]
  );

  const citationContacts = useMemo(
    () =>
      context.collection
        ?.getContacts()
        ?.filter((contact) => contact.roles.includes("citation")),
    [context.collection]
  );
  const suggestedCitation = useMemo(
    () => context.collection?.getCitation()?.suggestedCitation,
    [context.collection]
  );
  const otherConstraints = useMemo(
    () => context.collection?.getCitation()?.otherConstraints,
    [context.collection]
  );
  const useLimitations = useMemo(
    () => context.collection?.getCitation()?.useLimitations,
    [context.collection]
  );

  const constraints = useMemo(() => {
    const constraintItems: { title: string; content: string[] }[] = [];
    useLimitations?.forEach((limitation) => {
      constraintItems.push({
        title: "Use Limitation",
        content: [limitation],
      });
    });
    otherConstraints?.forEach((constraint) => {
      if (!constraint) {
        return;
      }
      constraintItems.push({
        title: "Other Constraint",
        content: [constraint],
      });
    });
    return constraintItems;
  }, [otherConstraints, useLimitations]);

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
        component: license ? (
          <LicenseBlock license={license} />
        ) : (
          <div>no license</div>
        ),
      },
      {
        title: "Suggested Citation",
        component: (
          <PlainTextBlock
            title="Suggested Citation"
            texts={suggestedCitation ? [suggestedCitation] : []}
          />
        ),
      },
      {
        title: "Constraints",
        component: (
          <PlainCollapseBlock title="Constraints" items={constraints} />
        ),
      },
    ],
    [citationContacts, constraints, license, suggestedCitation]
  );

  return <NavigatablePanel childrenList={blocks} isLoading={isLoading} />;
};

export default CitationPanel;
