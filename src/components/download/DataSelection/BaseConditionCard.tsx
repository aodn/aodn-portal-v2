import React, { useState } from "react";
import {
  DownloadConditionType,
  IDownloadCondition,
  IDownloadConditionCallback,
} from "../../../pages/detail-page/context/DownloadDefinitions";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Collapse,
  Divider,
  IconButton,
  IconButtonProps,
  Stack,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { CloseIcon } from "../../../assets/icons/download/close";
import { portalTheme } from "../../../styles";
import { BboxSelectionIcon } from "../../../assets/icons/download/bbox_selection";
import { PolygonSelectionIcon } from "../../../assets/icons/map/polygon_selection";
import { TimeRangeIcon } from "../../../assets/icons/download/time_range";

interface BaseConditionCardProps
  extends IDownloadCondition,
    IDownloadConditionCallback {
  children: React.ReactNode;
  actions?: React.ReactNode;
  disable?: boolean;
}

interface ExpandProps extends IconButtonProps {
  expand: boolean;
}

const ExpandIconButton = styled(({ expand, ...rest }: ExpandProps) => (
  <IconButton {...rest} />
))(({ theme, expand }) => ({
  transform: expand ? "rotate(0deg)" : "rotate(45deg)",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

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
      return "Time Range";
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
          <Stack direction="row" alignItems="center" spacing={0.5}>
            {removeCallback && (
              <IconButton
                onClick={removeCallback}
                disabled={disable}
                aria-label="remove"
                size="small"
              >
                <DeleteOutlineIcon
                  sx={{ color: portalTheme.palette.grey700, fontSize: 18 }}
                />
              </IconButton>
            )}
            <ExpandIconButton
              expand={expanded}
              onClick={toggle}
              disabled={disable}
              size="small"
              aria-expanded={expanded}
              aria-label={expanded ? "collapse" : "expand"}
            >
              <CloseIcon
                color={portalTheme.palette.grey700}
                width={12}
                height={12}
              />
            </ExpandIconButton>
          </Stack>
        }
        sx={{
          py: 1,
          px: 1.5,
          "& .MuiCardHeader-avatar": { mr: 1.5 },
          "& .MuiCardHeader-action": { m: 0, alignSelf: "center" },
        }}
      />
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent
          sx={{
            pt: 0.5,
            pb: 1.5,
            px: 1.5,
            "&:last-child": { pb: 1.5 },
          }}
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
                py: 0.5,
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
