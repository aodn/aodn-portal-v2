import { FC, ReactNode } from "react";
import { Box, Typography, IconButton } from "@mui/material";
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
    <Box
      sx={{
        borderRadius: "5px",
        background: "#FFF",
        width: { xs: "100%", sm: "48.5%", md: "100%" },
      }}
      component="section"
      role="region"
      aria-labelledby={titleId}
      aria-label={ariaLabel}
    >
      {/* Card Title Header */}
      <Box
        sx={{
          height: "40px",
          borderRadius: "6px 6px 0px 0px",
          background: "#FFF",
          boxShadow: "0px 2px 4px 0px rgba(0, 0, 0, 0.10)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <Typography
          variant="heading4"
          id={titleId}
          sx={{ color: rc8Theme.palette.text2 }}
        >
          {title}
        </Typography>

        {/* Action button positioned absolutely to the right */}
        {onClick && (
          <IconButton
            aria-label="open external"
            size="small"
            onClick={onClick}
            sx={{
              position: "absolute",
              right: "8px",
              color: rc8Theme.palette.text2,
            }}
          >
            <ArrowOutwardIcon fontSize="small" />
          </IconButton>
        )}
      </Box>

      {/* Card Content */}
      <Box
        sx={{
          px,
          py,
          display: "flex",
          flexDirection: "column",
        }}
        role="status"
        aria-live="polite"
      >
        {children}
      </Box>
    </Box>
  );
};

export default SideCardContainer;
