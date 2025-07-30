import { FC, ReactNode } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  IconButton,
  Typography,
} from "@mui/material";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import rc8Theme from "../../../../styles/themeRC8";

interface SideCardContainerProps {
  title: string;
  onClick?: () => void;
  children: ReactNode;
  px?: string | number;
  py?: string | number;
}

const SideCardContainer: FC<SideCardContainerProps> = ({
  children,
  title,
  onClick,
  px = "16px",
  py = "22px",
}) => {
  // Auto-generate titleId and ariaLabel from title
  const titleId = title.toLowerCase().replace(/\s+/g, "-") + "-heading";
  const ariaLabel = title.toLowerCase() + " section";

  return (
    <Card
      sx={{
        borderRadius: "5px",
        background: "#FFF",
        width: { xs: "100%", sm: "48.5%", md: "100%" },
        boxShadow: "none",
      }}
      component="section"
      role="region"
      aria-labelledby={titleId}
      aria-label={ariaLabel}
    >
      <CardHeader
        title={
          <Typography
            variant="heading4"
            id={titleId}
            sx={{ color: rc8Theme.palette.text2 }}
          >
            {title}
          </Typography>
        }
        action={
          onClick && (
            <IconButton
              aria-label="open external"
              size="small"
              onClick={onClick}
              sx={{ color: rc8Theme.palette.text2 }}
            >
              <ArrowOutwardIcon fontSize="small" />
            </IconButton>
          )
        }
        sx={{
          height: "40px",
          borderRadius: "6px 6px 0px 0px",
          background: "#FFF",
          boxShadow: "0px 2px 4px 0px rgba(0, 0, 0, 0.10)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 16px",
          position: "relative",
          "& .MuiCardHeader-content": {
            flex: 1,
            textAlign: "center",
            margin: 0,
            // Ensure title stays centered regardless of action button
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            width: "calc(100% - 64px)",
          },
          "& .MuiCardHeader-action": {
            alignSelf: "center",
            margin: 0,
            position: "absolute",
            right: "8px",
            zIndex: 1,
          },
        }}
      />

      <CardContent
        sx={{
          px,
          py,
          display: "flex",
          flexDirection: "column",
          "&:last-child": {
            paddingBottom: py,
          },
        }}
        role="status"
        aria-live="polite"
      >
        {children}
      </CardContent>
    </Card>
  );
};

export default SideCardContainer;
