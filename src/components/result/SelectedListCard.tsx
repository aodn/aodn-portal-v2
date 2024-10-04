import React from "react";
import { LIST_CARD_GAP, LIST_CARD_HEIGHT } from "./constants";
import { gap } from "../../styles/constants";
import ListResultCard from "./ListResultCard";
import { Box } from "@mui/material";
import { OGCCollection } from "../common/store/OGCCollectionDefinitions";

interface SelectedListCardProps {
  content: OGCCollection;
  onDownload: (uuid: string, tab: string, section?: string) => void;
  onLink: (uuid: string, tab: string, section?: string) => void;
  onDetail: (uuid: string) => void;
  onClickCard: (uuid: string) => void;
}

const SelectedListCard: React.FC<SelectedListCardProps> = ({
  content,
  onDownload,
  onLink,
  onDetail,
  onClickCard,
}) => {
  return (
    <Box height={LIST_CARD_HEIGHT - LIST_CARD_GAP * 2} mb={gap.lg}>
      <ListResultCard
        content={content}
        onDownload={onDownload}
        onLink={onLink}
        onDetail={onDetail}
        onClickCard={onClickCard}
        isSelectedDataset
      />
    </Box>
  );
};

export default SelectedListCard;
