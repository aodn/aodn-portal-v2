import { FC, useState } from "react";
import { Card, IconButton, Paper, Popover, Typography } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import CloseIcon from "@mui/icons-material/Close";
import InfoCard from "./InfoCard";
import { InfoContentType, InfoStatusType } from "./InfoDefinition";

interface InfoTipProps {
  infoContent?: InfoContentType;
}
const InfoTip: FC<InfoTipProps> = ({ infoContent }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClosePopover = () => {
    handleClose();
  };

  const open = Boolean(anchorEl);
  return (
    <>
      <IconButton onClick={handleClick}>
        <InfoIcon />
      </IconButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <InfoCard status={InfoStatusType.INFO} infoContent={infoContent}>
          <IconButton
            onClick={handleClosePopover}
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
