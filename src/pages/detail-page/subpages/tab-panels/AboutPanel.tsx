import React from "react";
import { Grid } from "@mui/material";
import DetailSubtab from "../../../../components/common/tabs/DetailSubtab";
import DetailsSubtabGroup from "../../../../components/common/tabs/DetailsSubtabGroup";

const AboutPanel = () => {
  const subtabTitles = ["Keywords", "Contact", "Credit"];

  return (
    <Grid container>
      <Grid item container md={3}>
        <Grid item md={1} />
        <Grid item container md={11}>
          <DetailsSubtabGroup titles={subtabTitles} />
        </Grid>
      </Grid>
      <Grid item container md={8} sx={{ backgroundColor: "green" }}>
        {" "}
        main
      </Grid>
    </Grid>
  );
};

export default AboutPanel;
