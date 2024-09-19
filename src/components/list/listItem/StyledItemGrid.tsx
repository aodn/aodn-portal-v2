import { styled } from "@mui/material/styles";
import { Grid, GridProps } from "@mui/material";
import React, { createContext, useContext, useState } from "react";

const StyledGrid = styled(Grid)(({ theme }) => ({
  backgroundColor: theme.palette.detail.listItemBG,
  margin: theme.mp.sm,
  borderRadius: theme.borderRadius.sm,
  width: "95%",
  padding: `${theme.mp.sm} ${theme.mp.xlg}`,
}));

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
const StyledItemGrid: React.FC<GridProps> = (props) => {
  const [isOnHover, setisOnHover] = useState<boolean>(false);
  return (
    <HoverContext.Provider value={{ isOnHover }}>
      <StyledGrid
        {...props}
        onMouseEnter={() => setisOnHover(true)}
        onMouseLeave={() => setisOnHover(false)}
      >
        {props.children}
      </StyledGrid>
    </HoverContext.Provider>
  );
};

export default StyledItemGrid;
