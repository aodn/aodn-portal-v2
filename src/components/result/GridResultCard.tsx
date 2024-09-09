import {
  Box,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import React, { useCallback } from "react";
import StaticResultCardButton from "../common/buttons/StaticResultCardButton";
import DynamicResultCardButton from "../common/buttons/DynamicResultCardButton";
import InfoIcon from "@mui/icons-material/Info";
import LinkIcon from "@mui/icons-material/Link";
import DownloadIcon from "@mui/icons-material/Download";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import { margin, padding } from "../../styles/constants";
import { OGCCollection } from "../common/store/OGCCollectionDefinitions";
import OrganizationLogo from "../logo/OrganizationLogo";

interface GridResultCardProps {
  content: OGCCollection | undefined;
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
  isSelectedDataset?: boolean;
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
      sx={{
        height: "300px",
        border: props.isSelectedDataset ? "2px solid #618CA5" : "none",
      }}
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
              <Box
                sx={{
                  marginBottom: "10px",
                  height: "64px",
                  display: "flex",
                  flexWrap: "nowrap",
                }}
              >
                <Stack
                  flex={1}
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Box flex={1}>
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
                  </Box>
                  <OrganizationLogo
                    logo={props.content.findIcon()}
                    sx={{
                      width: "50px",
                      height: "100%",
                      paddingX: padding.extraSmall,
                    }}
                  />
                </Stack>
                {props.isSelectedDataset && (
                  <TaskAltIcon color="primary" sx={{ mt: margin.lg }} />
                )}
              </Box>
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
          {props.content.getDistributionLinks() && (
            <Grid item xs={6}>
              <StaticResultCardButton
                text={generateLinkText(
                  props.content.getDistributionLinks()!.length
                )}
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
