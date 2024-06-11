import { Card, Typography } from "@mui/material";
import { fontSize } from "../../../styles/constants";
import time_range from "@/assets/logos/time-range.png";
const TimeRangeIcon = () => {
  return (
    <Card
      elevation={0}
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "84px",
        height: "84px",
        backgroundColor: "transparent",
      }}
    >
      <img
        src={time_range}
        alt="time_range"
        style={{
          objectFit: "scale-down",
          width: "60%",
          height: "60%",
        }}
      />
      <Typography fontSize={fontSize.icon} sx={{ paddingTop: 1 }}>
        Time Range
      </Typography>
    </Card>
  );
};

export default TimeRangeIcon;
