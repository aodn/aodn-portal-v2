import React from "react";
import { Grid } from "@mui/material";
import NaItem from "./listItem/NaItem";

interface NaListProps {
  title: string;
}

const NaList: React.FC<NaListProps> = ({ title }) => {
  return (
    <Grid item container md={12}>
      <NaItem title={title} />
    </Grid>
  );
};

export default NaList;
