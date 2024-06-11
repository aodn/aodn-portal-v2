import React from "react";
import { Grid } from "@mui/material";
import DetailsSubtabGroup from "../../../../components/common/tabs/DetailsSubtabGroup";
import SubPanel from "../subpanels/SubPanel";
import CollapseFragment from "../subpanels/CollapseFragment";

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
      <Grid item container md={8}>
        {subtabTitles.map((title) => {
          return (
            <SubPanel key={title} title={title}>
              <CollapseFragment title={"title of collapse"}>
                <h6>collapse content</h6>
              </CollapseFragment>
            </SubPanel>
          );
        })}
      </Grid>
    </Grid>
  );
};

export default AboutPanel;
