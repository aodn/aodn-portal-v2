import React, { FC, useEffect, useMemo, useState } from "react";
import { useDetailPageContext } from "../../context/detail-page-context";
import NavigatablePanel, { NavigatablePanelChild } from "./NavigatablePanel";
import LicenseList from "../../../../components/list/LicenseList";
import {
  IContact,
  MediaType,
  RelationType,
} from "../../../../components/common/store/OGCCollectionDefinitions";
import SuggestedCitationList from "../../../../components/list/SuggestedCitationList";
import CitedResponsiblePartyList from "../../../../components/list/CitedResponsiblePartyList";
import ConstraintList from "../../../../components/list/ConstraintList";
import {
  detailPageDefault,
  contactRoles,
  pageReferer,
} from "../../../../components/common/constants";
import { MODE } from "../../../../components/list/CommonDef";
import SideCardContainer from "../side-cards/SideCardContainer";
import useTabNavigation from "../../../../hooks/useTabNavigation";
import CreditList from "../../../../components/list/CreditList";
import ContactList from "../../../../components/list/ContactList";

interface CitationPanelProps {
  mode?: MODE;
}

const TITLE_LICENSE = "License";
const TITLE_SUGGESTED_CITATION = "Suggested Citation";

const CitationPanel: FC<CitationPanelProps> = ({ mode = MODE.NORMAL }) => {
  const { collection } = useDetailPageContext();
  const goToDetailPage = useTabNavigation();

  const [
    license,
    licenseUrl,
    licenseGraphic,
    citationContacts,
    suggestedCitation,
    constraints,
    aboutContacts,
    credits,
  ] = useMemo(() => {
    const license = collection?.getLicense();

    const licenseUrl = collection?.links?.find((link) => {
      return (
        link.rel === RelationType.LICENSE && link.type === MediaType.TEXT_HTML
      );
    })?.href;

    const licenseGraphic = collection?.links?.find((link) => {
      return (
        link.rel === RelationType.LICENSE && link.type === MediaType.IMAGE_PNG
      );
    })?.href;

    const citationContacts = collection
      ?.getContacts()
      ?.filter((contact) => contact.roles.includes(contactRoles.CITATION));

    const suggestedCitation = collection?.getCitation()?.suggestedCitation;

    const otherConstraints = collection
      ?.getCitation()
      ?.otherConstraints?.filter(
        // Some organizations put license in "other constraints".
        // So if a constraint is considered as license by es-indexer,
        // we should not show it in "other constraints".
        (cons) => cons.toLowerCase().trim() !== license?.toLowerCase().trim()
      );

    const useLimitations = collection?.getCitation()?.useLimitations;

    const constraints: { title: string; content: string[] }[] = [];
    useLimitations?.forEach((limitation) => {
      constraints.push({
        title: "Use Limitation",
        content: [limitation],
      });
    });
    otherConstraints?.forEach((constraint) => {
      if (!constraint) {
        return;
      }
      constraints.push({
        title: "Other Constraint",
        content: [constraint],
      });
    });

    const aboutContacts = collection
      ?.getContacts()
      ?.filter((contact: IContact) =>
        contact.roles.includes(contactRoles.ABOUT)
      );

    const credits = collection?.getCredits();

    return [
      license,
      licenseUrl,
      licenseGraphic,
      citationContacts,
      suggestedCitation,
      constraints,
      aboutContacts,
      credits,
    ];
  }, [collection]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!collection) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [collection]);

  const blocks: NavigatablePanelChild[] = useMemo(
    () => [
      {
        title: TITLE_SUGGESTED_CITATION,
        component: (
          <SuggestedCitationList suggestedCitation={suggestedCitation ?? ""} />
        ),
      },
      {
        title: "Cited Responsible Parties",
        component: (
          <CitedResponsiblePartyList
            responsibleParties={citationContacts ? citationContacts : []}
          />
        ),
      },
      {
        title: TITLE_LICENSE,
        component: (
          <LicenseList
            license={license ? license : ""}
            url={licenseUrl ? licenseUrl : ""}
            graphic={licenseGraphic ? licenseGraphic : ""}
          />
        ),
      },
      {
        title: "Constraints",
        component: <ConstraintList constraints={constraints} />,
      },
      {
        title: "Data Contact",
        component: (
          <ContactList contacts={aboutContacts ? aboutContacts : []} />
        ),
      },
      {
        title: "Credits",
        component: <CreditList credits={credits ? credits : []} />,
      },
    ],
    [
      citationContacts,
      constraints,
      license,
      licenseGraphic,
      licenseUrl,
      suggestedCitation,
      aboutContacts,
      credits,
    ]
  );

  if (collection) {
    switch (mode) {
      case MODE.COMPACT:
        return (
          <SideCardContainer
            title={TITLE_LICENSE}
            onClick={() =>
              goToDetailPage(
                collection.id,
                detailPageDefault.CITATION,
                pageReferer.DETAIL_PAGE_REFERER
              )
            }
          >
            <SuggestedCitationList
              suggestedCitation={suggestedCitation ?? ""}
              mode={mode}
            />
            <LicenseList
              license={license ? license : ""}
              url={licenseUrl ? licenseUrl : ""}
              graphic={licenseGraphic ? licenseGraphic : ""}
              mode={mode}
            />
          </SideCardContainer>
        );

      case MODE.NORMAL:
      default:
        return <NavigatablePanel childrenList={blocks} isLoading={isLoading} />;
    }
  }
};

export default CitationPanel;
