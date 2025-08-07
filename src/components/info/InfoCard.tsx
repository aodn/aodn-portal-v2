import { FC } from "react";
import { Link, Paper, SxProps, Typography } from "@mui/material";
import { InfoContentType, InfoStatusType } from "./InfoDefinition";
import rc8Theme from "../../styles/themeRC8";
import { COMBINED_LINK_REGEX, isEmail, isUrl } from "../../utils/StringUtils";

interface InfoCardProps {
  infoContent?: InfoContentType;
  status?: InfoStatusType;
  children?: React.ReactNode;
  sx?: SxProps;
}

const InfoCard: FC<InfoCardProps> = ({ infoContent, status, children, sx }) => {
  // Function to detect and convert emails and URLs to clickable links
  const renderTextWithLinks = (text: string) => {
    const parts = text.split(COMBINED_LINK_REGEX);

    return parts.map((part, index) => {
      // Check if part is an email
      if (isEmail(part)) {
        return (
          <Link
            key={index}
            href={`mailto:${part}`}
            color="primary"
            underline="hover"
            sx={{
              color: rc8Theme.palette.primary.main,
            }}
          >
            {part}
          </Link>
        );
      }

      // Check if part is a URL
      if (isUrl(part)) {
        return (
          <Link
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            color="primary"
            underline="hover"
            sx={{
              color: rc8Theme.palette.primary.main,
            }}
          >
            {part}
          </Link>
        );
      }

      return part;
    });
  };

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
            component="div"
            variant="body2Regular"
            sx={{ display: "block", padding: 2, paddingTop: 0 }}
          >
            {renderTextWithLinks(infoContent.body)}
          </Typography>
        </Paper>
      )}
      {children}
    </Paper>
  );
};

export default InfoCard;
