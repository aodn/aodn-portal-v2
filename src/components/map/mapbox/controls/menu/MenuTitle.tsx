import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { portalTheme } from "../../../../../styles";
import { borderRadius } from "../../../../../styles/constants";
import useBreakpoint from "../../../../../hooks/useBreakpoint";
import { mapboxIconButtonResetSx } from "./MenuControl";

interface MenuTitleProps {
  title: string;
  onClose: () => void;
}

export const switcherTitleTypographySx = {
  position: "relative",
  minHeight: "40px",
  backgroundColor: portalTheme.palette.primary4,
  borderRadius: borderRadius["menuTop"],
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  ...portalTheme.typography.title1Medium,
};

const MenuTitle: React.FC<MenuTitleProps> = ({ title, onClose }) => {
  const { isSmallMobile } = useBreakpoint();

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
  };

  return (
    <Box sx={switcherTitleTypographySx}>
      <Typography
        sx={{
          ...portalTheme.typography.title1Medium,
          ...(isSmallMobile && {
            whiteSpace: "normal",
            px: "32px", // Reserve space for close button on small screens
            textAlign: "center",
          }),
        }}
      >
        {title}
      </Typography>
      <IconButton
        size="small"
        onClick={handleClose}
        sx={{
          position: "absolute",
          right: "6px",
          ...mapboxIconButtonResetSx,
        }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </Box>
  );
};

export default MenuTitle;
