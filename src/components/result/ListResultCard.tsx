import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  Grid,
  Typography,
} from "@mui/material";
import { pageDefault } from "../common/constants";
import WhereToVoteIcon from "@mui/icons-material/WhereToVote";
import DownloadIcon from "@mui/icons-material/Download";
import InfoIcon from "@mui/icons-material/Info";
import { OGCCollection } from "../common/store/searchReducer";
import { useNavigate } from "react-router-dom";
import LinkIcon from "@mui/icons-material/Link";
import DynamicResultCardButton from "../common/buttons/DynamicResultCardButton";
import StaticResultCardButton from "../common/buttons/StaticResultCardButton";
import { useCallback } from "react";

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

const ListResultCard = (props: ResultCardProps) => {
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
                  image={props.content.findThumbnail()}
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
          status={props.content.getStatus()}
          onClick={() => {}}
        />
        <StaticResultCardButton
          text={"Briefs"}
          startIcon={<InfoIcon />}
          onClick={() => {}}
        />
        <StaticResultCardButton
          text={generateLinkText(props.content.links?.length)}
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

export default ListResultCard;