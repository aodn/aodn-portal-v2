import React, { useEffect, useMemo, useState } from "react";
import { useDetailPageContext } from "../../context/detail-page-context";
import NavigatablePanel, { NavigatablePanelChild } from "./NavigatablePanel";
import _ from "lodash";
import KeywordList from "../../../../components/list/KeywordList";
import StatementList from "../../../../components/list/StatementList";
import ThemeList from "../../../../components/list/ThemeList";
import MetadataContactList from "../../../../components/list/MetadataContactList";
import MetadataIdentifierList from "../../../../components/list/MetadataIdentifierList";
import MetadataUrlList from "../../../../components/list/MetadataUrlList";
import MetadataDateList from "../../../../components/list/MetadataDateList";
import { convertDateFormat } from "../../../../utils/DateUtils";
import { contactRoles } from "../../../../components/common/constants";

const AdditionalInfoPanel = () => {
  const context = useDetailPageContext();

  const metadataContact = useMemo(
    () =>
      context.collection
        ?.getContacts()
        ?.filter((contact) => contact.roles.includes(contactRoles.METADATA)),
    [context.collection]
  );

  const themes = useMemo(
    () => context.collection?.getThemes(),
    [context.collection]
  );

  const statement = useMemo(
    () => context.collection?.getStatement(),
    [context.collection]
  );
  // TODO: for the creation and revision, geonetwork still have a confusion about the time zone.
  //  currently just make all time zone to be UTC (hard coded).
  //  Should be resolved in the future when the geonetwork is clarified.
  const creation = useMemo(() => {
    const creation = context.collection?.getCreation();
    if (creation) {
      return convertDateFormat(creation);
    }
    return "";
  }, [context.collection]);

  const metadataId = useMemo(
    () => context.collection?.id,
    [context.collection?.id]
  );

  const revision = useMemo(() => {
    const revision = context.collection?.getRevision();
    if (revision) {
      return convertDateFormat(revision);
    }
    return "";
  }, [context.collection]);

  const metadataUrl = useMemo(() => {
    if (context.collection) {
      const metadataLink = context.collection.getMetadataUrl();
      if (metadataLink) {
        return metadataLink;
      }
      return "";
    }
  }, [context.collection]);

  const keywords: { title: string; content: string[] }[] = useMemo(() => {
    // getting keywords from themes
    const keywordItems: { title: string; content: string[] }[] = [];
    themes?.forEach((theme) => {
      // if no concepts, it is not considered as a keyword
      if (!theme.concepts || theme.concepts.length === 0) {
        return;
      }

      // if scheme is "categories", it is not a keyword
      if (theme.scheme === "Categories") {
        return;
      }

      // According to current implementation, concepts belong to one theme
      // share the same title & description. The reason that making every concept
      // has the same title is to obey the STAC collection standard (theme extension).
      const title = theme.concepts?.[0].title;
      keywordItems.push({
        title: title,
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

  const categories = useMemo(() => {
    for (const theme of themes ?? []) {
      if (theme.scheme === "Categories") {
        return theme.concepts.map((concept) => concept.id);
      }
    }
    return [];
  }, [themes]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!metadataContact || !themes) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [metadataContact, themes]);

  const blocks: NavigatablePanelChild[] = useMemo(
    () => [
      {
        title: "Lineage",
        component: (
          <StatementList statement={statement ?? ""} title={"Lineage"} />
        ),
      },
      {
        title: "Themes",
        component: <ThemeList title={"Themes"} themes={categories ?? []} />,
      },
      {
        title: "Keywords",
        component: <KeywordList keywords={keywords} />,
      },
      {
        title: "Metadata Contact",
        component: (
          <MetadataContactList
            contacts={metadataContact ? metadataContact : []}
          />
        ),
      },
      {
        title: "Metadata Identifier",
        component: <MetadataIdentifierList identifier={metadataId ?? ""} />,
      },
      {
        title: "Full Metadata Link",
        component: <MetadataUrlList url={metadataUrl ? metadataUrl : ""} />,
      },
      {
        title: "Metadata Dates",
        component: <MetadataDateList creation={creation} revision={revision} />,
      },
    ],
    [
      statement,
      categories,
      keywords,
      metadataContact,
      metadataId,
      metadataUrl,
      creation,
      revision,
    ]
  );

  return <NavigatablePanel childrenList={blocks} isLoading={isLoading} />;
};

export default AdditionalInfoPanel;
