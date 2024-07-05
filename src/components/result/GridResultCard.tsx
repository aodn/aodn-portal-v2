import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from "@mui/material";
import { pageDefault } from "../common/constants";
import { OGCCollection } from "../common/store/searchReducer";
import { useNavigate } from "react-router-dom";
import React, { useCallback } from "react";
import StaticResultCardButton from "../common/buttons/StaticResultCardButton";
import DynamicResultCardButton from "../common/buttons/DynamicResultCardButton";
import { trimContent } from "./CardUtils";
import InfoIcon from "@mui/icons-material/Info";
import LinkIcon from "@mui/icons-material/Link";
import DownloadIcon from "@mui/icons-material/Download";

interface GridResultCardProps {
  content?: OGCCollection;
  onRemoveLayer?:
    | ((
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        stac: OGCCollection | undefined
      ) => void)
    | undefined;
  onDownload?:
    | ((
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        stac: OGCCollection | undefined
      ) => void)
    | undefined;
  onClickCard?: ((uuid: string) => void) | undefined;
}

const GridResultCard: React.FC<GridResultCardProps> = (props) => {
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

  if (!props.content) return;

  return (
    <Card
      variant="outlined"
      sx={{ height: "100%" }}
      data-testid="result-card-grid"
    >
      <CardActionArea onClick={handleClick}>
        <CardContent>
          <Grid container>
            <Grid item xs={12}>
              <CardMedia
                sx={{ display: "flex", width: "100%", height: "100px" }}
                component="img"
                image={props.content?.findThumbnail()}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography
                component="div"
                sx={{
                  marginBottom: "10px",
                  height: "64px",
                }}
              >
                {trimContent(props.content?.title)}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </CardActionArea>
      <CardActions sx={{ justifyContent: "space-between" }}>
        <Grid container item xs={12}>
          <Grid item xs={6}>
            <DynamicResultCardButton
              status={props.content?.getStatus()}
              onClick={() => {}}
              isbordered="false"
            />
          </Grid>
          <Grid item xs={6}>
            <StaticResultCardButton
              text={"Briefs"}
              startIcon={<InfoIcon />}
              onClick={() => {}}
              isbordered="false"
            />
          </Grid>
          {props.content.links && (
            <Grid item xs={6}>
              <StaticResultCardButton
                text={generateLinkText(props.content.links.length)}
                startIcon={<LinkIcon />}
                onClick={() => {}}
                isbordered="false"
              />
            </Grid>
          )}
          <Grid item xs={6}>
            <StaticResultCardButton
              text={"Download"}
              startIcon={<DownloadIcon />}
              onClick={(event) =>
                props?.onDownload && props.onDownload(event, props.content)
              }
              isbordered="false"
            />
          </Grid>
        </Grid>
      </CardActions>
    </Card>
  );
};

export default GridResultCard;
