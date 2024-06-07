import React from "react";
import { Grid } from "@mui/material";
import DetailSubtab from "../../../../components/common/tabs/DetailSubtab";

const AboutCard = () => {
  return (
    <Grid container>
      <Grid item container md={3}>
        <Grid item md={1} />
        <Grid item container md={11}>
          <Grid item md={12}>
            <DetailSubtab title={"Keywords"} selectedTab={"Keywords"} />
          </Grid>
          <Grid item md={12}>
            {" "}
            <DetailSubtab title={"Contact"} selectedTab={"Keywords"} />
          </Grid>
          <Grid item md={12}>
            {" "}
            <DetailSubtab title={"Credit"} selectedTab={"Keywords"} />
          </Grid>
        </Grid>
      </Grid>
      <Grid item container md={8} sx={{ backgroundColor: "green" }}>
        {" "}
        main
      </Grid>
    </Grid>
  );
};

export default AboutCard;
