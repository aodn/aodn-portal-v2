import { FC, useCallback, useState, MouseEvent } from "react";
import { IconButton, Popover } from "@mui/material";
import InfoCard from "./InfoCard";
import { InfoContentType, InfoStatusType } from "./InfoDefinition";
import { disableScroll, enableScroll } from "../../utils/ScrollUtils";
import { portalTheme } from "../../styles";
import { InfoIcon } from "../../assets/icons/details/info";
import { CloseIcon } from "../../assets/icons/download/close";

interface InfoTipProps {
  infoContent?: InfoContentType;
}
const InfoTip: FC<InfoTipProps> = ({ infoContent }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    disableScroll();
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
    enableScroll();
  }, []);

  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton
        onClick={handleClick}
        sx={{ color: portalTheme.palette.info.main, padding: 0 }}
        data-testid="Info-tip-icon"
      >
        <InfoIcon />
      </IconButton>
      <Popover
        elevation={2}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        data-testid="Info-tip-popup"
      >
        <InfoCard
          status={InfoStatusType.INFO}
          infoContent={infoContent}
          sx={{
            width: "310px", // Fixed width as per design
            height: "auto",
            maxHeight: "80vh",
          }}
        >
          <IconButton
            onClick={handleClose}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
            }}
            data-testid="Info-tip-close-button"
          >
            <CloseIcon />
          </IconButton>
        </InfoCard>
      </Popover>
    </>
  );
};

export default InfoTip;
