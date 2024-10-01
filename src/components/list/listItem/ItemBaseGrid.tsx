import { Grid, GridProps, useTheme } from "@mui/material";
import React, { createContext, useContext, useState } from "react";

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
  const [isOnHover, setisOnHover] = useState<boolean>(false);
  return (
    <HoverContext.Provider value={{ isOnHover }}>
      <Grid
        {...props}
        onMouseEnter={() => setisOnHover(true)}
        onMouseLeave={() => setisOnHover(false)}
        sx={{
          backgroundColor: isOnHover
            ? theme.palette.detail.listItemBGHover
            : theme.palette.detail.listItemBG,
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
