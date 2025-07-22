import rc8Theme from "../../styles/themeRC8";
import { CancelIcon } from "../../assets/icons/download/cancel";
import { Box, DialogTitle, IconButton, Typography } from "@mui/material";

interface DialogHeaderProps {
  onClose: () => void;
}

export const DialogHeader = ({ onClose }: DialogHeaderProps) => {
  return (
    <DialogTitle
      sx={{
        boxShadow: "0px 2px 10px 0px rgba(0, 0, 0, 0.15)",
        height: "48px",
        marginBottom: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box display="flex" alignItems="center" justifyContent="center">
        <Typography
          variant="heading3"
          sx={{
            color: rc8Theme.palette.primary.main,
          }}
        >
          Dataset Download
        </Typography>
        <IconButton
          onClick={onClose}
          aria-label="Close dialog"
          sx={{
            position: "absolute",
            right: 14,
            color: rc8Theme.palette.text2,
          }}
        >
          <CancelIcon />
        </IconButton>
      </Box>
    </DialogTitle>
  );
};
