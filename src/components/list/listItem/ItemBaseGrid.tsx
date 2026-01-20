import { Grid, GridProps, SxProps, Theme } from "@mui/material";
import React, { createContext, useContext, useState } from "react";
import { portalTheme } from "../../../styles";

interface HoverContextProps {
  isOnHover: boolean;
}

const HoverContext = createContext<HoverContextProps | undefined>(undefined);
export const useHoverContext = () => {
  const context = useContext(HoverContext);
  if (!context) {
    throw new Error("useHoverContext must be used within a HoverProvider");
  }
  return context;
};

interface ItemBaseGridProps extends GridProps {
  disableHover?: boolean;
  sx?: SxProps<Theme>;
}

const ItemBaseGrid = ({
  disableHover = false,
  children,
  sx,
  ...props
}: React.PropsWithChildren<ItemBaseGridProps>) => {
  const [isOnHover, setIsOnHover] = useState<boolean>(false);

  // Determine background color
  // Disable hover when in tab panels
  const getBackgroundColor = () => {
    if (disableHover) return "transparent";
    return isOnHover
      ? portalTheme.palette.primary5
      : portalTheme.palette.primary6;
  };

  return (
    <HoverContext.Provider value={{ isOnHover }}>
      <Grid
        onMouseEnter={disableHover ? undefined : () => setIsOnHover(true)}
        onMouseLeave={disableHover ? undefined : () => setIsOnHover(false)}
        sx={{
          backgroundColor: getBackgroundColor(),
          width: "98%",
          minheight: "44px",
          display: "flex",
          alignItems: "center",
          borderRadius: "4px",
          my: disableHover ? "10px" : "6px",
          p: disableHover ? 0 : "4px 16px",
          ...sx,
        }}
        {...props}
      >
        {children}
      </Grid>
    </HoverContext.Provider>
  );
};

export default ItemBaseGrid;
