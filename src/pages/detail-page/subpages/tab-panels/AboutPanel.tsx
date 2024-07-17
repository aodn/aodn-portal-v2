import React, { useEffect, useMemo, useState } from "react";
import { useDetailPageContext } from "../../context/detail-page-context";
import PlainCollapseBlock from "../components/PlainCollapseBlock";
import ContactBlock from "../components/ContactBlock";
import NavigatablePanel from "../components/NavigatablePanel";
import PlainTextBlock from "../components/PlainTextBlock";
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
        component: <PlainCollapseBlock items={keywords} title="Keywords" />,
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
        component: (
          <PlainTextBlock title="Credits" texts={credits ? credits : []} />
        ),
      },
    ],
    [aboutContacts, credits, keywords]
  );

  return <NavigatablePanel childrenList={blocks} isLoading={isLoading} />;
};

export default AboutPanel;
