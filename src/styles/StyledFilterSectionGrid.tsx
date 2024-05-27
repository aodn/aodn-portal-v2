import { Grid } from "@mui/material";
import { styled } from "@mui/system";
import blue from "../components/common/colors/blue";

import { borderRadius } from "./constants";

interface StyledFilterSectionGridProps {
  theme?: any;
  issmall?: string;
}

const StyledFilterSectionGrid = styled(Grid)<StyledFilterSectionGridProps>(
  ({ issmall = undefined }) => ({
    backgroundColor: blue["bgParam"],
    border: "none",
    borderRadius: borderRadius["filter"],
    justifyContent: "center",
    height: "100%",
    padding: issmall ? "0px" : "20px",
  })
);

export default StyledFilterSectionGrid;
