import { Grid, GridProps, useTheme } from "@mui/material";
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
const ItemBaseGrid: React.FC<GridProps> = (props) => {
  const theme = useTheme();
  const [isOnHover, setIsOnHover] = useState<boolean>(false);
  return (
    <HoverContext.Provider value={{ isOnHover }}>
      <Grid
        {...props}
        onMouseEnter={() => setIsOnHover(true)}
        onMouseLeave={() => setIsOnHover(false)}
        sx={{
          backgroundColor: isOnHover
            ? rc8Theme.palette.primary5
            : rc8Theme.palette.primary6,
          margin: theme.mp.sm,
          borderRadius: theme.borderRadius.sm,
          width: "95%",
          padding: `${theme.mp.sm} ${theme.mp.xlg}`,
        }}
      >
        {props.children}
      </Grid>
    </HoverContext.Provider>
  );
};

export default ItemBaseGrid;
