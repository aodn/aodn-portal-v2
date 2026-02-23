import React from "react";
import { Grid } from "@mui/material";
import NaItem from "./listItem/NaItem";

interface NaListProps {
  title: string;
  message?: string;
  cardSx?: React.CSSProperties;
  contentSx?: React.CSSProperties;
}

const NaList: React.FC<NaListProps> = ({
  title,
  message,
  cardSx,
  contentSx,
}) => {
  return (
    <Grid item container md={12}>
      <NaItem
        title={title}
        message={message}
        cardSx={cardSx}
        contentSx={contentSx}
      />
    </Grid>
  );
};

export default NaList;
