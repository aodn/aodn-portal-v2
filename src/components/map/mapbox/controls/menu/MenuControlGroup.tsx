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
      // Modify this selector as needed for layout
      "&:first-of-type": {
        marginTop: "10px",
        borderTopLeftRadius: "6px",
        borderTopRightRadius: "6px",
      },

      "&:last-of-type": {
        marginBottom: "10px",
        borderBottomLeftRadius: "6px",
        borderBottomRightRadius: "6px",
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
