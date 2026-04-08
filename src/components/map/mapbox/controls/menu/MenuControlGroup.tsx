import React, {
  FC,
  cloneElement,
  isValidElement,
  useCallback,
  Children,
  useState,
} from "react";
import { Grid, SxProps, Theme } from "@mui/material";

interface MenuControlGroupProps {
  sx?: SxProps<Theme>;
  children?: React.ReactNode;
  className?: string;
}

// MenuControlGroup as a functional component, use to group menu icon together
const MenuControlGroup: FC<MenuControlGroupProps> = ({
  children,
  className = "menu-control-group",
}) => {
  const [containerNode, setContainerNode] = useState<HTMLDivElement | null>(
    null
  );
  const containerRefCallback = useCallback((node: HTMLDivElement | null) => {
    if (node !== null) {
      setContainerNode(node);
    }
  }, []);
  // Define the styles to apply to children
  const childStyles: SxProps<Theme> = {
    // Target the mapboxgl-ctrl-group class on the child's rendered div
    [`&.${className}`]: {
      width: "40px",
      borderRadius: 0,
      background: "#FFF",
      boxShadow: "none",
      "& button + button": {
        borderTop: "none",
      },
      marginY: 0,
      mx: "1px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
  };

  return (
    <Grid
      container
      direction="column"
      ref={containerRefCallback}
      sx={{
        width: "42px",
        bgcolor: "#FFF",
        borderRadius: "6px",
        boxShadow: "4px 4px 4px 0px rgba(0, 0, 0, 0.10)",
        mt: "10px",
        mr: "10px",
        py: "2px",
      }}
    >
      {containerNode &&
        Children.toArray(children).map((child, index) => {
          if (isValidElement(child)) {
            return cloneElement<any>(child, {
              key: child.key || index,
              className: className,
              parentRef: { current: containerNode },
              sx: childStyles,
            });
          }
          return child;
        })}
    </Grid>
  );
};

export default MenuControlGroup;
