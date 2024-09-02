import { Box, Grid, Typography, useTheme } from "@mui/material";
import React, { ReactNode, useState } from "react";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import ShowMoreDetailBtn from "../common/buttons/ShowMoreDetailBtn";
import NaList from "./NaList";

interface ExpandableListProps {
  title?: string;
  childrenList: ReactNode[];
}

const ExpandableList: React.FC<ExpandableListProps> = ({
  title,
  childrenList = [],
}) => {
  const theme = useTheme();
  let showingCollapseCount = 0;
  const [isShowingMore, setIsShowingMore] = useState(false);
  return (
    <Grid container sx={{ marginTop: theme.mp.md }}>
      {title !== "Statement" && (
        <Grid item md={12} display="flex" alignItems="center">
          <Box display="flex" justifyContent="center" alignItems="center">
            <KeyboardDoubleArrowRightIcon />
          </Box>
          <Typography
            display="inline"
            variant="detailTitle"
            sx={{
              marginLeft: theme.mp.sm,
            }}
            data-testid={`detail-sub-section-${title}`}
          >
            {title}
          </Typography>
        </Grid>
      )}

      {!childrenList || childrenList.length === 0 ? (
        <NaList title={title ? title : ""} />
      ) : (
        <Grid item container md={12}>
          {childrenList.map((child) => {
            showingCollapseCount++;
            if (!isShowingMore && showingCollapseCount > 5) {
              return null;
            }
            return child;
          })}
          {childrenList.length > 5 && (
            <ShowMoreDetailBtn
              isShowingMore={isShowingMore}
              setIsShowingMore={setIsShowingMore}
              title={title ? title : ""}
            />
          )}
        </Grid>
      )}
    </Grid>
  );
};

export default ExpandableList;
