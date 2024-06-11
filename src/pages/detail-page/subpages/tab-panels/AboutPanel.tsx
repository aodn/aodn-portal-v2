import React, { useState } from "react";
import { Grid } from "@mui/material";
import DetailSubtabGroup from "../../../../components/common/tabs/DetailSubtabGroup";
import SubPanel from "../subpanels/SubPanel";
import CollapseFragment from "../subpanels/CollapseFragment";
import BulletedText from "../../../../components/common/texts/BulletedText";

const AboutPanel = () => {
  const subtabTitles = Object.freeze(["Keywords", "Contact", "Credit"]);
  const [selectedTab, setSelectedTab] = useState<string>(subtabTitles[0]);

  return (
    <Grid container>
      <Grid item container md={3}>
        <Grid item md={1} />
        <Grid item container md={11}>
          <DetailSubtabGroup
            titles={subtabTitles}
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
          />
        </Grid>
      </Grid>
      {/*selected subpanel should be on the top*/}
      <Grid item container md={8}>
        <SubPanel title={selectedTab}>
          <CollapseFragment
            title={selectedTab + "collapse"}
            isAutoExpanded={true}
          >
            <BulletedText>
              item 1, eerewsfjs oicxvjxf moodsfsdj iorrm js oif
            </BulletedText>
          </CollapseFragment>
          {/*  TODO: other collapse fragment should be rendered here*/}
        </SubPanel>
        {/*render other subpanels*/}

        {subtabTitles.map((title) => {
          if (title === selectedTab) {
            return null;
          }
          return (
            <SubPanel key={title} title={title}>
              <CollapseFragment
                title={title + "collapse"}
                isAutoExpanded={title === selectedTab}
              >
                <BulletedText>
                  item 1, eerewsfjs oicxvjxf moodsfsdj iorrm js oif
                </BulletedText>
              </CollapseFragment>
            </SubPanel>
          );
        })}
      </Grid>
    </Grid>
  );
};

export default AboutPanel;
