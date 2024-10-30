import React from "react";
import { LIST_CARD_GAP, LIST_CARD_HEIGHT } from "./constants";
import { gap } from "../../styles/constants";
import ListResultCard from "./ListResultCard";
import { Box } from "@mui/material";
import { OGCCollection } from "../common/store/OGCCollectionDefinitions";
import { ItemCardProps } from "./ResultCards";

interface SelectedListCardProps extends ItemCardProps {}

const SelectedListCard: React.FC<SelectedListCardProps> = ({
  content,
  onClickCard,
  onClickDetail,
  onClickLinks,
  onClickDownload,
}) => {
  return (
    <Box height={LIST_CARD_HEIGHT - LIST_CARD_GAP * 2} mb={gap.lg}>
      <ListResultCard
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

export default SelectedListCard;
