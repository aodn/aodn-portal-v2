import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { portalTheme } from "../../../../../styles";
import { borderRadius } from "../../../../../styles/constants";

interface MenuTitleProps {
  title: string;
  onClose: () => void;
}

export const switcherTitleTypographySx = {
  minHeight: "40px",
  backgroundColor: portalTheme.palette.primary4,
  borderRadius: borderRadius["menuTop"],
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  ...portalTheme.typography.title1Medium,
};

const MenuTitle: React.FC<MenuTitleProps> = ({ title, onClose }) => {
  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
  };

  return (
    <Box sx={switcherTitleTypographySx}>
      <Typography sx={{ ...portalTheme.typography.title1Medium }}>
        {title}
      </Typography>
      <IconButton
        size="small"
        onClick={handleClose}
        sx={{
          mt: "4px",
          position: "absolute",
          right: "4px",
        }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </Box>
  );
};

export default MenuTitle;
