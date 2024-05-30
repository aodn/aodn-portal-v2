import { Grid } from "@mui/material";
import { styled } from "@mui/system";
import blue from "../components/common/colors/blue";

import { borderRadius } from "./constants";

interface StyledFilterSectionGridProps {
  padding?: string;
}

const StyledFilterSectionGrid = styled(Grid)<StyledFilterSectionGridProps>(
  ({ padding = "10px" }) => ({
    backgroundColor: blue["bgParam"],
    border: "none",
    borderRadius: borderRadius["filter"],
    justifyContent: "center",
    height: "100%",
    padding: padding,
  })
);

export default StyledFilterSectionGrid;
