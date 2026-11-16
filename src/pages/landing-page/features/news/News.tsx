import { FC } from "react";
import { Box, Button, Grid, Stack, Typography, alpha } from "@mui/material";
import { portalTheme } from "@/styles";
import {
  FEATURED_CONTRIBUTORS,
  NEWS_CARDS_DATA,
} from "@/pages/landing-page/features/news/constants";
import NewsCard from "@/pages/landing-page/features/news/components/NewsCard";
import { SearchKeys } from "@/components/search/constants";
import { useAppDispatch } from "@/app/store/hooks";
import {
  clearComponentParam,
  updateDatasetGroup,
} from "@/app/store/componentParamReducer";
import useRedirectSearch from "@/hooks/useRedirectSearch";

const { swoosh1, swoosh2 } = portalTheme.designTokens.colours.featuredDatasets;
// Background shapes in a 1920 × 877 box (the section size at 1920px)
const SWOOSH_LEFT =
  "M-363 230.219C-363 230.219 -103.97 807.924 431.806 854.792C967.888 901.328 1269.38 505.111 1335.36 381.459C1335.36 381.459 1258.69 261.132 1112.98 260.467C967.277 259.802 922.374 318.969 756.204 471.539C590.034 624.109 123.597 951.852 -363 230.551V230.219Z";
const SWOOSH_RIGHT =
  "M463.95 517.353C463.95 517.353 722.933 -60.3527 1258.92 -107.221C1794.6 -153.756 2096.03 242.461 2162 366.112C2162 366.112 1809.56 124.792 1787.57 275.7C1764.67 432.259 1749.4 428.603 1583.26 275.7C1417.12 123.13 950.46 -204.613 463.645 516.688L463.95 517.353Z";

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
      }}
    >
      {/* Two swoosh shapes across the full section width */}
      <Box
        component="svg"
        aria-hidden
        viewBox="0 0 1920 877"
        preserveAspectRatio="xMidYMid slice"
        sx={{
          position: "absolute",
          zIndex: -1,
          top: 0,
          left: "calc((100% - 100vw) / 2)",
          width: "100vw",
          height: "100%",
          pointerEvents: "none",
        }}
      >
        <path d={SWOOSH_LEFT} fill={swoosh1} />
        <path d={SWOOSH_RIGHT} fill={swoosh2} />
      </Box>
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
        </Button>
        {FEATURED_CONTRIBUTORS.map((organisation) => (
          <Button
            key={organisation.datasetGroup}
            onClick={() => explore(organisation.datasetGroup)}
            sx={tabSx}
          >
            <span>{organisation.shortName}</span>
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
