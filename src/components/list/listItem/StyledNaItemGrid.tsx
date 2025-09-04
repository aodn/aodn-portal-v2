import { styled } from "@mui/material/styles";
import { Grid } from "@mui/material";
import rc8Theme from "../../../styles/themeRC8";

const StyledNaItemGrid = styled(Grid)(() => ({
  backgroundColor: rc8Theme.palette.primary6,
  borderRadius: "4px",
  width: "95%",
  height: "44px",
  alignItems: "center",
}));

export default StyledNaItemGrid;
