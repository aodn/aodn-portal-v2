import {
  CollectionsQueryType,
  OGCCollection,
} from "../common/store/searchReducer";
import { FixedSizeList, ListChildComponentProps } from "react-window";
import { Grid, ListItem } from "@mui/material";
import GridResultCard from "./GridResultCard";
import { SearchResultLayoutEnum } from "../../pages/search-page/subpages/ResultSection";
import ListResultCard from "./ListResultCard";
import React, { useContext } from "react";
import { SearchResultLayoutContext } from "../../pages/search-page/SearchPage";

interface ResultCardsProps {
  contents: CollectionsQueryType;
  onRemoveLayer:
    | ((
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        stac: OGCCollection
      ) => void)
    | undefined;
  onDownload:
    | ((
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        stac: OGCCollection
      ) => void)
    | undefined;
  onTags:
    | ((
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        stac: OGCCollection
      ) => void)
    | undefined;
  onMore:
    | ((
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        stac: OGCCollection
      ) => void)
    | undefined;
}

const renderCells = (
  props: ResultCardsProps,
  child: ListChildComponentProps
) => {
  const { index, style } = child;

  const leftIndex = index * 2;
  const rightIndex = leftIndex + 1;

  return (
    <ListItem sx={{ pl: 0, pr: 0 }} style={style}>
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <GridResultCard
            content={props.contents.result.collections[leftIndex]}
            onRemoveLayer={props.onRemoveLayer}
            onDownload={props.onDownload}
            data-testid="result-cards-grid"
          />
        </Grid>
        <Grid item xs={6}>
          <GridResultCard
            content={props.contents.result.collections[rightIndex]}
            onRemoveLayer={props.onRemoveLayer}
            onDownload={props.onDownload}
          />
        </Grid>
      </Grid>
    </ListItem>
  );
};

const renderRows = (
  props: ResultCardsProps,
  child: ListChildComponentProps
) => {
  // The style must pass to the listitem else incorrect rendering
  const { index, style } = child;

  return (
    <ListItem sx={{ pl: 0, pr: 0 }} style={style}>
      <ListResultCard
        item={props.contents.result.collections[index].index}
        content={props.contents.result.collections[index]}
        onRemoveLayer={props.onRemoveLayer}
        onDownload={props.onDownload}
        onTags={props.onTags}
        onMore={props.onMore}
      />
    </ListItem>
  );
};
const ResultCards = (props: ResultCardsProps) => {
  const { resultLayout } = useContext(SearchResultLayoutContext);

  if (resultLayout === SearchResultLayoutEnum.LIST) {
    return (
      <FixedSizeList
        height={700}
        width={"100%"}
        itemSize={240}
        itemCount={props.contents.result.collections.length}
        overscanCount={10}
      >
        {(child: ListChildComponentProps) => renderRows(props, child)}
      </FixedSizeList>
    );
  }

  // or else render grid view
  return (
    <FixedSizeList
      height={700}
      width={"100%"}
      itemSize={310}
      itemCount={Math.ceil(props.contents.result.collections.length / 2)}
      overscanCount={10}
    >
      {(child: ListChildComponentProps) => renderCells(props, child)}
    </FixedSizeList>
  );
};

export default ResultCards;
