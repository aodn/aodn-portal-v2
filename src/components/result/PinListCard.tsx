import { FC } from "react";
import { Box, Stack, SxProps, Tooltip, Typography } from "@mui/material";
import { OGCCollection } from "../common/store/OGCCollectionDefinitions";
import Map from "../../components/map/mapbox/Map";
import Layers from "../map/mapbox/layers/Layers";
import GeojsonLayer from "../map/mapbox/layers/GeojsonLayer";
import ResultCardButtonGroup from "./ResultCardButtonGroup";
import { fontColor, fontSize, padding } from "../../styles/constants";

interface PinListCardProps {
  collection: OGCCollection;
  sx?: SxProps;
  onDatasetSelected?: () => void;
  tabNavigation?: (uuid: string, tab: string, section?: string) => void;
}

const mapContainerId = "pin-list-map";

const PinListCard: FC<PinListCardProps> = ({
  collection,
  onDatasetSelected = () => {},
  tabNavigation = () => {},
  sx,
}) => {
  const onLinks = () => tabNavigation(collection.id, "links");
  const onDownload = () =>
    tabNavigation(collection.id, "abstract", "download-section");
  const onDetail = () => tabNavigation(collection.id, "abstract");

  return (
    <Box flex={1} sx={{ ...sx }}>
      <Stack direction="column" spacing={1}>
        <Box onClick={onDatasetSelected}>
          <Box
            arial-label="map"
            id={`${mapContainerId}-${collection.id}`}
            sx={{
              width: "100%",
              height: "150px",
            }}
          >
            <Map panelId={`${mapContainerId}-${collection.id}`}>
              <Layers>
                <GeojsonLayer collection={collection} animate={false} />
              </Layers>
            </Map>
          </Box>
        </Box>

        <Box>
          <ResultCardButtonGroup
            content={collection}
            isGridView
            onLinks={onLinks}
            onDownload={onDownload}
            onDetail={onDetail}
          />
        </Box>

        <Box onClick={() => {}}>
          <Tooltip title="More detail..." placement="top">
            <Typography
              color={fontColor.gray.medium}
              fontSize={fontSize.resultCardContent}
              sx={{
                padding: 0,
                paddingX: padding.small,
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: "5",
                WebkitBoxOrient: "vertical",
                wordBreak: "break-word",
              }}
            >
              {collection.description}
            </Typography>
          </Tooltip>
        </Box>
      </Stack>
    </Box>
  );
};

export default PinListCard;
