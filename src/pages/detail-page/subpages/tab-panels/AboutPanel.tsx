import React, { useState } from "react";
import { Grid } from "@mui/material";
import DetailSubtabGroup from "../../../../components/common/tabs/DetailSubtabGroup";
import SubPanel from "../subpanels/SubPanel";
import CollapseFragment from "../subpanels/CollapseFragment";
import BulletedText from "../../../../components/common/texts/BulletedText";

const AboutPanel = () => {
  const readOnlySubtabTitles = Object.freeze(["Keywords", "Contact", "Credit"]);
  const [selectedTab, setSelectedTab] = useState<string>(
    readOnlySubtabTitles[0]
  );
  const sortedSubtabTitles = [...readOnlySubtabTitles].sort((a, b) =>
    a === selectedTab ? -1 : b === selectedTab ? 1 : 0
  );

  return (
    <Grid container>
      <Grid item container md={3}>
        <Grid item md={1} />
        <Grid item container md={11}>
          <DetailSubtabGroup
            titles={readOnlySubtabTitles}
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
          />
        </Grid>
      </Grid>
      <Grid item container md={8}>
        {sortedSubtabTitles.map((title) => {
          return (
            <SubPanel key={title} title={title} isOnTop={title === selectedTab}>
              <CollapseFragment
                title={title + "collapse"}
                isOnTop={title === selectedTab}
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
