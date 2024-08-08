import { styled } from "@mui/material/styles";
import { Grid } from "@mui/material";

const StyledItemGrid = styled(Grid)(({ theme }) => ({
  backgroundColor: theme.palette.detail.listItemBG,
  margin: theme.mp.sm,
  borderRadius: theme.borderRadius.sm,
  width: "95%",
  padding: `${theme.mp.sm} ${theme.mp.xlg}`,
}));

export default StyledItemGrid;
