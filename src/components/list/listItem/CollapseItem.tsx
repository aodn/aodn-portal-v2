import React, { ReactNode, useState } from "react";
import { Collapse, Grid, Box } from "@mui/material";
import ItemBaseGrid from "./ItemBaseGrid";
import CollapseItemTitle from "./subitem/CollapseItemTitle";
import CollapseBtn from "./subitem/CollapseBtn";
import rc8Theme from "../../../styles/themeRC8";

interface CollapseItemProps {
  title?: string | ReactNode; // Allow ReactNode for custom title
  children: ReactNode;
  isOpen?: boolean;
  icon?: ReactNode;
}

const CollapseItem: React.FC<CollapseItemProps> = ({
  title = "",
  children,
  isOpen = false,
  icon,
}) => {
  const [isExpanded, setIsExpanded] = useState(isOpen);

  return (
    <ItemBaseGrid container data-testid="collapseItem">
      <Grid item xs={11} sx={{ alignSelf: "center" }}>
        <Box display="flex" alignItems="flex-start" gap={1.5}>
          {icon && <Box sx={{ mt: "2px" }}>{icon}</Box>}
          {typeof title === "string" ? (
            <CollapseItemTitle setIsExpanded={setIsExpanded} text={title} />
          ) : (
            <Box
              onClick={() => setIsExpanded(!isExpanded)}
              sx={{ cursor: "pointer", width: "100%" }}
            >
              {title}
            </Box>
          )}
        </Box>
      </Grid>
      <Grid
        item
        xs={1}
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "flex-start",
        }}
      >
        <CollapseBtn
          setIsExpanded={setIsExpanded}
          isExpanded={isExpanded}
          iconColor={rc8Theme.palette.text2}
        />
      </Grid>
      <Grid item xs={12}>
        <Collapse in={isExpanded}>
          {children ? children : "[ NO CONTENT ]"}
        </Collapse>
      </Grid>
    </ItemBaseGrid>
  );
};

export default CollapseItem;
