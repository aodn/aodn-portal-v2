import React from "react";
import { GRID_CARD_HEIGHT, LIST_CARD_GAP } from "./constants";
import { gap } from "../../styles/constants";
import GridResultCard from "./GridResultCard";
import { Box } from "@mui/material";

interface SelectedGridCardProps {
  content: any;
  onDownload: (uuid: string, tab: string, section?: string) => void;
  onLink: (uuid: string, tab: string, section?: string) => void;
  onDetail: (uuid: string) => void;
  onClickCard: (uuid: string) => void;
}

const SelectedGridCard: React.FC<SelectedGridCardProps> = ({
  content,
  onDownload,
  onLink,
  onDetail,
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
        onDownload={onDownload}
        onLink={onLink}
        onClickCard={onClickCard}
        onDetail={onDetail}
        isSelectedDataset
      />
    </Box>
  );
};

export default SelectedGridCard;
