//Unused component
import React from "react";
import { GRID_CARD_HEIGHT, LIST_CARD_GAP } from "./constants";
import { gap } from "../../styles/constants";
import GridResultCard from "./GridResultCard";
import { Box } from "@mui/material";
import { ResultCard } from "./ResultCards";

interface SelectedGridCardProps extends ResultCard {}

const SelectedGridCard: React.FC<SelectedGridCardProps> = ({
  content,
  onClickCard,
  onClickDetail,
  onClickLinks,
  onClickDownload,
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
        onClickDetail={onClickDetail}
        onClickDownload={onClickDownload}
        onClickLinks={onClickLinks}
        isSelectedDataset
      />
    </Box>
  );
};

export default SelectedGridCard;
