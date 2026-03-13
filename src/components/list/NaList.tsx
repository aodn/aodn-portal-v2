import React from "react";
import { Grid, SxProps } from "@mui/material";
import NaItem from "./listItem/NaItem";

interface NaListProps {
  title: string;
  message?: string;
  cardSx?: SxProps;
  contentSx?: SxProps;
  onClick?: () => void;
}

const NaList: React.FC<NaListProps> = ({
  title,
  message,
  cardSx,
  contentSx,
  onClick,
}) => {
  return (
    <Grid item container md={12}>
      <NaItem
        title={title}
        message={message}
        cardSx={cardSx}
        contentSx={contentSx}
        onClick={onClick}
      />
    </Grid>
  );
};

export default NaList;
