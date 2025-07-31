import { Grid, GridProps, SxProps, Theme, useTheme } from "@mui/material";
import React, { createContext, useContext, useState } from "react";
import rc8Theme from "../../../styles/themeRC8";

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
  const theme = useTheme();
  const [isOnHover, setIsOnHover] = useState<boolean>(false);

  // Determine background color
  // Disable hover when in tab panels
  const getBackgroundColor = () => {
    if (disableHover) return "transparent";
    return isOnHover ? rc8Theme.palette.primary5 : rc8Theme.palette.primary6;
  };

  return (
    <HoverContext.Provider value={{ isOnHover }}>
      <Grid
        onMouseEnter={disableHover ? undefined : () => setIsOnHover(true)}
        onMouseLeave={disableHover ? undefined : () => setIsOnHover(false)}
        sx={{
          backgroundColor: getBackgroundColor(),
          mx: disableHover ? 0 : theme.mp.sm,
          my: disableHover ? "14px" : theme.mp.sm,
          borderRadius: theme.borderRadius.sm,
          width: "95%",
          padding: disableHover ? 0 : `${theme.mp.sm} ${theme.mp.xlg}`,
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
