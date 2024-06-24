import { Button, Grid, Typography } from "@mui/material";
import React, { ReactNode, useState } from "react";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";

interface BlockListProps {
  title: string;
  childrenList: ReactNode[];
}

const BlockList: React.FC<BlockListProps> = ({ title, childrenList = [] }) => {
  let showingCollapseCount = 0;
  const [isShowingMore, setIsShowingMore] = useState(false);
  return (
    <Grid container spacing={2}>
      <Grid item md={12} display="flex" alignItems="center">
        <KeyboardDoubleArrowRightIcon />
        <Typography display="inline" variant="h3" sx={{ paddingTop: "0px" }}>
          {title}
        </Typography>
      </Grid>
      <Grid item container md={12}>
        {childrenList.map((child) => {
          showingCollapseCount++;
          if (!isShowingMore && showingCollapseCount > 5) {
            return null;
          }
          return child;
        })}

        {childrenList.length > 5 && (
          <Button onClick={() => setIsShowingMore(!isShowingMore)}>
            {isShowingMore ? `Show less ${title}` : `Show more ${title}`}
          </Button>
        )}
      </Grid>
    </Grid>
  );
};

export default BlockList;
