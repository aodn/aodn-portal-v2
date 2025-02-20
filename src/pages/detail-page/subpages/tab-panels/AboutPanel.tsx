import React, { useEffect, useMemo, useState } from "react";
import { useDetailPageContext } from "../../context/detail-page-context";
import ContactList from "../../../../components/list/ContactList";
import NavigatablePanel, { NavigatablePanelChild } from "./NavigatablePanel";
import {
  IContact,
  ITheme,
} from "../../../../components/common/store/OGCCollectionDefinitions";
import _ from "lodash";
import CreditList from "../../../../components/list/CreditList";
import KeywordList from "../../../../components/list/KeywordList";
import { detailPageDefault } from "../../../../components/common/constants";

const AboutPanel = () => {
  const context = useDetailPageContext();
  const credits = useMemo(
    () => context.collection?.getCredits(),
    [context.collection]
  );
  const aboutContacts = useMemo(
    () =>
      context.collection
        ?.getContacts()
        ?.filter((contact: IContact) =>
          contact.roles.includes(detailPageDefault.ABOUT)
        ),
    [context.collection]
  );
  const themes = useMemo(
    () => context.collection?.getThemes(),
    [context.collection]
  );

  const keywords: { title: string; content: string[] }[] = useMemo(() => {
    // getting keywords from themes
    const keywordItems: { title: string; content: string[] }[] = [];
    themes?.forEach((theme: ITheme) => {
      keywordItems.push({
        title: theme.title,
        content: theme.concepts.map(
          (concept) => ` \u00A0 \u2022 ${concept.id}`
        ),
      });
    });

    // reorder them according to the title alphabetically
    return _.sortBy(keywordItems, (item) => {
      return item.title ? item.title : "\uffff";
    });
  }, [themes]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!credits || !aboutContacts || !themes) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [credits, aboutContacts, themes]);

  const blocks: NavigatablePanelChild[] = useMemo(
    () => [
      {
        title: "Contacts",
        component: (
          <ContactList contacts={aboutContacts ? aboutContacts : []} />
        ),
      },
      {
        title: "Credits",
        component: <CreditList credits={credits ? credits : []} />,
      },
      {
        title: "Keywords",
        component: <KeywordList keywords={keywords} />,
      },
    ],
    [aboutContacts, credits, keywords]
  );

  return <NavigatablePanel childrenList={blocks} isLoading={isLoading} />;
};

export default AboutPanel;
