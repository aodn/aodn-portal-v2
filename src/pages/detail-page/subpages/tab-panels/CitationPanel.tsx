import { FC, useEffect, useMemo, useState } from "react";
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
import { checkEmptyArray } from "../../../../utils/Helpers";

interface CitationPanelProps {
  mode?: MODE;
}

const TITLE_LICENSE = "License";
const TITLE_SUGGESTED_CITATION = "Suggested Citation";

const CitationPanel: FC<CitationPanelProps> = ({ mode = MODE.NORMAL }) => {
  const { collection, copyToClipboard, checkIsCopied } = useDetailPageContext();
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
    const license = collection?.getLicense() ?? "";

    const licenseUrl =
      collection?.links?.find((link) => {
        return (
          link.rel === RelationType.LICENSE && link.type === MediaType.TEXT_HTML
        );
      })?.href ?? "";

    const licenseGraphic =
      collection?.links?.find((link) => {
        return (
          link.rel === RelationType.LICENSE && link.type === MediaType.IMAGE_PNG
        );
      })?.href ?? "";

    const citationContacts =
      collection
        ?.getContacts()
        ?.filter((contact) => contact.roles.includes(contactRoles.CITATION)) ??
      [];

    const suggestedCitation =
      collection?.getCitation()?.suggestedCitation ?? "";

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

    const aboutContacts =
      collection
        ?.getContacts()
        ?.filter((contact: IContact) =>
          contact.roles.includes(contactRoles.ABOUT)
        ) ?? [];

    let credits: string[] = [];
    const crd = collection?.getCredits();
    if (crd && checkEmptyArray(crd)) {
      credits = crd;
    }

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
        component: (props: Record<string, any>) => (
          <SuggestedCitationList
            {...props}
            suggestedCitation={suggestedCitation ?? ""}
            copyButtonConfig={{ copyToClipboard, checkIsCopied }}
          />
        ),
      },
      {
        title: "Cited Responsible Parties",
        component: (props: Record<string, any>) => (
          <CitedResponsiblePartyList
            {...props}
            responsibleParties={citationContacts}
          />
        ),
      },
      {
        title: TITLE_LICENSE,
        component: (props: Record<string, any>) => (
          <LicenseList
            {...props}
            license={license}
            url={licenseUrl}
            graphic={licenseGraphic}
          />
        ),
      },
      {
        title: "Constraints",
        component: (props: Record<string, any>) => (
          <ConstraintList {...props} constraints={constraints} />
        ),
      },
      {
        title: "Data Contact",
        component: (props: Record<string, any>) => (
          <ContactList {...props} contacts={aboutContacts} />
        ),
      },
      {
        title: "Credits",
        component: (props: Record<string, any>) => (
          <CreditList {...props} credits={credits} />
        ),
      },
    ],
    [
      suggestedCitation,
      copyToClipboard,
      checkIsCopied,
      citationContacts,
      license,
      licenseUrl,
      licenseGraphic,
      constraints,
      aboutContacts,
      credits,
    ]
  );

  if (collection) {
    switch (mode) {
      case MODE.COMPACT:
        return (
          <SideCardContainer
            title={"Citation"}
            onClick={() =>
              goToDetailPage(
                collection.id,
                detailPageDefault.CITATION,
                pageReferer.DETAIL_PAGE_REFERER
              )
            }
            py={"16px"}
          >
            <SuggestedCitationList
              suggestedCitation={suggestedCitation ?? ""}
              mode={mode}
              copyButtonConfig={{ copyToClipboard, checkIsCopied }}
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
