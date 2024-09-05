import React from "react";
import { Box, Button, useTheme } from "@mui/material";

interface DetailSubtabProps {
  title: string;
  navigate: () => void;
  isBordered: boolean;
}

const DetailSubtabBtn: React.FC<DetailSubtabProps> = ({
  title,
  navigate,
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
        sx={{
          width: "100%",
          border: border,
          "&:hover": {
            border: border,
          },
          borderRadius: theme.borderRadius.sm,
          justifyContent: "center",
          textAlign: "center",
        }}
        onClick={navigate}
      >
        {title}
      </Button>
    </Box>
  );
};

export default DetailSubtabBtn;
