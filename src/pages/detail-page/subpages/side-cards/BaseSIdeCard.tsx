import { Typography, Box } from "@mui/material";
import { ReactNode } from "react";
import rc8Theme from "../../../../styles/themeRC8";

interface BaseSideCardProps {
  title: string;
  children: ReactNode;
}

const BaseSideCard = ({ title, children }: BaseSideCardProps) => {
  // Auto-generate titleId and ariaLabel from title
  const titleId = title.toLowerCase().replace(/\s+/g, "-") + "-heading";
  const ariaLabel = title.toLowerCase() + " section";

  return (
    <Box
      sx={{
        borderRadius: "5px",
        background: "#FFF",
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
        }}
      >
        <Typography
          variant="heading4"
          id={titleId}
          sx={{ color: rc8Theme.palette.text2 }}
        >
          {title}
        </Typography>
      </Box>

      {/* Card Content */}
      <Box
        sx={{
          px: "16px",
          py: "22px",
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

export default BaseSideCard;
