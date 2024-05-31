import { Card, Grid } from "@mui/material";
import { borderRadius, padding } from "../../../styles/constants";

const SidePanel = () => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Card
          sx={{
            backgroundColor: "white",
            borderRadius: borderRadius.small,
          }}
        >
          card
        </Card>
      </Grid>
    </Grid>
  );
};

export default SidePanel;
