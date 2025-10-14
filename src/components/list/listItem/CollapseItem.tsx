import React, { cloneElement, ReactNode, useState } from "react";
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
  titleColor = rc8Theme.palette.text1,
  collapseBtnColor = rc8Theme.palette.text2,
}) => {
  const [isExpanded, setIsExpanded] = useState(isOpen);

  // Show expanded icon when expanded, otherwise show regular icon
  const currentIcon = isExpanded && expandedIcon ? expandedIcon : icon;

  // Check if the icon should be clickable
  const isIconClickable = onIconClick && isExpanded && expandedIcon;

  const toggleExpanded = () => setIsExpanded(!isExpanded);

  const handleIconClick = (e: React.MouseEvent) => {
    if (isIconClickable) {
      e.stopPropagation(); // Prevent toggling when clicking icon
      onIconClick();
    }
  };

  const renderTitle = () => {
    if (titleComponent) {
      // Inject isExpanded and setIsExpanded into custom title component
      return cloneElement(titleComponent as React.ReactElement, {
        isExpanded,
        setIsExpanded,
      });
    }

    // Use default title component
    return (
      <CollapseItemTitle
        setIsExpanded={setIsExpanded}
        text={title}
        color={titleColor}
      />
    );
  };

  return (
    <ItemBaseGrid>
      <Grid container data-testid="collapseItem">
        {/* Main content area (icon + title) */}
        <Grid item xs={11} sx={{ alignSelf: "flex-start" }}>
          <Grid
            container
            alignItems="flex-start"
            onClick={toggleExpanded}
            sx={{ cursor: "pointer" }}
          >
            {/* Icon section */}
            {currentIcon && (
              <Grid
                item
                xs={2}
                md={1}
                onClick={handleIconClick}
                sx={{
                  cursor: isIconClickable ? "pointer" : "default",
                  pt: "8px",
                }}
              >
                {currentIcon}
              </Grid>
            )}

            {/* Title section */}
            <Grid item xs={currentIcon ? 10 : 12}>
              {renderTitle()}
            </Grid>
          </Grid>
        </Grid>

        {/* Collapse button */}
        <Grid
          item
          xs={1}
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "flex-start",
            pt: "10px",
          }}
        >
          <CollapseBtn
            setIsExpanded={setIsExpanded}
            isExpanded={isExpanded}
            iconColor={collapseBtnColor}
          />
        </Grid>

        {/* Collapsible content */}
        <Grid item xs={12}>
          <Collapse in={isExpanded}>{children || "[ NO CONTENT ]"}</Collapse>
        </Grid>
      </Grid>
    </ItemBaseGrid>
  );
};

export default CollapseItem;
