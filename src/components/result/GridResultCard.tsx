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
import InfoIcon from "@mui/icons-material/Info";
import LinkIcon from "@mui/icons-material/Link";
import DownloadIcon from "@mui/icons-material/Download";

interface GridResultCardProps {
  content?: OGCCollection;
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
}

const GridResultCard: React.FC<GridResultCardProps> = (props) => {
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

  if (props.content) {
    return (
      <Card
        variant="outlined"
        sx={{ height: "100%" }}
        data-testid="result-card-grid"
      >
        <CardActionArea
          onClick={() => {
            const searchParams = new URLSearchParams();
            searchParams.append("uuid", props.content.id);
            navigate(pageDefault.details + "?" + searchParams.toString());
          }}
        >
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
                  {`${props.content?.title?.slice(0, 90)}${props.content?.title?.length > 90 ? "..." : ""}`}
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
            <Grid item xs={6}>
              <StaticResultCardButton
                text={generateLinkText(props.content.links.length)}
                startIcon={<LinkIcon />}
                onClick={() => {}}
                isbordered="false"
              />
            </Grid>
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
  }
  return undefined;
};

export default GridResultCard;
