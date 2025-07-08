import React, { FC, cloneElement, isValidElement, Children } from "react";
import { Box, SxProps, Theme } from "@mui/material";
import {
  borderRadius,
  color,
  fontColor,
  fontFamily,
  fontSize,
  fontWeight,
} from "../../../../../styles/constants";
import grey from "../../../../common/colors/grey";
import {
  bottomPadding,
  leftPadding,
  rightPadding,
  topPadding,
} from "./MenuControl";

// Define the props for MenuControlGroup
interface MenuControlGroupProps {
  sx?: SxProps<Theme>;
  children?: React.ReactNode;
  className?: string;
}

export const switcherIconButtonSx = (open: boolean) => ({
  "&.MuiIconButton-root.MuiIconButton-root": {
    backgroundColor: `${open ? fontColor.blue.dark : "transparent"}`,
    color: open ? "white" : color.gray.dark,
    minWidth: "40px",
    height: "40px",
    borderRadius: "6px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "&:hover": {
      backgroundColor: open ? fontColor.blue.dark : "rgba(0, 0, 0, 0.12)",
    },
    "&.Mui-focusVisible": {
      backgroundColor: open ? fontColor.blue.dark : "rgba(0, 0, 0, 0.12)",
    },
  },
});

export const switcherTitleTypographySx = {
  backgroundColor: color.blue.medium,
  borderRadius: borderRadius["menuTop"],
  fontSize: "16px",
  color: "#090C02",
  fontWeight: fontWeight.regular,
  fontFamily: fontFamily.openSans,
  minHeight: "40px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

export const switcherMenuBoxSx = {
  color: grey["mapMenuText"],
  display: "inline-block",
  whiteSpace: "nowrap",
  borderRadius: borderRadius["menu"],
  backgroundColor: grey["resultCard"],
  zIndex: 1,
  width: "260px",
};

export const switcherMenuContentBoxSx = {
  paddingLeft: leftPadding,
  paddingRight: rightPadding,
  paddingTop: topPadding,
  paddingBottom: bottomPadding,
};

export const formControlLabelSx = {
  gap: 0.4,
};

export const switcherMenuContentIconSx = {
  padding: "6px",
  "& .MuiSvgIcon-root": {
    fontSize: "20px",
  },
  "&.Mui-checked": {
    color: fontColor.blue.dark,
  },
  "&:not(.Mui-checked)": {
    color: fontColor.gray.medium,
  },
};

export const switcherMenuContentLabelTypographySx = {
  fontSize: fontSize.info,
  color: "#090C02",
  fontFamily: fontFamily.openSans,
  fontWeight: fontWeight.regular,
  letterSpacing: "0.5px",
  lineHeight: "22px",
};

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
