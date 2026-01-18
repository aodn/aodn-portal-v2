import { FC } from "react";
import { Paper, SxProps, Typography } from "@mui/material";
import { InfoContentType, InfoStatusType } from "./InfoDefinition";
import { portalTheme } from "../../styles";
import TextRender from "../common/text/TextRender";

interface InfoCardProps {
  infoContent?: InfoContentType;
  status?: InfoStatusType;
  children?: React.ReactNode;
  sx?: SxProps;
  titleSx?: SxProps; // Additional styling for the title
  contentSx?: SxProps; // Additional styling for the content body
}

const InfoCard: FC<InfoCardProps> = ({
  infoContent,
  status,
  children,
  sx,
  titleSx,
  contentSx,
}) => {
  return (
    <Paper
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "row",
        justifyContent: "left",
        alignItems: "center",
        padding: "8px", // Fixed padding as per design
        ...sx,
      }}
    >
      {status !== InfoStatusType.NONE && (
        <Paper
          elevation={0}
          sx={{
            width: "6px", // Fixed width as per design
            alignSelf: "stretch",
            backgroundColor:
              status === InfoStatusType.ERROR
                ? portalTheme.palette.error.main
                : status === InfoStatusType.WARNING
                  ? portalTheme.palette.warning.main
                  : portalTheme.palette.info.main,
          }}
        />
      )}

      {infoContent && (
        <Paper elevation={0} sx={{ flex: 1 }}>
          {infoContent.title && (
            <Typography
              variant="heading4"
              sx={{
                display: "block",
                padding: 2,
                color: portalTheme.palette.primary.main,
                textAlign: "center",
                letterSpacing: "0.05em",
                ...titleSx,
              }}
            >
              {infoContent.title}
            </Typography>
          )}
          <Typography
            component="div"
            variant="body2Regular"
            sx={{ display: "block", padding: 2, paddingTop: 0, ...contentSx }}
          >
            <TextRender text={infoContent.body} />
          </Typography>
        </Paper>
      )}
      {children}
    </Paper>
  );
};

export default InfoCard;
