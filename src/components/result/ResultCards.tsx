import {
  CollectionsQueryType,
  OGCCollection,
} from "../common/store/searchReducer";
import { FixedSizeList, ListChildComponentProps } from "react-window";
import { Grid, ListItem } from "@mui/material";
import GridResultCard from "./GridResultCard";
import { SearchResultLayoutEnum } from "../subpage/SearchPageResultList";
import ListResultCard from "./ListResultCard";

interface ResultCardsProps {
  contents: CollectionsQueryType;
  layout: SearchResultLayoutEnum;
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

const renderGrid = (
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

// This function is use to control which item to render in the long list
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
  if (props.layout === SearchResultLayoutEnum.LIST) {
    return (
      <FixedSizeList
        height={700}
        width={"100%"}
        itemSize={270}
        itemCount={props.contents.result.collections.length}
        overscanCount={10}
      >
        {(child: ListChildComponentProps) => renderRows(props, child)}
      </FixedSizeList>
    );
  }

  // or else render grid
  return (
    <FixedSizeList
      height={700}
      width={"100%"}
      itemSize={310}
      itemCount={Math.ceil(props.contents.result.collections.length / 2)}
      overscanCount={10}
    >
      {(child: ListChildComponentProps) => renderGrid(props, child)}
    </FixedSizeList>
  );
};

export default ResultCards;
