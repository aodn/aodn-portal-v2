import React, {
  FC,
  cloneElement,
  isValidElement,
  Children,
  useRef,
} from "react";
import { Grid, SxProps, Theme } from "@mui/material";

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

  // Define the styles to apply to children
  const childStyles: SxProps<Theme> = {
    // Target the mapboxgl-ctrl-group class on the child's rendered div
    [`&.${className}`]: {
      width: "43px",
      borderRadius: 0,
      background: "#FFF",
      boxShadow: "none",
      marginY: 0,
      mx: "1px",
      padding: "4px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
  };

  return (
    <Grid
      container
      direction="column"
      ref={ref}
      sx={{
        width: "46px",
        bgcolor: "#FFF",
        borderRadius: "6px",
        boxShadow: "4px 4px 4px 0px rgba(0, 0, 0, 0.10)",
        mt: "10px",
        mr: "10px",
        py: "3px",
      }}
    >
      {Children.toArray(children).map((child, index) => {
        if (isValidElement(child)) {
          // Don't render if visible is explicitly false
          if (child.props.visible === false) return null;

          return cloneElement<any>(child, {
            key: child.key || index,
            className: className,
            parentRef: ref,
            sx: childStyles,
          });
        }
        return child;
      })}
    </Grid>
  );
};

export default MenuControlGroup;
