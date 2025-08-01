import { Box, Grid, Typography, useTheme } from "@mui/material";
import React, { ReactNode, useState } from "react";
import ShowMoreDetailBtn from "../common/buttons/ShowMoreDetailBtn";
import NaList from "./NaList";
import EndpointedDiamondIcon from "../icon/EndpointedDiamondIcon";
import { InfoContentType } from "../info/InfoDefinition";
import InfoTip from "../info/InfoTip";
import rc8Theme from "../../styles/themeRC8";

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
    <Grid container sx={{ marginTop: theme.mp.md }}>
      {title !== "Statement" && (
        <Grid item md={12} display="flex" alignItems="center">
          {navigatable && (
            <Box display="flex" justifyContent="center" alignItems="center">
              <EndpointedDiamondIcon isHighlighted={selected} />
            </Box>
          )}
          <Typography
            display="inline"
            variant="heading4"
            color={rc8Theme.palette.text2}
            sx={{
              marginLeft: theme.mp.md,
            }}
            data-testid={`detail-sub-section-${title}`}
          >
            {title}
          </Typography>
          {info && (
            <Box sx={{ marginLeft: theme.mp.sm }}>
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
