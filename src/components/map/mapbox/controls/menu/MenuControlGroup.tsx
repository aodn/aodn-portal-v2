import React, {
  FC,
  cloneElement,
  isValidElement,
  Children,
  useEffect,
} from "react";
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
    // Target the mapboxgl-ctrl-group class on the child"s rendered div
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

  // Apply styles after component mounts
  useEffect(() => {
    const menuElements = document.querySelectorAll(`.${className}`);

    if (menuElements.length > 0) {
      // Style first element
      const firstElement = menuElements[0] as HTMLElement;
      firstElement.style.marginTop = "10px";
      firstElement.style.borderTopLeftRadius = "6px";
      firstElement.style.borderTopRightRadius = "6px";

      // Style last element
      const lastElement = menuElements[menuElements.length - 1] as HTMLElement;
      lastElement.style.borderBottomLeftRadius = "6px";
      lastElement.style.borderBottomRightRadius = "6px";
    }
  }, [className, children]);

  return (
    <Box>
      {Children.map(children, (child) => {
        if (isValidElement(child)) {
          // Merge childStyles with the child"s existing sx prop
          return cloneElement<any>(child, {
            className: className,
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
