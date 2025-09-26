import { FC, useCallback, useRef, useState } from "react";
import { IconButton, Popover } from "@mui/material";
import InfoCard from "./InfoCard";
import { InfoContentType, InfoStatusType } from "./InfoDefinition";
import { disableScroll, enableScroll } from "../../utils/ScrollUtils";
import rc8Theme from "../../styles/themeRC8";
import { InfoIcon } from "../../assets/icons/details/info";
import { CloseIcon } from "../../assets/icons/download/close";

interface InfoTipProps {
  infoContent?: InfoContentType;
}
const InfoTip: FC<InfoTipProps> = ({ infoContent }) => {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState(false);

  const handleClick = useCallback((_: React.MouseEvent<HTMLButtonElement>) => {
    setOpen(true);
    disableScroll();
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    enableScroll();
  }, []);

  return (
    <>
      <IconButton
        ref={buttonRef}
        onClick={handleClick}
        sx={{ color: rc8Theme.palette.info.main }}
      >
        <InfoIcon />
      </IconButton>
      <Popover
        elevation={2}
        open={open}
        anchorEl={buttonRef.current}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <InfoCard
          status={InfoStatusType.INFO}
          infoContent={infoContent}
          sx={{
            width: "310px", // Fixed width as per design
            height: "190px", // Fixed Height as per design
          }}
        >
          <IconButton
            onClick={handleClose}
            style={{ position: "absolute", top: 8, right: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </InfoCard>
      </Popover>
    </>
  );
};

export default InfoTip;
