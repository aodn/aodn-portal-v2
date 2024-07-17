import {
  Box,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from "@mui/material";
import WhereToVoteIcon from "@mui/icons-material/WhereToVote";
import DownloadIcon from "@mui/icons-material/Download";
import InfoIcon from "@mui/icons-material/Info";
import LinkIcon from "@mui/icons-material/Link";
import DynamicResultCardButton from "../common/buttons/DynamicResultCardButton";
import StaticResultCardButton from "../common/buttons/StaticResultCardButton";
import { useCallback } from "react";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import { margin } from "../../styles/constants";
import { OGCCollection } from "../common/store/OGCCollectionDefinitions";

interface ResultCardProps {
  content: OGCCollection;
  onRemoveLayer?:
    | ((
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        stac: OGCCollection
      ) => void)
    | undefined;
  onDownload?:
    | ((
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        stac: OGCCollection
      ) => void)
    | undefined;
  onTags?:
    | ((
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        stac: OGCCollection
      ) => void)
    | undefined;
  onMore?:
    | ((
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        stac: OGCCollection
      ) => void)
    | undefined;
  onClickCard?: ((uuid: string) => void) | undefined;
  isSelectedDataset?: boolean;
}

const ListResultCard = (props: ResultCardProps) => {
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

  const handleClick = () => {
    if (props.onClickCard && props.content && props.content.id) {
      props.onClickCard(props.content.id);
    }
  };

  // TODO: buttons are changed, but the behaviors are fake / wrong
  return (
    <Card
      variant="outlined"
      sx={{
        width: "99%",
        minHeight: "250px",
        border: props.isSelectedDataset ? "2px solid #618CA5" : "none",
      }}
      data-testid="result-card-list"
    >
      <CardActionArea onClick={handleClick}>
        <CardContent>
          <Box
            sx={{
              marginBottom: "10px",
              height: "48px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography
              sx={{
                padding: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: "2",
                WebkitBoxOrient: "vertical",
              }}
            >
              {props.content.title}
            </Typography>
            {props.isSelectedDataset && (
              <TaskAltIcon color="primary" sx={{ mt: margin.sm }} />
            )}
          </Box>

          <Grid container spacing={1}>
            <Grid item xs={3}>
              <CardMedia
                sx={{ display: "flex", width: "100%", height: "100px" }}
                component="img"
                image={props.content.findThumbnail()}
              />
            </Grid>
            <Grid item xs={9}>
              <Typography
                variant="body2"
                sx={{
                  padding: 0,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: "5",
                  WebkitBoxOrient: "vertical",
                }}
              >
                {props.content.description}
              </Typography>
            </Grid>
          </Grid>
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
        {props.content.links && (
          <StaticResultCardButton
            text={generateLinkText(props.content.links?.length)}
            startIcon={<LinkIcon />}
            onClick={() => {}}
          />
        )}
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
