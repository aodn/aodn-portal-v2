import { FC } from "react";
import { Paper, SxProps, Typography } from "@mui/material";
import { InfoContentType, InfoStatusType } from "./InfoDefinition";
import rc8Theme from "../../styles/themeRC8";

interface InfoCardProps {
  infoContent?: InfoContentType;
  status?: InfoStatusType;
  children?: React.ReactNode;
  sx?: SxProps;
}

const InfoCard: FC<InfoCardProps> = ({ infoContent, status, children, sx }) => {
  return (
    <Paper
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "row",
        justifyContent: "left",
        alignItems: "center",
        padding: 1,
        ...sx,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "6px", // Fixed width as per design
          height: "100%",
          backgroundColor:
            status === InfoStatusType.ERROR
              ? rc8Theme.palette.error.main
              : status === InfoStatusType.WARNING
                ? rc8Theme.palette.warning.main
                : rc8Theme.palette.info.main,
        }}
      />
      {infoContent && (
        <Paper elevation={0} sx={{ flex: 1 }}>
          <Typography
            variant="heading4"
            sx={{
              display: "block",
              padding: 2,
              color: rc8Theme.palette.primary.main,
              textAlign: "center",
              letterSpacing: "0.05em",
            }}
          >
            {infoContent.title}
          </Typography>
          <Typography
            variant="body2Regular"
            sx={{ display: "block", padding: 2, paddingTop: 0 }}
          >
            {infoContent.body}
          </Typography>
        </Paper>
      )}
      {children}
    </Paper>
  );
};

export default InfoCard;
