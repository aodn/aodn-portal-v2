import { FC, useState } from "react";
import { Dialog, IconButton } from "@mui/material";
import InfoCard from "@/components/info/InfoCard";
import {
  InfoContentType,
  InfoStatusType,
} from "@/components/info/InfoDefinition";
import { CloseIcon } from "@/assets/icons/download/close";

interface AnnouncementDialogProps {
  infoContent: InfoContentType;
  status?: InfoStatusType;
}

/**
 * Modal announcement (e.g. a system maintenance notice) that opens on mount
 * and closes via the close button, backdrop click or Esc.
 */
const AnnouncementDialog: FC<AnnouncementDialogProps> = ({
  infoContent,
  status = InfoStatusType.NONE,
}) => {
  const [open, setOpen] = useState<boolean>(true);

  const handleClose = () => setOpen(false);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-label={infoContent.title}
      data-testid="announcement-dialog"
      slotProps={{ paper: { sx: { m: 2 } } }}
    >
      <InfoCard
        status={status}
        infoContent={infoContent}
        sx={{
          width: { xs: "100%", sm: "480px" },
          height: "auto",
          maxHeight: "80vh",
          overflow: "auto",
        }}
        titleSx={{ px: 5 }}
      >
        <IconButton
          onClick={handleClose}
          aria-label="Close announcement"
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
          }}
          data-testid="announcement-dialog-close-button"
        >
          <CloseIcon />
        </IconButton>
      </InfoCard>
    </Dialog>
  );
};

export default AnnouncementDialog;
