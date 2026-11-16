import { FC, useCallback, MouseEvent, useState } from "react";
import { Box, IconButton, Popover, SxProps, Typography } from "@mui/material";
import AIGenIcon from "../icon/AIGenIcon";
import { InfoContentType, InfoStatusType } from "./InfoDefinition";
import { disableScroll, enableScroll } from "../../utils/ScrollUtils";
import { portalTheme } from "../../styles";
import InfoCard from "./InfoCard";
import { CloseIcon } from "../../assets/icons/download/close";
import AIGenStarIcon from "../icon/AIGenStarIcon";
import TextRender from "../common/text/TextRender";

const ICON_VIEWBOX = 40;
const ICON_BOX_LEFT = 5;
const ICON_BOX_TOP = 8.5;
const POPUP_GAP = 15;

interface AIGenTagProps {
  infoContent?: InfoContentType;
  cardSx?: SxProps; // InfoCard surface
  headerSx?: SxProps; // Star and title row
  contentSx?: SxProps; // Body text
  iconSize?: number; // AI icon width and height
}

const AIGenTag: FC<AIGenTagProps> = ({
  infoContent,
  cardSx,
  headerSx,
  contentSx,
  iconSize = 28,
}) => {
  const iconScale = iconSize / ICON_VIEWBOX;
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    // 2. Set the current target as the anchor
    setAnchorEl(event.currentTarget);
    disableScroll();
  }, []);

  const handleClose = useCallback(() => {
    // 3. Clear the anchor to close
    setAnchorEl(null);
    enableScroll();
  }, []);

  // 4. "open" is derived: if we have an anchor, it's open
  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton
        onClick={handleClick} // Pass the event to handleClick
        sx={{ padding: 0, bgcolor: "transparent" }}
        data-testid="AIGenTag-icon"
      >
        <AIGenIcon
          color={portalTheme.palette.primary1}
          width={iconSize}
          height={iconSize}
        />
      </IconButton>
      <Popover
        elevation={2}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        slotProps={{
          paper: {
            sx: {
              mt: `${Math.round(ICON_BOX_TOP * iconScale)}px`,
              ml: `${Math.round(ICON_BOX_LEFT * iconScale) - POPUP_GAP}px`,
            },
          },
        }}
        data-testid="AIGenTag-popup"
      >
        <InfoCard
          status={InfoStatusType.NONE}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            width: "310px",
            height: "auto",
            padding: "10px",
            ...cardSx,
          }}
        >
          <IconButton
            onClick={handleClose}
            sx={{
              position: "absolute",
              top: "8px",
              right: "8px",
            }}
            data-testid="AIGenTag-close-button"
          >
            <CloseIcon />
          </IconButton>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexWrap: "nowrap",
              width: "100%",
              gap: 1,
              ...headerSx,
            }}
          >
            <AIGenStarIcon color={portalTheme.palette.primary1} />
            <Typography
              sx={{
                ...portalTheme.typography.heading4,
                color: portalTheme.palette.primary1,
                padding: 0,
              }}
            >
              {infoContent?.title}
            </Typography>
          </Box>

          <Typography
            sx={{
              ...portalTheme.typography.body2Regular,
              p: "8px",
              ...contentSx,
            }}
          >
            <TextRender text={infoContent?.body ?? ""} />
          </Typography>
        </InfoCard>
      </Popover>
    </>
  );
};

export default AIGenTag;
