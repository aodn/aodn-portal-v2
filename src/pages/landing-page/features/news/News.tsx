import { FC } from "react";
import { Box, Button, Grid, Stack, Typography, alpha } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { portalTheme } from "@/styles";
import {
  FEATURED_CONTRIBUTORS,
  NEWS_CARDS_DATA,
} from "@/pages/landing-page/features/news/constants";
import { FEATURED_DATASET_COUNTS } from "@/pages/landing-page/constants";
import NewsCard from "@/pages/landing-page/features/news/components/NewsCard";
import { SearchKeys } from "@/components/search/constants";
import { useAppDispatch } from "@/app/store/hooks";
import {
  clearComponentParam,
  updateDatasetGroup,
} from "@/app/store/componentParamReducer";
import useRedirectSearch from "@/hooks/useRedirectSearch";

const News: FC = () => {
  const dispatch = useAppDispatch();
  const redirectSearch = useRedirectSearch();
  const white = portalTheme.palette.common.white;
  const tabSx = {
    display: "inline-flex",
    alignItems: "center",
    minWidth: 0,
    height: 44,
    px: 2,
    py: 1.125,
    gap: 1.25,
    fontSize: portalTheme.typography.title2Regular.fontSize,
    lineHeight: 1,
    textTransform: "none",
    borderRadius: "999px",
    color: white,
    bgcolor: alpha(white, 0.05),
    border: `1px solid ${alpha(white, 0.26)}`,
    "&:hover": {
      border: `1px solid ${alpha(white, 0.26)}`,
      bgcolor: alpha(white, 0.1),
    },
  };
  const renderCount = (group: SearchKeys) =>
    FEATURED_DATASET_COUNTS[group] == null ? null : (
      <Box
        component="span"
        sx={{
          color:
            group === SearchKeys.IMOS
              ? portalTheme.palette.text2
              : portalTheme.palette.primary4,
          fontSize: portalTheme.typography.body2Regular.fontSize,
          lineHeight: 1,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {FEATURED_DATASET_COUNTS[group]?.toLocaleString("en-AU")}+
      </Box>
    );
  const explore = (group?: SearchKeys) => {
    dispatch(clearComponentParam());
    if (group) dispatch(updateDatasetGroup(group));
    redirectSearch("Featured Datasets");
  };

  return (
    <Box
      component="section"
      aria-label="Featured Datasets"
      sx={{
        py: { xs: 4, sm: 6 },
        color: white,
        position: "relative",
        isolation: "isolate",
        "&::before": {
          content: '""',
          position: "absolute",
          zIndex: -1,
          inset: "0 calc((100% - 100vw) / 2)",
          pointerEvents: "none",
          background: `radial-gradient(ellipse at 25% 10%, transparent 48%, ${alpha(portalTheme.palette.primary.main, 0.15)} 48.2%, ${alpha(portalTheme.palette.primary.main, 0.15)} 57%, transparent 57.2%), radial-gradient(ellipse at 85% 90%, transparent 46%, ${alpha(portalTheme.palette.primary.main, 0.12)} 46.2%, ${alpha(portalTheme.palette.primary.main, 0.12)} 59%, transparent 59.2%)`,
        },
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        gap={2}
      >
        <Box>
          <Typography variant="heading1" component="h2" sx={{ color: white }}>
            Featured Datasets
          </Typography>
          <Typography
            variant="title2Regular"
            sx={{ mt: 0.5, color: portalTheme.palette.primary4 }}
          >
            Select a contributing organisation to explore collections from their
            catalogue.
          </Typography>
        </Box>
        <Button
          variant="outlined"
          onClick={() => explore()}
          endIcon={<ArrowForwardIcon />}
          sx={{
            color: white,
            border: `1px solid ${white}`,
            borderRadius: portalTheme.borderRadius.sm,
            minWidth: 173,
            height: 50,
            px: 2.5,
            py: 1.5,
            gap: 1,
            "& .MuiButton-endIcon": { m: 0 },
            transition: portalTheme.transitions.create(
              ["background-color", "border-color"],
              { duration: portalTheme.transitions.duration.short }
            ),
            "&:hover, &:focus-visible": {
              border: `1px solid ${white}`,
              bgcolor: alpha(white, 0.1),
            },
            "@media (prefers-reduced-motion: reduce)": { transition: "none" },
            flexShrink: 0,
            textTransform: "none",
            fontSize: portalTheme.typography.title2Regular.fontSize,
          }}
        >
          More datasets
        </Button>
      </Stack>
      <Stack
        direction="row"
        gap={1}
        sx={{
          flexWrap: "wrap",
          mt: 3,
          pb: 2,
          borderBottom: `1px solid ${alpha(white, 0.15)}`,
        }}
      >
        <Button
          aria-current="true"
          onClick={() => explore(SearchKeys.IMOS)}
          sx={{
            ...tabSx,
            bgcolor: white,
            color: portalTheme.palette.text1,
            "&:hover": { border: `1px solid ${white}`, bgcolor: white },
          }}
        >
          <span>IMOS</span>
          {renderCount(SearchKeys.IMOS)}
        </Button>
        {FEATURED_CONTRIBUTORS.map((organisation) => (
          <Button
            key={organisation.datasetGroup}
            onClick={() => explore(organisation.datasetGroup)}
            sx={tabSx}
          >
            <span>{organisation.shortName}</span>
            {renderCount(organisation.datasetGroup)}
          </Button>
        ))}
      </Stack>
      <Typography
        component="h3"
        variant="heading3"
        sx={{ my: 2, color: white }}
      >
        Integrated Marine Observing System
      </Typography>
      <Grid container spacing={3}>
        {NEWS_CARDS_DATA.map((news) => (
          <Grid key={news.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <NewsCard news={news} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default News;
