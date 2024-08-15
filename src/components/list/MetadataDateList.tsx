import React from "react";
import ExpandableList from "./ExpandableList";
import StyledItemGrid from "./listItem/StyledItemGrid";
import { Grid, Typography, useTheme } from "@mui/material";

interface MetadataDateListProps {
  creation?: string;
  revision?: string;
}

const MetadataDateList: React.FC<MetadataDateListProps> = ({
  creation,
  revision,
}) => {
  const theme = useTheme();
  const metadataDateItem = (
    <StyledItemGrid container key="Metadata date">
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
    </StyledItemGrid>
  );

  return (
    <ExpandableList childrenList={[metadataDateItem]} title="Metadata Dates" />
  );
};

export default MetadataDateList;
