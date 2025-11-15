import React, { cloneElement, ReactNode, useState } from "react";
import { Collapse, Grid, Box } from "@mui/material";
import ItemBaseGrid from "./ItemBaseGrid";
import CollapseItemTitle from "./subitem/CollapseItemTitle";
import CollapseBtn from "./subitem/CollapseBtn";

interface CollapseItemProps {
  title?: string;
  children: ReactNode;
  isOpen?: boolean;
  icon?: ReactNode; // Icon always shown
  expandedIcon?: ReactNode; // Additional icon shown only when expanded
  onIconClick?: () => void; // Click handler for expandedIcon when visible
  titleComponent?: ReactNode; // Allow custom title component
  titleColor?: string; // Custom title color
}

const CollapseItem: React.FC<CollapseItemProps> = ({
  title = "",
  children,
  isOpen = false,
  icon,
  expandedIcon,
  onIconClick,
  titleComponent,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(isOpen);

  // Show expanded icon when expanded, otherwise show regular icon
  const currentIcon = isExpanded && expandedIcon ? expandedIcon : icon;

  // Check if the icon should be clickable
  const isIconClickable = Boolean(onIconClick && isExpanded && expandedIcon);

  const toggleExpanded = () => {
    return setIsExpanded((prev) => !prev);
  };

  const handleIconClick = (e: React.MouseEvent) => {
    if (isIconClickable) {
      e.stopPropagation(); // Prevent toggling when clicking icon
      onIconClick?.();
    }
  };

  // Inject state isExpanded into custom title component
  const titleElement = () => {
    if (titleComponent) {
      return cloneElement(titleComponent as React.ReactElement, {
        isExpanded,
      });
    }
  };

  return (
    <ItemBaseGrid>
      <Grid container data-testid="collapseItem">
        {/* Title content area (icon + title) */}
        <Grid item xs={children ? 11 : 12} onClick={toggleExpanded}>
          <Box
            sx={{
              cursor: "pointer",
              display: "flex",
              alignItems: "flex-start",
              gap: 1.5,
            }}
          >
            {/* Title icon section */}
            {currentIcon && (
              <Box
                onClick={handleIconClick}
                sx={{
                  cursor: isIconClickable ? "pointer" : "default",
                  flexShrink: 0,
                  pt: "10px",
                }}
              >
                {currentIcon}
              </Box>
            )}

            {/* Title text section */}
            <Box sx={{ flex: 1 }}>
              {/* {renderTitle()} */}
              <CollapseItemTitle
                // onClick={toggleExpanded}
                text={title}
                titleComponent={titleElement()}
              />
            </Box>
          </Box>
        </Grid>

        {children && (
          <>
            {/* Collapse button */}
            <Grid
              item
              xs={1}
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              <CollapseBtn onClick={toggleExpanded} isExpanded={isExpanded} />
            </Grid>

            {/* Collapsible content */}
            <Grid item xs={12}>
              <Collapse in={isExpanded}>{children}</Collapse>
            </Grid>
          </>
        )}
      </Grid>
    </ItemBaseGrid>
  );
};

export default CollapseItem;
