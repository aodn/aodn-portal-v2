import {
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  CardActionArea,
  CardActions,
  ListItem,
  Chip,
  Button,
} from "@mui/material";
import { pageDefault } from "../common/constants";
import WhereToVoteIcon from "@mui/icons-material/WhereToVote";
import DownloadIcon from "@mui/icons-material/Download";
import SellIcon from "@mui/icons-material/Sell";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { FixedSizeList, ListChildComponentProps } from "react-window";
import {
  OGCCollection,
  CollectionsQueryType,
} from "../common/store/searchReducer";
import { useNavigate } from "react-router-dom";

interface ResultCardProps {
  item: number;
  content: OGCCollection;
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

// const findThumbnail = (c: OGCCollection): string => {
//   return "https://warcontent.com/wp-content/uploads/2021/03/substring-javascript-5.png";
// };

const findThumbnail = (): string => {
  return "https://warcontent.com/wp-content/uploads/2021/03/substring-javascript-5.png";
};

const ResultCard = (props: ResultCardProps) => {
  const navigate = useNavigate();

  return (
    <Card variant="outlined">
      <CardActionArea
        onClick={() => {
          const searchParams = new URLSearchParams();
          searchParams.append("uuid", props.content.id);
          navigate(pageDefault.details + "?" + searchParams.toString());
        }}
      >
        <CardContent>
          <Typography component="div" sx={{ marginBottom: "10px" }}>
            <Grid container>
              <Grid item xs={11}>
                {props.content.title?.substring(0, 90) + "..."}
              </Grid>
              <Grid item xs={1}>
                <Chip label={props.item} />
              </Grid>
            </Grid>
          </Typography>
          <Typography variant="body2">
            <Grid container spacing={1}>
              <Grid item xs={3}>
                <CardMedia
                  sx={{ display: "flex", width: "100%", height: "100px" }}
                  component="img"
                  image={findThumbnail()}
                />
              </Grid>
              <Grid item xs={9}>
                {props.content.description?.substring(0, 180) + "..."}
              </Grid>
            </Grid>
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions sx={{ justifyContent: "space-between" }}>
        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          size="small"
          onClick={(event) =>
            props?.onDownload && props.onDownload(event, props.content)
          }
          disabled={props.onDownload === undefined}
        >
          Download
        </Button>
        <Button
          variant="outlined"
          startIcon={<SellIcon />}
          size="small"
          onClick={(event) =>
            props?.onTags && props.onTags(event, props.content)
          }
          disabled={props.onTags === undefined}
        >
          Tags
        </Button>
        <Button
          variant="outlined"
          startIcon={<MoreHorizIcon />}
          size="small"
          onClick={(event) =>
            props?.onMore && props.onMore(event, props.content)
          }
          disabled={props.onMore === undefined}
        >
          More
        </Button>
      </CardActions>
    </Card>
  );
};

interface ResultCardsProps {
  contents: CollectionsQueryType;
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

// This function is use to control which item to render in the long list
const renderRows = (
  props: ResultCardsProps,
  child: ListChildComponentProps
) => {
  // The style must pass to the listitem else incorrect rendering
  const { index, style } = child;

  return (
    <ListItem sx={{ pl: 0, pr: 0 }} style={style}>
      <ResultCard
        item={index + 1}
        content={props.contents.result.collections[index]}
        onDownload={props.onDownload}
        onTags={props.onTags}
        onMore={props.onMore}
      />
    </ListItem>
  );
};
const ResultCards = (props: ResultCardsProps) => {
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
};

export { ResultCards, ResultCard };
