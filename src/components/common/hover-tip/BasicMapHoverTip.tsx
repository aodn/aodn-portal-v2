import { FC } from "react";
import {
  Box,
  CardActionArea,
  SxProps,
  Tooltip,
  Typography,
} from "@mui/material";
import { fontColor, fontSize, fontWeight } from "../../../styles/constants";

export interface BasicMapHoverTipProps {
  content?: string | undefined | null;
  sx?: SxProps;
  onNavigateToDetail?: () => void;
  onDatasetSelected?: () => void;
}

const BasicMapHoverTip: FC<BasicMapHoverTipProps> = ({
  sx,
  content,
  onDatasetSelected = () => {},
}) => {
  if (!content) return;

  return (
    <CardActionArea onClick={onDatasetSelected}>
      <Tooltip title={content} placement="top">
        <Box sx={{ ...sx }}>
          <Typography
            color={fontColor.gray.dark}
            fontSize={fontSize.label}
            fontWeight={fontWeight.bold}
            sx={{
              padding: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: "4",
              WebkitBoxOrient: "vertical",
            }}
          >
            {content}
          </Typography>
        </Box>
      </Tooltip>
    </CardActionArea>
  );
};

export default BasicMapHoverTip;
