import React, { cloneElement, ReactNode, useState } from "react";
import { Collapse, Grid, Box } from "@mui/material";
import ItemBaseGrid from "./ItemBaseGrid";
import CollapseItemTitle from "./sub-item/CollapseItemTitle";
import CollapseBtn from "./sub-item/CollapseBtn";

interface CollapseItemProps {
  title?: string;
  children: ReactNode;
  isOpen?: boolean;
  icon?: ReactNode; // Icon always shown
  expandedIcon?: ReactNode; // Additional icon shown only when expanded
  onIconClick?: () => void; // Click handler for expandedIcon when visible
  titleComponent?: ReactNode; // Allow custom title component
  titleColor?: string; // Custom title color
  labels?: string[]; // Labels to display next to title
  arrowAlignment?: "top" | "center"; // "top" aligns arrow with the first title line
}

const CollapseItem: React.FC<CollapseItemProps> = ({
  title = "",
  children,
  isOpen = false,
  icon,
  expandedIcon,
  onIconClick,
  titleComponent,
  labels,
  arrowAlignment = "center",
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
      <Grid container data-testid="collapseItem" sx={{ width: "100%" }}>
        {/* Title content area (icon + title) */}
        <Grid size={children ? "grow" : 12}>
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              gap: 1,
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
            <Box flex={1}>
              <CollapseItemTitle
                text={title}
                titleComponent={titleElement()}
                labels={labels}
              />
            </Box>
          </Box>
        </Grid>

        {children && (
          <>
            {/* Collapse button */}
            <Grid
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: arrowAlignment === "top" ? "flex-start" : "center",
                // Center the arrow against the label chip on the first line
                pt: arrowAlignment === "top" ? "4px" : 0,
                // Keep the same visual gap on both sides of the arrow
                pl: "10px",
              }}
              data-testid={`collapse-btn-${
                (
                  titleComponent as
                    | React.ReactElement<{ link?: { title?: string } }>
                    | undefined
                )?.props?.link?.title ??
                title ??
                "[ NO TITLE ]"
              }`}
              size="auto"
            >
              <CollapseBtn onClick={toggleExpanded} isExpanded={isExpanded} />
            </Grid>

            {/* Collapsible content */}
            <Grid size={12}>
              <Collapse in={isExpanded}>
                <Box sx={{ pt: "10px" }}>{children}</Box>
              </Collapse>
            </Grid>
          </>
        )}
      </Grid>
    </ItemBaseGrid>
  );
};

export default CollapseItem;
