import React, { FC, cloneElement, isValidElement, Children } from "react";
import { Box, SxProps, Theme } from "@mui/material";

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
  // Define the styles to apply to children
  const childStyles: SxProps<Theme> = {
    // Target the mapboxgl-ctrl-group class on the child's rendered div
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
      // Apply first-child styles
      "&:first-of-type": {
        marginTop: "10px",
        borderTopLeftRadius: "6px",
        borderTopRightRadius: "6px",
      },
      // Apply last-child styles
      "&:last-of-type": {
        borderBottomLeftRadius: "6px",
        borderBottomRightRadius: "6px",
      },
    },
  };

  return (
    <Box>
      {Children.map(children, (child, index) => {
        if (isValidElement(child)) {
          const childCount = Children.count(children);
          const isFirst = index === 0;
          const isLast = index === childCount - 1;

          // Create additional styles for first/last elements
          const additionalStyles: SxProps<Theme> = {
            [`&.${className}`]: {
              ...(isFirst && {
                marginTop: "10px",
                borderTopLeftRadius: "6px",
                borderTopRightRadius: "6px",
              }),
              ...(isLast && {
                borderBottomLeftRadius: "6px",
                borderBottomRightRadius: "6px",
              }),
            },
          };

          // Merge childStyles with the child's existing sx prop
          return cloneElement<any>(child, {
            className: className,
            sx: [
              childStyles,
              additionalStyles,
              ...(Array.isArray(child.props.sx)
                ? child.props.sx
                : [child.props.sx]),
            ],
          });
        }
        return child;
      })}
    </Box>
  );
};

export default MenuControlGroup;
