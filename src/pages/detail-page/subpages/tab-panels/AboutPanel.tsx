import React, { useEffect, useMemo, useState } from "react";
import { useDetailPageContext } from "../../context/detail-page-context";
import CollapseList from "../../../../components/list/CollapseList";
import ContactList from "../../../../components/list/ContactList";
import NavigatablePanel from "./NavigatablePanel";
import TextList from "../../../../components/list/TextList";
import {
  IContact,
  ITheme,
} from "../../../../components/common/store/OGCCollectionDefinitions";
import _ from "lodash";

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

  const blocks = useMemo(
    () => [
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
        component: <TextList title="Credits" texts={credits ? credits : []} />,
      },
      {
        title: "Keywords",
        component: <CollapseList items={keywords} title="Keywords" />,
      },
    ],
    [aboutContacts, credits, keywords]
  );

  return <NavigatablePanel childrenList={blocks} isLoading={isLoading} />;
};

export default AboutPanel;
