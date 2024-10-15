import React from "react";
import { Box, Button, useTheme } from "@mui/material";
import { color } from "../../../styles/constants";

interface DetailSubtabProps {
  id?: string;
  title: string;
  onClick: () => void;
  isBordered: boolean;
}

const DetailSubtabBtn: React.FC<DetailSubtabProps> = ({
  id,
  title,
  onClick,
  isBordered,
}) => {
  const theme = useTheme();

  const border = isBordered ? theme.border.detailSubtabBtn : theme.border.nil;
  return (
    <Box
      display="flex"
      justifyContent="flex-start"
      sx={{
        height: "45px",
        width: "160px",
        marginX: theme.mp.lg,
      }}
    >
      <Button
        id={id}
        sx={{
          width: "100%",
          border: border,
          "&:hover": {
            border: border,
            backgroundColor: color.white.sixTenTransparent,
          },
          borderRadius: theme.borderRadius.sm,
          justifyContent: "center",
          textAlign: "center",
          backgroundColor: "#fff",
        }}
        onClick={onClick}
      >
        {title}
      </Button>
    </Box>
  );
};

export default DetailSubtabBtn;
