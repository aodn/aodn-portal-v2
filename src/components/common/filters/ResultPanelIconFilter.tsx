import { Grid, Paper, Stack, styled } from "@mui/material";
import { SmartCard11 } from "../../smartpanel/SmartCard";
import dateTime from "@/assets/logos/time-range.png";
import depth from "@/assets/logos/depth.png";
import dataSettings from "@/assets/logos/data-settings.png";
import parameter from "@/assets/logos/parameter.png";

const Item = styled(Paper)(({ theme }) => ({
  textAlign: "center",
  minWidth: "100px",
  color: theme.palette.text.secondary,
}));

const ResultPanelIconFilter = () => {
  return (
    <Grid container sx={{ pl: 2 }}>
      <Grid item xs={12}>
        <Stack direction="column" spacing={2}>
          <Item variant="outlined">
            <SmartCard11
              imageUrl={dateTime}
              caption="Date Range"
              colour="#747474"
              isOutlined
            />
          </Item>
          <Item variant="outlined">
            <SmartCard11
              imageUrl={depth}
              caption="Depth"
              colour="#747474"
              isOutlined
            />
          </Item>
          <Item variant="outlined">
            <SmartCard11
              imageUrl={dataSettings}
              caption="Data Settings"
              colour="#747474"
              isOutlined
            />
          </Item>
          <Item variant="outlined">
            <SmartCard11
              imageUrl={parameter}
              caption="Parameter"
              colour="#747474"
              isOutlined
            />
          </Item>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default ResultPanelIconFilter;
