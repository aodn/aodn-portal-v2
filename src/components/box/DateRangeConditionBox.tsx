import DownloadConditionBox from "./DownloadConditionBox";
import {
  DateRangeCondition,
  DownloadConditionType,
} from "../../pages/detail-page/context/DownloadDefinitions";
import React from "react";
import { Grid, Typography } from "@mui/material";

interface DateRangeConditionBoxProps {
  dateRangeCondition: DateRangeCondition;
}

const DateRangeConditionBox: React.FC<DateRangeConditionBoxProps> = ({
  dateRangeCondition,
}) => {
  const start = dateRangeCondition.start;
  const end = dateRangeCondition.end;
  return (
    <DownloadConditionBox
      type={DownloadConditionType.DATE_RANGE}
      conditionId={dateRangeCondition.id}
    >
      <Grid container sx={{}}>
        <Typography
          sx={{
            color: "#7194AB",
            fontSize: "12px",
            fontWeight: "400",
            lineHeight: "8px",
          }}
        >
          {start + " to " + end}
        </Typography>
      </Grid>
    </DownloadConditionBox>
  );
};

export default DateRangeConditionBox;
