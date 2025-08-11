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
      // "&:first-of-type": {
      //   marginTop: "10px",
      //   borderTopLeftRadius: "6px",
      //   borderTopRightRadius: "6px",
      // },
      // // Apply last-child styles
      // "&:last-of-type": {
      //   borderBottomLeftRadius: "6px",
      //   borderBottomRightRadius: "6px",
      // },
    },
  };

  return (
    <Grid
      container
      direction="column"
      ref={ref}
      sx={{
        borderRadius: "6px",
        bgcolor: "red",
        padding: "4px",
        marginX: "10px",
      }}
    >
      {Children.map(children, (child, index) => {
        if (isValidElement(child)) {
          // Merge childStyles with the child's existing sx prop
          return cloneElement<any>(child, {
            className: className,
            parentRef: ref,
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
    </Grid>
  );
};

export default MenuControlGroup;
