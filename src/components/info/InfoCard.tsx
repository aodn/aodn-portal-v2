import { FC } from "react";
import { Card, Paper, Typography, useTheme } from "@mui/material";
import { InfoContentType, InfoStatusType } from "./InfoDefinition";

interface InfoCardProps {
  infoContent?: InfoContentType;
  status?: InfoStatusType;
  children?: React.ReactNode;
}

const InfoCard: FC<InfoCardProps> = ({ infoContent, status, children }) => {
  const theme = useTheme();
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
          width: "6px", // Fixed width as per design
          height: "100%",
          backgroundColor:
            status === InfoStatusType.ERROR
              ? theme.palette.error.main
              : status === InfoStatusType.WARNING
                ? theme.palette.warning.main
                : theme.palette.info.main,
        }}
      />
      {infoContent && (
        <Card elevation={0} sx={{ flex: 1 }}>
          <Typography
            variant="heading4"
            sx={{
              display: "block",
              padding: 2,
              color: theme.palette.text1,
              textAlign: "center",
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
        </Card>
      )}
      {children}
    </Card>
  );
};

export default InfoCard;
