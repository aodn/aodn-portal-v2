import React, { FC, cloneElement, isValidElement, Children } from "react";
import { Box, SxProps, Theme } from "@mui/material";

// Define the props for MenuControlGroup
interface MenuControlGroupProps {
  sx?: SxProps<Theme>;
  children?: React.ReactNode;
}

// MenuControlGroup as a functional component
const MenuControlGroup: FC<MenuControlGroupProps> = ({ children }) => {
  // Define the styles to apply to children
  const childStyles: SxProps<Theme> = {
    // Target the mapboxgl-ctrl-group class on the child"s rendered div
    "&.mapboxgl-ctrl-group": {
      borderRadius: "6px",
      background: "red",
      boxShadow: "4px 4px 4px 0px rgba(0, 0, 0, 0.10)",
      width: "45px",
      margin: "10px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    // Target buttons or controls inside the mapboxgl-ctrl-group
    "&.mapboxgl-ctrl-group .mapboxgl-ctrl": {
      margin: "3.2px 0",
      border: "none",
      boxShadow: "none",
      width: "100%",
      display: "flex",
      justifyContent: "center",
      "& button": {
        height: "40px",
        borderRadius: "6px",
        minWidth: "40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      },
    },
  };

  return (
    <Box>
      {Children.map(children, (child) => {
        if (isValidElement(child)) {
          // Merge childStyles with the child"s existing sx prop
          return cloneElement<any>(child, {
            sx: [
              childStyles,
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
