import { Button, Grid, Typography, useTheme } from "@mui/material";
import React from "react";

interface ShowMoreDetailButtonProps {
  title: string;
  isShowingMore: boolean;
  setIsShowingMore: (isShowingMore: boolean) => void;
}

const ShowMoreDetailBtn: React.FC<ShowMoreDetailButtonProps> = ({
  title,
  isShowingMore,
  setIsShowingMore,
}) => {
  const theme = useTheme();
  return (
    <Grid
      item
      md={12}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: theme.mp.lg,
      }}
    >
      <Button
        onClick={() => setIsShowingMore(!isShowingMore)}
        sx={{
          border: theme.border.detailSubtabBtn,
          borderRadius: theme.borderRadius.sm,
          "&:hover": {
            border: theme.border.detailSubtabBtn,
          },
        }}
      >
        <Typography variant="detailContent">
          {isShowingMore ? `Show Less ${title}` : `Show More ${title}`}
        </Typography>
      </Button>
    </Grid>
  );
};

export default ShowMoreDetailBtn;
