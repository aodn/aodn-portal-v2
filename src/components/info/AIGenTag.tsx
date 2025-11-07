import { FC, useCallback, useRef, useState } from "react";
import { IconButton, Popover, Typography } from "@mui/material";
import AIGenIcon from "../icon/AIGenIcon";
import { InfoContentType, InfoStatusType } from "./InfoDefinition";
import { disableScroll, enableScroll } from "../../utils/ScrollUtils";
import rc8Theme from "../../styles/themeRC8";
import InfoCard from "./InfoCard";
import { CloseIcon } from "../../assets/icons/download/close";

interface AIGenTagProps {
  infoContent?: InfoContentType;
}

const AIGenTag: FC<AIGenTagProps> = ({ infoContent }) => {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState(false);

  const handleClick = useCallback(() => {
    setOpen(true);
    disableScroll();
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    enableScroll();
  }, []);
  return (
    <>
      <IconButton ref={buttonRef} onClick={handleClick} sx={{ padding: 0 }}>
        <AIGenIcon color={rc8Theme.palette.primary1} />
      </IconButton>
      <Popover
        elevation={2}
        open={open}
        anchorEl={buttonRef.current}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <InfoCard
          status={InfoStatusType.NONE}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            width: "310px", // Fixed width as per design
            height: "170px", // Fixed Height as per design
          }}
        >
          <IconButton
            onClick={handleClose}
            sx={{
              position: "absolute",
              top: 8,
              right: { xs: "35px", sm: "15px" },
            }}
          >
            <CloseIcon />
          </IconButton>
          <Typography>{infoContent?.title}</Typography>
          <Typography>{infoContent?.body}</Typography>
        </InfoCard>
      </Popover>
    </>
  );
};

export default AIGenTag;
