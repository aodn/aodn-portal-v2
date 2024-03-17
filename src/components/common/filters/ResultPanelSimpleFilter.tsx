import {
  FormControl,
  Grid,
  IconButton,
  InputBase,
  MenuItem,
  Paper,
  Select,
  Stack,
  styled,
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import dateTime from "@/assets/logos/time-range.png";
import depth from "@/assets/logos/depth.png";
import dataSettings from "@/assets/logos/data-settings.png";
import waterBody from "@/assets/logos/water-body.png";

import { SmartCard11 } from "../../smartpanel/SmartCard";

// interface ResultPanelSimpleFilterProps {
//   filterClicked?: (e: React.MouseEvent<HTMLButtonElement>) => void;
// }

const SlimSelect = styled(InputBase)(() => ({
  "& .MuiInputBase-input": {
    border: "none",
  },
}));

const Item = styled(Paper)(({ theme }) => ({
  textAlign: "center",
  minWidth: "100px",
  color: theme.palette.text.secondary,
}));

export const ResultPanelIconFilter = () => {
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
              imageUrl={waterBody}
              caption="Water Body"
              colour="#747474"
              isOutlined
            />
          </Item>
        </Stack>
      </Grid>
    </Grid>
  );
};
// props: ResultPanelSimpleFilterProps -- use this later maybe?
const ResultPanelSimpleFilter = () => {
  return (
    <Grid container justifyContent="center">
      <Grid item xs={12} sx={{ pb: 1 }}>
        <Paper
          variant="outlined"
          component="form"
          sx={{ p: "2px 4px", display: "flex", alignItems: "center" }}
        >
          <IconButton sx={{ p: "10px" }} aria-label="search">
            <ArrowBackIosIcon />
          </IconButton>
          <FormControl fullWidth size="small">
            <Select
              value={1}
              input={<SlimSelect id="select1" name="select1" />}
            >
              <MenuItem value={1}>1-20 on 1258 matching</MenuItem>
            </Select>
          </FormControl>
          <IconButton sx={{ p: "10px" }}>
            <ArrowForwardIosIcon />
          </IconButton>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default ResultPanelSimpleFilter;
