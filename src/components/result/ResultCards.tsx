import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  Grid,
  ListItem,
  Typography,
} from "@mui/material";
import { pageDefault } from "../common/constants";
import WhereToVoteIcon from "@mui/icons-material/WhereToVote";
import DownloadIcon from "@mui/icons-material/Download";
import InfoIcon from "@mui/icons-material/Info";
import { FixedSizeList, ListChildComponentProps } from "react-window";
import {
  CollectionsQueryType,
  OGCCollection,
} from "../common/store/searchReducer";
import { useNavigate } from "react-router-dom";
import LinkIcon from "@mui/icons-material/Link";
import DynamicResultCardButton from "../common/buttons/DynamicResultCardButton";
import StaticResultCardButton from "../common/buttons/StaticResultCardButton";
import { useCallback } from "react";
import default_thumbnail from "@/assets/images/default-thumbnail.png";

interface ResultCardProps {
  item: string;
  content: OGCCollection;
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

const findThumbnail = (links: Array<Link>): string => {
  const target = links.find((l) => l.type === "image" && l.rel === "thumbnail");
  return target !== undefined ? target.href : default_thumbnail;
};

const ResultCard = (props: ResultCardProps) => {
  const navigate = useNavigate();

  // links here may need to be changed, because only html links are wanted
  const generateLinkText = useCallback((linkLength: number) => {
    if (linkLength === 0) {
      return "No Link";
    }
    if (linkLength === 1) {
      return "1 Link";
    }
    return `${linkLength} Links`;
  }, []);

  // TODO: buttons are changed, but the behaviors are fake / wrong
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
                  image={findThumbnail(props.content.links)}
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
        {/*This button will be gone in the future*/}
        <StaticResultCardButton
          text={"Remove Layer"}
          startIcon={<WhereToVoteIcon />}
          onClick={(event) =>
            props?.onRemoveLayer && props.onRemoveLayer(event, props.content)
          }
        />
        <DynamicResultCardButton
          status={props.content.properties.get("STATUS")}
          onClick={() => {}}
        />
        <StaticResultCardButton
          text={"Briefs"}
          startIcon={<InfoIcon />}
          onClick={() => {}}
        />
        <StaticResultCardButton
          text={generateLinkText(props.content.links.length)}
          startIcon={<LinkIcon />}
          onClick={() => {}}
        />
        <StaticResultCardButton
          text={"Download"}
          startIcon={<DownloadIcon />}
          onClick={(event) =>
            props?.onDownload && props.onDownload(event, props.content)
          }
        />
      </CardActions>
    </Card>
  );
};

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
