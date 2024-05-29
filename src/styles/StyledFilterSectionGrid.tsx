import { Grid } from "@mui/material";
import { styled } from "@mui/system";
import blue from "../components/common/colors/blue";

import { borderRadius } from "./constants";

interface StyledFilterSectionGridProps {
  theme?: any;
  isSmall?: string;
}

const StyledFilterSectionGrid = styled(Grid)<StyledFilterSectionGridProps>(
  ({ isSmall = undefined }) => ({
    backgroundColor: blue["bgParam"],
    border: "none",
    borderRadius: borderRadius["filter"],
    justifyContent: "center",
    height: "100%",
    padding: isSmall === "true" ? "0px" : "10px",
  })
);

export default StyledFilterSectionGrid;
