import { FC } from "react";
import { OGCCollection } from "../store/OGCCollectionDefinitions";
import { BasicMapHoverTipProps } from "./BasicMapHoverTip";
import { Box, CardActionArea, Stack, Tooltip, Typography } from "@mui/material";
import {
  fontColor,
  fontSize,
  fontWeight,
  padding,
} from "../../../styles/constants";
import ResultCardButtonGroup from "../../result/ResultCardButtonGroup";

interface ComplexMapHoverTipProps extends BasicMapHoverTipProps {
  collection: OGCCollection;
}

const ComplexMapHoverTip: FC<ComplexMapHoverTipProps> = ({
  collection,
  onNavigateToDetail = () => {},
  onDatasetSelected = () => {},
  sx,
}) => {
  return (
    <Box flex={1} sx={{ ...sx }}>
      <Stack direction="column" spacing={1}>
        <CardActionArea>
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
        </CardActionArea>

        <CardActionArea onClick={onDatasetSelected}>
          <Tooltip title="Show spatial extents" placement="top">
            <Box width="100%" height="130px">
              <img
                src={collection.findThumbnail()}
                alt="org_logo"
                style={{
                  objectFit: "cover",
                  width: "100%",
                  height: "100%",
                }}
              />
            </Box>
          </Tooltip>
        </CardActionArea>

        <Box>
          <ResultCardButtonGroup
            content={collection}
            onDetail={onNavigateToDetail}
            isGridView
          />
        </Box>

        <CardActionArea onClick={onNavigateToDetail}>
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
        </CardActionArea>
      </Stack>
    </Box>
  );
};

export default ComplexMapHoverTip;
