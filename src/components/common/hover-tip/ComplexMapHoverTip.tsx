import { FC } from "react";
import { OGCCollection } from "../store/OGCCollectionDefinitions";
import { BasicMapHoverTipProps } from "./BasicMapHoverTip";
import { Box, Stack, Tooltip, Typography } from "@mui/material";
import {
  fontColor,
  fontSize,
  fontWeight,
  padding,
} from "../../../styles/constants";
import ResultCardButtonGroup from "../../result/ResultCardButtonGroup";
import Map from "../../map/mapbox/Map";
import Layers from "../../map/mapbox/layers/Layers";
import GeojsonLayer from "../../map/mapbox/layers/GeojsonLayer";

interface ComplexMapHoverTipProps extends BasicMapHoverTipProps {
  collection: OGCCollection;
}

const mapContainerId = "map-popup-spatial-extend-overview";

const ComplexMapHoverTip: FC<ComplexMapHoverTipProps> = ({
  collection,
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
        <Box>
          <Tooltip title={collection.title} placement="top">
            <Box display="flex" alignItems="center" height="60px">
              <Typography
                fontWeight={fontWeight.bold}
                fontSize={fontSize.info}
                sx={{
                  padding: 0,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: "3",
                  WebkitBoxOrient: "vertical",
                }}
              >
                {collection.title}
              </Typography>
            </Box>
          </Tooltip>
        </Box>

        <Box
          arial-label="map"
          id={`${mapContainerId}-${collection.id}`}
          sx={{
            width: "100%",
            height: "130px",
          }}
        >
          <Map panelId={`${mapContainerId}-${collection.id}`}>
            <Layers>
              <GeojsonLayer collection={collection} />
            </Layers>
          </Map>
        </Box>

        <ResultCardButtonGroup
          content={collection}
          isGridView
          onLinks={onLinks}
          onDownload={onDownload}
          onDetail={onDetail}
        />

        <Box>
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

export default ComplexMapHoverTip;
