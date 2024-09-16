import { Box, Button, Grid, Typography, useTheme } from "@mui/material";
import React from "react";
import PlusIcon from "../../icon/PlusIcon";
import MinusIcon from "../../icon/MinusIcon";

interface ShowMoreDetailButtonProps {
  isShowingMore: boolean;
  setIsShowingMore: (isShowingMore: boolean) => void;
}

const ShowMoreDetailBtn: React.FC<ShowMoreDetailButtonProps> = ({
  isShowingMore,
  setIsShowingMore,
}) => {
  const theme = useTheme();

  function generateShowMoreBtnContent() {
    return (
      <>
        <Typography variant="detailContent" color="#54BCEB">
          {isShowingMore ? "Show Less " : "Show More "}
        </Typography>
        <Box sx={{ width: "9px" }} />
        {isShowingMore ? <MinusIcon /> : <PlusIcon />}
      </>
    );
  }

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
          border: theme.border.detailBtnLight,
          borderRadius: theme.borderRadius.sm,
          "&:hover": {
            border: theme.border.detailSubtabBtn,
          },
        }}
      >
        {generateShowMoreBtnContent()}
      </Button>
    </Grid>
  );
};

export default ShowMoreDetailBtn;
