import { styled } from "@mui/material/styles";
import { Grid } from "@mui/material";

const StyledNaItemGrid = styled(Grid)(({ theme }) => ({
  backgroundColor: theme.palette.detail.na.light,
  margin: theme.mp.sm,
  borderRadius: theme.borderRadius.sm,
  width: "95%",
  padding: `${theme.mp.sm} ${theme.mp.xlg}`,
  border: theme.border.detailNa,
}));

export default StyledNaItemGrid;
