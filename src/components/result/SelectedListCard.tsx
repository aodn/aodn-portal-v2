import React from "react";
import { LIST_CARD_GAP, LIST_CARD_HEIGHT } from "./constants";
import { gap } from "../../styles/constants";
import ListResultCard from "./ListResultCard";
import { Box } from "@mui/material";
import { OGCCollection } from "../common/store/OGCCollectionDefinitions";

interface SelectedListCardProps {
  content: OGCCollection;
  onClickCard: (uuid: string) => void;
}

const SelectedListCard: React.FC<SelectedListCardProps> = ({
  content,
  onClickCard,
}) => {
  return (
    <Box height={LIST_CARD_HEIGHT - LIST_CARD_GAP * 2} mb={gap.lg}>
      <ListResultCard
        content={content}
        onClickCard={onClickCard}
        isSelectedDataset
      />
    </Box>
  );
};

export default SelectedListCard;
