import { useEffect, useMemo, useState } from "react";
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
import { IKeyword } from "../../../../components/common/store/OGCCollectionDefinitions";

const AdditionalInfoPanel = () => {
  const context = useDetailPageContext();

  const [
    metadataContact,
    themes,
    statement,
    metadataId,
    creation,
    revision,
    categories,
    metadataUrl,
    keywords,
  ] = useMemo(() => {
    const metadataContact =
      context.collection
        ?.getContacts()
        ?.filter((contact) => contact.roles.includes(contactRoles.METADATA)) ??
      [];

    const themes = context.collection?.getThemes() ?? [];

    const statement = context.collection?.getStatement() ?? "";

    const metadataId = context.collection?.id ?? "";

    const t = context.collection?.getRevision();
    const revision = t ? convertDateFormat(t) : "";

    // TODO: for the creation and revision, geonetwork still have a confusion about the time zone.
    //  currently just make all time zone to be UTC (hard coded).
    //  Should be resolved in the future when the geonetwork is clarified.
    const c = context.collection?.getCreation();
    const creation = c ? convertDateFormat(c) : "";

    let categories: Array<string> = [];
    for (const theme of themes) {
      if (theme.scheme === "Categories") {
        categories = theme.concepts.map((concept) => concept.id);
      }
    }

    const metadataUrl = context.collection?.getMetadataUrl() ?? "";

    let keywords: IKeyword[] = [];
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
      const title = theme.concepts[0].title ?? "";
      const description = theme.concepts[0].description ?? "";
      keywords.push({
        title: title,
        description: description,
        content: theme.concepts
          .filter((concept) => concept.id)
          .map((concept) => ` \u00A0 \u2022 ${concept.id}`),
      });
    });

    keywords = _.sortBy(keywords, (item) => {
      return item.title ? item.title : "\uffff";
    });

    return [
      metadataContact,
      themes,
      statement,
      metadataId,
      creation,
      revision,
      categories,
      metadataUrl,
      keywords,
    ];
  }, [context.collection]);

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
        component: (props: Record<string, any>) => (
          <StatementList {...props} statement={statement} title={"Lineage"} />
        ),
      },
      {
        title: "Themes",
        component: (props: Record<string, any>) => (
          <ThemeList {...props} title={"Themes"} themes={categories} />
        ),
      },
      {
        title: "Keywords",
        component: (props: Record<string, any>) => (
          <KeywordList {...props} keywords={keywords} />
        ),
      },
      {
        title: "Metadata Contact",
        component: (props: Record<string, any>) => (
          <MetadataContactList {...props} contacts={metadataContact} />
        ),
      },
      {
        title: "Metadata Identifier",
        component: (props: Record<string, any>) => (
          <MetadataIdentifierList {...props} identifier={metadataId} />
        ),
      },
      {
        title: "Full Metadata Link",
        component: (props: Record<string, any>) => (
          <MetadataUrlList {...props} url={metadataUrl} />
        ),
      },
      {
        title: "Metadata Dates",
        component: (props: Record<string, any>) => (
          <MetadataDateList
            {...props}
            creation={creation}
            revision={revision}
          />
        ),
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
