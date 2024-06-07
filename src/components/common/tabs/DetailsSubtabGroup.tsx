import { Grid } from "@mui/material";
import DetailSubtab from "./DetailSubtab";
import React, { useState } from "react";

interface DetailsSubtabGroupProps {
  titles: string[];
}

const DetailsSubtabGroup: React.FC<DetailsSubtabGroupProps> = ({ titles }) => {
  const [selectedTab, setSelectedTab] = useState<string>(titles[0]);

  return (
    <Grid container>
      {titles.map((title) => {
        return (
          <Grid item key={title}>
            <DetailSubtab
              title={title}
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
            />
          </Grid>
        );
      })}

      {/*<Grid item md={12}>*/}
      {/*  <DetailSubtab title={"Keywords"} selectedTab={"Keywords"} />*/}
      {/*</Grid>*/}
      {/*<Grid item md={12}>*/}
      {/*  {" "}*/}
      {/*  <DetailSubtab title={"Contact"} selectedTab={"Keywords"} />*/}
      {/*</Grid>*/}
      {/*<Grid item md={12}>*/}
      {/*  {" "}*/}
      {/*  <DetailSubtab title={"Credit"} selectedTab={"Keywords"} />*/}
      {/*</Grid>*/}
    </Grid>
  );
};

export default DetailsSubtabGroup;
