import { Card, Typography } from "@mui/material";
import { color, fontSize } from "../../../styles/constants";
import { FileDownloadIcon } from "../../icon/download";

const DownloadIcon = () => {
  return (
    <Card
      elevation={3}
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "84px",
        height: "84px",
        backgroundColor: color.blue.light,
      }}
    >
      <FileDownloadIcon />
      <Typography fontSize={fontSize.icon} sx={{ paddingTop: 1 }}>
        Download
      </Typography>
    </Card>
  );
};

export default DownloadIcon;
