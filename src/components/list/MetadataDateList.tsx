import React from "react";
import ExpandableList from "./ExpandableList";
import ItemBaseGrid from "./listItem/ItemBaseGrid";
import { Grid, Typography, useTheme } from "@mui/material";

interface MetadataDateListProps {
  creation?: string;
  revision?: string;
  selected?: boolean;
}

const MetadataDateList: React.FC<MetadataDateListProps> = ({
  creation,
  revision,
  selected = false,
}) => {
  const theme = useTheme();
  const metadataDateItem =
    creation || revision ? (
      <ItemBaseGrid container key="Metadata date">
        {creation && (
          <Grid item md={12} sx={{ marginTop: theme.mp.sm }}>
            <Typography variant="detailContent">
              <b>CREATION: </b>
              {creation}
            </Typography>
          </Grid>
        )}

        {revision && (
          <Grid item md={12} sx={{ marginTop: theme.mp.sm }}>
            <Typography variant="detailContent">
              <b>REVISION: </b>
              {revision}
            </Typography>
          </Grid>
        )}
      </ItemBaseGrid>
    ) : undefined;

  return (
    <ExpandableList
      selected={selected}
      childrenList={metadataDateItem ? [metadataDateItem] : []}
      title="Metadata Dates"
    />
  );
};

export default MetadataDateList;
