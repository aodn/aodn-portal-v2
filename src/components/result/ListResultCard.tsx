import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Stack,
  Typography,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import InfoIcon from "@mui/icons-material/Info";
import LinkIcon from "@mui/icons-material/Link";
import DynamicResultCardButton from "../common/buttons/DynamicResultCardButton";
import StaticResultCardButton from "../common/buttons/StaticResultCardButton";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import {
  border,
  color,
  fontColor,
  fontSize,
  margin,
  padding,
} from "../../styles/constants";
import { OGCCollection } from "../common/store/OGCCollectionDefinitions";
import { useCallback, useState } from "react";
import OrganizationLogo from "../logo/OrganizationLogo";

interface ResultCardProps {
  content: OGCCollection;
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

// links here may need to be changed, because only html links are wanted
const generateLinkText = (linkLength: number) => {
  if (linkLength === 0) {
    return "No Link";
  }
  if (linkLength === 1) {
    return "1 Link";
  }
  return `${linkLength} Links`;
};

const ListResultCard = (props: ResultCardProps) => {
  const [showButtons, setShowButtons] = useState<boolean>(true);

  const handleClick = useCallback(() => {
    if (props.onClickCard && props.content && props.content.id) {
      props.onClickCard(props.content.id);
    }
  }, [props]);

  // TODO: buttons are changed, but the behaviors are fake / wrong
  return (
    <Card
      variant="outlined"
      sx={{
        width: "100%",
        height: "100%",
        border: props.isSelectedDataset
          ? `${border.sm} ${color.blue.dark}`
          : "none",
      }}
      data-testid="result-card-list"
    >
      <CardActionArea onClick={handleClick}>
        <CardContent>
          <Box
            sx={{
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
              <Stack direction="column" flex={1}>
                <Box height="45px">
                  <Typography
                    color={fontColor.gray.dark}
                    fontSize={fontSize.resultCardTitle}
                    sx={{
                      padding: 0,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: "2",
                      WebkitBoxOrient: "vertical",
                    }}
                    data-testid="result-card-title"
                  >
                    {props.content.title}
                  </Typography>
                </Box>

                <Typography
                  color={fontColor.gray.medium}
                  fontSize={fontSize.resultCardContent}
                  sx={{
                    padding: 0,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: showButtons ? "3" : "5",
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {props.content.description}
                </Typography>
                <Box sx={{ justifyContent: "space-between" }}>
                  <DynamicResultCardButton
                    status={props.content.getStatus()}
                    onClick={() => {}}
                  />
                  <StaticResultCardButton
                    text={"Briefs"}
                    startIcon={<InfoIcon />}
                    onClick={() => {}}
                  />
                  {props.content.getDistributionLinks() && (
                    <StaticResultCardButton
                      text={generateLinkText(
                        props.content.getDistributionLinks()!.length
                      )}
                      startIcon={<LinkIcon />}
                      onClick={() => {}}
                    />
                  )}
                  <StaticResultCardButton
                    text={"Download"}
                    startIcon={<DownloadIcon />}
                    onClick={(event) =>
                      props?.onDownload &&
                      props.onDownload(event, props.content)
                    }
                  />
                </Box>
              </Stack>
              <Stack
                direction="column"
                flexWrap="nowrap"
                justifyContent="center"
                alignItems="end"
                width="120px"
                height="100%"
              >
                <Box height="45px">
                  <OrganizationLogo
                    logo={props.content.findIcon()}
                    sx={{
                      width: "50px",
                      height: "100%",
                      paddingX: padding.extraSmall,
                    }}
                  />
                  {props.isSelectedDataset && (
                    <TaskAltIcon color="primary" sx={{ mt: margin.sm }} />
                  )}
                </Box>
                <Box width="100%" flex={1}>
                  <CardMedia
                    sx={{
                      display: "flex",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    component="img"
                    image={props.content.findThumbnail()}
                  />
                </Box>
              </Stack>
            </Stack>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default ListResultCard;
