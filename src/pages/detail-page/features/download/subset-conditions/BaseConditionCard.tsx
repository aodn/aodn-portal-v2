import React, { useState } from "react";
import { DownloadConditionType } from "../../../context/DownloadDefinitions";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Collapse,
  Divider,
  IconButton,
  SxProps,
  Theme,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { portalTheme } from "../../../../../styles";
import { BboxSelectionIcon } from "../../../../../assets/icons/download/bbox_selection";
import { PolygonSelectionIcon } from "../../../../../assets/icons/map/polygon_selection";
import { TimeRangeIcon } from "../../../../../assets/icons/download/time_range";

interface BaseConditionCardProps {
  type: DownloadConditionType;
  children: React.ReactNode;
  actions?: React.ReactNode;
  removeCallback?: () => void;
  disable?: boolean;
  contentSx?: SxProps<Theme>;
  headerDivider?: boolean;
}

const iconMap: Partial<Record<DownloadConditionType, React.ComponentType>> = {
  [DownloadConditionType.BBOX]: BboxSelectionIcon,
  [DownloadConditionType.POLYGON]: () => (
    <PolygonSelectionIcon color={portalTheme.palette.primary1} />
  ),
  [DownloadConditionType.DATE_RANGE]: TimeRangeIcon,
};

const getIcon = (type: DownloadConditionType, size: number) => {
  const IconComponent = iconMap[type];
  if (!IconComponent) return null;
  return (
    <Box
      sx={{
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <IconComponent />
    </Box>
  );
};

const getTitle = (type: DownloadConditionType) => {
  switch (type) {
    case DownloadConditionType.BBOX:
      return "Bounding Box Selection";
    case DownloadConditionType.POLYGON:
      return "Polygon Selection";
    case DownloadConditionType.DATE_RANGE:
      return "Date Range";
    default:
      return "";
  }
};

const BaseConditionCard: React.FC<BaseConditionCardProps> = ({
  type,
  children,
  actions,
  removeCallback,
  disable = false,
  contentSx,
  headerDivider = false,
}) => {
  const [expanded, setExpanded] = useState(true);
  const toggle = () => setExpanded((prev) => !prev);

  return (
    <Card
      elevation={0}
      sx={{
        backgroundColor: portalTheme.palette.primary6,
        transition: (theme) =>
          theme.transitions.create(
            ["border-color", "box-shadow", "border-radius"],
            { duration: theme.transitions.duration.shortest }
          ),
        border: `1px solid ${
          expanded ? portalTheme.palette.grey600 : "transparent"
        }`,
        borderRadius: expanded ? "6px" : "7px",
        boxShadow: expanded ? "1px 1px 4px 0 rgba(0, 0, 0, 0.20)" : "none",
      }}
    >
      <CardHeader
        avatar={getIcon(type, 24)}
        title={getTitle(type)}
        titleTypographyProps={{
          variant: "body1Medium",
          color: portalTheme.palette.text1,
        }}
        action={
          removeCallback && (
            <IconButton
              // Stop the click bubbling up to the header, which would toggle the card
              onClick={(event) => {
                event.stopPropagation();
                removeCallback();
              }}
              disabled={disable}
              aria-label="remove"
              size="small"
            >
              <DeleteOutlineIcon
                sx={{ color: portalTheme.palette.grey700, fontSize: 18 }}
              />
            </IconButton>
          )
        }
        // The whole header is the expand/collapse control, so no separate chevron
        onClick={disable ? undefined : toggle}
        onKeyDown={(event) => {
          if (disable) return;
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            toggle();
          }
        }}
        role="button"
        tabIndex={disable ? -1 : 0}
        aria-expanded={expanded}
        sx={{
          py: 1,
          px: 1.5,
          cursor: disable ? "default" : "pointer",
          "&:hover": {
            backgroundColor: disable
              ? "transparent"
              : portalTheme.palette.primary5,
          },
          "& .MuiCardHeader-avatar": { mr: 1.5 },
          "& .MuiCardHeader-action": { m: 0, alignSelf: "center" },
        }}
      />
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        {headerDivider && (
          <Divider sx={{ borderBottomWidth: 2, borderColor: "common.white" }} />
        )}
        <CardContent
          sx={[
            {
              pt: 0.5,
              pb: 1.5,
              px: 1.5,
              "&:last-child": { pb: 1.5 },
            },
            ...(Array.isArray(contentSx) ? contentSx : [contentSx]),
          ]}
        >
          {children}
        </CardContent>
        {actions && (
          <>
            <Divider
              sx={{ borderBottomWidth: 2, borderColor: "common.white" }}
            />
            <CardActions
              sx={{
                justifyContent: "center",
                alignItems: "center",
                px: 1.5,
                py: 1,
              }}
            >
              {actions}
            </CardActions>
          </>
        )}
      </Collapse>
    </Card>
  );
};

export default BaseConditionCard;
