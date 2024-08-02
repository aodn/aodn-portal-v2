import React, { useEffect, useMemo, useState } from "react";
import { useDetailPageContext } from "../../context/detail-page-context";
import PlainCollapseList from "../../../../components/list/PlainCollapseList";
import ContactList from "../../../../components/list/ContactList";
import NavigatablePanel from "./NavigatablePanel";
import PlainTextList from "../../../../components/list/PlainTextList";
import {
  IContact,
  ITheme,
} from "../../../../components/common/store/OGCCollectionDefinitions";
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
        ?.filter((contact: IContact) => contact.roles.includes("about")),
    [context.collection]
  );
  const themes = useMemo(
    () => context.collection?.getThemes(),
    [context.collection]
  );

  const keywords: { title: string; content: string[] }[] = useMemo(() => {
    const keywordItems: { title: string; content: string[] }[] = [];
    themes?.forEach((theme: ITheme) => {
      keywordItems.push({
        title: theme.title,
        content: theme.concepts.map((concept) => ` \u2022 ${concept.id}`),
      });
    });
    return keywordItems;
  }, [themes]);

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
        component: <PlainCollapseList items={keywords} title="Keywords" />,
      },
      {
        title: "Contacts",
        component: (
          <ContactList
            title="Contacts"
            contacts={aboutContacts ? aboutContacts : []}
          />
        ),
      },
      {
        title: "Credits",
        component: (
          <PlainTextList title="Credits" texts={credits ? credits : []} />
        ),
      },
    ],
    [aboutContacts, credits, keywords]
  );

  return <NavigatablePanel childrenList={blocks} isLoading={isLoading} />;
};

export default AboutPanel;
