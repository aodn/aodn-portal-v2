import React, { ReactNode, useState } from "react";
import { Collapse, Grid } from "@mui/material";
import ItemBaseGrid from "./ItemBaseGrid";
import CollapseItemTitle from "./subitem/CollapseItemTitle";
import CollapseBtn from "./subitem/CollapseBtn";
import rc8Theme from "../../../styles/themeRC8";

interface CollapseItemProps {
  title?: string;
  children: ReactNode;
  isOpen?: boolean;
  icon?: ReactNode; // Icon always shown
  expandedIcon?: ReactNode; // Additional icon shown only when expanded
  onIconClick?: () => void; // Click handler for expandedIcon when visible
  titleComponent?: ReactNode; // Allow custom title component
  useBaseGrid?: boolean; // Control whether to use ItemBaseGrid
  titleColor?: string; // Custom title color
  collapseBtnColor?: string; // Custom collapse button icon color
}

const CollapseItem: React.FC<CollapseItemProps> = ({
  title = "",
  children,
  isOpen = false,
  icon,
  expandedIcon,
  onIconClick,
  titleComponent,
  useBaseGrid = true,
  titleColor = rc8Theme.palette.text1,
  collapseBtnColor = rc8Theme.palette.text2,
}) => {
  const [isExpanded, setIsExpanded] = useState(isOpen);

  const Wrapper = useBaseGrid ? ItemBaseGrid : Grid;
  const displayIcon = isExpanded && expandedIcon ? expandedIcon : icon;

  return (
    <Wrapper container data-testid="collapseItem">
      <Grid item xs={11} sx={{ alignSelf: "flex-start" }}>
        <Grid
          container
          alignItems="flex-start"
          onClick={() => setIsExpanded(!isExpanded)}
          sx={{ cursor: "pointer" }}
        >
          {displayIcon && (
            <Grid
              item
              xs={2}
              md={1}
              onClick={(e) => {
                if (onIconClick && isExpanded && expandedIcon) {
                  e.stopPropagation();
                  onIconClick();
                }
              }}
              sx={{
                cursor:
                  onIconClick && isExpanded && expandedIcon
                    ? "pointer"
                    : "default",
                pt: "8px",
              }}
            >
              {displayIcon}
            </Grid>
          )}
          <Grid item xs={displayIcon ? 10 : 12}>
            {titleComponent ? (
              React.cloneElement(titleComponent as React.ReactElement, {
                isExpanded,
                setIsExpanded,
              })
            ) : (
              <CollapseItemTitle
                setIsExpanded={setIsExpanded}
                text={title}
                color={titleColor}
              />
            )}
          </Grid>
        </Grid>
      </Grid>
      <Grid
        item
        xs={1}
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "flex-start",
          pt: displayIcon ? "8px" : 0,
        }}
      >
        <CollapseBtn
          setIsExpanded={setIsExpanded}
          isExpanded={isExpanded}
          iconColor={collapseBtnColor}
        />
      </Grid>
      <Grid item xs={12}>
        <Collapse in={isExpanded}>
          {children ? children : "[ NO CONTENT ]"}
        </Collapse>
      </Grid>
    </Wrapper>
  );
};

export default CollapseItem;
