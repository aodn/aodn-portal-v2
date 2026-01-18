import { Box, Grid, Typography, useTheme } from "@mui/material";
import React, { ReactNode, useState } from "react";
import ShowMoreDetailBtn from "../common/buttons/ShowMoreDetailBtn";
import NaList from "./NaList";
import EndpointedDiamondIcon from "../icon/EndpointedDiamondIcon";
import { InfoContentType } from "../info/InfoDefinition";
import InfoTip from "../info/InfoTip";
import { portalTheme } from "../../styles";

interface ExpandableListProps {
  title?: string;
  info?: InfoContentType;
  navigatable?: boolean;
  selected?: boolean;
  childrenList?: ReactNode[];
}

const ExpandableList: React.FC<ExpandableListProps> = ({
  title,
  info,
  navigatable = true,
  selected = false,
  childrenList = [],
}) => {
  const theme = useTheme();
  let showingCollapseCount = 0;
  const [isShowingMore, setIsShowingMore] = useState(false);
  return (
    <Grid container sx={{ marginTop: "6px" }}>
      {title !== "Statement" && (
        <Grid item xs={12} display="flex" alignItems="center">
          <Box display="flex" sx={{ ml: "12px" }}>
            {navigatable && (
              <Box display="flex" justifyContent="center" alignItems="center">
                <EndpointedDiamondIcon isHighlighted={selected} />
              </Box>
            )}
            <Typography
              display="inline"
              sx={{
                ...portalTheme.typography.heading4,
                color: portalTheme.palette.text2,
                pb: "6px",
                marginLeft: theme.mp.md,
              }}
              data-testid={`detail-sub-section-${title}`}
            >
              {title}
            </Typography>
          </Box>
          {info && (
            <Box
              sx={{ marginLeft: theme.mp.sm, mr: { xs: "20px", sm: "35px" } }}
            >
              <InfoTip infoContent={info} />
            </Box>
          )}
        </Grid>
      )}

      {!childrenList || childrenList.length === 0 ? (
        <NaList title={title ? title : ""} />
      ) : (
        <Grid item container md={12} data-testid={`collapse-list-${title}`}>
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
              title={title}
            />
          )}
        </Grid>
      )}
    </Grid>
  );
};

export default ExpandableList;
