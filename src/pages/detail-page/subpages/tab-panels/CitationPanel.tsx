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
  const context = useDetailPageContext();
  const goToDetailPage = useTabNavigation();

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
        ?.filter((contact) =>
          contact.roles.includes(detailPageDefault.CITATION)
        ),
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

  const aboutContacts = useMemo(
    () =>
      context.collection
        ?.getContacts()
        ?.filter((contact: IContact) =>
          contact.roles.includes(detailPageDefault.ADDITIONAL_INFO)
        ),
    [context.collection]
  );

  const credits = useMemo(
    () => context.collection?.getCredits(),
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
        title: "Contact of Data Owner",
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

  if (context.collection) {
    const collection = context.collection;
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
