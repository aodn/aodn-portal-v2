import React from "react";
import { GRID_CARD_HEIGHT, LIST_CARD_GAP } from "./constants";
import { gap } from "../../styles/constants";
import GridResultCard from "./GridResultCard";
import { Box } from "@mui/material";

interface SelectedGridCardProps {
  content: any;
  onClickCard: (uuid: string) => void;
}

const SelectedGridCard: React.FC<SelectedGridCardProps> = ({
  content,
  onClickCard,
}) => {
  return (
    <Box
      width={"calc(50% - 7px)"}
      height={GRID_CARD_HEIGHT - LIST_CARD_GAP}
      mb={gap.lg}
    >
      <GridResultCard
        content={content}
        onClickCard={onClickCard}
        isSelectedDataset
      />
    </Box>
  );
};

export default SelectedGridCard;
