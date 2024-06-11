import { Grid } from "@mui/material";
import DetailSubtab from "./DetailSubtab";
import React from "react";

interface DetailSubtabGroupProps {
  titles: readonly string[];
  selectedTab?: string;
  setSelectedTab?: (tab: string) => void;
}

const DetailSubtabGroup: React.FC<DetailSubtabGroupProps> = ({
  titles,
  selectedTab,
  setSelectedTab,
}) => {
  return (
    <Grid item>
      {titles.map((title) => {
        return (
          <DetailSubtab
            key={title}
            title={title}
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
          />
        );
      })}
    </Grid>
  );
};

export default DetailSubtabGroup;
