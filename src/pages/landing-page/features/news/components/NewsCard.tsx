import { FC } from "react";
import { Box, Button, CardMedia, Typography, alpha } from "@mui/material";
import EastIcon from "@mui/icons-material/East";
import { portalTheme } from "@/styles";
import { NewsCardData } from "@/pages/landing-page/features/news/constants";

interface NewsCardProps {
  news: NewsCardData;
}

const NewsCard: FC<NewsCardProps> = ({ news }) => {
  const white = portalTheme.palette.common.white;
  return (
    <Box
      sx={{
        height: "100%",
        overflow: "hidden",
        borderRadius: 1,
        bgcolor: alpha(white, 0.06),
        minHeight: 252,
        border: `1px solid ${alpha(white, 0.12)}`,
        display: "flex",
        flexDirection: "column",
        color: white,
        transition: portalTheme.transitions.create(
          ["background-color", "border-color"],
          { duration: portalTheme.transitions.duration.short }
        ),
        "&:focus-within": {
          bgcolor: alpha(white, 0.1),
          borderColor: alpha(white, 0.3),
        },
        "@media (hover: hover)": {
          "&:hover": {
            bgcolor: alpha(white, 0.1),
            borderColor: alpha(white, 0.3),
          },
        },
        "@media (prefers-reduced-motion: reduce)": { transition: "none" },
      }}
    >
      <Box sx={{ position: "relative" }}>
        <CardMedia
          component="img"
          image={news.image}
          srcSet={news.imageSrcSet}
          sizes="(min-width: 900px) 33vw, (min-width: 600px) 50vw, 100vw"
          alt={news.title}
          loading="lazy"
          decoding="async"
          data-testid={news.subheading}
          sx={{ aspectRatio: "1.9", objectFit: "cover" }}
        />
        <Typography
          component="span"
          sx={{
            position: "absolute",
            top: 14,
            right: 13,
            px: 1.5,
            py: "4.5px",
            minWidth: 77,
            height: 28,
            boxSizing: "border-box",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "999px",
            bgcolor: "rgba(14, 30, 42, 0.82)",
            color: "#EAF3F8",
            fontFamily: portalTheme.typography.body2Regular.fontFamily,
            fontSize: 14,
            fontWeight: 400,
            lineHeight: "18px",
            zIndex: 1,
          }}
        >
          On going
        </Typography>
      </Box>
      <Box
        sx={{
          p: "20px 20px 24px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexGrow: 1,
        }}
      >
        <Typography
          variant="overline"
          sx={{
            color: portalTheme.palette.primary4,
            fontSize: 13,
            lineHeight: "18px",
            letterSpacing: "1.3px",
            alignSelf: "stretch",
          }}
        >
          {news.subheading}
        </Typography>
        <Typography
          component="h4"
          variant="subtitle1"
          sx={{
            my: "11px",
            fontSize: 20,
            lineHeight: "26px",
            fontWeight: 500,
            color: white,
          }}
        >
          {news.title}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "#C2D3DE",
            fontSize: 14,
            lineHeight: "22px",
            alignSelf: "stretch",
          }}
        >
          {news.description}
        </Typography>
        <Button
          component="a"
          href={news.link}
          target="_blank"
          rel="noopener noreferrer"
          endIcon={<EastIcon />}
          sx={{
            alignSelf: "flex-end",
            mt: "auto",
            color: alpha(white, 0.8),
            fontSize: portalTheme.typography.title2Regular.fontSize,
            lineHeight: "24px",
            textTransform: "none",
            px: 0,
          }}
        >
          Read more
        </Button>
      </Box>
    </Box>
  );
};

export default NewsCard;
