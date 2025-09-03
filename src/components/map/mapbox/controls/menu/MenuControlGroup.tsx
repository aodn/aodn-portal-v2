import React, {
  FC,
  cloneElement,
  isValidElement,
  Children,
  useRef,
} from "react";
import { Grid, SxProps, Theme } from "@mui/material";

// Define the props for MenuControlGroup
interface MenuControlGroupProps {
  sx?: SxProps<Theme>;
  children?: React.ReactNode;
  className?: string;
}

// MenuControlGroup as a functional component
const MenuControlGroup: FC<MenuControlGroupProps> = ({
  children,
  className = "menu-control-group",
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const allChildren = Children.toArray(children);

  // Calculate which children are visible and determine first/last visible indices
  const childrenWithVisibility = allChildren.map((child, index) => ({
    child,
    index,
    isVisible: isValidElement(child) ? child.props.visible !== false : true,
  }));

  const visibleIndices = childrenWithVisibility
    .filter((item) => item.isVisible)
    .map((item) => item.index);

  const firstVisibleIndex = visibleIndices[0];
  const lastVisibleIndex = visibleIndices[visibleIndices.length - 1];

  // Base styles for all children
  const baseChildStyles: SxProps<Theme> = {
    [`&.${className}`]: {
      borderRadius: 0,
      background: "#FFF",
      boxShadow: "4px 4px 4px 0px rgba(0, 0, 0, 0.10)",
      width: "45px",
      marginX: "10px",
      marginY: 0,
      padding: "4px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
  };

  // First child specific styles
  const firstChildStyles: SxProps<Theme> = {
    [`&.${className}`]: {
      marginTop: "10px",
      borderTopLeftRadius: "6px",
      borderTopRightRadius: "6px",
    },
  };

  // Last child specific styles
  const lastChildStyles: SxProps<Theme> = {
    [`&.${className}`]: {
      borderBottomLeftRadius: "6px",
      borderBottomRightRadius: "6px",
    },
  };

  return (
    <Grid container direction="column" ref={ref}>
      {allChildren.map((child, index) => {
        if (isValidElement(child)) {
          const isVisible = child.props.visible !== false;
          const isFirstVisible = index === firstVisibleIndex;
          const isLastVisible = index === lastVisibleIndex;

          // Build styles array based on position
          const childStylesArray = [baseChildStyles];

          if (isFirstVisible) {
            childStylesArray.push(firstChildStyles);
          }

          if (isLastVisible) {
            childStylesArray.push(lastChildStyles);
          }

          // Add visibility control
          childStylesArray.push({
            display: isVisible ? "flex" : "none",
          });

          // Add any existing styles from the child
          if (Array.isArray(child.props.sx)) {
            childStylesArray.push(...child.props.sx);
          } else if (child.props.sx) {
            childStylesArray.push(child.props.sx);
          }

          return cloneElement<any>(child, {
            key: child.key || index,
            className: className,
            parentRef: ref,
            sx: childStylesArray,
          });
        }
        return child;
      })}
    </Grid>
  );
};

export default MenuControlGroup;
