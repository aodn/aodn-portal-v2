import { FC } from "react";
import { Box, Button, useTheme } from "@mui/material";
import { color } from "../../../styles/constants";

interface DetailSubtabProps {
  id?: string;
  title: string;
  onClick: () => void;
  isBordered: boolean;
}

const DetailSubtabBtn: FC<DetailSubtabProps> = ({
  id,
  title,
  onClick,
  isBordered,
}) => {
  const theme = useTheme();
  const border = isBordered ? theme.border.detailSubtabBtn : theme.border.nil;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-start",
        height: "45px",
        width: "160px",
        mx: theme.mp.lg,
      }}
    >
      <Button
        id={id}
        data-testid={id}
        sx={{
          width: "100%",
          border: border,
          "&:hover": {
            border: border,
            bgcolor: color.white.sixTenTransparent,
          },
          borderRadius: theme.borderRadius.sm,
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
