import { FC } from "react";
import { Card, Paper, Typography } from "@mui/material";
import { InfoContentType, InfoStatusType } from "./InfoDefinition";

interface InfoCardProps {
  infoContent?: InfoContentType;
  status?: InfoStatusType;
  children?: React.ReactNode;
}

const InfoCard: FC<InfoCardProps> = ({ infoContent, status, children }) => {
  return (
    <Card
      elevation={1}
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "row",
        justifyContent: "left",
        alignItems: "center",
        width: "310px", // Fixed width as per design
        height: "190px", // Fixed Height as per design
        padding: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "6px",
          height: "100%",
          backgroundColor:
            status === InfoStatusType.ERROR
              ? "red"
              : status === InfoStatusType.WARNING
                ? "orange"
                : "blue",
        }}
      />
      {infoContent && (
        <Card elevation={0} sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ padding: 2 }}>
            {infoContent.title}
          </Typography>
          <Typography variant="body2" sx={{ padding: 2, paddingTop: 0 }}>
            {infoContent.body}
          </Typography>
        </Card>
      )}
      {children}
    </Card>
  );
};

export default InfoCard;
