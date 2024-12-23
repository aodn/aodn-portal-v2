import { Stack } from "@mui/material";
import TimeRangeIcon from "../icon/TimeRangeIcon";
import SpatialIcon from "../icon/SpatialIcon";
import DimensionsIcon from "../icon/Dimensions";
import { padding } from "../../styles/constants";

const ResultPanelIconFilter = () => {
  return (
    <Stack direction="column" spacing={1} paddingTop={padding.large}>
      <TimeRangeIcon />
      <SpatialIcon />
      <DimensionsIcon />
    </Stack>
  );
};

export default ResultPanelIconFilter;
