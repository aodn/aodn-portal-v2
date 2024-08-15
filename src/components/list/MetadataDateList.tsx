import React from "react";
import ExpandableList from "./ExpandableList";
import StyledItemGrid from "./listItem/StyledItemGrid";
import { Grid, Typography, useTheme } from "@mui/material";

interface MetadataDateListProps {
  title?: string;
  creation?: string;
  revision?: string;
}

const MetadataDateList: React.FC<MetadataDateListProps> = ({
  title,
  creation,
  revision,
}) => {
  const theme = useTheme();
  const metadataDateItem = (
    <StyledItemGrid container>
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

  return <ExpandableList childrenList={[metadataDateItem]} title={title} />;
};

export default MetadataDateList;
