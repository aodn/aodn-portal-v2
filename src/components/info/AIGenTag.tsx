import { FC, useCallback, MouseEvent, useState } from "react";
import { Box, IconButton, Popover, Typography } from "@mui/material";
import AIGenIcon from "../icon/AIGenIcon";
import { InfoContentType, InfoStatusType } from "./InfoDefinition";
import { disableScroll, enableScroll } from "../../utils/ScrollUtils";
import { portalTheme } from "../../styles";
import InfoCard from "./InfoCard";
import { CloseIcon } from "../../assets/icons/download/close";
import AIGenStarIcon from "../icon/AIGenStarIcon";
import TextRender from "../common/text/TextRender";

interface AIGenTagProps {
  infoContent?: InfoContentType;
}

const AIGenTag: FC<AIGenTagProps> = ({ infoContent }) => {
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
        <AIGenIcon color={portalTheme.palette.primary1} />
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
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexWrap="nowrap"
            width="100%"
            gap={1}
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

          <Typography sx={{ ...portalTheme.typography.body2Regular, p: "8px" }}>
            <TextRender text={infoContent?.body ?? ""} />
          </Typography>
        </InfoCard>
      </Popover>
    </>
  );
};

export default AIGenTag;
