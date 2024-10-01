import React, { useEffect, useMemo, useState } from "react";
import { useDetailPageContext } from "../../context/detail-page-context";
import NavigatablePanel from "./NavigatablePanel";
import LicenseList from "../../../../components/list/LicenseList";
import {
  MediaType,
  RelationType,
} from "../../../../components/common/store/OGCCollectionDefinitions";
import SuggestedCitationList from "../../../../components/list/SuggestedCitationList";
import CitedResponsiblePartyList from "../../../../components/list/CitedResponsiblePartyList";
import ConstraintList from "../../../../components/list/ConstraintList";

const CitationPanel = () => {
  const context = useDetailPageContext();

  const license = useMemo(
    () => context.collection?.getLicense(),
    [context.collection]
  );

  const licenseUrl = useMemo(() => {
    return context.collection?.links?.find((link) => {
      return (
        link.rel === RelationType.LICENSE && link.type === MediaType.TEXT_HTML
      );
    })?.href;
  }, [context.collection?.links]);

  const licenseGraphic = useMemo(() => {
    return context.collection?.links?.find((link) => {
      return (
        link.rel === RelationType.LICENSE && link.type === MediaType.IMAGE_PNG
      );
    })?.href;
  }, [context.collection?.links]);

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
    () =>
      context.collection?.getCitation()?.otherConstraints?.filter(
        // Some organizations put license in "other constraints".
        // So if a constraint is considered as license by es-indexer,
        // we should not show it in "other constraints".
        (cons) => cons.toLowerCase().trim() !== license?.toLowerCase().trim()
      ),
    [context.collection, license]
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
          <CitedResponsiblePartyList
            responsibleParties={citationContacts ? citationContacts : []}
          />
        ),
      },
      {
        title: "License",
        component: (
          <LicenseList
            license={license ? license : ""}
            url={licenseUrl ? licenseUrl : ""}
            graphic={licenseGraphic ? licenseGraphic : ""}
          />
        ),
      },
      {
        title: "Suggested Citation",
        component: (
          <SuggestedCitationList suggestedCitation={suggestedCitation ?? ""} />
        ),
      },
      {
        title: "Constraints",
        component: <ConstraintList constraints={constraints} />,
      },
    ],
    [
      citationContacts,
      constraints,
      license,
      licenseGraphic,
      licenseUrl,
      suggestedCitation,
    ]
  );

  return <NavigatablePanel childrenList={blocks} isLoading={isLoading} />;
};

export default CitationPanel;
